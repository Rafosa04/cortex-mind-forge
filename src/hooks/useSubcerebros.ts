
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Subcerebro {
  id: string;
  user_id: string;
  nome: string;
  descricao?: string;
  tags: string[];
  area?: string;
  tipo: string;
  relevancia: number;
  created_at: string;
  updated_at: string;
  last_access?: string;
}

export interface SubcerebroConnection {
  id: string;
  user_id: string;
  source_id: string;
  source_type: string;
  target_id: string;
  target_type: string;
  connection_strength: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubcerebroData {
  nome: string;
  descricao?: string;
  tags?: string[];
  area?: string;
  tipo?: string;
  relevancia?: number;
}

export interface UpdateSubcerebroData extends Partial<CreateSubcerebroData> {
  id: string;
}

export const useSubcerebros = () => {
  const [subcerebros, setSubcerebros] = useState<Subcerebro[]>([]);
  const [connections, setConnections] = useState<SubcerebroConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar subcérebros do usuário
  const fetchSubcerebros = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Buscando subcérebros para o usuário:', user.id);

      const { data, error: fetchError } = await supabase
        .from('subcerebros')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar subcérebros:', fetchError);
        throw fetchError;
      }

      console.log('Subcérebros encontrados:', data);
      setSubcerebros(data || []);
    } catch (err: any) {
      const errorMsg = `Erro ao carregar subcérebros: ${err.message}`;
      console.error(errorMsg, err);
      setError(errorMsg);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar conexões do usuário
  const fetchConnections = async () => {
    if (!user) return;

    try {
      console.log('Buscando conexões para o usuário:', user.id);

      const { data, error: fetchError } = await supabase
        .from('subcerebro_connections')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Erro ao buscar conexões:', fetchError);
        throw fetchError;
      }

      console.log('Conexões encontradas:', data);
      setConnections(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar conexões:', err);
    }
  };

  // Criar novo subcérebro
  const createSubcerebro = async (data: CreateSubcerebroData): Promise<Subcerebro | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log('Criando subcérebro:', data);

      const subcerebroData = {
        user_id: user.id,
        nome: data.nome,
        descricao: data.descricao || null,
        tags: data.tags || [],
        area: data.area || null,
        tipo: data.tipo || 'subcerebro',
        relevancia: data.relevancia || 5
      };

      const { data: newSubcerebro, error: createError } = await supabase
        .from('subcerebros')
        .insert(subcerebroData)
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar subcérebro:', createError);
        throw createError;
      }

      console.log('Subcérebro criado:', newSubcerebro);
      setSubcerebros(prev => [newSubcerebro, ...prev]);

      toast({
        title: "Sucesso",
        description: `Subcérebro "${newSubcerebro.nome}" criado com sucesso!`
      });

      return newSubcerebro;
    } catch (err: any) {
      const errorMsg = `Erro ao criar subcérebro: ${err.message}`;
      console.error(errorMsg, err);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
  };

  // Atualizar subcérebro
  const updateSubcerebro = async (data: UpdateSubcerebroData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Atualizando subcérebro:', data);

      const { id, ...updateData } = data;

      const { data: updatedSubcerebro, error: updateError } = await supabase
        .from('subcerebros')
        .update({
          ...updateData,
          last_access: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar subcérebro:', updateError);
        throw updateError;
      }

      console.log('Subcérebro atualizado:', updatedSubcerebro);
      setSubcerebros(prev => 
        prev.map(s => s.id === id ? updatedSubcerebro : s)
      );

      toast({
        title: "Sucesso",
        description: "Subcérebro atualizado com sucesso!"
      });

      return true;
    } catch (err: any) {
      const errorMsg = `Erro ao atualizar subcérebro: ${err.message}`;
      console.error(errorMsg, err);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive"
      });
      return false;
    }
  };

  // Deletar subcérebro
  const deleteSubcerebro = async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Deletando subcérebro:', id);

      // Primeiro, deletar todas as conexões relacionadas
      await supabase
        .from('subcerebro_connections')
        .delete()
        .eq('user_id', user.id)
        .or(`source_id.eq.${id},target_id.eq.${id}`);

      // Depois, deletar o subcérebro
      const { error: deleteError } = await supabase
        .from('subcerebros')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Erro ao deletar subcérebro:', deleteError);
        throw deleteError;
      }

      console.log('Subcérebro deletado:', id);
      setSubcerebros(prev => prev.filter(s => s.id !== id));
      setConnections(prev => 
        prev.filter(c => c.source_id !== id && c.target_id !== id)
      );

      toast({
        title: "Sucesso",
        description: "Subcérebro removido com sucesso!"
      });

      return true;
    } catch (err: any) {
      const errorMsg = `Erro ao deletar subcérebro: ${err.message}`;
      console.error(errorMsg, err);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive"
      });
      return false;
    }
  };

  // Criar conexão entre entidades
  const createConnection = async (
    sourceId: string,
    sourceType: string,
    targetId: string,
    targetType: string,
    strength: number = 5
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('Criando conexão:', { sourceId, sourceType, targetId, targetType, strength });

      const { data: connection, error: createError } = await supabase
        .from('subcerebro_connections')
        .insert({
          user_id: user.id,
          source_id: sourceId,
          source_type: sourceType,
          target_id: targetId,
          target_type: targetType,
          connection_strength: strength
        })
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar conexão:', createError);
        throw createError;
      }

      console.log('Conexão criada:', connection);
      setConnections(prev => [...prev, connection]);

      toast({
        title: "Sucesso",
        description: "Conexão criada com sucesso!"
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao criar conexão:', err);
      return false;
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    if (user) {
      fetchSubcerebros();
      fetchConnections();
    }
  }, [user]);

  return {
    subcerebros,
    connections,
    loading,
    error,
    createSubcerebro,
    updateSubcerebro,
    deleteSubcerebro,
    createConnection,
    fetchSubcerebros,
    fetchConnections
  };
};
