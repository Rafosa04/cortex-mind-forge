
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Lightbulb,
  Target,
  Clock
} from 'lucide-react';

interface AthenaInsight {
  id: string;
  type: 'proactive' | 'predictive' | 'contextual';
  category: string;
  title: string;
  description: string;
  action_suggestion?: string;
  confidence_score: number;
  priority: number;
  status: 'active' | 'dismissed' | 'acted_upon';
  created_at: string;
}

interface AthenaInsightCardProps {
  insight: AthenaInsight;
  onDismiss: (id: string) => void;
  onMarkActedUpon: (id: string) => void;
  compact?: boolean;
}

const getInsightIcon = (category: string, type: string) => {
  switch (category) {
    case 'habit_streak': return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'project_risk': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'mental_pattern': return <Brain className="h-5 w-5 text-purple-500" />;
    case 'success_prediction': return <Target className="h-5 w-5 text-blue-500" />;
    default: return <Lightbulb className="h-5 w-5 text-primary" />;
  }
};

const getPriorityColor = (priority: number) => {
  if (priority >= 8) return 'bg-red-500/20 text-red-500 border-red-500/30';
  if (priority >= 6) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
  return 'bg-green-500/20 text-green-500 border-green-500/30';
};

const getPriorityLabel = (priority: number) => {
  if (priority >= 8) return 'Alta';
  if (priority >= 6) return 'Média';
  return 'Baixa';
};

export const AthenaInsightCard: React.FC<AthenaInsightCardProps> = ({
  insight,
  onDismiss,
  onMarkActedUpon,
  compact = false
}) => {
  const timeAgo = new Date(insight.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="border-l-4 border-primary bg-background/80 backdrop-blur-sm p-3 rounded-r-lg"
      >
        <div className="flex items-start gap-3">
          {getInsightIcon(insight.category, insight.type)}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{insight.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {insight.description}
            </p>
            {insight.action_suggestion && (
              <p className="text-xs text-primary mt-1 line-clamp-1">
                💡 {insight.action_suggestion}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(insight.id)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-background to-background/60 border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getInsightIcon(insight.category, insight.type)}
              <div>
                <CardTitle className="text-lg">{insight.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                    {getPriorityLabel(insight.priority)}
                  </Badge>
                  <Badge variant="secondary">
                    {insight.type === 'proactive' ? 'Proativo' : 
                     insight.type === 'predictive' ? 'Preditivo' : 'Contextual'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4">{insight.description}</p>
          
          {insight.action_suggestion && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-primary">{insight.action_suggestion}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onMarkActedUpon(insight.id)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Ação realizada
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDismiss(insight.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {insight.confidence_score && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Confiança da IA</span>
                <span>{Math.round(insight.confidence_score * 100)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1 mt-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${insight.confidence_score * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
