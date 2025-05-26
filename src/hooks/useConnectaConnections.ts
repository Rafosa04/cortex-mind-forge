
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { ConnectionType, ConversationType, UserSuggestionType } from '@/types/connecta';

export const useConnectaConnections = () => {
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [suggestions, setSuggestions] = useState<UserSuggestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConnections = async () => {
    if (!user) return;

    try {
      // Buscar conexões pendentes e aceitas
      const { data: connectionsData, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          requester:profiles!user_connections_requester_id_fkey(name, avatar_url),
          addressee:profiles!user_connections_addressee_id_fkey(name, avatar_url)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedConnections: ConnectionType[] = connectionsData?.map(conn => {
        const isRequester = conn.requester_id === user.id;
        const otherUser = isRequester ? conn.addressee : conn.requester;
        
        return {
          id: conn.id,
          name: otherUser?.name || 'Usuário',
          avatar: otherUser?.avatar_url || '/placeholder.svg',
          username: otherUser?.name?.toLowerCase().replace(/\s+/g, '') || 'usuario',
          status: conn.status as 'pending' | 'accepted' | 'suggested',
          mutualConnections: Math.floor(Math.random() * 10) // TODO: Calcular conexões mútuas reais
        };
      }) || [];

      setConnections(transformedConnections);
    } catch (error: any) {
      console.error('Erro ao buscar conexões:', error);
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:profiles!conversations_participant_1_fkey(name, avatar_url),
          participant2:profiles!conversations_participant_2_fkey(name, avatar_url),
          messages(content, created_at, sender_id, read_at)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const transformedConversations: ConversationType[] = conversationsData?.map(conv => {
        const isParticipant1 = conv.participant_1 === user.id;
        const otherParticipant = isParticipant1 ? conv.participant2 : conv.participant1;
        const lastMessage = conv.messages?.[0];
        
        // Contar mensagens não lidas
        const unreadCount = conv.messages?.filter(
          (msg: any) => msg.sender_id !== user.id && !msg.read_at
        ).length || 0;

        return {
          id: conv.id,
          participant: {
            name: otherParticipant?.name || 'Usuário',
            avatar: otherParticipant?.avatar_url || '/placeholder.svg',
            username: otherParticipant?.name?.toLowerCase().replace(/\s+/g, '') || 'usuario'
          },
          lastMessage: lastMessage?.content || 'Conversa iniciada',
          timestamp: lastMessage?.created_at || conv.created_at,
          unreadCount,
          isOnline: Math.random() > 0.5 // TODO: Implementar presença real
        };
      }) || [];

      setConversations(transformedConversations);
    } catch (error: any) {
      console.error('Erro ao buscar conversas:', error);
    }
  };

  const fetchSuggestions = async () => {
    if (!user) return;

    try {
      // Buscar usuários que não são conexões atuais
      const { data: suggestionsData, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(5);

      if (error) throw error;

      // Filtrar usuários que já são conexões
      const existingConnectionIds = connections.map(c => c.id);
      const filteredSuggestions = suggestionsData?.filter(
        profile => !existingConnectionIds.includes(profile.id)
      ) || [];

      const transformedSuggestions: UserSuggestionType[] = filteredSuggestions.map(profile => ({
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar_url || '/placeholder.svg',
        username: profile.name.toLowerCase().replace(/\s+/g, ''),
        commonCells: Math.floor(Math.random() * 15) + 1, // TODO: Calcular células em comum reais
        mutualConnections: Math.floor(Math.random() * 5),
        isFollowing: false // TODO: Verificar se já segue
      }));

      setSuggestions(transformedSuggestions);
    } catch (error: any) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  const acceptConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Conexão aceita",
        description: "Conexão estabelecida com sucesso!"
      });

      await fetchConnections();
    } catch (error: any) {
      console.error('Erro ao aceitar conexão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar a conexão",
        variant: "destructive"
      });
    }
  };

  const rejectConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Conexão rejeitada",
        description: "Solicitação rejeitada"
      });

      await fetchConnections();
    } catch (error: any) {
      console.error('Erro ao rejeitar conexão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a conexão",
        variant: "destructive"
      });
    }
  };

  const followUser = async (userId: string) => {
    if (!user) return;

    try {
      const { data: existingFollow } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      if (existingFollow) {
        // Deixar de seguir
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        toast({
          title: "Deixou de seguir",
          description: "Você não segue mais este usuário"
        });
      } else {
        // Seguir
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        toast({
          title: "Seguindo",
          description: "Agora você está seguindo este usuário!"
        });
      }

      // Atualizar estado local
      setSuggestions(prev => prev.map(suggestion => 
        suggestion.id === userId 
          ? { ...suggestion, isFollowing: !suggestion.isFollowing }
          : suggestion
      ));

    } catch (error: any) {
      console.error('Erro ao seguir usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível seguir o usuário",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchConnections(),
        fetchConversations(),
        fetchSuggestions()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  return {
    connections,
    conversations,
    suggestions,
    loading,
    acceptConnection,
    rejectConnection,
    followUser,
    refetch: () => Promise.all([fetchConnections(), fetchConversations(), fetchSuggestions()])
  };
};
