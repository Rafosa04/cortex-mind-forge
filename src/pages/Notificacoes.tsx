
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Archive, CheckCircle, Eye, Settings, BellOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

// Mock notification data (would come from Supabase in production)
const mockNotifications = [
  { 
    id: "1", 
    tipo: "IA", 
    conteudo: "Detectei que seu foco tem diminuído nos últimos dias. Gostaria de criar um hábito de meditação?", 
    timestamp: "há 30min", 
    lida: false, 
    arquivada: false, 
    by_athena: true,
    icone: "brain",
    acao: { texto: "Criar hábito", url: "/habitos" },
    detalhes: "Análise do seu padrão de uso mostra diminuição na profundidade de trabalho. Uma prática de meditação pode reforçar o foco cognitivo."
  },
  { 
    id: "2", 
    tipo: "Projeto", 
    conteudo: "Seu projeto 'Redesign Website' tem um prazo que vence em 48 horas.", 
    timestamp: "há 2h", 
    lida: false, 
    arquivada: false,
    by_athena: false,
    icone: "clipboard",
    acao: { texto: "Ver projeto", url: "/projetos" },
    detalhes: "Este projeto está com 65% de conclusão. Tente dedicar mais 2 horas hoje para avançar nas tarefas críticas."
  },
  { 
    id: "3", 
    tipo: "Hábito", 
    conteudo: "Seu hábito de leitura está com 5 dias de sequência! Continue assim.", 
    timestamp: "há 5h", 
    lida: true, 
    arquivada: false,
    by_athena: false,
    icone: "repeat",
    acao: { texto: "Registrar leitura", url: "/habitos" },
    detalhes: "Seu hábito de leitura está se fortalecendo! Notei que você tem preferido ler no período noturno, entre 21h e 22h30."
  },
  { 
    id: "4", 
    tipo: "Sistema", 
    conteudo: "Atualização do CÓRTEX instalada com sucesso. Veja as novidades!", 
    timestamp: "há 1d", 
    lida: true, 
    arquivada: false,
    by_athena: false,
    icone: "settings",
    acao: { texto: "Ver novidades", url: "/" },
    detalhes: "Nova versão 1.2.4 inclui melhorias no sistema de projetos, novas análises de hábitos e maior precisão no feedback da IA."
  },
  { 
    id: "5", 
    tipo: "Connecta", 
    conteudo: "Lucas comentou em seu insight sobre produtividade.", 
    timestamp: "há 2d", 
    lida: false, 
    arquivada: false,
    by_athena: false,
    icone: "link",
    acao: { texto: "Ver comentário", url: "/connecta" },
    detalhes: "Lucas disse: 'Realmente interessante sua abordagem sobre ciclos de foco. Estou testando o método e percebo melhorias!'"
  },
  { 
    id: "6", 
    tipo: "IA", 
    conteudo: "Baseado no seu padrão de sono recente, você pode estar dormindo menos que o ideal.", 
    timestamp: "há 3d", 
    lida: true, 
    arquivada: true,
    by_athena: true,
    icone: "brain",
    acao: { texto: "Dicas de sono", url: "/" },
    detalhes: "Análise dos seus registros de produtividade e diário indicam padrão de sono irregular. Recomendo criar um ritual noturno e monitorar por 7 dias."
  }
];

