
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentTrend, EmotionPattern } from '@/hooks/useDiaryAnalysis';

interface DiaryTrendsChartProps {
  sentimentTrends: SentimentTrend[];
  emotionPatterns: EmotionPattern[];
}

export const DiaryTrendsChart: React.FC<DiaryTrendsChartProps> = ({
  sentimentTrends,
  emotionPatterns
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 0.2) return '#10B981'; // green
    if (score < -0.2) return '#EF4444'; // red
    return '#6B7280'; // gray
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: '#10B981',
      sad: '#EF4444',
      angry: '#F59E0B',
      anxious: '#8B5CF6',
      excited: '#06B6D4',
      calm: '#84CC16',
      frustrated: '#EC4899',
      grateful: '#14B8A6',
      neutral: '#6B7280'
    };
    return colors[emotion as keyof typeof colors] || '#6B7280';
  };

  if (!sentimentTrends.length && !emotionPatterns.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <p>Não há dados suficientes para gerar gráficos</p>
            <p className="text-sm mt-1">Registre algumas entradas para ver suas tendências</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Humor e Tendências</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sentiment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sentiment">Tendência de Humor</TabsTrigger>
            <TabsTrigger value="emotions">Padrões Emocionais</TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-4">
            {sentimentTrends.length > 0 ? (
              <>
                {/* Gráfico de linha para scores de sentimento */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sentimentTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        fontSize={12}
                      />
                      <YAxis 
                        domain={[-1, 1]}
                        tickFormatter={(value) => value.toFixed(1)}
                        fontSize={12}
                      />
                      <Tooltip 
                        formatter={(value: number) => [value.toFixed(2), 'Score de Humor']}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgScore" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Estatísticas resumidas */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {sentimentTrends.reduce((sum, t) => sum + t.positive, 0)}
                    </div>
                    <div className="text-sm text-green-600">Dias Positivos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {sentimentTrends.reduce((sum, t) => sum + t.neutral, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Dias Neutros</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {sentimentTrends.reduce((sum, t) => sum + t.negative, 0)}
                    </div>
                    <div className="text-sm text-red-600">Dias Difíceis</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Adicione mais entradas para ver suas tendências de humor</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="emotions" className="space-y-4">
            {emotionPatterns.length > 0 ? (
              <>
                {/* Gráfico de barras para emoções */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emotionPatterns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="emotion" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Ocorrências']}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Lista de emoções com percentuais */}
                <div className="space-y-2">
                  {emotionPatterns.slice(0, 5).map((pattern, index) => (
                    <div key={pattern.emotion} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getEmotionColor(pattern.emotion) }}
                        />
                        <span className="capitalize font-medium">{pattern.emotion}</span>
                        {getTrendIcon(pattern.trend)}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{pattern.count}x</div>
                        <div className="text-sm text-muted-foreground">
                          {pattern.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Registre suas emoções para ver os padrões</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
