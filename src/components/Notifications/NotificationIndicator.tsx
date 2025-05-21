
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationIndicator = () => {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate("/notificacoes")}
      aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationIndicator;
