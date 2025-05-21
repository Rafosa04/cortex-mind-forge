
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveAthenaLog } from "@/utils/athenaUtils";

interface Insight {
  id: string;
  title: string;
  description: string;
  type: "projeto" | "habito" | "produtividade" | "aprendizado";
  actionText?: string;
  actionPath?: string;
}

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Generate insights based on user data
  const generateInsights = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch user projects
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id);
      
      // Fetch user habits
      const { data: habits } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id);
      
      // Fetch Athena interactions
      const { data: athenaLogs } = await supabase
        .from("athena_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      
      const generatedInsights: Insight[] = [];
      
      // Project-based insights
      if (projects && projects.length > 0) {
        // Find projects with low progress
        const lowProgressProjects = projects.filter(p => 
          p.status === "ativo" && (p.progress || 0) < 30
        );
        
        if (lowProgressProjects.length > 0) {
          generatedInsights.push({
            id: "low-progress-projects",
            title: "Projetos com baixa atividade",
            description: `Você tem ${lowProgressProjects.length} projeto(s) com menos de 30% de progresso. Considere revisar e definir próximas etapas.`,
            type: "projeto",
            actionText: "Ver projetos",
            actionPath: "/projetos"
          });
        }
        
        // Find projects approaching deadline
        const now = new Date();
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(now.getDate() + 14);
        
        const approachingDeadlineProjects = projects.filter(p => 
          p.status === "ativo" && 
          p.deadline && 
          new Date(p.deadline) <= twoWeeksFromNow &&
          new Date(p.deadline) >= now
        );
        
        if (approachingDeadlineProjects.length > 0) {
          generatedInsights.push({
            id: "approaching-deadline-projects",
            title: "Prazos se aproximando",
            description: `Você tem ${approachingDeadlineProjects.length} projeto(s) com prazo nos próximos 14 dias. Priorize-os para garantir a conclusão a tempo.`,
            type: "projeto",
            actionText: "Ver prazos",
            actionPath: "/projetos"
          });
        }
      }
      
      // Habit-based insights
      if (habits && habits.length > 0) {
        // Find habits with low progress
        const lowProgressHabits = habits.filter(h => 
          (h.progress || 0) < 30
        );
        
        if (lowProgressHabits.length > 0) {
          generatedInsights.push({
            id: "low-progress-habits",
            title: "Hábitos que precisam de atenção",
            description: `Você tem ${lowProgressHabits.length} hábito(s) com progresso abaixo de 30%. Considere revisar ou ajustar suas metas.`,
            type: "habito",
            actionText: "Ver hábitos",
            actionPath: "/habitos"
          });
        }
        
        // Productivity insight
        generatedInsights.push({
          id: "habit-consistency",
          title: "Consistência é a chave",
          description: "Manter seus hábitos consistentes por pelo menos 66 dias é essencial para torná-los automáticos. Continue acompanhando seu progresso diário.",
          type: "produtividade"
        });
      }
      
      // Learning insights from Athena logs
      if (athenaLogs && athenaLogs.length > 0) {
        // Extract most discussed topics
        const topics = new Map<string, number>();
        
        // Simple keyword extraction
        const keywordList = ["produtividade", "foco", "organização", "tempo", "prioridades", 
                            "metas", "objetivos", "planejamento", "rotina", "estresse",
                            "ansiedade", "motivação", "inspiração", "criatividade", "aprendizado"];
        
        for (const log of athenaLogs) {
          const combinedText = (log.prompt + " " + log.response).toLowerCase();
          
          for (const keyword of keywordList) {
            if (combinedText.includes(keyword)) {
              topics.set(keyword, (topics.get(keyword) || 0) + 1);
            }
          }
        }
        
        // Get top 3 topics
        const topTopics = [...topics.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(entry => entry[0]);
        
        if (topTopics.length > 0) {
          generatedInsights.push({
            id: "learning-topics",
            title: "O que você tem aprendido",
            description: `Nos últimos diálogos com a Athena, você tem explorado temas como ${topTopics.join(', ')}. Continue aprofundando esses conhecimentos para crescimento pessoal.`,
            type: "aprendizado"
          });
        }
      }
      
      // Add general insights if we have few specific ones
      if (generatedInsights.length < 3) {
        generatedInsights.push({
          id: "productivity-systems",
          title: "Sistemas de produtividade",
          description: "Experimente métodos como Pomodoro (25 min trabalho, 5 min descanso) ou Getting Things Done (GTD) para organizar suas tarefas e aumentar seu foco.",
          type: "produtividade"
        });
        
        generatedInsights.push({
          id: "learning-methods",
          title: "Melhore seu aprendizado",
          description: "Técnicas como revisão espaçada e aprendizado ativo podem aumentar significativamente sua retenção de conhecimento. Pergunte à Athena como implementá-las.",
          type: "aprendizado",
          actionText: "Perguntar à Athena",
          actionPath: "/athena"
        });
      }
      
      setInsights(generatedInsights);
      
      // Save that we generated insights
      if (user) {
        await saveAthenaLog(
          "Geração de insights automáticos", 
          `Insights gerados: ${generatedInsights.map(i => i.title).join(', ')}`, 
          "insights"
        );
      }
      
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [user]);

  const filteredInsights = selectedType === "all" 
    ? insights 
    : insights.filter(insight => insight.type === selectedType);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Insights</h1>
        <p className="text-muted-foreground">
          Descubra padrões e insights sobre seus projetos, hábitos e aprendizados.
        </p>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedType} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="projeto">Projetos</TabsTrigger>
          <TabsTrigger value="habito">Hábitos</TabsTrigger>
          <TabsTrigger value="produtividade">Produtividade</TabsTrigger>
          <TabsTrigger value="aprendizado">Aprendizado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {renderInsightContent(filteredInsights, loading)}
        </TabsContent>
        
        <TabsContent value="projeto" className="mt-4">
          {renderInsightContent(filteredInsights, loading)}
        </TabsContent>
        
        <TabsContent value="habito" className="mt-4">
          {renderInsightContent(filteredInsights, loading)}
        </TabsContent>
        
        <TabsContent value="produtividade" className="mt-4">
          {renderInsightContent(filteredInsights, loading)}
        </TabsContent>
        
        <TabsContent value="aprendizado" className="mt-4">
          {renderInsightContent(filteredInsights, loading)}
        </TabsContent>
      </Tabs>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pergunte à Athena</CardTitle>
          <CardDescription>
            Não encontrou o que procurava? A Athena pode gerar insights personalizados para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground">Sugestões de perguntas:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Como posso aumentar minha produtividade nos projetos atuais?</li>
              <li>Quais hábitos posso desenvolver para melhorar meu foco?</li>
              <li>Como balancear melhor projetos pessoais e profissionais?</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/athena')}>
            Conversar com Athena
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function renderInsightContent(insights: Insight[], loading: boolean) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
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
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="py-10 flex flex-col items-center">
          <span className="text-6xl mb-4">🔍</span>
          <h3 className="text-xl font-semibold mb-2">Nenhum insight encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Experimente adicionar mais projetos ou hábitos, ou interagir mais com a Athena.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight) => (
        <Card key={insight.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between mb-1">
              <Badge>{getTypeLabel(insight.type)}</Badge>
            </div>
            <CardTitle className="text-lg">{insight.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm">{insight.description}</p>
          </CardContent>
          {insight.actionText && insight.actionPath && (
            <CardFooter>
              <Button variant="outline" onClick={() => window.location.href = insight.actionPath!}>
                {insight.actionText}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'projeto':
      return 'Projetos';
    case 'habito':
      return 'Hábitos';
    case 'produtividade':
      return 'Produtividade';
    case 'aprendizado':
      return 'Aprendizado';
    default:
      return type;
  }
}