export default function Notificacoes() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const form = useForm({
    defaultValues: {
      frequency: "immediate",
      channels: {
        app: true,
        email: false
      },
      types: {
        ia: true,
        projetos: true,
        habitos: true,
        sistema: true,
        connecta: true
      },
      silentMode: false,
      tone: "empathetic"
    }
  });

  // Filter notifications based on selected category and archived status
  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === "Todos" || notification.tipo === selectedCategory;
    return matchesCategory && !notification.arquivada;
  });

  // Handle marking notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, lida: true } : notification
      )
    );
  };

  // Handle archiving notification
  const archiveNotification = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, arquivada: true } : notification
      )
    );
  };

  // Get color class based on notification type
  const getTypeColorClass = (tipo) => {
    switch (tipo) {
      case "IA": return "bg-purple-500/20 text-purple-300";
      case "Projeto": return "bg-green-500/20 text-green-300";
      case "Hábito": return "bg-blue-500/20 text-blue-300";
      case "Sistema": return "bg-gray-500/20 text-gray-300";
      case "Connecta": return "bg-amber-500/20 text-amber-300";
      default: return "bg-primary/20 text-primary";
    }
  };

  // Handle notification settings submission
  const onSettingsSubmit = (data) => {
    console.log("Notification settings updated:", data);
    // Here you would update user preferences in your database
  };

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
        
        {/* Quote */}
        <motion.div
          className="mt-4 text-sm italic text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          "Quando o CÓRTEX fala, sua mente responde."
        </motion.div>
        
        {/* Settings button */}
        <motion.div
          className="absolute top-0 right-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Configurar</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Configurações de Notificações</SheetTitle>
                <SheetDescription>
                  Personalize como seu CÓRTEX se comunica com você
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSettingsSubmit)} className="space-y-6">
                    {/* Frequency settings */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Frequência</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          type="button" 
                          variant={form.watch("frequency") === "immediate" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => form.setValue("frequency", "immediate")}
                        >
                          Imediato
                        </Button>
                        <Button 
                          type="button" 
                          variant={form.watch("frequency") === "daily" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => form.setValue("frequency", "daily")}
                        >
                          Diário
                        </Button>
                        <Button 
                          type="button" 
                          variant={form.watch("frequency") === "weekly" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => form.setValue("frequency", "weekly")}
                        >
                          Semanal
                        </Button>
                      </div>
                    </div>
                    
                    {/* Notification types */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Tipos de Notificação</h3>
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="types.ia"
                          render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                              <div className="space-y-0">
                                <FormLabel>IA Cognitiva</FormLabel>
                                <FormDescription className="text-xs">Insights da Athena</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="types.projetos"
                          render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                              <div className="space-y-0">
                                <FormLabel>Projetos</FormLabel>
                                <FormDescription className="text-xs">Prazos e atualizações</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="types.habitos"
                          render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                              <div className="space-y-0">
                                <FormLabel>Hábitos</FormLabel>
                                <FormDescription className="text-xs">Lembretes e conquistas</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="types.sistema"
                          render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                              <div className="space-y-0">
                                <FormLabel>Sistema</FormLabel>
                                <FormDescription className="text-xs">Atualizações e manutenção</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="types.connecta"
                          render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                              <div className="space-y-0">
                                <FormLabel>Connecta</FormLabel>
                                <FormDescription className="text-xs">Interações sociais</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {/* Silent mode */}
                    <FormField
                      control={form.control}
                      name="silentMode"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <div className="space-y-0">
                            <FormLabel>Modo Silêncio</FormLabel>
                            <FormDescription className="text-xs">Desativa todas as notificações</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Tone preference */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Preferência de Tom</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          type="button" 
                          variant={form.watch("tone") === "empathetic" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => form.setValue("tone", "empathetic")}
                        >
                          Com empatia
                        </Button>
                        <Button 
                          type="button" 
                          variant={form.watch("tone") === "direct" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => form.setValue("tone", "direct")}
                        >
                          Direto
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Salvar Configurações</Button>
                  </form>
                </Form>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </motion.div>
      
      {/* Filters */}
      <motion.div
        className="flex overflow-x-auto pb-2 mb-6 gap-2 scrollbar-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {["Todos", "IA", "Projeto", "Hábito", "Sistema", "Connecta"].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="shrink-0"
          >
            {category}
          </Button>
        ))}
      </motion.div>
      
      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, idx) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={cn(
                "rounded-lg border p-4 relative shadow-sm",
                !notification.lida ? "border-primary/40 bg-card/80" : "border-border bg-card/30"
              )}
            >
              {/* Notification badge & indicator */}
              <div className="flex items-center justify-between mb-2">
                <Badge className={cn(
                  "px-2 py-0.5 text-xs font-medium",
                  getTypeColorClass(notification.tipo)
                )}>
                  {notification.tipo}
                </Badge>
                {!notification.lida && (
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                )}
              </div>
              
              {/* Content */}
              <div className="mt-2">
                <p className={cn(
                  "text-sm", 
                  !notification.lida ? "text-foreground" : "text-muted-foreground"
                )}>
                  {notification.conteudo}
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>{notification.timestamp}</span>
                  {notification.by_athena && (
                    <Badge variant="outline" className="ml-2 px-1.5 py-0 text-[10px] border-purple-500/30 text-purple-400">
                      Athena IA
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/60">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    <span>{notification.lida ? "Lida" : "Marcar como lida"}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => archiveNotification(notification.id)}
                  >
                    <Archive className="h-3.5 w-3.5 mr-1" />
                    <span>Arquivar</span>
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  {/* Mobile Drawer for Details */}
                  <div className="md:hidden">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => setSelectedNotification(notification)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>Detalhes</span>
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader className="text-left">
                          <DrawerTitle>Detalhes da Notificação</DrawerTitle>
                          <DrawerDescription>
                            {notification.tipo} • {notification.timestamp}
                          </DrawerDescription>
                        </DrawerHeader>
                        
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Mensagem:</p>
                            <p className="text-sm">{notification.conteudo}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Detalhes:</p>
                            <p className="text-sm">{notification.detalhes}</p>
                          </div>
                          
                          {notification.by_athena && (
                            <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="px-1.5 py-0 text-[10px] border-purple-500/30 text-purple-400">
                                  Insight Athena
                                </Badge>
                              </div>
                              <p className="text-sm text-purple-200">Este padrão foi detectado pela IA com base no seu histórico de atividades.</p>
                            </div>
                          )}
                        </div>
                        
                        <DrawerFooter className="flex flex-row justify-end gap-2">
                          <DrawerClose asChild>
                            <Button variant="outline">Fechar</Button>
                          </DrawerClose>
                          {notification.acao && (
                            <Button as="a" href={notification.acao.url}>{notification.acao.texto}</Button>
                          )}
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>
                  
                  {/* Desktop Dialog for Details */}
                  <div className="hidden md:block">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => setSelectedNotification(notification)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>Detalhes</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalhes da Notificação</DialogTitle>
                          <DialogDescription>
                            {notification.tipo} • {notification.timestamp}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Mensagem:</p>
                            <p className="text-sm">{notification.conteudo}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Detalhes:</p>
                            <p className="text-sm">{notification.detalhes}</p>
                          </div>
                          
                          {notification.by_athena && (
                            <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="px-1.5 py-0 text-[10px] border-purple-500/30 text-purple-400">
                                  Insight Athena
                                </Badge>
                              </div>
                              <p className="text-sm text-purple-200">Este padrão foi detectado pela IA com base no seu histórico de atividades.</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          <DialogClose asChild>
                            <Button variant="outline">Fechar</Button>
                          </DialogClose>
                          {notification.acao && (
                            <Button as="a" href={notification.acao.url}>{notification.acao.texto}</Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {notification.acao && (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="h-8 px-2 text-xs"
                      as="a"
                      href={notification.acao.url}
                    >
                      {notification.acao.texto}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
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
