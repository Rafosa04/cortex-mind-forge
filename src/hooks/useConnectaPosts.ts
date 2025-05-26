
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { PostType } from '@/types/connecta';

export const useConnectaPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Buscar posts com informações do autor
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Buscar likes e saves do usuário atual se estiver logado
      let userLikes: string[] = [];
      let userSaves: string[] = [];

      if (user) {
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        const { data: savesData } = await supabase
          .from('post_saves')
          .select('post_id')
          .eq('user_id', user.id);

        userLikes = likesData?.map(like => like.post_id) || [];
        userSaves = savesData?.map(save => save.post_id) || [];
      }

      // Transformar dados para o formato esperado
      const transformedPosts: PostType[] = postsData?.map(post => ({
        id: post.id,
        author: {
          name: post.profiles?.name || 'Usuário',
          avatar: post.profiles?.avatar_url || '/placeholder.svg',
          username: post.profiles?.name?.toLowerCase().replace(/\s+/g, '') || 'usuario'
        },
        content: post.content,
        createdAt: post.created_at,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        saves: post.saves_count || 0,
        liked: userLikes.includes(post.id),
        saved: userSaves.includes(post.id),
        category: post.category as 'focus' | 'expansion' | 'reflection',
        imageUrl: post.image_url || undefined
      })) || [];

      setPosts(transformedPosts);
    } catch (error: any) {
      console.error('Erro ao buscar posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, category: 'focus' | 'expansion' | 'reflection', imageUrl?: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um post",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          category,
          image_url: imageUrl
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post criado com sucesso!"
      });

      // Recarregar posts
      await fetchPosts();
    } catch (error: any) {
      console.error('Erro ao criar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o post",
        variant: "destructive"
      });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      // Verificar se já curtiu
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existingLike) {
        // Remover like
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
      } else {
        // Adicionar like
        await supabase
          .from('post_likes')
          .insert({
            user_id: user.id,
            post_id: postId
          });
      }

      // Atualizar estado local
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newLiked = !post.liked;
          return {
            ...post,
            liked: newLiked,
            likes: newLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      }));

    } catch (error: any) {
      console.error('Erro ao curtir post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível curtir o post",
        variant: "destructive"
      });
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;

    try {
      // Verificar se já salvou
      const { data: existingSave } = await supabase
        .from('post_saves')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existingSave) {
        // Remover save
        await supabase
          .from('post_saves')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
      } else {
        // Adicionar save
        await supabase
          .from('post_saves')
          .insert({
            user_id: user.id,
            post_id: postId
          });
      }

      // Atualizar estado local
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newSaved = !post.saved;
          return {
            ...post,
            saved: newSaved,
            saves: newSaved ? post.saves + 1 : post.saves - 1
          };
        }
        return post;
      }));

    } catch (error: any) {
      console.error('Erro ao salvar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o post",
        variant: "destructive"
      });
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
