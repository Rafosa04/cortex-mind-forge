
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { saveAthenaLog } from "@/utils/athenaUtils";
import { processAthenaCommand } from "@/utils/athenaCommandUtils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

// Limite de mensagens para armazenamento local
const MAX_MESSAGES = 10;
const MAX_INTERACTIONS = 10; // Limite de interações por sessão

const AthenaChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [interactionCount, setInteractionCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Carregar histórico de mensagens do localStorage ao iniciar
  useEffect(() => {
    const savedMessages = localStorage.getItem("athenaChatHistory");
    const savedInteractions = localStorage.getItem("athenaInteractionCount");
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Erro ao carregar histórico de mensagens:", e);
        localStorage.removeItem("athenaChatHistory");
      }
    }
    
    if (savedInteractions) {
      setInteractionCount(parseInt(savedInteractions, 10));
    }
  }, []);

  // Salvar mensagens no localStorage quando atualizadas
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("athenaChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Salvar contador de interações no localStorage
  useEffect(() => {
    localStorage.setItem("athenaInteractionCount", interactionCount.toString());
  }, [interactionCount]);

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Verificar se atingiu o limite de interações
    if (interactionCount >= MAX_INTERACTIONS) {
      toast({
        title: "Limite de interações atingido",
        description: "Você atingiu o limite de 10 interações por sessão.",
        variant: "destructive",
      });
      return;
    }

    const currentMessage = message.trim();
    setMessage("");
    
    // Adicionar mensagem do usuário
    const newUserMessage: Message = {
      role: "user",
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);
    
    // Incrementar contador de interações
    setInteractionCount(prev => prev + 1);

    try {
      // Processar comandos se o usuário estiver autenticado
      let commandResult = null;
      let contextType = "geral";
      let contextId = null;
      
      if (user) {
        commandResult = await processAthenaCommand(user.id, currentMessage);
        if (commandResult) {
          contextType = commandResult.contextType;
          contextId = commandResult.contextId;
        }
      }

      const apiKey = "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";
      
      // Preparar histórico de mensagens para a API
      const apiMessages = [
        {
          role: "system",
          content: "Você é Athena, uma inteligência artificial integrada ao sistema CÓRTEX. Ajude o usuário com insights sobre produtividade, organização pessoal e projetos."
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: currentMessage }
      ];
      
      // Se um comando foi processado com sucesso, adicione contexto adicional para a IA
      if (commandResult?.result.success) {
        apiMessages.push({
          role: "system",
          content: `[SISTEMA: ${commandResult.result.message} Mencione isso na sua resposta.]`
        });
      }
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: apiMessages
        })
      });
      
      if (!response.ok) {
        throw new Error(`API retornou ${response.status}`);
      }
      
      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";
      
      // Adicionar resposta da Athena
      const newAssistantMessage: Message = {
        role: "assistant",
        content: assistantMessage,
        timestamp: new Date().toISOString(),
      };
      
      // Se um comando foi processado com erro, adicione mensagem de sistema
      if (commandResult && !commandResult.result.success) {
        const systemMessage: Message = {
          role: "system",
          content: `⚠️ ${commandResult.result.message}`,
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, systemMessage]);
      }
      
      // Manter apenas as últimas MAX_MESSAGES mensagens
      setMessages((prev) => {
        const allMessages = [...prev, newAssistantMessage];
        return allMessages.slice(Math.max(0, allMessages.length - MAX_MESSAGES));
      });
      
      // Salvar log no Supabase se o usuário estiver autenticado
      if (user) {
        saveAthenaLog(
          currentMessage, 
          assistantMessage, 
          contextType, 
          contextId
        ).catch(err => console.error("Erro ao salvar log de conversa:", err));
      }
      
    } catch (error) {
      console.error("Erro ao chamar a API da OpenAI:", error);
      
      // Adicionar mensagem de erro
      const errorMessage: Message = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Erro de comunicação",
        description: "Não foi possível conectar com Athena. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    setInteractionCount(0);
    localStorage.removeItem("athenaChatHistory");
    localStorage.removeItem("athenaInteractionCount");
    toast({
      title: "Histórico limpo",
      description: "O histórico de conversas foi apagado.",
    });
  };

  return (
    <>
      {/* Botão flutuante para abrir/fechar o chat */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed bottom-4 right-4 z-50 flex items-center justify-center h-12 w-12 rounded-full shadow-lg ${
          isOpen ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>

      {/* Caixa de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[320px] sm:w-[350px] md:w-[380px] max-w-[95vw] max-h-[600px] shadow-xl border border-border rounded-lg overflow-hidden glass-morphism"
          >
            {/* Cabeçalho */}
            <div className="p-3 pb-2 flex items-center justify-between bg-card/90 backdrop-blur-sm border-b border-border">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback className="text-sm font-semibold text-primary-foreground">🧠</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">Athena IA</h3>
                  <p className="text-xs text-foreground/70">Seu assistente pessoal</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full hover:bg-destructive/20"
                onClick={clearHistory}
                title="Limpar histórico"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            {/* Área de mensagens */}
            <ScrollArea 
              ref={scrollAreaRef} 
              className="flex-1 h-[350px] md:h-[400px] overflow-y-auto p-3 scrollbar-thin bg-background/95"
            >
              {/* Mensagem inicial */}
              {messages.length === 0 && (
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
              )}

              {/* Histórico de mensagens */}
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

              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="max-w-[85%] p-3 rounded-lg bg-card/50 border border-border/50">
                    <p className="text-sm text-foreground/70 animate-pulse">
                      Athena está digitando...
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Rodapé - área de input */}
            <div className="p-3 pt-2 border-t border-border bg-card/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Pergunte algo à Athena…"
                  className="min-h-[40px] max-h-[120px] bg-background/70"
                  style={{ resize: "none" }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!message.trim() || isTyping}
                  className="h-10 px-3"
                >
                  <Send size={18} />
                </Button>
              </div>

              {/* Contador de interações */}
              <div className="mt-1 text-xs text-foreground/50 flex justify-between">
                <span>Interações: {interactionCount}/{MAX_INTERACTIONS}</span>
                {message.length > 0 && (
                  <span>{message.length} caracteres</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AthenaChatBox;
