
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface AgendaEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: 'Projetos' | 'Hábitos' | 'Descanso' | 'Reuniões' | 'Tarefas';
  subcrebro_relacionado?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useAgendaEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agenda_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos da agenda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<AgendaEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .insert({
          ...eventData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!"
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateEvent = async (id: string, updates: Partial<AgendaEvent>) => {
    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...data } : event
      ));

      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!"
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agenda_events')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Sucesso",
        description: "Evento removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o evento",
        variant: "destructive"
      });
    }
  };

  const markAsCompleted = async (id: string, completed: boolean) => {
    return updateEvent(id, { completed });
  };

  useEffect(() => {
    loadEvents();
  }, [user?.id]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    markAsCompleted,
    refreshEvents: loadEvents
  };
};
