
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target, Download } from 'lucide-react';
import { DiaryInsight } from '@/hooks/useDiaryAnalysis';

interface DiaryInsightsPanelProps {
  insights: DiaryInsight[];
  onExportSummary: (format: 'pdf' | 'markdown') => void;
  loading?: boolean;
}

export const DiaryInsightsPanel: React.FC<DiaryInsightsPanelProps> = ({
  insights,
  onExportSummary,
  loading = false
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'streak': return <Target className="h-5 w-5 text-green-500" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default: return <Lightbulb className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case 'pattern': return 'Padrão';
      case 'streak': return 'Progresso';
      case 'recommendation': return 'Sugestão';
      default: return 'Insight';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights da Athena
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportSummary('markdown')}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportSummary('pdf')}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={getConfidenceColor(insight.confidence)}
                      >
                        {getInsightTypeLabel(insight.type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confiança
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    {insight.actionSuggestion && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Sugestão:</strong> {insight.actionSuggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-muted-foreground mb-2">
              Nenhum insight disponível ainda
            </h3>
            <p className="text-sm text-muted-foreground">
              Continue registrando suas experiências para que a Athena possa gerar insights personalizados
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
