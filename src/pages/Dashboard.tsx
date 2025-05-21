import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Calendar, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Star,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateAthenaInsights } from "@/utils/athenaInsightUtils";
import AthenaDashboardInsight from "@/components/Athena/AthenaDashboardInsight";

interface DashboardStats {
  projectsActive: number;
  projectsCompleted: number;
  habitsActive: number;
  habitsProgress: number;
  athenaInteractions: number;
  favoriteCount: number;
  recentFavorites: any[];
  athenaInsight: string | null;
  athenaActionText?: string;
  athenaActionUrl?: string;
  loading: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projectsActive: 0,
    projectsCompleted: 0,
    habitsActive: 0,
    habitsProgress: 0,
    athenaInteractions: 0,
    favoriteCount: 0,
    recentFavorites: [],
    athenaInsight: null,
    loading: true
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const fetchDashboardStats = async () => {
    if (!user) return;
    
    try {
      // Fetch active projects count
      const { data: activeProjects, error: activeProjectsError } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "ativo");
      
      // Fetch completed projects count
      const { data: completedProjects, error: completedProjectsError } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "concluído");
      
      // Fetch habits 
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id);
      
      // Fetch Athena interactions count
      const { data: athenaLogs, error: athenaLogsError } = await supabase
        .from("athena_logs")
        .select("id, is_favorite")
        .eq("user_id", user.id);
      
      // Fetch recent favorites
      const { data: recentFavorites, error: recentFavoritesError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      
      // Calculate average habits progress
      let habitsProgress = 0;
      if (habits && habits.length > 0) {
        const totalProgress = habits.reduce((sum, habit) => sum + (habit.progress || 0), 0);
        const totalGoals = habits.reduce((sum, habit) => sum + (habit.goal || 100), 0);
        habitsProgress = totalGoals > 0 ? Math.round((totalProgress / totalGoals) * 100) : 0;
      }
      
      // Count favorite Athena interactions
      const favoriteCount = athenaLogs 
        ? athenaLogs.filter(log => log.is_favorite).length 
        : 0;
      
      // Generate Athena insights based on user data
      if (user) {
        const insights = await generateAthenaInsights(user.id);
        
        if (insights.length > 0) {
          // Choose a random insight to display
          const randomIndex = Math.floor(Math.random() * insights.length);
          const selectedInsight = insights[randomIndex];
          
          setStats(prev => ({
            ...prev,
            athenaInsight: selectedInsight.message,
            athenaActionText: selectedInsight.actionText,
            athenaActionUrl: selectedInsight.actionUrl
          }));
        }
      }
      
      setStats({
        projectsActive: activeProjects?.length || 0,
        projectsCompleted: completedProjects?.length || 0,
        habitsActive: habits?.length || 0,
        habitsProgress,
        athenaInteractions: athenaLogs?.length || 0,
        favoriteCount,
        recentFavorites: recentFavorites || [],
        athenaInsight: generateAthenaInsight(
          activeProjects?.length || 0,
          habits?.length || 0,
          athenaLogs?.length || 0
        ),
        loading: false
      });
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Generate a simple insight based on user data
  const generateAthenaInsight = (
    activeProjects: number, 
    activeHabits: number,
    interactions: number
  ): string => {
    if (interactions === 0) {
      return "Bem-vindo ao CÓRTEX! Experimente conversar com a Athena para obter ajuda com seus projetos e hábitos.";
    }
    
    if (activeProjects === 0) {
      return "Que tal começar um novo projeto hoje? Converse comigo para criar seu primeiro projeto.";
    }
    
    if (activeHabits === 0) {
      return "Hábitos consistentes são a chave para o sucesso. Que tal criar seu primeiro hábito?";
    }
    
    const insights = [
      "Você está no caminho certo! Continue acompanhando seus projetos diariamente para aumentar sua produtividade.",
      "Lembre-se de revisar seus hábitos semanalmente para garantir que eles estejam alinhados com seus objetivos.",
      "O sucesso é a soma de pequenos esforços repetidos dia após dia. Continue com seus hábitos!",
      "Você sabia que dividir grandes projetos em tarefas menores aumenta significativamente as chances de sucesso?",
      "Que tal usar a Athena para obter insights sobre seus projetos e hábitos atuais?"
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };
  
  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus projetos, hábitos e interações.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.projectsActive}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.projectsCompleted} projeto(s) concluído(s)
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hábitos Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.habitsActive}</div>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Progresso</span>
                    <span className="text-xs font-medium">{stats.habitsProgress}%</span>
                  </div>
                  <Progress value={stats.habitsProgress} className="h-1" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interações com Athena</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.athenaInteractions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.favoriteCount} interações favoritadas
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.recentFavorites.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.recentFavorites.length > 0 ? "Adições recentes" : "Nenhum favorito ainda"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 mb-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Sugestão da Athena</CardTitle>
            <CardDescription>
              Baseada nos seus dados recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AthenaDashboardInsight 
              insight={stats.athenaInsight}
              loading={stats.loading}
              actionText={stats.athenaActionText}
              actionUrl={stats.athenaActionUrl}
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Favoritos Recentes</CardTitle>
            <CardDescription>
              Seus últimos itens salvos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="space-y-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : stats.recentFavorites.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhum favorito adicionado ainda</p>
                <Button variant="link" className="mt-2" onClick={() => navigate('/favoritos')}>
                  Adicionar favoritos
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[180px]">
                <div className="space-y-4">
                  {stats.recentFavorites.map((favorite) => (
                    <div key={favorite.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded bg-secondary/20 flex items-center justify-center">
                        <Star size={14} className="text-secondary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1 line-clamp-1">{favorite.title}</h4>
                        <div className="flex items-center gap-2">
                          {favorite.type && (
                            <Badge variant="outline" className="text-xs">
                              {favorite.type}
                            </Badge>
                          )}
                          {favorite.tags?.length > 0 && favorite.tags[0] && (
                            <Badge variant="secondary" className="text-xs">
                              {favorite.tags[0]}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Próximos passos sugeridos</CardTitle>
            <CardDescription>
              Melhore sua experiência com o CÓRTEX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.projectsActive === 0 && (
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <BarChart size={20} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Crie seu primeiro projeto</h4>
                    <p className="text-sm text-muted-foreground">Organize suas tarefas e acompanhe seu progresso</p>
                  </div>
                  <Button onClick={() => navigate('/projetos')}>
                    Começar
                  </Button>
                </div>
              )}
              
              {stats.habitsActive === 0 && (
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Activity size={20} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Desenvolva um novo hábito</h4>
                    <p className="text-sm text-muted-foreground">Crie hábitos consistentes para alcançar seus objetivos</p>
                  </div>
                  <Button onClick={() => navigate('/habitos')}>
                    Começar
                  </Button>
                </div>
              )}
              
              {stats.athenaInteractions === 0 && (
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <MessageSquare size={20} className="text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Converse com a Athena</h4>
                    <p className="text-sm text-muted-foreground">Obtenha insights e ajuda para melhorar sua produtividade</p>
                  </div>
                  <Button onClick={() => navigate('/athena')}>
                    Conversar
                  </Button>
                </div>
              )}
              
              {stats.projectsActive > 0 && stats.habitsActive > 0 && stats.athenaInteractions > 0 && (
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Explore insights personalizados</h4>
                    <p className="text-sm text-muted-foreground">Descubra padrões e insights sobre seus projetos e hábitos</p>
                  </div>
                  <Button onClick={() => navigate('/insights')}>
                    Explorar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
