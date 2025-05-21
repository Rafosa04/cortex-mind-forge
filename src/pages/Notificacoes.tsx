
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Archive, Check, BellOff, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationCard from "@/components/Notifications/NotificationCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Notificacoes() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  // Get distinct notification types
  const notificationTypes = notifications
    .map(notification => notification.type)
    .filter((type, index, self) => type && self.indexOf(type) === index);
  
  // Filter notifications based on selected category
  const filteredNotifications = selectedCategory
    ? notifications.filter(notification => notification.type === selectedCategory)
    : notifications;
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.is_read).length;
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header section */}
      <motion.div
        className="mb-8 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <motion.h2
          className="text-2xl font-bold text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Notificações do CÓRTEX
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Aqui sua mente conversa com você.
        </motion.p>
        
        {/* Actions */}
        <motion.div
          className="absolute top-0 right-0 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-xs"
            >
              <Check className="h-4 w-4" />
              <span>Marcar todas como lidas</span>
            </Button>
          )}
        </motion.div>
      </motion.div>
      
      {/* Filters */}
      {notificationTypes.length > 0 && (
        <motion.div
          className="flex overflow-x-auto pb-2 mb-6 gap-2 scrollbar-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            key="all"
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="shrink-0"
          >
            Todos
          </Button>
          
          {notificationTypes.map((type) => (
            <Button
              key={type}
              variant={selectedCategory === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(type)}
              className="shrink-0"
            >
              {type?.charAt(0).toUpperCase() + type?.slice(1)}
            </Button>
          ))}
        </motion.div>
      )}
      
      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-[140px] w-full rounded-lg" />
            </motion.div>
          ))
        ) : filteredNotifications.length > 0 ? (
          // Notifications list
          filteredNotifications.map((notification, idx) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <NotificationCard 
                id={notification.id}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                isRead={notification.is_read}
                createdAt={notification.created_at}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            </motion.div>
          ))
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-10 text-center border border-dashed rounded-lg"
          >
            <BellOff className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-1">Sua mente está tranquila</h3>
            <p className="text-sm text-muted-foreground/70">Por enquanto.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
