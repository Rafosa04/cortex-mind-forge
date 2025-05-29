
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  BarChart3,
  Target,
  Clock
} from 'lucide-react';
import { useAthenaInsights } from '@/hooks/useAthenaInsights';
import { AthenaInsightCard } from './AthenaInsightCard';
import { AthenaAnalytics } from '@/utils/athenaAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AthenaInsightsDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    insights,
    predictions,
    loading,
    generateProactiveInsights,
    dismissInsight,
    markInsightAsActedUpon,
    fetchInsights,
    fetchPredictions
  } = useAthenaInsights();

  const [analyzing, setAnalyzing] = useState(false);
  const [habitPredictions, setHabitPredictions] = useState<any[]>([]);
  const [projectPredictions, setProjectPredictions] = useState<any[]>([]);

  const runAnalysis = async () => {
    if (!user) return;
    
    setAnalyzing(true);
    try {
      const [habitAnalysis, projectAnalysis] = await Promise.all([
        AthenaAnalytics.analyzeHabitRisk(user.id),
        AthenaAnalytics.analyzeProjectCompletion(user.id)
      ]);
      
      setHabitPredictions(habitAnalysis);
      setProjectPredictions(projectAnalysis);
      
      await Promise.all([
        generateProactiveInsights(),
        fetchPredictions()
      ]);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (user && insights.length === 0) {
      runAnalysis();
    }
  }, [user]);

  const activeInsights = insights.filter(insight => insight.status === 'active');
  const highPriorityInsights = activeInsights.filter(insight => insight.priority >= 7);

  const riskDistributionData = habitPredictions.map(pred => ({
    name: pred.habitName.substring(0, 15) + '...',
    risco: Math.round(pred.abandonmentRisk * 100),
    sucesso: Math.round(pred.successProbability * 100)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Athena Intelligence</h1>
            <p className="text-muted-foreground">Insights e predições da sua IA pessoal</p>
          </div>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={analyzing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analisando...' : 'Atualizar Análise'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Insights Ativos</p>
                <p className="text-2xl font-bold">{activeInsights.length}</p>
              </div>
              <Brain className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold text-red-500">{highPriorityInsights.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predições</p>
                <p className="text-2xl font-bold">{predictions.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Análises</p>
                <p className="text-2xl font-bold">{habitPredictions.length + projectPredictions.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights Proativos</TabsTrigger>
          <TabsTrigger value="predictions">Análise Preditiva</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : activeInsights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {activeInsights.map((insight) => (
                  <AthenaInsightCard
                    key={insight.id}
                    insight={insight}
                    onDismiss={dismissInsight}
                    onMarkActedUpon={markInsightAsActedUpon}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum insight ativo</h3>
                <p className="text-muted-foreground mb-4">
                  A Athena está analisando seus dados. Novos insights aparecerão aqui.
                </p>
                <Button onClick={runAnalysis} disabled={analyzing}>
                  {analyzing ? 'Analisando...' : 'Gerar Insights'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hábitos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Análise de Hábitos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {habitPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {habitPredictions.slice(0, 3).map((pred) => (
                      <div key={pred.habitId} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{pred.habitName}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pred.abandonmentRisk > 0.7 ? 'bg-red-500/20 text-red-500' :
                            pred.abandonmentRisk > 0.4 ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {pred.abandonmentRisk > 0.7 ? 'Alto Risco' :
                             pred.abandonmentRisk > 0.4 ? 'Risco Moderado' : 'Baixo Risco'}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Sucesso: {Math.round(pred.successProbability * 100)}%
                        </div>
                        {pred.recommendations.length > 0 && (
                          <div className="text-xs text-primary">
                            💡 {pred.recommendations[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Execute uma análise para ver as predições de hábitos
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Projetos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Análise de Projetos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projectPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {projectPredictions.slice(0, 3).map((pred) => (
                      <div key={pred.projectId} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{pred.projectName}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pred.completionProbability > 0.7 ? 'bg-green-500/20 text-green-500' :
                            pred.completionProbability > 0.4 ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {Math.round(pred.completionProbability * 100)}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Estimativa: {pred.estimatedDaysToComplete} dias
                        </div>
                        {pred.suggestions.length > 0 && (
                          <div className="text-xs text-primary">
                            💡 {pred.suggestions[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Execute uma análise para ver as predições de projetos
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {riskDistributionData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Risco dos Hábitos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="risco" fill="#ef4444" name="Risco %" />
                      <Bar dataKey="sucesso" fill="#22c55e" name="Sucesso %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
