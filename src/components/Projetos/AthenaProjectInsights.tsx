
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  BookOpen, 
  Target, 
  Heart, 
  Users, 
  Lightbulb,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectWithSteps } from '@/services/projectsService';
import { toast } from '@/hooks/use-toast';

interface AthenaInsight {
  type: 'connection' | 'creation';
  entity_type: 'diary_entry' | 'habit' | 'saved_item' | 'subcerebro' | 'connecta_post' | 'new_entity';
  entity_id: string | null;
  title: string;
  description: string;
  action_label: string;
  action_payload: any;
  relevance_score: 'high' | 'medium' | 'low';
}

interface RelatedEntity {
  id: string;
  title: string;
  summary: string;
  action_label: string;
  type: string;
  created_at?: string;
}

interface AthenaInsightsData {
  insights_summary: string;
  suggestions: AthenaInsight[];
  related_entities_display: {
    diary_entries: RelatedEntity[];
    habits: RelatedEntity[];
    saved_items: RelatedEntity[];
    subcerebros: RelatedEntity[];
    connecta_posts: RelatedEntity[];
  };
}

interface AthenaProjectInsightsProps {
  projeto: ProjectWithSteps;
}

export function AthenaProjectInsights({ projeto }: AthenaProjectInsightsProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: insights, isLoading, error, refetch } = useQuery({
    queryKey: ['athena-project-insights', projeto.id, refreshKey],
    queryFn: async (): Promise<AthenaInsightsData> => {
      const { data, error } = await supabase.functions.invoke('generate-project-insights', {
        body: {
          project_id: projeto.id,
          project_name: projeto.name,
          project_description: projeto.description,
          project_tags: projeto.tags || [],
          project_steps: projeto.steps?.map(step => ({
            name: step.description,
            status: step.done ? 'completed' : 'pending'
          })) || [],
          project_progress: projeto.progress
        }
      });

      if (error) {
        console.error('Error generating insights:', error);
        throw new Error('Falha ao gerar insights da Athena');
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000 // 30 minutos - fixed from cacheTime to gcTime
  });

  const handleAction = (payload: any, actionType: string) => {
    switch (actionType) {
      case 'view_diary':
        window.open('/diario', '_blank');
        break;
      case 'view_habits':
        window.open('/habitos', '_blank');
        break;
      case 'view_saved':
        window.open('/favoritos', '_blank');
        break;
      case 'view_subcerebro':
        window.open('/subcerebros', '_blank');
        break;
      case 'view_connecta':
        window.open('/connecta', '_blank');
        break;
      default:
        toast({
          title: "Ação em desenvolvimento",
          description: "Esta funcionalidade será implementada em breve."
        });
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'diary_entry': return <BookOpen className="w-4 h-4" />;
      case 'habit': return <Target className="w-4 h-4" />;
      case 'saved_item': return <Heart className="w-4 h-4" />;
      case 'subcerebro': return <Brain className="w-4 h-4" />;
      case 'connecta_post': return <Users className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getRelevanceColor = (score: string) => {
    switch (score) {
      case 'high': return 'text-green-400 border-green-400/40';
      case 'medium': return 'text-yellow-400 border-yellow-400/40';
      case 'low': return 'text-gray-400 border-gray-400/40';
      default: return 'text-gray-400 border-gray-400/40';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-[#993887]" />
          <span className="font-semibold text-[#993887]">Insights da Athena</span>
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-16 w-full bg-[#191933]/70" />
          <Skeleton className="h-12 w-full bg-[#191933]/70" />
          <Skeleton className="h-12 w-full bg-[#191933]/70" />
          <Skeleton className="h-20 w-full bg-[#191933]/70" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#993887]" />
            <span className="font-semibold text-[#993887]">Insights da Athena</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <Card className="bg-[#191933]/60 border-red-500/40">
          <CardContent className="p-4">
            <p className="text-red-400 text-sm">
              Não foi possível gerar insights no momento. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#993887]" />
          <span className="font-semibold text-[#993887]">Insights da Athena</span>
          <Sparkles className="w-4 h-4 text-[#993887] animate-pulse" />
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Resumo dos Insights */}
      {insights.insights_summary && (
        <Card className="bg-[#993887]/10 border-[#993887]/40">
          <CardContent className="p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              {insights.insights_summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sugestões da Athena */}
      {insights.suggestions && insights.suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Sugestões Inteligentes
          </h4>
          
          <AnimatePresence>
            {insights.suggestions.slice(0, 3).map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-[#191933]/60 border-[#60B5B5]/40 hover:border-[#60B5B5]/60 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getEntityIcon(suggestion.entity_type)}
                          <span className="font-medium text-white text-sm">
                            {suggestion.title}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRelevanceColor(suggestion.relevance_score)}`}
                          >
                            {suggestion.relevance_score === 'high' ? 'Alta' : 
                             suggestion.relevance_score === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          {suggestion.description}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#60B5B5]/40 text-[#60B5B5] hover:bg-[#60B5B5]/10"
                          onClick={() => handleAction(suggestion.action_payload, suggestion.entity_type)}
                        >
                          {suggestion.action_label}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Separator className="bg-[#60B5B5]/20" />

      {/* Entidades Relacionadas */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Conexões Descobertas
        </h4>

        {/* Subcérebros Relacionados */}
        {insights.related_entities_display.subcerebros.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Brain className="w-3 h-3" />
              Subcérebros Conectados
            </span>
            {insights.related_entities_display.subcerebros.slice(0, 2).map((entity) => (
              <Card key={entity.id} className="bg-[#191933]/40 border-[#60B5B5]/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{entity.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{entity.summary}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-[#60B5B5] hover:bg-[#60B5B5]/10"
                      onClick={() => handleAction({ id: entity.id }, 'view_subcerebro')}
                    >
                      {entity.action_label}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Hábitos Relacionados */}
        {insights.related_entities_display.habits.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Hábitos Relacionados
            </span>
            {insights.related_entities_display.habits.slice(0, 2).map((entity) => (
              <Card key={entity.id} className="bg-[#191933]/40 border-[#60B5B5]/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{entity.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{entity.summary}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-[#60B5B5] hover:bg-[#60B5B5]/10"
                      onClick={() => handleAction({ id: entity.id }, 'view_habits')}
                    >
                      {entity.action_label}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Entradas de Diário */}
        {insights.related_entities_display.diary_entries.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Reflexões no Diário
            </span>
            {insights.related_entities_display.diary_entries.slice(0, 2).map((entity) => (
              <Card key={entity.id} className="bg-[#191933]/40 border-[#60B5B5]/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{entity.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{entity.summary}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-[#60B5B5] hover:bg-[#60B5B5]/10"
                      onClick={() => handleAction({ id: entity.id }, 'view_diary')}
                    >
                      {entity.action_label}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Itens Salvos */}
        {insights.related_entities_display.saved_items.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Heart className="w-3 h-3" />
              Itens Salvos Relevantes
            </span>
            {insights.related_entities_display.saved_items.slice(0, 2).map((entity) => (
              <Card key={entity.id} className="bg-[#191933]/40 border-[#60B5B5]/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{entity.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{entity.summary}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-[#60B5B5] hover:bg-[#60B5B5]/10"
                      onClick={() => handleAction({ id: entity.id }, 'view_saved')}
                    >
                      {entity.action_label}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Mensagem caso não haja conexões */}
        {!insights.related_entities_display.subcerebros.length && 
         !insights.related_entities_display.habits.length && 
         !insights.related_entities_display.diary_entries.length && 
         !insights.related_entities_display.saved_items.length && (
          <Card className="bg-[#191933]/40 border-[#60B5B5]/20">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-[#993887]/50" />
              <p className="text-sm text-gray-400">
                Nenhuma conexão descoberta ainda. Continue expandindo seu CÓRTEX!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
