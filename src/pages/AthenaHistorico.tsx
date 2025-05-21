
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAthenaHistory } from "@/utils/athenaUtils";
import { saveAthenaLog } from "@/utils/athenaUtils";

// Refactored components
import AthenaHistoryCard from "@/components/Athena/AthenaHistoryCard";
import AthenaFilterBar from "@/components/Athena/AthenaFilterBar";
import AthenaEmptyState from "@/components/Athena/AthenaEmptyState";

interface AthenaLog {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  context_type: string;
  context_id: string | null;
  created_at: string;
  is_favorite: boolean;
}

export default function AthenaHistorico() {
  const [logs, setLogs] = useState<AthenaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const { fetchHistory, toggleFavorite } = useAthenaHistory();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
  };

  const loadHistory = async () => {
    setLoading(true);
    const { data, error } = await fetchHistory();
    setLoading(false);
    
    if (error) {
      console.error("Erro ao carregar histórico:", error);
      return;
    }
    
    if (data) {
      setLogs(data);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const reprocessPrompt = async (prompt: string) => {
    if (!user) {
      toast({
        title: "Não autorizado",
        description: "Você precisa estar logado para fazer isso.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processando",
      description: "Enviando sua pergunta para Athena...",
    });

    try {
      const apiKey = "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";
      
      const apiMessages = [
        {
          role: "system",
          content: "Você é Athena, uma inteligência artificial integrada ao sistema CÓRTEX. Ajude o usuário com insights sobre produtividade, organização pessoal e projetos."
        },
        { role: "user", content: prompt }
      ];
      
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
      
      // Salvar no Supabase
      await saveAthenaLog(prompt, assistantMessage, "reanálise");
      
      // Mostrar toast de sucesso
      toast({
        title: "Reanálise concluída",
        description: "Sua pergunta foi reanalisada com sucesso.",
      });
      
      // Recarregar histórico
      loadHistory();
      
    } catch (error) {
      console.error("Erro ao reprocessar prompt:", error);
      toast({
        title: "Erro ao reprocessar",
        description: "Não foi possível conectar com Athena. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async (log: AthenaLog) => {
    const result = await toggleFavorite(log.id, log.is_favorite);
    if (!result.error) {
      // Update local state to reflect the change
      setLogs(currentLogs => 
        currentLogs.map(l => 
          l.id === log.id ? { ...l, is_favorite: !l.is_favorite } : l
        )
      );
      
      toast({
        title: log.is_favorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: log.is_favorite 
          ? "Conversa removida dos seus favoritos."
          : "Conversa adicionada aos seus favoritos.",
      });
    }
  };

  const viewContextConversations = (contextType: string, contextId: string | null) => {
    if (!contextId) return;
    navigate(`/athena/contexto/${contextId}?tipo=${contextType}`);
  };

  const filteredLogs = logs.filter(log => 
    log.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Histórico de Interações</h1>
        <p className="text-muted-foreground">
          Seu histórico pessoal de conversas com a Athena IA.
        </p>
      </div>

      <AthenaFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loadHistory={loadHistory}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-8 w-28" />
            </div>
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <AthenaEmptyState hasSearchTerm={searchTerm.length > 0} />
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <AthenaHistoryCard
              key={log.id}
              log={log}
              expandedLogs={expandedLogs}
              toggleExpanded={toggleExpanded}
              handleToggleFavorite={handleToggleFavorite}
              reprocessPrompt={reprocessPrompt}
              viewContextConversations={viewContextConversations}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
