
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, MessageSquare, Calendar, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { fetchContextConversations, useAthenaHistory } from "@/utils/athenaUtils";

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

export default function AthenaContexto() {
  const [logs, setLogs] = useState<AthenaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{id: string}>();
  const [searchParams] = useSearchParams();
  const contextType = searchParams.get('tipo') || '';
  const { toggleFavorite } = useAthenaHistory();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadContextConversations = async () => {
    if (!id || !contextType) return;
    
    setLoading(true);
    const { data, error } = await fetchContextConversations(contextType, id);
    setLoading(false);
    
    if (error) {
      console.error("Erro ao carregar conversas de contexto:", error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Não foi possível carregar as conversas relacionadas.",
        variant: "destructive"
      });
      return;
    }
    
    if (data) {
      setLogs(data);
    }
  };

  useEffect(() => {
    loadContextConversations();
  }, [id, contextType]);

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

  const contextTypeMap: Record<string, string> = {
    'projeto': 'Projeto',
    'hábito': 'Hábito',
    'habito': 'Hábito',
    'geral': 'Geral',
    'reanálise': 'Reanálise',
    'reanalise': 'Reanálise'
  };
  
  const getContextTypeDisplay = () => {
    return contextTypeMap[contextType.toLowerCase()] || contextType;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/athena/historico')}
          >
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Conversas de {getContextTypeDisplay()}</h1>
            <p className="text-muted-foreground">
              {logs.length > 0 ? 
                `${logs.length} interações com Athena relacionadas a este ${contextType.toLowerCase()}` : 
                "Carregando conversas..."}
            </p>
          </div>
        </div>
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
            </Card>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="py-10 flex flex-col items-center">
            <span className="text-6xl mb-4">🤔</span>
            <h3 className="text-xl font-semibold mb-2">Nenhuma conversa encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Não encontramos conversas relacionadas a este contexto.
            </p>
            <Button onClick={() => navigate("/athena/historico")}>
              Voltar para o histórico
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
            <h3 className="font-medium text-lg">Contexto da conversa</h3>
            <p className="text-muted-foreground text-sm">
              Estas são todas as interações relacionadas a este {contextType.toLowerCase()}.
              Veja como evoluiu ao longo do tempo.
            </p>
          </div>
          
          {logs.map((log, index) => (
            <Card key={log.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar size={14} />
                      {format(new Date(log.created_at), "PPpp", { locale: ptBR })}
                      {index === 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-md text-xs">
                          Primeira interação
                        </span>
                      )}
                      {index === logs.length - 1 && index > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-500 rounded-md text-xs">
                          Mais recente
                        </span>
                      )}
                    </CardDescription>
                    <div className="mt-2 mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                        {index + 1}
                      </span>
                      <CardTitle className="text-lg">{log.prompt}</CardTitle>
                    </div>
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
              <CardContent className="pb-4 pl-8 border-l ml-3 border-dashed border-border">
                <div className="flex mb-2 items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <MessageSquare size={12} />
                  </div>
                  <span className="text-sm font-medium text-secondary">Resposta da Athena</span>
                </div>
                <div className="p-4 rounded-lg bg-card/50 border border-border/50">
                  <p className="text-sm whitespace-pre-wrap">{log.response}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center my-8">
            <Button onClick={() => navigate('/athena/historico')}>
              Voltar para o histórico completo
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
