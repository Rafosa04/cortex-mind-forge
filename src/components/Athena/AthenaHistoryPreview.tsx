
import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface AthenaHistoryPreviewProps {
  messages: Message[];
  expandedLogs: Set<string>;
  toggleExpanded: (id: string) => void;
  isTyping: boolean;
}

const AthenaHistoryPreview: React.FC<AthenaHistoryPreviewProps> = ({ 
  messages, 
  isTyping 
}) => {
  if (messages.length === 0) {
    return (
      <Card className="p-4 mb-3 bg-card/50 border-primary/20">
        <p className="text-sm">
          Olá, eu sou a Athena, sua inteligência evolutiva. Em que posso ajudar hoje?
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Experimente comandos como:</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>"Crie um novo projeto chamado Estudos de IA"</li>
            <li>"Quero criar o hábito de ler 30 minutos por dia"</li>
          </ul>
        </div>
      </Card>
    );
  }
  
  return (
    <>
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`mb-3 flex ${
            msg.role === "user" 
              ? "justify-end" 
              : msg.role === "system" 
                ? "justify-center" 
                : "justify-start"
          }`}
        >
          {msg.role === "system" ? (
            <div className="max-w-[90%] py-2 px-3 rounded-md bg-yellow-500/10 border border-yellow-500/25 text-yellow-500">
              <p className="text-xs">{msg.content}</p>
            </div>
          ) : (
            <div 
              className={`max-w-[85%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary/20 text-foreground"
                  : "bg-card/80 border border-border/50"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default AthenaHistoryPreview;
