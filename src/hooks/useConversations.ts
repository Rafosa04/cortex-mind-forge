
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  metadata: any;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
  other_participant?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  unread_count?: number;
  last_message?: Message;
}

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Buscar conversas do usuário
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1_profile:profiles!conversations_participant_1_fkey(id, name, avatar_url),
          participant_2_profile:profiles!conversations_participant_2_fkey(id, name, avatar_url)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Processar conversas para incluir informações do outro participante
      const processedConversations = (conversationsData || []).map(conv => {
        const isParticipant1 = conv.participant_1 === user.id;
        const otherParticipant = isParticipant1 
          ? conv.participant_2_profile 
          : conv.participant_1_profile;

        return {
          ...conv,
          other_participant: otherParticipant
        };
      });

      setConversations(processedConversations);

      // Carregar mensagens para cada conversa
      for (const conv of processedConversations) {
        await loadMessages(conv.id);
      }

    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [conversationId]: data || []
      }));

      return data || [];
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      return [];
    }
  };

  const sendMessage = async (conversationId: string, content: string, messageType = 'text') => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          message_type: messageType
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar mensagens localmente
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), data]
      }));

      // Atualizar timestamp da conversa
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
      return null;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user?.id) return;

    try {
      const conversationMessages = messages[conversationId] || [];
      const unreadMessages = conversationMessages.filter(
        msg => msg.sender_id !== user.id && !msg.read_at
      );

      if (unreadMessages.length === 0) return;

      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_id', user.id, { negate: true })
        .is('read_at', null);

      if (error) throw error;

      // Atualizar mensagens localmente
      setMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId]?.map(msg => 
          msg.sender_id !== user.id && !msg.read_at 
            ? { ...msg, read_at: new Date().toISOString() }
            : msg
        ) || []
      }));

    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const createConversation = async (participantId: string) => {
    if (!user?.id) return null;

    try {
      // Verificar se já existe uma conversa entre os usuários
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${participantId}),and(participant_1.eq.${participantId},participant_2.eq.${user.id})`)
        .single();

      if (existingConv) {
        return existingConv;
      }

      // Criar nova conversa
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: participantId
        })
        .select()
        .single();

      if (error) throw error;

      await loadConversations(); // Recarregar conversas
      return data;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user?.id]);

  // Configurar realtime para novas mensagens
  useEffect(() => {
    if (!user?.id) return;

    const messagesSubscription = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => ({
            ...prev,
            [newMessage.conversation_id]: [
              ...(prev[newMessage.conversation_id] || []),
              newMessage
            ]
          }));
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [user?.id]);

  return {
    conversations,
    messages,
    loading,
    sendMessage,
    markAsRead,
    createConversation,
    loadMessages,
    refreshConversations: loadConversations
  };
};
