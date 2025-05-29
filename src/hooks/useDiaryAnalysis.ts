
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SentimentTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  avgScore: number;
  entryCount: number;
}

export interface EmotionPattern {
  emotion: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DiaryInsight {
  type: 'pattern' | 'streak' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionSuggestion?: string;
}

export const useDiaryAnalysis = () => {
  const [sentimentTrends, setSentimentTrends] = useState<SentimentTrend[]>([]);
  const [emotionPatterns, setEmotionPatterns] = useState<EmotionPattern[]>([]);
  const [insights, setInsights] = useState<DiaryInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const analyzeSentiment = async (content: string): Promise<{ score: number; label: string }> => {
    try {
      // Análise simples de sentimento baseada em palavras-chave
      const positiveWords = ['feliz', 'alegre', 'ótimo', 'maravilhoso', 'excelente', 'amor', 'sucesso', 'conquista', 'vitória', 'gratidão'];
      const negativeWords = ['triste', 'ruim', 'péssimo', 'terrível', 'ódio', 'falha', 'fracasso', 'problema', 'dor', 'ansiedade'];
      
      const text = content.toLowerCase();
      let score = 0;
      
      positiveWords.forEach(word => {
        if (text.includes(word)) score += 1;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) score -= 1;
      });
      
      // Normalizar score entre -1 e 1
      const normalizedScore = Math.max(-1, Math.min(1, score / 5));
      
      let label = 'neutral';
      if (normalizedScore > 0.2) label = 'positive';
      else if (normalizedScore < -0.2) label = 'negative';
      
      return { score: normalizedScore, label };
    } catch (error) {
      console.error('Erro na análise de sentimento:', error);
      return { score: 0, label: 'neutral' };
    }
  };

  const fetchSentimentTrends = async (days: number = 30) => {
    if (!user) return;

    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('diary_entries')
        .select('date, sentiment_score, sentiment_label, emotion')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString())
        .order('date');

      if (error) throw error;

      // Agrupar por data
      const groupedByDate = data?.reduce((acc, entry) => {
        const date = new Date(entry.date).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { positive: 0, neutral: 0, negative: 0, scores: [], count: 0 };
        }
        
        acc[date].count++;
        if (entry.sentiment_score !== null) {
          acc[date].scores.push(entry.sentiment_score);
        }
        
        if (entry.sentiment_label === 'positive') acc[date].positive++;
        else if (entry.sentiment_label === 'negative') acc[date].negative++;
        else acc[date].neutral++;
        
        return acc;
      }, {} as Record<string, any>) || {};

      // Converter para array de trends
      const trends: SentimentTrend[] = Object.entries(groupedByDate).map(([date, data]) => ({
        date,
        positive: data.positive,
        neutral: data.neutral,
        negative: data.negative,
        avgScore: data.scores.length > 0 ? data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length : 0,
        entryCount: data.count
      }));

      setSentimentTrends(trends.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error: any) {
      console.error('Erro ao buscar tendências:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tendências de humor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmotionPatterns = async (days: number = 30) => {
    if (!user) return;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('diary_entries')
        .select('emotion')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString());

      if (error) throw error;

      // Contar emoções
      const emotionCounts = data?.reduce((acc, entry) => {
        const emotion = entry.emotion || 'neutral';
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0);
      
      const patterns: EmotionPattern[] = Object.entries(emotionCounts)
        .map(([emotion, count]) => ({
          emotion,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
          trend: 'stable' as const // Simplificado por ora
        }))
        .sort((a, b) => b.count - a.count);

      setEmotionPatterns(patterns);
    } catch (error) {
      console.error('Erro ao buscar padrões emocionais:', error);
    }
  };

  const generateInsights = async () => {
    if (!user || sentimentTrends.length === 0) return;

    try {
      const insights: DiaryInsight[] = [];

      // Insight de tendência positiva
      const recentTrends = sentimentTrends.slice(-7);
      const avgRecentScore = recentTrends.reduce((sum, trend) => sum + trend.avgScore, 0) / recentTrends.length;
      
      if (avgRecentScore > 0.3) {
        insights.push({
          type: 'pattern',
          title: 'Tendência Positiva',
          description: 'Seus registros mostram uma tendência positiva nos últimos dias',
          confidence: 0.8,
          actionSuggestion: 'Continue cultivando os hábitos que estão contribuindo para seu bem-estar'
        });
      } else if (avgRecentScore < -0.3) {
        insights.push({
          type: 'recommendation',
          title: 'Momentos Desafiadores',
          description: 'Percebo que você tem enfrentado alguns desafios emocionais',
          confidence: 0.7,
          actionSuggestion: 'Considere dedicar um tempo para atividades que lhe tragam paz e relaxamento'
        });
      }

      // Insight de consistência
      const entriesThisWeek = sentimentTrends.filter(trend => {
        const trendDate = new Date(trend.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return trendDate >= weekAgo;
      }).length;

      if (entriesThisWeek >= 5) {
        insights.push({
          type: 'streak',
          title: 'Consistência Excelente',
          description: `Você registrou ${entriesThisWeek} entradas esta semana`,
          confidence: 0.9,
          actionSuggestion: 'Mantenha essa consistência para obter insights mais precisos sobre seus padrões'
        });
      }

      setInsights(insights);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    }
  };

  const exportSummary = async (format: 'pdf' | 'markdown' = 'markdown') => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('export-diary-summary', {
        body: { 
          userId: user.id, 
          format,
          period: 30 
        }
      });

      if (error) throw error;

      // Criar download
      const blob = new Blob([data.content], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/markdown' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diary-summary-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: `Resumo exportado em formato ${format.toUpperCase()}`
      });
    } catch (error: any) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o resumo",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchSentimentTrends();
      fetchEmotionPatterns();
    }
  }, [user]);

  useEffect(() => {
    if (sentimentTrends.length > 0) {
      generateInsights();
    }
  }, [sentimentTrends]);

  return {
    sentimentTrends,
    emotionPatterns,
    insights,
    loading,
    analyzeSentiment,
    fetchSentimentTrends,
    fetchEmotionPatterns,
    exportSummary
  };
};
