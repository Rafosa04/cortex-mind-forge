
import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Star, Plus, Target, Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

// Message animations
const messageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const MessageItem = ({ message, onCreateFromMessage }) => {
  const [showOptions, setShowOptions] = useState(false);
  const isOwn = message.senderId === "me";
  
  // Format timestamp
  const formattedTime = format(new Date(message.timestamp), 'HH:mm');
  const formattedDate = format(new Date(message.timestamp), 'dd MMM', { locale: ptBR });
  
  // Determine if message has potential for transformation
  const hasAthenaInsight = message.text.length > 30 || 
                            message.text.includes("gostaria") || 
                            message.text.includes("quero") ||
                            message.text.includes("ideia") ||
                            message.text.includes("projeto");

  // Special message type indicators
  const getMessageIcon = (text) => {
    if (text.includes("ideia") || text.includes("pensei"))
      return <Lightbulb className="h-3.5 w-3.5 text-primary" />;
    if (text.includes("meta") || text.includes("objetivo") || text.includes("quero"))
      return <Target className="h-3.5 w-3.5 text-secondary" />;
    if (text.includes("refletir") || text.includes("pensando"))
      return <Brain className="h-3.5 w-3.5 text-[#a39dff]" />;
    return null;
  };
  
  const messageIcon = getMessageIcon(message.text);

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse' : ''} group`}
      onMouseEnter={() => hasAthenaInsight && setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div
        className={`relative max-w-[80%] rounded-2xl ${
          isOwn
            ? 'bg-primary/10 text-accent rounded-tr-none border border-primary/20'
            : 'bg-card text-accent rounded-tl-none border border-border'
        } px-4 py-2.5 shadow-sm`}
      >
        {/* Message content */}
        <div className="flex items-start gap-1.5">
          {!isOwn && messageIcon && (
            <div className="mt-0.5">{messageIcon}</div>
          )}
          <p className="text-sm">{message.text}</p>
          {isOwn && messageIcon && (
            <div className="mt-0.5">{messageIcon}</div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className="mt-1.5 text-[10px] text-muted-foreground flex items-center gap-2">
          <span>{formattedTime}</span>
          <span className="opacity-70">•</span>
          <span>{formattedDate}</span>
        </div>
        
        {/* Athena suggestion button */}
        {hasAthenaInsight && showOptions && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className={`absolute h-6 w-6 rounded-full bg-secondary/20 hover:bg-secondary/30 ${
                  isOwn ? 'left-0 -translate-x-3' : 'right-0 translate-x-3'
                } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <Plus className="h-3.5 w-3.5 text-secondary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-52 p-1.5" 
              side={isOwn ? "left" : "right"}
              align="center"
            >
              <div className="text-xs text-secondary font-medium mb-2 px-2">
                Transformar em:
              </div>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-xs h-8"
                  onClick={() => onCreateFromMessage(message.id, 'projeto')}
                >
                  <Target className="h-3.5 w-3.5 mr-2" />
                  Novo Projeto
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-xs h-8"
                  onClick={() => onCreateFromMessage(message.id, 'hábito')}
                >
                  <Star className="h-3.5 w-3.5 mr-2" />
                  Novo Hábito
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-xs h-8"
                  onClick={() => onCreateFromMessage(message.id, 'célula')}
                >
                  <Brain className="h-3.5 w-3.5 mr-2" />
                  Salvar como Célula
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </motion.div>
  );
};
