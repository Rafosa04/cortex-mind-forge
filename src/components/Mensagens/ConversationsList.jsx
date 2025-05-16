
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import { Circle } from "lucide-react";

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Marina Silva",
    avatar: "/placeholder.svg",
    lastMessage: "Aquele projeto sobre meio ambiente poderia virar um hábito de estudo recorrente, você não acha?",
    timestamp: "2025-05-15T14:34:00Z",
    unread: true,
    status: "online"
  },
  {
    id: "2",
    name: "Carlos Eduardo",
    avatar: "/placeholder.svg",
    lastMessage: "Acho que podemos transformar aquela ideia em um novo projeto no Córtex",
    timestamp: "2025-05-14T22:15:00Z",
    unread: false,
    status: "offline"
  },
  {
    id: "3",
    name: "Grupo de Estudos",
    avatar: "/placeholder.svg",
    lastMessage: "Os resumos estão agora disponíveis no subcérebro de Filosofia",
    timestamp: "2025-05-14T15:22:00Z",
    unread: false,
    status: "online"
  },
  {
    id: "4",
    name: "Athena IA",
    avatar: "/placeholder.svg",
    lastMessage: "Detectei 3 novos padrões no seu comportamento que podem virar hábitos positivos",
    timestamp: "2025-05-14T09:45:00Z",
    unread: true,
    status: "typing"
  },
  {
    id: "5",
    name: "Raquel Mendes",
    avatar: "/placeholder.svg",
    lastMessage: "Vamos começar aquele projeto que conversamos? Tenho algumas ideias",
    timestamp: "2025-05-13T18:05:00Z",
    unread: false,
    status: "offline"
  }
];

export const ConversationsList = ({ onSelectContact, selectedContactId }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-1">
        {mockConversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant="ghost"
            className={`w-full justify-start px-3 py-2.5 h-auto mb-1 ${
              selectedContactId === conversation.id ? "bg-primary/10" : ""
            }`}
            onClick={() => onSelectContact(conversation)}
          >
            <div className="flex w-full items-start gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>{conversation.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {conversation.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card"></span>
                )}
              </div>
              
              <div className="flex-1 truncate text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{conversation.name}</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {timeAgo(conversation.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {conversation.unread && (
                    <Circle className="h-2 w-2 fill-primary text-primary flex-shrink-0" />
                  )}
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
