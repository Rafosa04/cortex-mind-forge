
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ConversationsList = ({ 
  conversations = [], 
  messages = {}, 
  onSelectContact, 
  selectedContactId,
  loading = false 
}) => {
  const getLastMessage = (conversationId) => {
    const conversationMessages = messages[conversationId] || [];
    return conversationMessages[conversationMessages.length - 1];
  };

  const getUnreadCount = (conversationId, currentUserId) => {
    const conversationMessages = messages[conversationId] || [];
    return conversationMessages.filter(
      msg => msg.sender_id !== currentUserId && !msg.read_at
    ).length;
  };

  const formatMessageTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm', { locale: ptBR });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Circle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Nenhuma conversa ainda
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Inicie uma nova conversa para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-1">
        {conversations.map((conversation) => {
          const lastMessage = getLastMessage(conversation.id);
          const unreadCount = getUnreadCount(conversation.id, conversation.participant_1);
          const otherParticipant = conversation.other_participant;

          return (
            <Button
              key={conversation.id}
              variant="ghost"
              className={`w-full justify-start px-3 py-2.5 h-auto mb-1 ${
                selectedContactId === conversation.id ? "bg-primary/10" : ""
              }`}
              onClick={() => onSelectContact({
                id: conversation.id,
                name: otherParticipant?.name || 'Usuário',
                avatar: otherParticipant?.avatar_url,
                status: 'online'
              })}
            >
              <div className="flex w-full items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherParticipant?.avatar_url} />
                    <AvatarFallback>
                      {otherParticipant?.name?.substring(0, 2) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card"></span>
                </div>
                
                <div className="flex-1 truncate text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      {otherParticipant?.name || 'Usuário'}
                    </span>
                    {lastMessage && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatMessageTime(lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && (
                      <Circle className="h-2 w-2 fill-primary text-primary flex-shrink-0" />
                    )}
                    <p className="text-xs text-muted-foreground truncate">
                      {lastMessage 
                        ? lastMessage.content 
                        : "Conversa iniciada"
                      }
                    </p>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="ml-auto text-[10px] h-4 px-1">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
