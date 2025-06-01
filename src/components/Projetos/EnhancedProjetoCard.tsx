
import React from "react";
import { Calendar, Users, Tag, Heart, MoreVertical, Bot, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectWithSteps } from "@/services/projectsService";
import { AthenaInsightBadge } from "./AthenaInsightBadge";

interface EnhancedProjetoCardProps {
  projeto: ProjectWithSteps;
  onVerDetalhes: (projeto: ProjectWithSteps) => void;
  onRemoveProjeto: (id: string) => Promise<boolean>;
  onToggleFavorite: (id: string, isFavorite: boolean) => Promise<boolean>;
  onSugerirEtapa?: (projeto: ProjectWithSteps) => void;
  variant?: "default" | "compact";
  isDragging?: boolean;
}

export function EnhancedProjetoCard({
  projeto,
  onVerDetalhes,
  onRemoveProjeto,
  onToggleFavorite,
  onSugerirEtapa,
  variant = "default",
  isDragging = false
}: EnhancedProjetoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "pausado":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "concluído":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={isDragging ? "opacity-50 rotate-3" : ""}
    >
      <Card className={`group hover:shadow-xl transition-all duration-300 bg-[#141429]/90 border-[#191933] shadow-lg ${
        isCompact ? "h-auto" : "h-full"
      }`}>
        <CardHeader className={isCompact ? "pb-2" : "pb-4"}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-white truncate ${
                isCompact ? "text-sm" : "text-lg"
              }`}>
                {projeto.name}
              </h3>
              {!isCompact && projeto.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {projeto.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge 
                variant="outline" 
                className={`${getStatusColor(projeto.status)} text-xs`}
              >
                {projeto.status}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onVerDetalhes(projeto)}>
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onToggleFavorite(projeto.id, !projeto.is_favorite)}
                  >
                    {projeto.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  </DropdownMenuItem>
                  {onSugerirEtapa && (
                    <DropdownMenuItem onClick={() => onSugerirEtapa(projeto)}>
                      <Bot className="w-4 h-4 mr-2" />
                      Sugerir próxima etapa
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onRemoveProjeto(projeto.id)}
                    className="text-red-400"
                  >
                    Remover projeto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Athena AI Insights */}
          <div className="flex flex-wrap gap-1 mt-2">
            <AthenaInsightBadge projeto={projeto} type="warning" />
            <AthenaInsightBadge projeto={projeto} type="deadline" />
            <AthenaInsightBadge projeto={projeto} type="trend" />
            <AthenaInsightBadge projeto={projeto} type="suggestion" />
          </div>
        </CardHeader>

        <CardContent className={isCompact ? "py-2" : "py-4"}>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progresso</span>
              <span className="text-white font-medium">{projeto.progress}%</span>
            </div>
            <Progress value={projeto.progress} className="h-2" />
          </div>

          {!isCompact && (
            <>
              {/* Tags */}
              {projeto.tags && projeto.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {projeto.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-[#60B5B5]/40 text-[#60B5B5]"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {projeto.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-[#60B5B5]/40">
                      +{projeto.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Deadline */}
              {projeto.deadline && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Prazo: {formatDate(projeto.deadline)}</span>
                </div>
              )}

              {/* Steps Summary */}
              {projeto.steps && projeto.steps.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {projeto.steps.filter(s => s.done).length} de {projeto.steps.length} etapas
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className={`flex items-center justify-between ${
          isCompact ? "pt-2" : "pt-4"
        }`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerDetalhes(projeto)}
            className="border-[#60B5B5]/40 text-[#60B5B5] hover:bg-[#60B5B5]/10"
          >
            Ver detalhes
          </Button>
          
          <div className="flex items-center gap-2">
            {onSugerirEtapa && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSugerirEtapa(projeto)}
                className="h-8 w-8 p-0 text-[#993887] hover:bg-[#993887]/10"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(projeto.id, !projeto.is_favorite)}
              className={`h-8 w-8 p-0 ${
                projeto.is_favorite 
                  ? "text-red-400 hover:bg-red-400/10" 
                  : "text-gray-400 hover:bg-gray-400/10"
              }`}
            >
              <Heart className={`w-4 h-4 ${projeto.is_favorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
