
/**
 * ConnectionsSidebar - Sidebar para mensagens e conexões
 * 
 * @component
 * @example
 * <ConnectionsSidebar 
 *   conversations={conversations}
 *   connections={connections}
 *   onMessageSelect={(conversationId) => openChat(conversationId)}
 *   onAccept={(connectionId) => acceptConnection(connectionId)}
 *   onReject={(connectionId) => rejectConnection(connectionId)}
 * />
 */

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, Check, X, Circle } from "lucide-react";
import { ConnectionType, ConversationType } from "@/types/connecta";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConnectionsSidebarProps {
  conversations: ConversationType[];
  connections: ConnectionType[];
  onMessageSelect: (conversationId: string) => void;
  onAccept: (connectionId: string) => void;
  onReject: (connectionId: string) => void;
}

export default function ConnectionsSidebar({ 
  conversations, 
  connections, 
  onMessageSelect, 
  onAccept, 
  onReject 
}: ConnectionsSidebarProps) {
  const [activeTab, setActiveTab] = useState("messages");

  // Filtrar conexões por status
  const pendingConnections = connections.filter(c => c.status === 'pending');
  const suggestedConnections = connections.filter(c => c.status === 'suggested');

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 m-4 bg-gray-900">
            <TabsTrigger 
              value="messages" 
              className="text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger 
              value="connections"
              className="text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Conexões
            </TabsTrigger>
          </TabsList>

          {/* Tab de Mensagens */}
          <TabsContent value="messages" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2 pb-4">
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="bg-gray-900 hover:bg-gray-700 transition-colors cursor-pointer border-gray-600"
                      onClick={() => onMessageSelect(conversation.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border border-gray-600">
                              <AvatarImage src={conversation.participant.avatar} />
                              <AvatarFallback className="bg-gray-700 text-white">
                                {conversation.participant.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.isOnline && (
                              <Circle className="absolute -bottom-1 -right-1 h-4 w-4 fill-green-500 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="font-medium text-white text-sm truncate">
                                {conversation.participant.name}
                              </div>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                              {conversation.lastMessage}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(new Date(conversation.timestamp), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {conversations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhuma conversa ainda</p>
                    <p className="text-xs mt-1">Conecte-se com outros usuários!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Tab de Conexões */}
          <TabsContent value="connections" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {/* Solicitações Pendentes */}
                {pendingConnections.length > 0 && (
                  <div>
                    <h3 className="font-medium text-white text-sm mb-3">
                      Solicitações Pendentes
                    </h3>
                    <div className="space-y-2">
                      {pendingConnections.map((connection) => (
                        <motion.div
                          key={connection.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <Card className="bg-gray-900 border-gray-600">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border border-gray-600">
                                    <AvatarImage src={connection.avatar} />
                                    <AvatarFallback className="bg-gray-700 text-white">
                                      {connection.name.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-white text-sm">
                                      {connection.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      @{connection.username}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => onAccept(connection.id)}
                                    className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => onReject(connection.id)}
                                    className="bg-red-600 hover:bg-red-700 h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sugestões de Conexão */}
                {suggestedConnections.length > 0 && (
                  <div>
                    <h3 className="font-medium text-white text-sm mb-3">
                      Sugestões para Você
                    </h3>
                    <div className="space-y-2">
                      {suggestedConnections.map((connection) => (
                        <motion.div
                          key={connection.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <Card className="bg-gray-900 border-gray-600">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3 mb-2">
                                <Avatar className="h-10 w-10 border border-gray-600">
                                  <AvatarImage src={connection.avatar} />
                                  <AvatarFallback className="bg-gray-700 text-white">
                                    {connection.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium text-white text-sm">
                                    {connection.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    @{connection.username}
                                  </div>
                                  {connection.mutualConnections && (
                                    <div className="text-xs text-indigo-400">
                                      {connection.mutualConnections} conexões em comum
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAccept(connection.id)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white"
                              >
                                Conectar
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingConnections.length === 0 && suggestedConnections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhuma conexão disponível</p>
                    <p className="text-xs mt-1">Explore a plataforma para encontrar pessoas!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}
