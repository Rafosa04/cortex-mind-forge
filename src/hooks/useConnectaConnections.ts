
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
      // Buscar conexões
      const { data: connectionsData, error } = await supabase
        .from('user_connections')
        .select('*')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar profiles dos usuários conectados
      const userIds = connectionsData?.flatMap(conn => [conn.requester_id, conn.addressee_id])
        .filter(id => id !== user.id) || [];
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      const transformedConnections: ConnectionType[] = connectionsData?.map(conn => {
        const isRequester = conn.requester_id === user.id;
        const otherUserId = isRequester ? conn.addressee_id : conn.requester_id;
        const otherUser = profilesData?.find(p => p.id === otherUserId);
        
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
      // Buscar conversas
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Buscar profiles dos participantes
      const participantIds = conversationsData?.flatMap(conv => [conv.participant_1, conv.participant_2])
        .filter(id => id !== user.id) || [];
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', participantIds);

      // Buscar mensagens das conversas
      const conversationIds = conversationsData?.map(conv => conv.id) || [];
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      const transformedConversations: ConversationType[] = conversationsData?.map(conv => {
        const isParticipant1 = conv.participant_1 === user.id;
        const otherParticipantId = isParticipant1 ? conv.participant_2 : conv.participant_1;
        const otherParticipant = profilesData?.find(p => p.id === otherParticipantId);
        
        // Filtrar mensagens desta conversa
        const conversationMessages = messagesData?.filter(msg => msg.conversation_id === conv.id) || [];
        const lastMessage = conversationMessages[0];
        
        // Contar mensagens não lidas
        const unreadCount = conversationMessages.filter(
          msg => msg.sender_id !== user.id && !msg.read_at
        ).length;

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
