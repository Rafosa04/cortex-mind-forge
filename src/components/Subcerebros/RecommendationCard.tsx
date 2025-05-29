
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Brain, Link2, Target } from 'lucide-react';
import { SubcerebroRecommendation } from '@/hooks/useSubcerebroRecommendations';

interface RecommendationCardProps {
  recommendation: SubcerebroRecommendation;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
}

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case 'similar_tags':
      return <Target className="h-4 w-4 text-blue-500" />;
    case 'same_area':
      return <Brain className="h-4 w-4 text-purple-500" />;
    default:
      return <Link2 className="h-4 w-4 text-primary" />;
  }
};

const getRecommendationTypeLabel = (type: string) => {
  switch (type) {
    case 'similar_tags':
      return 'Tags Similares';
    case 'same_area':
      return 'Mesma Área';
    default:
      return 'Conexão Sugerida';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 0.8) return 'text-green-600 bg-green-100';
  if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
  return 'text-blue-600 bg-blue-100';
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAccept,
  onReject,
  isLoading = false
}) => {
  const scorePercentage = Math.round(recommendation.similarity_score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getRecommendationIcon(recommendation.recommendation_type)}
              <div>
                <h4 className="font-medium text-sm">
                  {getRecommendationTypeLabel(recommendation.recommendation_type)}
                </h4>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getScoreColor(recommendation.similarity_score)}`}
                >
                  {scorePercentage}% compatibilidade
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Subcérebros envolvidos */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">
                {recommendation.source_subcerebro?.nome || 'Subcérebro'}
              </span>
              {recommendation.source_subcerebro?.area && (
                <Badge variant="outline" className="text-xs">
                  {recommendation.source_subcerebro.area}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-center">
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">
                {recommendation.recommended_subcerebro?.nome || 'Subcérebro'}
              </span>
              {recommendation.recommended_subcerebro?.area && (
                <Badge variant="outline" className="text-xs">
                  {recommendation.recommended_subcerebro.area}
                </Badge>
              )}
            </div>
          </div>

          {/* Raciocínio */}
          {recommendation.reasoning && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
          )}

          {/* Tags em comum */}
          {recommendation.source_subcerebro?.tags && 
           recommendation.recommended_subcerebro?.tags && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Tags em comum:</p>
              <div className="flex flex-wrap gap-1">
                {recommendation.source_subcerebro.tags
                  .filter(tag => recommendation.recommended_subcerebro?.tags.includes(tag))
                  .map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onAccept(recommendation.id)}
              disabled={isLoading}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              Aceitar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(recommendation.id)}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
