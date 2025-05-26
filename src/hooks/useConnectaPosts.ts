
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ConnectaPost {
  id: string;
  content: string;
  category: string;
  createdAt: string;
  likes: number;
  comments: number;
  saves: number;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
}

export const useConnectaPosts = () => {
  const [posts, setPosts] = useState<ConnectaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          category,
          created_at,
          likes_count,
          comments_count,
          saves_count,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPosts: ConnectaPost[] = data?.map(post => ({
        id: post.id,
        content: post.content,
        category: post.category,
        createdAt: post.created_at,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        saves: post.saves_count || 0,
        author: {
          name: post.profiles?.name || 'Usuário',
          username: post.profiles?.name?.toLowerCase().replace(/\s+/g, '_') || 'usuario',
          avatar: post.profiles?.avatar_url || '/placeholder.svg'
        }
      })) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    loading,
    refetch: fetchPosts
  };
};
