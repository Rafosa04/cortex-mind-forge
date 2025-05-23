
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Habito } from "@/components/Habitos/HabitoCard";

export function useHabitos() {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
    
    // Configurar realtime subscription
    const channel = supabase
      .channel('habits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habits'
        },
        () => {
          console.log('Habit change detected, refetching...');
          fetchHabits();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habit_check_ins'
        },
        () => {
          console.log('Check-in change detected, refetching...');
          fetchHabits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para ver seus hábitos",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao buscar hábitos",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (data) {
        const mappedHabits: Habito[] = data.map(habit => ({
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
        }));
        setHabitos(mappedHabits);
      }
    } catch (error) {
      console.error("Erro ao buscar hábitos:", error);
      toast({
        title: "Erro ao buscar hábitos",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (nome: string, proposito: string, frequencia: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para adicionar um hábito",
          variant: "destructive"
        });
        return;
      }

      const newHabit = {
        name: nome,
        description: proposito,
        frequency: frequencia,
        user_id: user.id,
        goal: 100,
        progress: 0,
        streak: 0,
        icon: '💪',
        tags: ['novo'],
        ai_observation: 'Novo hábito criado! Vamos começar!'
      };

      const { error } = await supabase.from('habits').insert(newHabit);

      if (error) {
        toast({
          title: "Erro ao adicionar hábito",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Hábito adicionado com sucesso!",
        description: "Continue acompanhando seu progresso",
      });
    } catch (error) {
      console.error("Erro ao adicionar hábito:", error);
      toast({
        title: "Erro ao adicionar hábito",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  const checkInHabit = async (habitId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para fazer check-in",
          variant: "destructive"
        });
        return;
      }

      // Verificar se já fez check-in hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: existingCheckIn } = await supabase
        .from('habit_check_ins')
        .select('id')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .gte('checked_in_at', today)
        .single();

      if (existingCheckIn) {
        toast({
          title: "Check-in já realizado",
          description: "Você já fez check-in neste hábito hoje!",
          variant: "default"
        });
        return;
      }

      const { error } = await supabase
        .from('habit_check_ins')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          checked_in_at: new Date().toISOString()
        });

      if (error) {
        toast({
          title: "Erro no check-in",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Check-in realizado!",
        description: "Continue assim para alcançar seus objetivos.",
      });
    } catch (error) {
      console.error("Erro no check-in:", error);
      toast({
        title: "Erro no check-in",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) {
        toast({
          title: "Erro ao deletar hábito",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Hábito deletado",
        description: "Hábito removido com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar hábito:", error);
      toast({
        title: "Erro ao deletar hábito",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  return {
    habitos,
    loading,
    addHabit,
    checkInHabit,
    deleteHabit,
    refetch: fetchHabits
  };
}
