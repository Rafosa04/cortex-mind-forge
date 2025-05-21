
import React from "react";
import { Check, Archive, ExternalLink, Bell, MessageSquare, Activity, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: string | null;
  isRead: boolean;
  createdAt: string | null;
  actionText?: string;
  actionUrl?: string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  type,
  isRead,
  createdAt,
  actionText,
  actionUrl,
  onMarkAsRead,
  onDelete,
}) => {
  const navigate = useNavigate();
  
  const getTypeIcon = () => {
    switch (type) {
      case "sugestao":
        return <Bell className="h-4 w-4" />;
      case "lembrete":
        return <Clock className="h-4 w-4" />;
      case "conquista":
        return <Activity className="h-4 w-4" />;
      case "projeto_parado":
      case "prazo_proximo":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case "sugestao":
        return "bg-purple-500/20 text-purple-300";
      case "lembrete":
        return "bg-amber-500/20 text-amber-300";
      case "conquista":
        return "bg-green-500/20 text-green-300";
      case "projeto_parado":
      case "prazo_proximo":
        return "bg-blue-500/20 text-blue-300";
      case "erro":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-primary/20 text-primary";
    }
  };
  
  const getFormattedDate = () => {
    if (!createdAt) return "";
    
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `há ${diffMins}min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `há ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `há ${diffDays}d`;
    
    return date.toLocaleDateString("pt-BR");
  };
  
  const handleAction = () => {
    if (actionUrl && !isRead) {
      onMarkAsRead(id);
    }
    
    if (actionUrl) {
      navigate(actionUrl);
    }
  };
  
  return (
    <Card className={cn(
      "border p-4 relative shadow-sm transition-all duration-200",
      !isRead 
        ? "border-primary/40 bg-card/80" 
        : "border-border bg-card/30"
    )}>
      {/* Notification badge & indicator */}
      <div className="flex items-center justify-between mb-2">
        <Badge className={cn(
          "px-2 py-0.5 text-xs font-medium flex items-center gap-1",
          getTypeColor()
        )}>
          {getTypeIcon()}
          <span>{type || "Notificação"}</span>
        </Badge>
        {!isRead && (
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        )}
      </div>
      
      {/* Content */}
      <CardContent className="p-0 pt-1">
        <h4 className={cn(
          "text-sm font-medium mb-1",
          !isRead ? "text-foreground" : "text-muted-foreground"
        )}>
          {title}
        </h4>
        
        <p className={cn(
          "text-sm", 
          !isRead ? "text-foreground/80" : "text-muted-foreground"
        )}>
          {message}
        </p>
        
        <div className="text-xs text-muted-foreground mt-1">
          {getFormattedDate()}
        </div>
      </CardContent>
      
      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/60">
        <div className="flex space-x-2">
          {!isRead && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => onMarkAsRead(id)}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>Marcar como lida</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onDelete(id)}
          >
            <Archive className="h-3.5 w-3.5 mr-1" />
            <span>Arquivar</span>
          </Button>
        </div>
        
        {actionText && actionUrl && (
          <Button 
            variant="default" 
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={handleAction}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            <span>{actionText}</span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default NotificationCard;
