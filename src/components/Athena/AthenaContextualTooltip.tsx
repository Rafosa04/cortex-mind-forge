
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Brain, X, Lightbulb } from 'lucide-react';
import { useAthenaInsights } from '@/hooks/useAthenaInsights';

interface AthenaContextualTooltipProps {
  contextType: 'habit' | 'project' | 'subcerebro' | 'diary';
  contextId: string;
  contextData?: any;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export const AthenaContextualTooltip: React.FC<AthenaContextualTooltipProps> = ({
  contextType,
  contextId,
  contextData,
  trigger,
  children
}) => {
  const [contextualInsight, setContextualInsight] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { createCustomInsight } = useAthenaInsights();

  const generateContextualInsight = async () => {
    if (!contextData) return;

    let insight = '';
    
    switch (contextType) {
      case 'habit':
        if (contextData.streak > 10) {
          insight = `Excelente! Seu streak de ${contextData.streak} dias mostra dedicação. Considere aumentar a intensidade ou adicionar um hábito complementar.`;
        } else if (contextData.streak === 0) {
          insight = `Toda jornada começa com um passo. Que tal começar com apenas 2 minutos hoje?`;
        } else {
          insight = `Você está construindo momentum! ${contextData.streak} dias é um ótimo começo.`;
        }
        break;
        
      case 'project':
        if (contextData.progress > 80) {
          insight = `Você está quase lá! Com ${contextData.progress}% concluído, mantenha o foco para finalizar.`;
        } else if (contextData.progress < 20) {
          insight = `Todo grande projeto começa pequeno. Divida em tarefas menores para criar momentum.`;
        } else {
          insight = `Progresso sólido! ${contextData.progress}% concluído. Continue assim!`;
        }
        break;
        
      case 'subcerebro':
        insight = `Este subcérebro pode ser conectado a projetos relacionados com ${contextData.area}. Quer que eu sugira conexões?`;
        break;
        
      case 'diary':
        if (contextData.emotion === 'positive') {
          insight = `Que bom ver você bem! Momentos assim são importantes para manter o equilíbrio.`;
        } else if (contextData.emotion === 'negative') {
          insight = `Entendo que não é um dia fácil. Lembre-se: sentimentos passam e você é mais forte do que imagina.`;
        } else {
          insight = `Reflexão é o primeiro passo para o autoconhecimento. Continue escrevendo!`;
        }
        break;
    }
    
    setContextualInsight(insight);
    setIsVisible(true);

    // Salvar como insight contextual
    if (insight) {
      try {
        await createCustomInsight({
          type: 'contextual',
          category: `${contextType}_contextual`,
          title: `Insight sobre ${contextType}`,
          description: insight,
          priority: 4,
          context_data: { contextType, contextId, contextData }
        });
      } catch (error) {
        console.error('Erro ao salvar insight contextual:', error);
      }
    }
  };

  useEffect(() => {
    if (isVisible && !contextualInsight) {
      generateContextualInsight();
    }
  }, [isVisible, contextData]);

  if (!contextData) return children || null;

  return (
    <TooltipProvider>
      <Tooltip open={isVisible} onOpenChange={setIsVisible}>
        <TooltipTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-primary/60 hover:text-primary"
              onClick={() => setIsVisible(!isVisible)}
            >
              <Brain className="h-4 w-4" />
            </Button>
          )}
        </TooltipTrigger>
        <AnimatePresence>
          {isVisible && contextualInsight && (
            <TooltipContent asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="max-w-sm bg-background border border-primary/20 rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-primary">Athena diz:</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setIsVisible(false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {contextualInsight}
                    </p>
                  </div>
                </div>
                
                {/* Seta do tooltip */}
                <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-background border-r border-b border-primary/20"></div>
              </motion.div>
            </TooltipContent>
          )}
        </AnimatePresence>
      </Tooltip>
    </TooltipProvider>
  );
};
