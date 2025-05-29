
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  sentiment_score?: number | null;
  sentiment_label?: string | null;
  athena_analysis?: any;
}

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
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
    sentiment_score?: number;
    sentiment_label?: string;
  }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('diary_entries')
        .insert([{
          ...entryData,
          user_id: user.id,
          date: new Date().toISOString()
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
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => 
        entry.id === id ? { ...entry, ...data } : entry
      ));

      // Só mostrar toast se não for apenas atualização de análise
      if (!updates.sentiment_score || Object.keys(updates).length > 2) {
        toast({
          title: "Sucesso",
          description: "Entrada atualizada com sucesso!",
        });
      }

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
        .eq('id', id)
        .eq('user_id', user?.id);

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
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
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
    if (user) {
      fetchEntries();
    }
  }, [user]);

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
