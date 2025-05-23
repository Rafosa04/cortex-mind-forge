
import { supabase } from "@/integrations/supabase/client";
import { Habito } from "@/components/Habitos/HabitoCard";

// Função para gerar insights para um hábito específico
export function generateHabitInsight(habit: Habito): string {
  // Verificar streak
  if (habit.streak === 0) {
    return "Vamos começar! O primeiro passo é sempre o mais importante.";
  }
  
  if (habit.streak === 1) {
    return "Bom começo! Consistência é a chave para formar hábitos duradouros.";
  }
  
  if (habit.streak >= 30) {
    return `Impressionante! ${habit.streak} dias seguidos. Este hábito está se tornando parte de quem você é.`;
  }
  
  if (habit.streak >= 21) {
    return `Excelente! Com ${habit.streak} dias seguidos, este hábito está se consolidando no seu cérebro.`;
  }
  
  if (habit.streak >= 14) {
    return `Ótimo trabalho! ${habit.streak} dias consecutivos mostram seu comprometimento.`;
  }
  
  if (habit.streak >= 7) {
    return `Uma semana completa! ${habit.streak} dias de constância são um ótimo sinal.`;
  }
  
  if (habit.streak >= 3) {
    return `${habit.streak} dias seguidos! Continue assim para fortalecer este hábito.`;
  }
  
  // Verificar progresso
  if (habit.progresso >= 90) {
    return "Você está dominando este hábito! Considere aumentar o desafio ou adicionar uma variação.";
  }
  
  if (habit.progresso >= 70) {
    return "Progresso excelente! Continue mantendo a consistência.";
  }
  
  if (habit.progresso >= 50) {
    return "Você está no caminho certo! Continue construindo seu momentum.";
  }
  
  if (habit.progresso >= 30) {
    return "Bom progresso! Mantenha o foco nos próximos dias para aumentar sua consistência.";
  }
  
  if (habit.progresso < 30) {
    return "Que tal fazer deste hábito uma prioridade? Pequenos passos diários levam a grandes resultados.";
  }
  
  // Insights padrão se nenhum dos anteriores se aplicar
  const insights = [
    "Lembre-se: pequenas ações consistentes levam a grandes transformações.",
    "Tente associar este hábito a algo que você já faz todos os dias.",
    "Celebre seu progresso, mesmo que pareça pequeno.",
    "Considere ajustar o horário deste hábito para quando você tem mais energia.",
    "A consistência é mais importante que a perfeição."
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}

// Função para atualizar insights da IA para todos os hábitos do usuário
export async function updateAllHabitsInsights(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    // Buscar todos os hábitos do usuário
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id);
      
    if (error) throw error;
    if (!habits || habits.length === 0) return;
    
    // Para cada hábito, gerar um insight e atualizar
    for (const habit of habits) {
      const habitoFormatado: Habito = {
        id: habit.id,
        nome: habit.name,
        proposito: habit.description || '',
        frequencia: habit.frequency || 'Diário',
        progresso: habit.progress || 0,
        streak: habit.streak || 0,
        ultimoCheck: habit.last_check_in 
          ? new Date(habit.last_check_in).toLocaleDateString('pt-BR')
          : 'Nunca',
        observacaoIA: habit.ai_observation || 'Continue assim!',
        tags: habit.tags || [],
        icone: habit.icon || '💪',
      };
      
      const insight = generateHabitInsight(habitoFormatado);
      
      // Atualizar o hábito com o novo insight
      await supabase
        .from('habits')
        .update({ ai_observation: insight })
        .eq('id', habit.id);
    }
  } catch (error) {
    console.error("Erro ao atualizar insights dos hábitos:", error);
  }
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  deadline: string | null;
  created_at: string | null;
}

interface Habit {
  id: string;
  name: string;
  progress: number;
  goal: number | null;
  frequency: string | null;
}

interface AthenaInsight {
  type: string;
  message: string;
  relatedId?: string;
  relatedType?: string;
  actionText?: string;
  actionUrl?: string;
}

