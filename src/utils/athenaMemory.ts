
import { supabase } from "@/integrations/supabase/client";

interface AthenaMemoryEntry {
  id?: string;
  prompt: string;
  response: string;
  context_type: string;
  context_id?: string;
  is_favorite?: boolean;
  created_at?: string;
}

interface MemoryQuery {
  contextType?: string;
  contextId?: string;
  searchTerm?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  isFavorite?: boolean;
  limit?: number;
}

export class AthenaMemory {
  
  static async saveInteraction(
    prompt: string, 
    response: string, 
    contextType: string = 'general',
    contextId?: string
  ): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('athena_logs')
        .insert({
          user_id: user.id,
          prompt,
          response,
          context_type: contextType,
          context_id: contextId,
          is_favorite: false
        })
        .select()
        .single();

      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error('Erro ao salvar interação da Athena:', error);
      return null;
    }
  }

  static async searchMemories(query: MemoryQuery): Promise<AthenaMemoryEntry[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let queryBuilder = supabase
        .from('athena_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filtros opcionais
      if (query.contextType) {
        queryBuilder = queryBuilder.eq('context_type', query.contextType);
      }

      if (query.contextId) {
        queryBuilder = queryBuilder.eq('context_id', query.contextId);
      }

      if (query.isFavorite !== undefined) {
        queryBuilder = queryBuilder.eq('is_favorite', query.isFavorite);
      }

      if (query.searchTerm) {
        queryBuilder = queryBuilder.or(
          `prompt.ilike.%${query.searchTerm}%,response.ilike.%${query.searchTerm}%`
        );
      }

      if (query.dateRange) {
        queryBuilder = queryBuilder
          .gte('created_at', query.dateRange.start.toISOString())
          .lte('created_at', query.dateRange.end.toISOString());
      }

      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar memórias:', error);
      return [];
    }
  }

  static async getRelevantContext(
    contextType: string, 
    contextId?: string, 
    limit: number = 5
  ): Promise<AthenaMemoryEntry[]> {
    return this.searchMemories({
      contextType,
      contextId,
      limit
    });
  }

  static async getFavoriteInsights(limit: number = 10): Promise<AthenaMemoryEntry[]> {
    return this.searchMemories({
      isFavorite: true,
      limit
    });
  }

  static async toggleFavorite(logId: string): Promise<boolean> {
    try {
      // Primeiro, buscar o estado atual
      const { data: currentLog, error: fetchError } = await supabase
        .from('athena_logs')
        .select('is_favorite')
        .eq('id', logId)
        .single();

      if (fetchError) throw fetchError;

      // Alternar o estado
      const { error: updateError } = await supabase
        .from('athena_logs')
        .update({ is_favorite: !currentLog.is_favorite })
        .eq('id', logId);

      if (updateError) throw updateError;

      return !currentLog.is_favorite;
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      return false;
    }
  }

  static async generateContextSummary(
    contextType: string,
    contextId?: string,
    days: number = 30
  ): Promise<string> {
    try {
      const dateRange = {
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        end: new Date()
      };

      const memories = await this.searchMemories({
        contextType,
        contextId,
        dateRange,
        limit: 20
      });

      if (memories.length === 0) {
        return `Nenhuma interação registrada nos últimos ${days} dias para este contexto.`;
      }

      // Gerar resumo baseado nas interações
      const totalInteractions = memories.length;
      const favoriteCount = memories.filter(m => m.is_favorite).length;
      const recentTopics = memories
        .slice(0, 5)
        .map(m => m.prompt.split(' ').slice(0, 5).join(' '))
        .join(', ');

      return `Resumo dos últimos ${days} dias: ${totalInteractions} interações registradas, ${favoriteCount} marcadas como favoritas. Tópicos recentes: ${recentTopics}...`;
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      return 'Erro ao gerar resumo do contexto.';
    }
  }

  static async getInsightHistory(limit: number = 50): Promise<AthenaMemoryEntry[]> {
    return this.searchMemories({
      contextType: 'insight',
      limit
    });
  }

  static async deleteMemory(logId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('athena_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar memória:', error);
      return false;
    }
  }

  static async exportMemories(
    query: MemoryQuery = {}
  ): Promise<AthenaMemoryEntry[]> {
    // Remover limite para exportação completa
    const exportQuery = { ...query, limit: undefined };
    return this.searchMemories(exportQuery);
  }

  static formatMemoryForDisplay(memory: AthenaMemoryEntry): string {
    const date = new Date(memory.created_at!).toLocaleDateString('pt-BR');
    return `[${date}] Contexto: ${memory.context_type}\nPergunta: ${memory.prompt}\nResposta: ${memory.response}\n---\n`;
  }
}
