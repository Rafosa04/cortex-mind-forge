
import React from "react";
import { ArrowRight, Bot, Star, Trash2, Calendar, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { StatusTag } from "./StatusTag";
import { TagProjeto } from "./TagProjeto";
import { AthenaInsightBadge } from "./AthenaInsightBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectWithSteps } from "@/services/projectsService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { saveAthenaLog } from "@/utils/athenaUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  projeto: ProjectWithSteps;
  onVerDetalhes?: (projeto: ProjectWithSteps) => void;
  onRemoveProjeto?: (id: string) => Promise<boolean>;
  onToggleFavorite?: (id: string, isFavorite: boolean) => Promise<boolean>;
  onSugerirEtapa?: (projeto: ProjectWithSteps) => void;
  variant?: "default" | "compact";
  isDragging?: boolean;
};

export function EnhancedProjetoCard({ 
  projeto, 
  onVerDetalhes,
  onRemoveProjeto,
  onToggleFavorite,
  onSugerirEtapa,
  variant = "default",
  isDragging = false,
}: Props) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onRemoveProjeto) return;
    
    if (confirm(`Tem certeza que deseja remover o projeto "${projeto.name}"?`)) {
      await onRemoveProjeto(projeto.id);
    }
  };
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    
    await onToggleFavorite(projeto.id, !projeto.is_favorite);
  };
  
  const handleSugerirEtapa = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onSugerirEtapa) {
      onSugerirEtapa(projeto);
    } else {
      toast({
        title: "Processando...",
        description: "Solicitando sugestão de etapa para este projeto",
      });
      
      const prompt = `Sugira uma próxima etapa para o projeto "${projeto.name}" com a descrição "${projeto.description || 'Sem descrição'}". Etapas atuais: ${projeto.steps.map(s => `"${s.description}"`).join(", ")}`;
      
      await saveAthenaLog(
        prompt,
        "Solicitação de sugestão de etapa registrada. Acesse o assistente Athena para visualizar a resposta completa.",
        "projeto",
        projeto.id
      );
      
      toast({
        title: "Solicitação enviada",
        description: "Abra Athena para ver a sugestão de etapa para seu projeto",
      });
    }
  };

  const handleInsightClick = () => {
    toast({
      title: "Athena Insight",
      description: "Clique no botão da Athena para mais detalhes",
    });
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = () => {
    if (!projeto.deadline) return null;
    const deadline = new Date(projeto.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline();

  // Compact variant for kanban view
  if (variant === "compact") {
    return (
      <motion.div
        className={`rounded-xl bg-[#141429]/90 border ${projeto.is_favorite ? 'border-[#993887]' : 'border-[#191933]'} shadow-lg p-4 flex flex-col gap-3 hover:border-[#60B5B5] transition-all cursor-grab ${isDragging ? 'opacity-50 cursor-grabbing' : ''}`}
        whileHover={{ scale: 1.02, boxShadow: "0 0 8px #60B5B5, 0 0 40px #99388722" }}
        transition={{ duration: 0.2 }}
        onClick={() => onVerDetalhes && onVerDetalhes(projeto)}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold text-primary drop-shadow-sm line-clamp-1">{projeto.name}</h3>
          {projeto.is_favorite && <Star className="w-3 h-3 text-[#993887] fill-[#993887] flex-shrink-0" />}
        </div>
        
        {/* Athena Insights */}
        <div className="flex flex-wrap gap-1">
          <AthenaInsightBadge projeto={projeto} type="warning" onClick={handleInsightClick} />
          <AthenaInsightBadge projeto={projeto} type="deadline" onClick={handleInsightClick} />
          <AthenaInsightBadge projeto={projeto} type="suggestion" onClick={handleInsightClick} />
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <Progress 
            value={projeto.progress} 
            className="flex-1 h-2 bg-[#191933] rounded-full" 
          />
          <span className="text-xs text-[#E6E6F0]/70 flex-shrink-0">{projeto.progress}%</span>
        </div>
        
        {/* Deadline info */}
        {daysUntilDeadline !== null && (
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="w-3 h-3" />
            <span className={`${
              daysUntilDeadline < 0 ? 'text-red-400' : 
              daysUntilDeadline <= 7 ? 'text-orange-400' : 
              'text-gray-400'
            }`}>
              {daysUntilDeadline < 0 ? `${Math.abs(daysUntilDeadline)}d atrasado` :
               daysUntilDeadline === 0 ? 'Hoje' :
               `${daysUntilDeadline}d restantes`}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-1">
          <Button 
            onClick={() => onVerDetalhes && onVerDetalhes(projeto)} 
            size="sm" 
            variant="outline" 
            className="text-xs flex items-center gap-1 border-primary/50 py-0 h-7"
          >
            Ver detalhes <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>
    );
  }
  
  // Default full card with enhanced features
  return (
    <motion.div
      className={`rounded-2xl bg-[#141429]/90 border ${projeto.is_favorite ? 'border-[#993887]' : 'border-[#191933]'} shadow-xl p-6 flex flex-col gap-4 relative hover:scale-[1.025] hover:border-[#60B5B5] transition-all cursor-pointer group overflow-hidden`}
      whileHover={{ scale: 1.025, boxShadow: "0 0 8px #60B5B5, 0 0 40px #99388722" }}
      transition={{ duration: 0.23 }}
      onClick={() => onVerDetalhes && onVerDetalhes(projeto)}
    >
      {/* Gradient overlay for visual enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#993887]/5 via-transparent to-[#60B5B5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg font-bold text-primary drop-shadow-sm line-clamp-1">{projeto.name}</span>
            {projeto.is_favorite && <Star className="w-4 h-4 text-[#993887] fill-[#993887] flex-shrink-0" />}
          </div>
          <StatusTag status={projeto.status} />
        </div>
        
        {/* Description (if available) */}
        {projeto.description && (
          <p className="text-sm text-secondary/80 line-clamp-2 mb-3">
            {projeto.description}
          </p>
        )}
        
        {/* Athena AI Insights */}
        <div className="flex flex-wrap gap-2 mb-3">
          <AthenaInsightBadge projeto={projeto} type="warning" onClick={handleInsightClick} />
          <AthenaInsightBadge projeto={projeto} type="deadline" onClick={handleInsightClick} />
          <AthenaInsightBadge projeto={projeto} type="trend" onClick={handleInsightClick} />
          <AthenaInsightBadge projeto={projeto} type="connection" onClick={handleInsightClick} />
          <AthenaInsightBadge projeto={projeto} type="suggestion" onClick={handleInsightClick} />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-3">
          {projeto.category && (
            <TagProjeto variant="primary">{projeto.category}</TagProjeto>
          )}
          {projeto.tags && projeto.tags.slice(0, 3).map((tag) => (
            <TagProjeto key={tag} variant="secondary">{tag}</TagProjeto>
          ))}
          {projeto.tags && projeto.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-[#60B5B5]/40">
              +{projeto.tags.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Progress with enhanced visualization */}
        <div className="flex items-center gap-3 mb-3">
          <Progress 
            value={projeto.progress} 
            className="flex-1 h-3 bg-[#191933] rounded-full overflow-hidden" 
          />
          <span className="text-sm font-medium text-[#E6E6F0]">{projeto.progress}%</span>
        </div>
        
        {/* Project Stats */}
        <div className="flex items-center gap-4 text-xs text-secondary/70 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{projeto.steps.length} etapas</span>
          </div>
          
          {daysUntilDeadline !== null && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className={`${
                daysUntilDeadline < 0 ? 'text-red-400' : 
                daysUntilDeadline <= 7 ? 'text-orange-400' : 
                'text-secondary/70'
              }`}>
                {daysUntilDeadline < 0 ? `${Math.abs(daysUntilDeadline)}d atrasado` :
                 daysUntilDeadline === 0 ? 'Hoje' :
                 `${daysUntilDeadline}d restantes`}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Solo</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={() => onVerDetalhes && onVerDetalhes(projeto)} 
            size="sm" 
            variant="outline" 
            className="group/button text-xs flex items-center gap-1 border-primary/50 shadow-glow transition hover:bg-primary/90 hover:text-[#0C0C1C]"
          >
            Ver detalhes <ArrowRight className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
          </Button>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-primary hover:bg-primary/10 h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">Opções</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#191933] border-[#60B5B5]/40">
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleToggleFavorite}
                >
                  <Star className="w-4 h-4" />
                  {projeto.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-red-400"
                  onClick={handleRemove}
                >
                  <Trash2 className="w-4 h-4" />
                  Remover projeto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-primary hover:bg-primary/10 h-8 w-8 relative" 
              title="Sugerir nova etapa com Athena"
              onClick={handleSugerirEtapa}
            >
              <span className="sr-only">Sugerir nova etapa</span>
              <Bot className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#993887] rounded-full animate-pulse" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
