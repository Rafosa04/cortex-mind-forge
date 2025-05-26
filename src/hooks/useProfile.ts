
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProfileStats {
  ideasCaptured: number;
  projectsCompleted: number;
  activeHabits: number;
  activeConnections: number;
  totalPosts: number;
  totalLikes: number;
}

interface ProfileData {
  avatarUrl: string;
  coverUrl: string;
  name: string;
  username: string;
  bio: string;
  location?: string;
  publicLink: string;
}

export const useProfile = (profileUserId?: string) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const targetUserId = profileUserId || user?.id;
  const isOwnProfile = !profileUserId || profileUserId === user?.id;

  const fetchProfileData = async () => {
    if (!targetUserId) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;

      setProfileData({
        avatarUrl: profile.avatar_url || '/placeholder.svg',
        coverUrl: 'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1190&q=80',
        name: profile.name || 'Usuário',
        username: profile.name?.toLowerCase().replace(/\s+/g, '_') || 'usuario',
        bio: 'Designer, pesquisador e apaixonado por conectar ideias. Construindo um segundo cérebro para explorar o potencial da mente humana.',
        location: 'São Paulo, Brasil',
        publicLink: `cortex.ai/${profile.name?.toLowerCase().replace(/\s+/g, '_') || 'usuario'}`
      });
    } catch (error: any) {
      console.error('Erro ao buscar dados do perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do perfil",
        variant: "destructive"
      });
    }
  };

  const fetchProfileStats = async () => {
    if (!targetUserId) return;

    try {
      // Buscar estatísticas de projetos
      const { data: projects } = await supabase
        .from('projects')
        .select('status')
        .eq('user_id', targetUserId);

      // Buscar estatísticas de hábitos
      const { data: habits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', targetUserId);

      // Buscar estatísticas de posts
      const { data: posts } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('user_id', targetUserId);

      // Buscar estatísticas de conexões
      const { data: connections } = await supabase
        .from('user_connections')
        .select('status')
        .or(`requester_id.eq.${targetUserId},addressee_id.eq.${targetUserId}`)
        .eq('status', 'accepted');

      // Buscar favoritos salvos
      const { data: favorites } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', targetUserId);

      const projectsCompleted = projects?.filter(p => p.status === 'concluido').length || 0;
      const totalLikes = posts?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

      setProfileStats({
        ideasCaptured: (favorites?.length || 0) + (posts?.length || 0),
        projectsCompleted,
        activeHabits: habits?.length || 0,
        activeConnections: connections?.length || 0,
        totalPosts: posts?.length || 0,
        totalLikes
      });
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas do perfil:', error);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user || !isOwnProfile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfileData();
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!"
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (targetUserId) {
      setLoading(true);
      Promise.all([fetchProfileData(), fetchProfileStats()])
        .finally(() => setLoading(false));
    }
  }, [targetUserId]);

  return {
    profileData,
    profileStats,
    loading,
    isOwnProfile,
    updateProfile,
    refetch: () => Promise.all([fetchProfileData(), fetchProfileStats()])
  };
};
