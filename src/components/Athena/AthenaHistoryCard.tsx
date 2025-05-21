
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ChevronDown, ChevronUp, Reply, Search, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AthenaLog {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  context_type: string;
  context_id: string | null;
  created_at: string;
  is_favorite: boolean;
}

interface AthenaHistoryCardProps {
  log: AthenaLog;
  expandedLogs: Set<string>;
  toggleExpanded: (id: string) => void;
  handleToggleFavorite: (log: AthenaLog) => void;
  reprocessPrompt: (prompt: string) => void;
  viewContextConversations: (contextType: string, contextId: string | null) => void;
}

const AthenaHistoryCard: React.FC<AthenaHistoryCardProps> = ({ 
  log, 
  expandedLogs, 
  toggleExpanded, 
  handleToggleFavorite,
  reprocessPrompt,
  viewContextConversations 
}) => {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              {format(new Date(log.created_at), "PPpp", { locale: ptBR })}
              {log.context_type !== "geral" && (
                <span 
                  className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs cursor-pointer hover:bg-primary/20"
                  onClick={() => log.context_id && viewContextConversations(log.context_type, log.context_id)}
                >
                  {log.context_type}
                </span>
              )}
            </div>
            <CardTitle className="text-lg mt-1">{log.prompt}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleToggleFavorite(log)}
          >
            {log.is_favorite ? (
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ) : (
              <StarOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div 
          className={`relative ${!expandedLogs.has(log.id) && log.response.length > 300 ? "max-h-32 overflow-hidden" : ""}`}
        >
          <p className="text-sm whitespace-pre-wrap">{log.response}</p>
          {!expandedLogs.has(log.id) && log.response.length > 300 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>
        {log.response.length > 300 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleExpanded(log.id)}
            className="mt-2 flex items-center gap-1 text-xs"
          >
            {expandedLogs.has(log.id) ? (
              <>
                <ChevronUp size={14} /> Ver menos
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Ver mais
              </>
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => reprocessPrompt(log.prompt)}
          className="flex items-center gap-2"
        >
          <Reply size={16} />
          <span>Reanalisar com Athena</span>
        </Button>
        {log.context_id && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => viewContextConversations(log.context_type, log.context_id)}
            className="flex items-center gap-2"
          >
            <Search size={16} />
            <span>Ver contexto</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AthenaHistoryCard;
