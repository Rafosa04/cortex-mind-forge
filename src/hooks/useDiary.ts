
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  emotion: string;
  type: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as entradas do diário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: {
    title?: string;
    content: string;
    emotion: string;
    type: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('diary_entries')
        .insert([{
          ...entryData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Entrada do diário criada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Error creating diary entry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a entrada do diário.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => 
        entry.id === id ? { ...entry, ...data } : entry
      ));

      toast({
        title: "Sucesso",
        description: "Entrada atualizada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Error updating diary entry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a entrada.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Entrada removida com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a entrada.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const searchEntries = async (searchTerm: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,emotion.ilike.%${searchTerm}%`)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error searching diary entries:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar entradas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
    refetch: fetchEntries,
  };
}
