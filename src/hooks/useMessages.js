
import { useConversations } from "./useConversations";

// Este hook é mantido para compatibilidade, mas agora usa useConversations
export const useMessages = () => {
  console.warn("useMessages is deprecated, use useConversations instead");
  
  const { conversations, messages, sendMessage, markAsRead } = useConversations();
  
  // Converter formato para compatibilidade
  const convertedMessages = [];
  Object.entries(messages).forEach(([conversationId, msgs]) => {
    msgs.forEach(msg => {
      convertedMessages.push({
        id: msg.id,
        text: msg.content,
        senderId: msg.sender_id,
        contactId: conversationId,
        timestamp: msg.created_at,
        read: !!msg.read_at
      });
    });
  });

  const unreadCounts = {};
  conversations.forEach(conv => {
    const convMessages = messages[conv.id] || [];
    unreadCounts[conv.id] = convMessages.filter(msg => !msg.read_at && msg.sender_id !== conv.participant_1).length;
  });

  return {
    messages: convertedMessages,
    unreadCounts,
    sendMessage: (messageData) => sendMessage(messageData.contactId, messageData.text),
    markAsRead
  };
};
