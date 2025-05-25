
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Habito } from "@/components/Habitos/HabitoCard";
import { generateHabitInsight } from "@/utils/athenaInsightUtils";
import { useAuth } from '@/hooks/useAuth';

const QUERY_KEYS = {
  habits: ['habits'] as const,
  habit: (id: string) => ['habits', id] as const,
} as const;

export function useOptimizedHabitos() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Main query for habits
  const {
    data: habitos = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.habits,
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(habit => ({
        id: habit.id,
        nome: habit.name,
        proposito: habit.description || '',
        frequencia: habit.frequency || 'Diário',
        progresso: habit.progress || 0,
        streak: habit.streak || 0,
        ultimoCheck: habit.last_check_in 
          ? new Date(habit.last_check_in).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Nunca',
        observacaoIA: habit.ai_observation || 'Continue assim!',
        tags: habit.tags || [],
        icone: habit.icon || '💪',
      })) as Habito[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add habit mutation
  const addHabitMutation = useMutation({
    mutationFn: async ({ nome, proposito, frequencia }: { 
      nome: string; 
      proposito: string; 
      frequencia: string; 
    }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const newHabitFormatted: Habito = {
        nome,
        proposito,
        frequencia,
        progresso: 0,
        streak: 0,
        ultimoCheck: 'Nunca',
        tags: ['novo'],
        observacaoIA: ''
      };

      const insight = generateHabitInsight(newHabitFormatted);

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
        ai_observation: insight
      };

      const { error } = await supabase.from('habits').insert(newHabit);
      if (error) throw error;

      return newHabit;
    },
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.habits });
      
      const previousHabits = queryClient.getQueryData(QUERY_KEYS.habits);
      
      const optimisticHabit: Habito = {
        id: `temp-${Date.now()}`,
        nome: newHabit.nome,
        proposito: newHabit.proposito,
        frequencia: newHabit.frequencia,
        progresso: 0,
        streak: 0,
        ultimoCheck: 'Nunca',
        observacaoIA: 'Continue assim!',
        tags: ['novo'],
        icone: '💪',
      };
      
      queryClient.setQueryData(QUERY_KEYS.habits, (old: Habito[] = []) => 
        [optimisticHabit, ...old]
      );
      
      return { previousHabits };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(QUERY_KEYS.habits, context?.previousHabits);
      toast({
        title: "Erro ao adicionar hábito",
        description: "Não foi possível adicionar o hábito. Tente novamente.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.habits });
      toast({
        title: "Hábito adicionado com sucesso!",
        description: "Continue acompanhando seu progresso",
      });
    },
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const today = new Date().toISOString().split('T')[0];
      const { data: existingCheckIn } = await supabase
        .from('habit_check_ins')
        .select('id')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .gte('checked_in_at', today)
        .single();

      if (existingCheckIn) {
        throw new Error("Check-in já realizado hoje");
      }

      const { error } = await supabase
        .from('habit_check_ins')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          checked_in_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: (_, habitId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.habits });
      
      // Update AI observation after check-in
      setTimeout(async () => {
        try {
          const { data: updatedHabit } = await supabase
            .from('habits')
            .select('*')
            .eq('id', habitId)
            .single();
            
          if (updatedHabit) {
            const habitoFormatado: Habito = {
              id: updatedHabit.id,
              nome: updatedHabit.name,
              proposito: updatedHabit.description || '',
              frequencia: updatedHabit.frequency || 'Diário',
              progresso: updatedHabit.progress || 0,
              streak: updatedHabit.streak || 0,
              ultimoCheck: updatedHabit.last_check_in 
                ? new Date(updatedHabit.last_check_in).toLocaleDateString('pt-BR')
                : 'Nunca',
              observacaoIA: updatedHabit.ai_observation || 'Continue assim!',
              tags: updatedHabit.tags || [],
              icone: updatedHabit.icon || '💪',
            };
            
            const newInsight = generateHabitInsight(habitoFormatado);
            
            await supabase
              .from('habits')
              .update({ ai_observation: newInsight })
              .eq('id', habitId);
          }
        } catch (error) {
          console.error("Erro ao atualizar insight:", error);
        }
      }, 1000);

      toast({
        title: "Check-in realizado!",
        description: "Continue assim para alcançar seus objetivos.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: error.message === "Check-in já realizado hoje" 
          ? "Check-in já realizado" 
          : "Erro no check-in",
        description: error.message === "Check-in já realizado hoje"
          ? "Você já fez check-in neste hábito hoje!"
          : "Não foi possível realizar o check-in. Tente novamente.",
        variant: error.message === "Check-in já realizado hoje" ? "default" : "destructive"
      });
    },
  });

  // Delete habit mutation
  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
    },
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.habits });
      
      const previousHabits = queryClient.getQueryData(QUERY_KEYS.habits);
      
      queryClient.setQueryData(QUERY_KEYS.habits, (old: Habito[] = []) =>
        old.filter(habit => habit.id !== habitId)
      );
      
      return { previousHabits };
    },
    onError: (err, habitId, context) => {
      queryClient.setQueryData(QUERY_KEYS.habits, context?.previousHabits);
      toast({
        title: "Erro ao deletar hábito",
        description: "Não foi possível deletar o hábito. Tente novamente.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Hábito deletado",
        description: "Hábito removido com sucesso",
      });
    },
  });

  // Memoized functions
  const addHabit = useCallback((nome: string, proposito: string, frequencia: string) => {
    return addHabitMutation.mutateAsync({ nome, proposito, frequencia });
  }, [addHabitMutation]);

  const checkInHabit = useCallback((habitId: string) => {
    return checkInMutation.mutateAsync(habitId);
  }, [checkInMutation]);

  const deleteHabit = useCallback((habitId: string) => {
    return deleteHabitMutation.mutateAsync(habitId);
  }, [deleteHabitMutation]);

  const refetch = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.habits });
  }, [queryClient]);

  // Legacy update function for compatibility
  const updateHabit = useCallback(async (habitId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.habits });
      
      toast({
        title: "Hábito atualizado",
        description: "Alterações salvas com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar hábito",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  }, [queryClient]);

  return {
    habitos,
    loading,
    error: error?.message || null,
    addHabit,
    updateHabit,
    checkInHabit,
    deleteHabit,
    refetch
  };
}
