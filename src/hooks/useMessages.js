
import { useState, useEffect } from "react";

// Mock initial messages
const initialMessages = [
  {
    id: "m1",
    text: "Olá! Como está indo o desenvolvimento do seu projeto sobre visualização de dados?",
    senderId: "1", // Contact ID
    contactId: "1", 
    timestamp: "2025-05-16T09:15:00Z",
    read: true
  },
  {
    id: "m2",
    text: "Estou trabalhando na integração da API e visualização de grafos. Queria ter sua opinião sobre o design dos nós.",
    senderId: "me", 
    contactId: "1", 
    timestamp: "2025-05-16T09:17:00Z",
    read: true
  },
  {
    id: "m3",
    text: "Claro! Acho que podemos usar gradientes para indicar o nível de conexão entre conceitos. Tenho uma ideia para criar um subcérebro específico para esse projeto.",
    senderId: "1", 
    contactId: "1", 
    timestamp: "2025-05-16T09:20:00Z",
    read: false
  },
  {
    id: "m4",
    text: "Gostei muito dessa proposta! Quero transformar isso em um projeto mais estruturado dentro do Córtex.",
    senderId: "me", 
    contactId: "1", 
    timestamp: "2025-05-16T09:22:00Z",
    read: false
  },
  // Mensagens para o contato 4 (Athena)
  {
    id: "m5",
    text: "Detectei que você tem mencionado meditação em várias conversas. Gostaria de transformar isso em um hábito?",
    senderId: "4", 
    contactId: "4", 
    timestamp: "2025-05-14T09:45:00Z",
    read: false
  },
];

export const useMessages = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  // Calculate unread counts
  useEffect(() => {
    const counts = messages.reduce((acc, message) => {
      if (!message.read && message.senderId !== "me") {
        acc[message.contactId] = (acc[message.contactId] || 0) + 1;
      }
      return acc;
    }, {});
    
    setUnreadCounts(counts);
  }, [messages]);
  
  // Send a new message
  const sendMessage = (messageData) => {
    const newMessage = {
      id: `m${messages.length + 1}`,
      senderId: "me",
      read: true,
      ...messageData
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate reply after delay for demo purposes
    if (messageData.contactId === "1") {
      setTimeout(() => {
        const reply = {
          id: `m${messages.length + 2}`,
          text: "Estou analisando sua proposta. Acho que podemos expandir essa ideia e conectar com o subcérebro de gestão de conhecimento.",
          senderId: "1",
          contactId: "1",
          timestamp: new Date().toISOString(),
          read: false
        };
        setMessages(prev => [...prev, reply]);
      }, 8000);
    }
  };
  
  // Mark messages as read
  const markAsRead = (contactId) => {
    setMessages(prev => 
      prev.map(message => 
        message.contactId === contactId && !message.read
          ? { ...message, read: true }
          : message
      )
    );
  };
  
  return {
    messages,
    unreadCounts,
    sendMessage,
    markAsRead
  };
};
