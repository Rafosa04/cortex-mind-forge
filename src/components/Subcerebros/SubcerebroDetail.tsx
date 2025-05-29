
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Edit, 
  Trash2, 
  Link2, 
  Calendar,
  Eye,
  Target,
  X
} from 'lucide-react';
import { Subcerebro } from '@/hooks/useSubcerebros';
import { useSubcerebroRecommendations } from '@/hooks/useSubcerebroRecommendations';
import { RecommendationCard } from './RecommendationCard';
import { AthenaContextualTooltip } from '@/components/Athena/AthenaContextualTooltip';

interface SubcerebroDetailProps {
  subcerebro: Subcerebro | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (subcerebro: Subcerebro) => void;
  onDelete: (id: string, nome: string) => void;
}

export const SubcerebroDetail: React.FC<SubcerebroDetailProps> = ({
  subcerebro,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { 
    recommendations, 
    loading,
    generateRecommendations,
    acceptRecommendation,
    rejectRecommendation
  } = useSubcerebroRecommendations();

  if (!subcerebro) return null;

  const relevantRecommendations = recommendations.filter(
    rec => rec.source_subcerebro_id === subcerebro.id || 
           rec.recommended_subcerebro_id === subcerebro.id
  );

  const handleGenerateRecommendations = async () => {
    await generateRecommendations();
    setShowRecommendations(true);
  };

  const contextData = {
    name: subcerebro.nome,
    area: subcerebro.area,
    tags: subcerebro.tags,
    relevancia: subcerebro.relevancia,
    connections: relevantRecommendations.length
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
              <SheetTitle className="text-xl">{subcerebro.nome}</SheetTitle>
              <AthenaContextualTooltip
                contextType="subcerebro"
                contextId={subcerebro.id}
                contextData={contextData}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {subcerebro.descricao && (
            <SheetDescription className="text-left">
              {subcerebro.descricao}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Metadados */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Área</p>
              <Badge variant="outline">
                {subcerebro.area || 'Não definida'}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Relevância</p>
              <div className="flex items-center gap-2">
                <span className="text-sm">{subcerebro.relevancia}/10</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${subcerebro.relevancia * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {subcerebro.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-2">
                {subcerebro.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Informações temporais */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Criado em {new Date(subcerebro.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            {subcerebro.last_access && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Último acesso em {new Date(subcerebro.last_access).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Recomendações */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conexões Sugeridas
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateRecommendations}
                disabled={loading}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Gerar Sugestões
              </Button>
            </div>

            <AnimatePresence>
              {relevantRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {relevantRecommendations.slice(0, 3).map((recommendation) => (
                    <RecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                      onAccept={acceptRecommendation}
                      onReject={rejectRecommendation}
                      isLoading={loading}
                    />
                  ))}
                  {relevantRecommendations.length > 3 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setShowRecommendations(true)}
                    >
                      Ver todas as {relevantRecommendations.length} recomendações
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Nenhuma conexão sugerida ainda</p>
                  <p className="text-xs">Clique em "Gerar Sugestões" para descobrir conexões</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <Separator />

          {/* Ações */}
          <div className="flex gap-3">
            <Button 
              onClick={() => onEdit(subcerebro)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onDelete(subcerebro.id, subcerebro.nome)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
