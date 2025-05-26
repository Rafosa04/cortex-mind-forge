
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Project {
  id: string;
  title: string;
  progress: number;
  status: 'em_andamento' | 'planejado' | 'concluido';
  thumbnail: string;
}

interface Achievement {
  label: string;
  streak: number;
  icon: string;
}

interface TopPost {
  id: string;
  content: string;
  likes: number;
  comments: number;
  category: 'focus' | 'expansion' | 'reflection';
}

interface RecentFavorite {
  title: string;
  type: string;
  accessCount: number;
}

interface AthenaeSuggestion {
  content: string;
  timestamp: string;
}

export const useProfileHighlights = (profileUserId?: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [recentFavorites, setRecentFavorites] = useState<RecentFavorite[]>([]);
  const [athenaeSuggestion, setAthenaeSuggestion] = useState<AthenaeSuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const targetUserId = profileUserId || user?.id;

  const fetchProjects = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', targetUserId)
        .order('progress', { ascending: false })
        .limit(3);

      if (error) throw error;

      const transformedProjects: Project[] = data?.map(project => ({
        id: project.id,
        title: project.name,
        progress: project.progress || 0,
        status: project.status as 'em_andamento' | 'planejado' | 'concluido',
        thumbnail: '/placeholder.svg'
      })) || [];

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };

  const fetchAchievements = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('name, streak')
        .eq('user_id', targetUserId)
        .gt('streak', 0)
        .order('streak', { ascending: false })
        .limit(3);

      if (error) throw error;

      const transformedAchievements: Achievement[] = data?.map(habit => ({
        label: habit.name,
        streak: habit.streak || 0,
        icon: '🎯'
      })) || [];

      setAchievements(transformedAchievements);
    } catch (error) {
      console.error('Erro ao buscar conquistas:', error);
    }
  };

  const fetchTopPosts = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', targetUserId)
        .order('likes_count', { ascending: false })
        .limit(1);

      if (error) throw error;

      const transformedPosts: TopPost[] = data?.map(post => ({
        id: post.id,
        content: post.content,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        category: post.category as 'focus' | 'expansion' | 'reflection'
      })) || [];

      setTopPosts(transformedPosts);
    } catch (error) {
      console.error('Erro ao buscar top posts:', error);
    }
  };

  const fetchRecentFavorites = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;

      const transformedFavorites: RecentFavorite[] = data?.map(favorite => ({
        title: favorite.title,
        type: favorite.type || 'artigo',
        accessCount: Math.floor(Math.random() * 20) + 5 // Mock até implementar tracking
      })) || [];

      setRecentFavorites(transformedFavorites);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const fetchAthenaeSuggestion = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('athena_highlights')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const suggestion = data[0];
        setAthenaeSuggestion({
          content: suggestion.description || 'Continue explorando suas conexões mentais!',
          timestamp: 'há 2 dias'
        });
      } else {
        setAthenaeSuggestion({
          content: "Notei que você está criando conteúdo sobre produtividade. Que tal conectar com seu projeto de IA pessoal para criar um sistema integrado?",
          timestamp: "há 2 dias"
        });
      }
    } catch (error) {
      console.error('Erro ao buscar sugestão da Athena:', error);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      setLoading(true);
      Promise.all([
        fetchProjects(),
        fetchAchievements(),
        fetchTopPosts(),
        fetchRecentFavorites(),
        fetchAthenaeSuggestion()
      ]).finally(() => setLoading(false));
    }
  }, [targetUserId]);

  return {
    projects,
    achievements,
    topPosts,
    recentFavorites,
    athenaeSuggestion,
    loading,
    refetch: () => Promise.all([
      fetchProjects(),
      fetchAchievements(),
      fetchTopPosts(),
      fetchRecentFavorites(),
      fetchAthenaeSuggestion()
    ])
  };
};
