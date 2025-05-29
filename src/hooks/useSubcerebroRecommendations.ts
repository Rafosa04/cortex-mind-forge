
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SubcerebroRecommendation {
  id: string;
  user_id: string;
  source_subcerebro_id: string;
  recommended_subcerebro_id: string;
  recommendation_type: string;
  similarity_score: number;
  reasoning: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Dados dos subcérebros relacionados
  source_subcerebro?: {
    id: string;
    nome: string;
    area?: string;
    tags: string[];
  };
  recommended_subcerebro?: {
    id: string;
    nome: string;
    area?: string;
    tags: string[];
  };
}

export const useSubcerebroRecommendations = () => {
  const [recommendations, setRecommendations] = useState<SubcerebroRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando recomendações para o usuário:', user.id);

      const { data, error } = await supabase
        .from('subcerebro_recommendations')
        .select(`
          *,
          source_subcerebro:subcerebros!source_subcerebro_id(
            id, nome, area, tags
          ),
          recommended_subcerebro:subcerebros!recommended_subcerebro_id(
            id, nome, area, tags
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('similarity_score', { ascending: false });

      if (error) {
        console.error('Erro ao buscar recomendações:', error);
        throw error;
      }

      console.log('Recomendações encontradas:', data);
      // Type assertion to ensure correct status type
      const typedRecommendations = data?.map(item => ({
        ...item,
        status: item.status as 'pending' | 'accepted' | 'rejected'
      })) || [];
      
      setRecommendations(typedRecommendations);
    } catch (error: any) {
      console.error('Erro ao carregar recomendações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as recomendações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!user) return;

    try {
      console.log('Gerando novas recomendações...');

      const { data, error } = await supabase.rpc('generate_subcerebro_recommendations', {
        target_user_id: user.id
      });

      if (error) throw error;

      // Inserir as novas recomendações
      if (data && data.length > 0) {
        const recommendationsToInsert = data.map((rec: any) => ({
          user_id: user.id,
          source_subcerebro_id: rec.source_subcerebro_id,
          recommended_subcerebro_id: rec.recommended_subcerebro_id,
          recommendation_type: rec.recommendation_type,
          similarity_score: rec.similarity_score,
          reasoning: rec.reasoning,
          status: 'pending'
        }));

        const { error: insertError } = await supabase
          .from('subcerebro_recommendations')
          .insert(recommendationsToInsert);

        if (insertError) throw insertError;

        await fetchRecommendations();

        toast({
          title: "Recomendações geradas!",
          description: `${data.length} nova(s) recomendação(ões) foram criadas`
        });
      } else {
        toast({
          title: "Nenhuma recomendação",
          description: "Não foram encontradas novas conexões possíveis"
        });
      }
    } catch (error: any) {
      console.error('Erro ao gerar recomendações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar recomendações",
        variant: "destructive"
      });
    }
  };

  const acceptRecommendation = async (recommendationId: string) => {
    if (!user) return false;

    try {
      console.log('Aceitando recomendação:', recommendationId);

      const { data, error } = await supabase.rpc('accept_subcerebro_recommendation', {
        recommendation_id: recommendationId,
        user_id_param: user.id
      });

      if (error) throw error;

      if (data) {
        setRecommendations(prev => 
          prev.filter(rec => rec.id !== recommendationId)
        );

        toast({
          title: "Recomendação aceita!",
          description: "A conexão foi criada com sucesso"
        });

        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Erro ao aceitar recomendação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar a recomendação",
        variant: "destructive"
      });
      return false;
    }
  };

  const rejectRecommendation = async (recommendationId: string) => {
    if (!user) return false;

    try {
      console.log('Rejeitando recomendação:', recommendationId);

      const { data, error } = await supabase.rpc('reject_subcerebro_recommendation', {
        recommendation_id: recommendationId,
        user_id_param: user.id
      });

      if (error) throw error;

      if (data) {
        setRecommendations(prev => 
          prev.filter(rec => rec.id !== recommendationId)
        );

        toast({
          title: "Recomendação rejeitada",
          description: "A sugestão foi removida"
        });

        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Erro ao rejeitar recomendação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a recomendação",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  return {
    recommendations,
    loading,
    generateRecommendations,
    acceptRecommendation,
    rejectRecommendation,
    fetchRecommendations
  };
};