export const generateAthenaInsights = async (userId: string): Promise<AthenaInsight[]> => {
  try {
    const insights: AthenaInsight[] = [];
    
    // Fetch user's projects
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId);
      
    if (projectsError) throw projectsError;
    
    // Fetch user's habits
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);
      
    if (habitsError) throw habitsError;
    
    // Generate insights based on projects
    if (projects && projects.length > 0) {
      // Find stalled projects (progress < 50% and no updates in last 7 days)
      // Since we don't have updated_at, we'll use created_at for demonstration
      const stalledProjects = projects.filter(project => {
        if (!project.created_at) return false;
        
        const lastUpdate = new Date(project.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        return project.progress < 50 && project.status === 'ativo' && lastUpdate < sevenDaysAgo;
      });
      
      // Add stalled project insights
      stalledProjects.slice(0, 2).forEach(project => {
        insights.push({
          type: "projeto_parado",
          message: `Seu projeto "${project.name}" está parado há mais de 7 dias. Deseja revisitá-lo?`,
          relatedId: project.id,
          relatedType: "project",
          actionText: "Ver projeto",
          actionUrl: `/projetos?id=${project.id}`
        });
      });
      
      // Find projects nearing deadline
      const nearingDeadlineProjects = projects.filter(project => {
        if (!project.deadline) return false;
        
        const deadline = new Date(project.deadline);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        
        return project.status === 'ativo' && project.progress < 100 && deadline <= threeDaysFromNow;
      });
      
      // Add deadline insights
      nearingDeadlineProjects.slice(0, 2).forEach(project => {
        insights.push({
          type: "prazo_proximo",
          message: `O prazo do projeto "${project.name}" está se aproximando e ele está com ${project.progress}% de conclusão.`,
          relatedId: project.id,
          relatedType: "project",
          actionText: "Atualizar progresso",
          actionUrl: `/projetos?id=${project.id}`
        });
      });
    }
    
    // Generate insights based on habits
    if (habits && habits.length > 0) {
      // Find habits with good progress
      const goodHabits = habits.filter(habit => {
        if (habit.goal === null) return false;
        return (habit.progress / habit.goal) >= 0.8;
      });
      
      // Add congratulatory insight for good habits
      if (goodHabits.length > 0) {
        const habitName = goodHabits[0].name;
        insights.push({
          type: "habito_bom",
          message: `Parabéns pelo seu progresso no hábito "${habitName}"! Você está quase atingindo sua meta.`,
          relatedId: goodHabits[0].id,
          relatedType: "habit",
          actionText: "Ver hábito",
          actionUrl: `/habitos`
        });
      }
      
      // Find habits with low progress
      const lowProgressHabits = habits.filter(habit => {
        if (habit.goal === null) return false;
        return (habit.progress / habit.goal) < 0.3;
      });
      
      // Add low progress habit insight
      if (lowProgressHabits.length > 0) {
        const habitName = lowProgressHabits[0].name;
        insights.push({
          type: "habito_baixo",
          message: `Seu hábito "${habitName}" está com progresso abaixo do esperado. Precisa de ajuda com ele?`,
          relatedId: lowProgressHabits[0].id,
          relatedType: "habit",
          actionText: "Revisar hábito",
          actionUrl: `/habitos`
        });
      }
    }
    
    // Add general insights if we have few specific ones
    if (insights.length < 3) {
      // Suggestions for creating new habits or projects
      if (habits.length === 0) {
        insights.push({
          type: "sugestao",
          message: "Que tal começar um novo hábito? Hábitos consistentes são a base para o sucesso.",
          actionText: "Criar hábito",
          actionUrl: "/habitos"
        });
      }
      
      if (projects.length === 0) {
        insights.push({
          type: "sugestao",
          message: "Você ainda não tem projetos. Organize suas ideias criando seu primeiro projeto.",
          actionText: "Criar projeto",
          actionUrl: "/projetos"
        });
      }
      
      // General productivity tip
      insights.push({
        type: "dica",
        message: "Experimente a técnica Pomodoro: 25 minutos de foco intenso seguidos por 5 minutos de descanso.",
      });
    }
    
    // Limit to 5 insights max
    return insights.slice(0, 5);
    
  } catch (error) {
    console.error("Error generating Athena insights:", error);
    return [{
      type: "erro",
      message: "Não foi possível gerar insights neste momento. Tente novamente mais tarde."
    }];
  }
};

export const saveInsightAsNotification = async (
  userId: string, 
  insight: AthenaInsight
) => {
  try {
    // Use type assertion to handle table that's not in the TypeScript type definitions
    const { error } = await supabase
      .from("notifications" as any)
      .insert({
        user_id: userId,
        type: insight.type,
        title: getInsightTitle(insight.type),
        message: insight.message,
      });
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error saving insight as notification:", error);
    return { success: false, error };
  }
};

// Helper function to get title based on insight type
const getInsightTitle = (type: string): string => {
  switch (type) {
    case "projeto_parado":
      return "Projeto inativo";
    case "prazo_proximo":
      return "Prazo se aproximando";
    case "habito_bom":
      return "Parabéns pelo progresso!";
    case "habito_baixo":
      return "Atenção ao seu hábito";
    case "sugestao":
      return "Sugestão da Athena";
    case "dica":
      return "Dica de produtividade";
    default:
      return "Insight da Athena";
  }
};
