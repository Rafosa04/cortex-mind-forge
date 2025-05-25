
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { saveAthenaLog } from "@/utils/athenaUtils";
import { processAthenaCommand } from "@/utils/athenaCommandUtils";

// Newly refactored components
import AthenaHeader from "./Athena/AthenaHeader";
import AthenaHistoryPreview from "./Athena/AthenaHistoryPreview";
import AthenaTypingIndicator from "./Athena/AthenaTypingIndicator";
import AthenaInputBox from "./Athena/AthenaInputBox";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

// Limite de mensagens para armazenamento local
const MAX_MESSAGES = 10;
const MAX_INTERACTIONS = 10; // Limite de interações por sessão

const AthenaChatBox: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [interactionCount, setInteractionCount] = useState(0);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedLogs(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  }, []);

  // Memoized functions
  const clearHistory = useCallback(() => {
    setMessages([]);
    setInteractionCount(0);
    localStorage.removeItem("athenaChatHistory");
    localStorage.removeItem("athenaInteractionCount");
    toast({
      title: "Histórico limpo",
      description: "O histórico de conversas foi apagado.",
    });
  }, [toast]);

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

  const handleSendMessage = useCallback(async () => {
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
  }, [message, interactionCount, messages, user, toast]);

  // Memoized components
  const memoizedHistoryPreview = useMemo(() => (
    <AthenaHistoryPreview
      messages={messages}
      expandedLogs={expandedLogs}
      toggleExpanded={toggleExpanded}
      isTyping={isTyping}
    />
  ), [messages, expandedLogs, toggleExpanded, isTyping]);

  const memoizedInputBox = useMemo(() => (
    <AthenaInputBox
      message={message}
      setMessage={setMessage}
      handleSendMessage={handleSendMessage}
      isTyping={isTyping}
      interactionCount={interactionCount}
      maxInteractions={MAX_INTERACTIONS}
    />
  ), [message, setMessage, handleSendMessage, isTyping, interactionCount]);

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
            <AthenaHeader clearHistory={clearHistory} />
            
            <ScrollArea 
              ref={scrollAreaRef} 
              className="flex-1 h-[350px] md:h-[400px] overflow-y-auto p-3 scrollbar-thin bg-background/95"
            >
              {memoizedHistoryPreview}
              <AthenaTypingIndicator isTyping={isTyping} />
            </ScrollArea>

            {memoizedInputBox}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

AthenaChatBox.displayName = 'AthenaChatBox';

export default AthenaChatBox;
