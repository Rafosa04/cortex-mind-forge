
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalHabits: number;
  totalSubcerebros: number;
  totalPosts: number;
  totalDiaryEntries: number;
  totalAthenaLogs: number;
}

interface UserStats {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
  total_projects: number;
  total_habits: number;
  total_subcerebros: number;
}

interface ActivityData {
  date: string;
  users: number;
  projects: number;
  habits: number;
  athena_calls: number;
}

export const useAdminData = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      // Buscar métricas gerais
      const [
        { count: totalUsers },
        { count: totalProjects },
        { count: totalHabits },
        { count: totalSubcerebros },
        { count: totalPosts },
        { count: totalDiaryEntries },
        { count: totalAthenaLogs }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('habits').select('*', { count: 'exact', head: true }),
        supabase.from('subcerebros').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('diary_entries').select('*', { count: 'exact', head: true }),
        supabase.from('athena_logs').select('*', { count: 'exact', head: true })
      ]);

      // Calcular usuários ativos (logaram nos últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', sevenDaysAgo.toISOString());

      setMetrics({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalProjects: totalProjects || 0,
        totalHabits: totalHabits || 0,
        totalSubcerebros: totalSubcerebros || 0,
        totalPosts: totalPosts || 0,
        totalDiaryEntries: totalDiaryEntries || 0,
        totalAthenaLogs: totalAthenaLogs || 0
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      toast({
        title: "Erro ao carregar métricas",
        description: "Não foi possível carregar as métricas do sistema",
        variant: "destructive"
      });
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          role,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Buscar estatísticas adicionais para cada usuário
      const userStatsWithCounts = await Promise.all(
        (users || []).map(async (user) => {
          const [
            { count: totalProjects },
            { count: totalHabits },
            { count: totalSubcerebros }
          ] = await Promise.all([
            supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('habits').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('subcerebros').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
          ]);

          return {
            id: user.id,
            name: user.name,
            email: 'email@hidden.com', // Por privacidade
            role: user.role,
            created_at: user.created_at,
            last_sign_in_at: user.updated_at,
            total_projects: totalProjects || 0,
            total_habits: totalHabits || 0,
            total_subcerebros: totalSubcerebros || 0
          };
        })
      );

      setUserStats(userStatsWithCounts);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar as estatísticas dos usuários",
        variant: "destructive"
      });
    }
  };

  const fetchActivityData = async () => {
    try {
      // Buscar dados de atividade dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activityPromises = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        activityPromises.push(
          Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true })
              .gte('created_at', dateStr)
              .lt('created_at', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
            supabase.from('projects').select('*', { count: 'exact', head: true })
              .gte('created_at', dateStr)
              .lt('created_at', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
            supabase.from('habits').select('*', { count: 'exact', head: true })
              .gte('created_at', dateStr)
              .lt('created_at', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
            supabase.from('athena_logs').select('*', { count: 'exact', head: true })
              .gte('created_at', dateStr)
              .lt('created_at', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          ]).then(([users, projects, habits, athena]) => ({
            date: dateStr,
            users: users.count || 0,
            projects: projects.count || 0,
            habits: habits.count || 0,
            athena_calls: athena.count || 0
          }))
        );
      }

      const activityResults = await Promise.all(activityPromises);
      setActivityData(activityResults.reverse());
    } catch (error) {
      console.error('Erro ao buscar dados de atividade:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role atualizada",
        description: "A role do usuário foi atualizada com sucesso"
      });

      // Recarregar dados
      await fetchUserStats();
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast({
        title: "Erro ao atualizar role",
        description: "Não foi possível atualizar a role do usuário",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMetrics(),
        fetchUserStats(),
        fetchActivityData()
      ]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  return {
    metrics,
    userStats,
    activityData,
    loading,
    refetch: () => {
      fetchMetrics();
      fetchUserStats();
      fetchActivityData();
    },
    updateUserRole
  };
};
