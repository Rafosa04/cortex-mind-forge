
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AthenaInsight {
  id: string;
  type: 'proactive' | 'predictive' | 'contextual';
  category: string;
  title: string;
  description: string;
  action_suggestion?: string;
  confidence_score: number;
  context_data: any;
  related_item_id?: string;
  related_item_type?: string;
  priority: number;
  status: 'active' | 'dismissed' | 'acted_upon';
  expires_at?: string;
  created_at: string;
}

interface AthenaPrediction {
  id: string;
  prediction_type: string;
  target_type: string;
  target_id?: string;
  prediction_value: number;
  prediction_label: string;
  factors: any;
  accuracy_score: number;
  valid_until?: string;
  created_at: string;
}

// Helper function to cast database response to AthenaInsight type
const castToAthenaInsight = (dbInsight: any): AthenaInsight => ({
  id: dbInsight.id,
  type: dbInsight.type as 'proactive' | 'predictive' | 'contextual',
  category: dbInsight.category,
  title: dbInsight.title,
  description: dbInsight.description,
  action_suggestion: dbInsight.action_suggestion,
  confidence_score: dbInsight.confidence_score,
  context_data: dbInsight.context_data,
  related_item_id: dbInsight.related_item_id,
  related_item_type: dbInsight.related_item_type,
  priority: dbInsight.priority,
  status: dbInsight.status as 'active' | 'dismissed' | 'acted_upon',
  expires_at: dbInsight.expires_at,
  created_at: dbInsight.created_at
});

export const useAthenaInsights = () => {
  const [insights, setInsights] = useState<AthenaInsight[]>([]);
  const [predictions, setPredictions] = useState<AthenaPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchInsights = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('athena_insights')
        .select('*')
        .eq('status', 'active')
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights((data || []).map(castToAthenaInsight));
    } catch (error) {
      console.error('Erro ao buscar insights:', error);
      toast({
        title: "Erro ao carregar insights",
        description: "Não foi possível carregar os insights da Athena",
        variant: "destructive"
      });
    }
  };

  const fetchPredictions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('athena_predictions')
        .select('*')
        .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Erro ao buscar predições:', error);
    }
  };

  const generateProactiveInsights = async () => {
    if (!user) return;

    try {
      // Chamar função do banco para gerar insights automáticos
      const { data, error } = await supabase.rpc('generate_proactive_insights', {
        target_user_id: user.id
      });

      if (error) throw error;

      // Salvar insights gerados no banco
      if (data && data.length > 0) {
        const insightsToInsert = data.map((insight: any) => ({
          user_id: user.id,
          type: 'proactive',
          category: insight.insight_type,
          title: insight.title,
          description: insight.description,
          action_suggestion: insight.action_suggestion,
          priority: insight.priority,
          context_data: {}
        }));

        const { error: insertError } = await supabase
          .from('athena_insights')
          .insert(insightsToInsert);

        if (insertError) throw insertError;

        await fetchInsights();
        
        toast({
          title: "Novos insights gerados!",
          description: `${data.length} insight(s) foram criados pela Athena`
        });
      }
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    }
  };

  const dismissInsight = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('athena_insights')
        .update({ status: 'dismissed' })
        .eq('id', insightId);

      if (error) throw error;

      setInsights(prev => prev.filter(insight => insight.id !== insightId));
      
      toast({
        title: "Insight dismissido",
        description: "O insight foi removido da sua lista"
      });
    } catch (error) {
      console.error('Erro ao dismissar insight:', error);
    }
  };

  const markInsightAsActedUpon = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('athena_insights')
        .update({ status: 'acted_upon' })
        .eq('id', insightId);

      if (error) throw error;

      setInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, status: 'acted_upon' as const }
            : insight
        )
      );
      
      toast({
        title: "Ação registrada!",
        description: "Marcamos que você agiu com base neste insight"
      });
    } catch (error) {
      console.error('Erro ao marcar insight:', error);
    }
  };

  const createCustomInsight = async (insightData: Partial<AthenaInsight>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('athena_insights')
        .insert({
          user_id: user.id,
          type: insightData.type || 'contextual',
          category: insightData.category || 'custom',
          title: insightData.title!,
          description: insightData.description!,
          action_suggestion: insightData.action_suggestion,
          priority: insightData.priority || 5,
          context_data: insightData.context_data || {}
        })
        .select()
        .single();

      if (error) throw error;

      setInsights(prev => [castToAthenaInsight(data), ...prev]);
      
      return castToAthenaInsight(data);
    } catch (error) {
      console.error('Erro ao criar insight:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchInsights(), fetchPredictions()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    insights,
    predictions,
    loading,
    fetchInsights,
    fetchPredictions,
    generateProactiveInsights,
    dismissInsight,
    markInsightAsActedUpon,
    createCustomInsight
  };
};
