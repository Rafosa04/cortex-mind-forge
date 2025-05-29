
import { supabase } from "@/integrations/supabase/client";

interface PredictionFactors {
  streak_consistency: number;
  recent_activity: number;
  completion_rate: number;
  time_since_last_activity: number;
  difficulty_score: number;
}

interface HabitPrediction {
  habitId: string;
  habitName: string;
  abandonmentRisk: number;
  successProbability: number;
  factors: PredictionFactors;
  recommendations: string[];
}

interface ProjectPrediction {
  projectId: string;
  projectName: string;
  completionProbability: number;
  estimatedDaysToComplete: number;
  riskFactors: string[];
  suggestions: string[];
}

export class AthenaAnalytics {
  
  static async analyzeHabitRisk(userId: string, habitId?: string): Promise<HabitPrediction[]> {
    try {
      // Buscar hábitos do usuário
      const habitsQuery = supabase
        .from('habits')
        .select(`
          id, name, streak, progress, goal, frequency, created_at, last_check_in,
          habit_check_ins!inner(checked_in_at, created_at)
        `)
        .eq('user_id', userId);

      if (habitId) {
        habitsQuery.eq('id', habitId);
      }

      const { data: habits, error } = await habitsQuery;
      if (error) throw error;

      const predictions: HabitPrediction[] = [];

      for (const habit of habits || []) {
        // Calcular fatores de risco
        const factors = await this.calculateHabitFactors(habit);
        
        // Calcular probabilidades usando algoritmo simples
        const abandonmentRisk = this.calculateAbandonmentRisk(factors);
        const successProbability = 1 - abandonmentRisk;
        
        // Gerar recomendações
        const recommendations = this.generateHabitRecommendations(factors, habit);

        predictions.push({
          habitId: habit.id,
          habitName: habit.name,
          abandonmentRisk,
          successProbability,
          factors,
          recommendations
        });

        // Salvar predição no banco
        await this.savePrediction(userId, {
          prediction_type: 'abandonment_risk',
          target_type: 'habit',
          target_id: habit.id,
          prediction_value: abandonmentRisk * 100,
          prediction_label: this.getRiskLabel(abandonmentRisk),
          factors: factors,
          accuracy_score: 0.75 // Score fixo por enquanto
        });
      }

      return predictions;
    } catch (error) {
      console.error('Erro na análise de hábitos:', error);
      return [];
    }
  }

  static async analyzeProjectCompletion(userId: string, projectId?: string): Promise<ProjectPrediction[]> {
    try {
      const projectsQuery = supabase
        .from('projects')
        .select(`
          id, name, progress, deadline, created_at, status,
          project_steps(id, done, created_at)
        `)
        .eq('user_id', userId);

      if (projectId) {
        projectsQuery.eq('id', projectId);
      }

      const { data: projects, error } = await projectsQuery;
      if (error) throw error;

      const predictions: ProjectPrediction[] = [];

      for (const project of projects || []) {
        const completionProbability = this.calculateProjectCompletionProbability(project);
        const estimatedDays = this.estimateProjectDays(project);
        const riskFactors = this.identifyProjectRisks(project);
        const suggestions = this.generateProjectSuggestions(project, riskFactors);

        predictions.push({
          projectId: project.id,
          projectName: project.name,
          completionProbability,
          estimatedDaysToComplete: estimatedDays,
          riskFactors,
          suggestions
        });

        // Salvar predição
        await this.savePrediction(userId, {
          prediction_type: 'completion_probability',
          target_type: 'project',
          target_id: project.id,
          prediction_value: completionProbability * 100,
          prediction_label: completionProbability > 0.7 ? 'Alta' : completionProbability > 0.4 ? 'Média' : 'Baixa',
          factors: { riskFactors, suggestions },
          accuracy_score: 0.7
        });
      }

      return predictions;
    } catch (error) {
      console.error('Erro na análise de projetos:', error);
      return [];
    }
  }

