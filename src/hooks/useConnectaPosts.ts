import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

/**
 * Interface para autor do post com dados do perfil
 */
interface PostAuthor {
  id: string;
  name: string;
  avatar_url: string | null;
  username?: string;
}

/**
 * Interface para post com autor completo
 */
interface PostWithAuthor {
  id: string;
  content: string;
  category: 'focus' | 'expansion' | 'reflection';
  created_at: string;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  user_id: string;
  image_url?: string;
  author: PostAuthor;
}

/**
 * Interface para post transformado para uso na UI
 */
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
  imageUrl?: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
}

/**
 * Hook para gerenciar posts da rede social Connecta
 */
export const useConnectaPosts = () => {
  const [posts, setPosts] = useState<ConnectaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Busca posts com dados do autor via join com profiles
   */
  const fetchPosts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Query com join explícito para buscar dados do autor
      const { data: postsData, error: postsError } = await supabase
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
          image_url,
          profiles!inner (
            id,
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Erro ao buscar posts:', postsError);
        setError(postsError.message);
        return;
      }

      if (!postsData) {
        setPosts([]);
        return;
      }

      // Buscar likes e saves do usuário atual para todos os posts
      const postIds = postsData.map(post => post.id);
      
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

      // Transformar dados para interface esperada
      const transformedPosts: ConnectaPost[] = postsData.map(post => {
        const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
        
        return {
          id: post.id,
          content: post.content,
          category: post.category as 'focus' | 'expansion' | 'reflection',
          createdAt: post.created_at,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          saves: post.saves_count || 0,
          liked: userLikes.has(post.id),
          saved: userSaves.has(post.id),
          imageUrl: post.image_url || undefined,
          author: {
            name: profile?.name || 'Usuário',
            username: profile?.name?.toLowerCase().replace(/\s+/g, '_') || 'usuario',
            avatar: profile?.avatar_url || '/placeholder.svg'
          }
        };
      });

      setPosts(transformedPosts);
    } catch (error: any) {
      console.error('Erro ao buscar posts:', error);
      setError(error.message || 'Erro desconhecido ao buscar posts');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cria um novo post
   */
  const createPost = async (content: string, category: 'focus' | 'expansion' | 'reflection', imageUrl?: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    if (!content.trim()) {
      throw new Error('Conteúdo não pode estar vazio');
    }

    try {
      console.log('Criando post:', { content, category, imageUrl, user_id: user.id });

      const postData = {
        content: content.trim(),
        category,
        user_id: user.id,
        image_url: imageUrl || null,
        likes_count: 0,
        comments_count: 0,
        saves_count: 0
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          id,
          content,
          category,
          created_at,
          likes_count,
          comments_count,
          saves_count,
          user_id,
          image_url
        `)
        .single();

      if (error) {
        console.error('Erro do Supabase ao criar post:', error);
        throw new Error(`Erro ao criar post: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado após criação do post');
      }

      console.log('Post criado com sucesso:', data);

      // Recarregar posts para mostrar o novo post
      await fetchPosts();
      
      return data;
    } catch (error: any) {
      console.error('Erro completo ao criar post:', error);
      throw error;
    }
  };

  /**
   * Alterna o like de um post
   */
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
      toast({
        title: "Erro",
        description: "Não foi possível curtir o post.",
        variant: "destructive"
      });
    }
  };

  /**
   * Alterna o save de um post
   */
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
      toast({
        title: "Erro",
        description: "Não foi possível salvar o post.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  return {
    posts,
    loading,
    error,
    createPost,
    toggleLike,
    toggleSave,
    refetch: fetchPosts
  };
};
