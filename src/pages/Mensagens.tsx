
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Send, MessageSquare, Plus, Brain, Smile, Star, Lightbulb, Target, Info, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConversationsList } from "@/components/Mensagens/ConversationsList";
import { MessageItem } from "@/components/Mensagens/MessageItem";
import { useMessages } from "@/hooks/useMessages";
import { AthenaObserver } from "@/components/Mensagens/AthenaObserver";

export default function Mensagens() {
  const { toast } = useToast();
  const [currentContact, setCurrentContact] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, markAsRead } = useMessages();
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle contact selection
  const handleSelectContact = (contact) => {
    setCurrentContact(contact);
    if (contact) {
      markAsRead(contact.id);
    }
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentContact) return;
    
    sendMessage({
      text: inputMessage,
      contactId: currentContact.id,
      timestamp: new Date().toISOString()
    });
    
    setInputMessage("");
  };
  
  // Handle keypress (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Create habit or project from message
  const handleCreateFromMessage = (messageId, type) => {
    toast({
      title: `Criando ${type} a partir da mensagem`,
      description: "Funcionalidade em desenvolvimento"
    });
  };

  return (
    <div className="w-full h-[calc(100vh-9rem)] flex gap-4">
      {/* Left Sidebar - Conversations List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-80 min-w-80 h-full flex flex-col rounded-xl bg-card/90 border border-border shadow overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <h3 className="text-base text-primary font-medium mb-2">Mensagens</h3>
          <div className="text-xs text-accent/70 mb-4">
            "Aqui, até suas conversas pensam com você."
          </div>
          
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar conversa..." 
              className="pl-9 bg-background text-sm"
            />
          </div>
        </div>
        
        {/* Conversations List */}
        <ConversationsList 
          onSelectContact={handleSelectContact} 
          selectedContactId={currentContact?.id}
        />
        
        {/* New Conversation Button */}
        <div className="p-3 mt-auto border-t border-border">
          <Button className="w-full flex gap-2 items-center" size="sm">
            <MessageSquare className="h-4 w-4" />
            <span>Nova Conversa</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Right Side - Chat Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col rounded-xl bg-card/90 border border-border shadow overflow-hidden"
      >
        {currentContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentContact.avatar} />
                  <AvatarFallback>{currentContact.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-accent font-medium">{currentContact.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      {currentContact.status === "typing" ? "digitando..." : "online"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Athena Observer Icon */}
              <AthenaObserver />
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages
                  .filter(m => m.contactId === currentContact.id)
                  .map((message) => (
                    <MessageItem 
                      key={message.id}
                      message={message}
                      onCreateFromMessage={handleCreateFromMessage}
                    />
                  ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Textarea 
                    placeholder="Digite sua mensagem..." 
                    className="min-h-[60px] resize-none pr-10 bg-background"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2">
                        <div className="grid grid-cols-6 gap-1.5">
                          {["😊", "👍", "❤️", "😂", "🔥", "👏", "🎉", "🤔", "😎", "🧠", "💡", "🎯"].map(emoji => (
                            <button 
                              key={emoji}
                              className="hover:bg-accent/10 p-1.5 rounded-md text-lg"
                              onClick={() => setInputMessage(prev => prev + emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button onClick={handleSendMessage} className="h-[60px] px-5">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              {/* AI Suggestions */}
              {inputMessage.length > 10 && (
                <div className="mt-2 flex gap-1.5">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 text-xs py-1"
                    onClick={() => setInputMessage("Podemos marcar um encontro na semana que vem?")}
                  >
                    <Lightbulb className="h-3 w-3 mr-1 text-primary" />
                    Sugerir encontro
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 text-xs py-1"
                    onClick={() => setInputMessage("Gostei muito da sua sugestão, vamos implementar!")}
                  >
                    <Target className="h-3 w-3 mr-1 text-primary" />
                    Concordar
                  </Badge>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Suas Mensagens</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Selecione uma conversa à esquerda ou inicie uma nova para começar a interagir.
            </p>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Nova Conversa
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
