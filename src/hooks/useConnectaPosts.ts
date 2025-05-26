
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ConnectaPost {
  id: string;
  content: string;
  category: 'focus' | 'expansion' | 'reflection';
  createdAt: string;
  likes: number;
  comments: number;
  saves: number;
  liked: boolean;
  saved: boolean;
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
  const { toast } = useToast();

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
          user_id,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar likes e saves do usuário atual
      const postIds = data?.map(post => post.id) || [];
      
      const [likesData, savesData] = await Promise.all([
        supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds),
        supabase
          .from('post_saves')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds)
      ]);

      const userLikes = new Set(likesData.data?.map(like => like.post_id) || []);
      const userSaves = new Set(savesData.data?.map(save => save.post_id) || []);

      const transformedPosts: ConnectaPost[] = data?.map(post => ({
        id: post.id,
        content: post.content,
        category: post.category as 'focus' | 'expansion' | 'reflection',
        createdAt: post.created_at,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        saves: post.saves_count || 0,
        liked: userLikes.has(post.id),
        saved: userSaves.has(post.id),
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

  const createPost = async (content: string, category: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content,
            category,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso.",
      });

      await fetchPosts();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o post.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.liked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user.id }]);
      }

      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                liked: !p.liked, 
                likes: p.liked ? p.likes - 1 : p.likes + 1 
              }
            : p
        )
      );
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.saved) {
        await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_saves')
          .insert([{ post_id: postId, user_id: user.id }]);
      }

      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                saved: !p.saved, 
                saves: p.saved ? p.saves - 1 : p.saves + 1 
              }
            : p
        )
      );
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    toggleSave,
    refetch: fetchPosts
  };
};
