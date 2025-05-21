
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Reply, Search, Calendar, ChevronDown, ChevronUp, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAthenaHistory } from "@/utils/athenaUtils";
import { saveAthenaLog } from "@/utils/athenaUtils";

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

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Pesquisar no histórico..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={loadHistory}
          className="flex items-center gap-2"
        >
          <Reply size={16} />
          <span>Atualizar</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="py-10 flex flex-col items-center">
            <span className="text-6xl mb-4">🤔</span>
            <h3 className="text-xl font-semibold mb-2">Nenhuma conversa encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 
                "Não encontramos nenhuma conversa que corresponda à sua pesquisa." : 
                "Você ainda não conversou com a Athena. Experimente fazer uma pergunta!"}
            </p>
            <Button onClick={() => navigate("/")}>Ir para o Dashboard</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="mb-4 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar size={14} />
                      {format(new Date(log.created_at), "PPpp", { locale: ptBR })}
                      {log.context_type !== "geral" && (
                        <span 
                          className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs cursor-pointer hover:bg-primary/20"
                          onClick={() => log.context_id && viewContextConversations(log.context_type, log.context_id)}
                        >
                          {log.context_type}
                        </span>
                      )}
                    </CardDescription>
                    <CardTitle className="text-lg mt-1">{log.prompt}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleToggleFavorite(log)}
                  >
                    {log.is_favorite ? (
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div 
                  className={`relative ${!expandedLogs.has(log.id) && log.response.length > 300 ? "max-h-32 overflow-hidden" : ""}`}
                >
                  <p className="text-sm whitespace-pre-wrap">{log.response}</p>
                  {!expandedLogs.has(log.id) && log.response.length > 300 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>
                {log.response.length > 300 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleExpanded(log.id)}
                    className="mt-2 flex items-center gap-1 text-xs"
                  >
                    {expandedLogs.has(log.id) ? (
                      <>
                        <ChevronUp size={14} /> Ver menos
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> Ver mais
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => reprocessPrompt(log.prompt)}
                  className="flex items-center gap-2"
                >
                  <Reply size={16} />
                  <span>Reanalisar com Athena</span>
                </Button>
                {log.context_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewContextConversations(log.context_type, log.context_id)}
                    className="flex items-center gap-2"
                  >
                    <Search size={16} />
                    <span>Ver contexto</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
