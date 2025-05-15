
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, MessageSquare, Users, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type ConnectionsSidebarProps = {
  onClose: () => void;
};

type Contact = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage?: string;
  unreadCount?: number;
  connectionStatus?: "connected" | "pending" | "suggested";
  commonTraits?: string;
};

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Ana Silva",
    avatar: "/placeholder.svg",
    status: "online",
    lastMessage: "Vamos conectar nossos subcérebros de filosofia?",
    unreadCount: 2,
    connectionStatus: "connected"
  },
  {
    id: "2",
    name: "Carlos Mendes",
    avatar: "/placeholder.svg",
    status: "offline",
    lastMessage: "Obrigado pela dica de leitura!",
    connectionStatus: "connected"
  },
  {
    id: "3",
    name: "Fernanda Lima",
    avatar: "/placeholder.svg",
    status: "online",
    connectionStatus: "pending"
  },
  {
    id: "4",
    name: "Ricardo Gomes",
    avatar: "/placeholder.svg",
    status: "offline",
    connectionStatus: "pending"
  },
  {
    id: "5",
    name: "Patrícia Luz",
    avatar: "/placeholder.svg",
    status: "online",
    connectionStatus: "suggested",
    commonTraits: "5 hábitos em comum"
  },
  {
    id: "6",
    name: "Rafael Costa",
    avatar: "/placeholder.svg",
    status: "online",
    connectionStatus: "suggested",
    commonTraits: "3 projetos similares"
  },
  {
    id: "7",
    name: "Daniela Mota",
    avatar: "/placeholder.svg",
    status: "offline",
    connectionStatus: "suggested",
    commonTraits: "Interesses em comum: filosofia, ciência"
  }
];

export default function ConnectionsSidebar({ onClose }: ConnectionsSidebarProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("messages");
  const [contacts, setContacts] = useState(mockContacts);

  const handleConnect = (contactId: string) => {
    setContacts(prev => 
      prev.map(contact => {
        if (contact.id === contactId && contact.connectionStatus === "suggested") {
          return {...contact, connectionStatus: "pending"};
        }
        return contact;
      })
    );
    
    toast({
      title: "Solicitação enviada",
      description: "Solicitação de conexão enviada com sucesso!",
    });
  };

  const handleMessage = (contactId: string) => {
    toast({
      title: "Mensagem",
      description: "Funcionalidade de mensagens em desenvolvimento",
    });
  };

  const handleCreateGroup = () => {
    toast({
      title: "Grupo Mental",
      description: "Funcionalidade de criação de grupo em desenvolvimento",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-80 bg-card/30 backdrop-blur-lg rounded-lg border border-border/50 flex flex-col h-[calc(100vh-15rem)]"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/40">
        <h2 className="font-semibold text-sm">Connecta Social</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs for different connection views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="messages" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="connections" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Conexões
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab Content */}
        <TabsContent value="messages" className="flex-1 flex flex-col p-0 m-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 py-2">
              {contacts
                .filter(contact => contact.connectionStatus === "connected")
                .map(contact => (
                  <Card key={contact.id} className="bg-card/30 hover:bg-card/50 transition-colors cursor-pointer">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span 
                            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
                              contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                            } ring-1 ring-background`}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            {contact.name}
                            {contact.unreadCount && (
                              <span className="bg-[#8B5CF6] text-white text-[10px] rounded-full px-1.5 py-0.5">
                                {contact.unreadCount}
                              </span>
                            )}
                          </div>
                          {contact.lastMessage && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {contact.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleMessage(contact.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
          
          {/* Create group button */}
          <div className="p-4 border-t border-border/40">
            <Button 
              variant="outline" 
              className="w-full text-xs"
              onClick={handleCreateGroup}
            >
              <Plus className="h-4 w-4 mr-2" /> Criar Grupo Mental
            </Button>
          </div>
        </TabsContent>

        {/* Connections Tab Content */}
        <TabsContent value="connections" className="flex-1 flex flex-col p-0 m-0">
          <ScrollArea className="flex-1 px-4">
            {/* Pending Connections */}
            <div className="py-2">
              <h3 className="font-medium text-xs text-muted-foreground mb-2">Solicitações Pendentes</h3>
              <div className="space-y-2">
                {contacts
                  .filter(contact => contact.connectionStatus === "pending")
                  .map(contact => (
                    <Card key={contact.id} className="bg-card/30">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">{contact.name}</div>
                        </div>
                        <div className="text-xs text-[#8B5CF6]">Pendente</div>
                      </CardContent>
                    </Card>
                  ))}

                {contacts.filter(contact => contact.connectionStatus === "pending").length === 0 && (
                  <p className="text-xs text-muted-foreground">Nenhuma solicitação pendente</p>
                )}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="py-4">
              <h3 className="font-medium text-xs text-muted-foreground mb-2">Sugestões para Você</h3>
              <div className="space-y-2">
                {contacts
                  .filter(contact => contact.connectionStatus === "suggested")
                  .map(contact => (
                    <Card key={contact.id} className="bg-card/30">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">{contact.name}</div>
                        </div>
                        {contact.commonTraits && (
                          <div className="text-xs text-muted-foreground mb-2 ml-12">
                            {contact.commonTraits}
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleConnect(contact.id)}
                          >
                            Conectar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