  private static async calculateHabitFactors(habit: any): Promise<PredictionFactors> {
    const now = new Date();
    const createdAt = new Date(habit.created_at);
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // Streak consistency (0-1)
    const expectedCheckins = daysSinceCreation;
    const actualCheckins = habit.habit_check_ins?.length || 0;
    const streak_consistency = Math.min(actualCheckins / Math.max(expectedCheckins, 1), 1);

    // Recent activity (últimos 7 dias)
    const recentCheckins = habit.habit_check_ins?.filter((checkin: any) => {
      const checkinDate = new Date(checkin.checked_in_at);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return checkinDate >= sevenDaysAgo;
    }).length || 0;
    const recent_activity = Math.min(recentCheckins / 7, 1);

    // Completion rate
    const completion_rate = habit.progress / Math.max(habit.goal || 100, 1);

    // Time since last activity
    const lastCheckIn = habit.last_check_in ? new Date(habit.last_check_in) : createdAt;
    const daysSinceLastActivity = Math.floor((now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
    const time_since_last_activity = Math.min(daysSinceLastActivity / 7, 1); // Normalizado para 7 dias

    // Difficulty score (baseado na frequência)
    const difficulty_score = habit.frequency === 'Diário' ? 0.8 : 
                            habit.frequency === 'Semanal' ? 0.5 : 0.3;

    return {
      streak_consistency,
      recent_activity,
      completion_rate,
      time_since_last_activity,
      difficulty_score
    };
  }

  private static calculateAbandonmentRisk(factors: PredictionFactors): number {
    // Algoritmo simples de risco
    const weights = {
      streak_consistency: -0.3,
      recent_activity: -0.4,
      completion_rate: -0.2,
      time_since_last_activity: 0.4,
      difficulty_score: 0.1
    };

    let risk = 0.5; // Base risk
    risk += factors.streak_consistency * weights.streak_consistency;
    risk += factors.recent_activity * weights.recent_activity;
    risk += factors.completion_rate * weights.completion_rate;
    risk += factors.time_since_last_activity * weights.time_since_last_activity;
    risk += factors.difficulty_score * weights.difficulty_score;

    return Math.max(0, Math.min(1, risk));
  }

  private static generateHabitRecommendations(factors: PredictionFactors, habit: any): string[] {
    const recommendations: string[] = [];

    if (factors.recent_activity < 0.3) {
      recommendations.push("Defina um horário fixo para praticar este hábito");
    }

    if (factors.streak_consistency < 0.5) {
      recommendations.push("Considere reduzir a frequência para criar consistência");
    }

    if (factors.time_since_last_activity > 0.5) {
      recommendations.push("Retome este hábito hoje mesmo, mesmo que por poucos minutos");
    }

    if (habit.streak > 7) {
      recommendations.push("Você está indo muito bem! Defina uma recompensa para manter a motivação");
    }

    return recommendations;
  }

  private static calculateProjectCompletionProbability(project: any): number {
    const now = new Date();
    const createdAt = new Date(project.created_at);
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // Fatores base
    let probability = 0.5;

    // Progresso atual
    if (project.progress > 80) probability += 0.3;
    else if (project.progress > 50) probability += 0.1;
    else if (project.progress < 10) probability -= 0.2;

    // Presença de steps
    const totalSteps = project.project_steps?.length || 0;
    const completedSteps = project.project_steps?.filter((step: any) => step.done).length || 0;
    
    if (totalSteps > 0) {
      probability += 0.2; // Tem planejamento
      probability += (completedSteps / totalSteps) * 0.2; // Execução
    }

    // Deadline proximity
    if (project.deadline) {
      const deadline = new Date(project.deadline);
      const daysToDeadline = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToDeadline < 0) probability -= 0.3; // Atrasado
      else if (daysToDeadline < 7) probability += 0.1; // Urgência pode motivar
    }

    // Tempo sem atividade
    if (daysSinceCreation > 30 && project.progress < 50) {
      probability -= 0.2;
    }

    return Math.max(0, Math.min(1, probability));
  }

  private static estimateProjectDays(project: any): number {
    const remainingProgress = 100 - (project.progress || 0);
    const daysSinceCreation = Math.floor((Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const dailyProgressRate = (project.progress || 1) / Math.max(daysSinceCreation, 1);
    
    return Math.ceil(remainingProgress / Math.max(dailyProgressRate, 0.5));
  }

  private static identifyProjectRisks(project: any): string[] {
    const risks: string[] = [];
    
    if (!project.project_steps || project.project_steps.length === 0) {
      risks.push("Falta de planejamento detalhado");
    }
    
    if (project.progress < 10 && Math.floor((Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24)) > 7) {
      risks.push("Baixo progresso inicial");
    }
    
    if (project.deadline && new Date(project.deadline) < new Date()) {
      risks.push("Deadline perdido");
    }
    
    return risks;
  }

  private static generateProjectSuggestions(project: any, risks: string[]): string[] {
    const suggestions: string[] = [];
    
    if (risks.includes("Falta de planejamento detalhado")) {
      suggestions.push("Divida o projeto em etapas menores");
    }
    
    if (risks.includes("Baixo progresso inicial")) {
      suggestions.push("Dedique 15 minutos diários para avançar este projeto");
    }
    
    if (project.progress > 70) {
      suggestions.push("Você está quase lá! Mantenha o foco para finalizar");
    }
    
    return suggestions;
  }

  private static getRiskLabel(risk: number): string {
    if (risk > 0.7) return 'Alto Risco';
    if (risk > 0.4) return 'Risco Moderado';
    return 'Baixo Risco';
  }

  private static async savePrediction(userId: string, predictionData: any) {
    try {
      await supabase.from('athena_predictions').insert({
        user_id: userId,
        ...predictionData,
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Válido por 7 dias
      });
    } catch (error) {
      console.error('Erro ao salvar predição:', error);
    }
  }
}
