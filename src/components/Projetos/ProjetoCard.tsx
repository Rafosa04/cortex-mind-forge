
import React from "react";
import { ArrowRight, Bot, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { StatusTag } from "./StatusTag";
import { TagProjeto } from "./TagProjeto";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProjectWithSteps } from "@/services/projectsService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { saveAthenaLog } from "@/utils/athenaUtils";

type Props = {
  projeto: ProjectWithSteps;
  onVerDetalhes?: (projeto: ProjectWithSteps) => void;
  onRemoveProjeto?: (id: string) => Promise<boolean>;
  onToggleFavorite?: (id: string, isFavorite: boolean) => Promise<boolean>;
  onSugerirEtapa?: (projeto: ProjectWithSteps) => void;
  variant?: "default" | "compact";
  isDragging?: boolean;
};

export function ProjetoCard({ 
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
      // Fallback if no handler provided
      toast({
        title: "Processando...",
        description: "Solicitando sugestão de etapa para este projeto",
      });
      
      // Create a prompt for Athena
      const prompt = `Sugira uma próxima etapa para o projeto "${projeto.name}" com a descrição "${projeto.description || 'Sem descrição'}". Etapas atuais: ${projeto.steps.map(s => `"${s.description}"`).join(", ")}`;
      
      // Log the interaction for Athena
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

  // Compact variant for kanban view
  if (variant === "compact") {
    return (
      <motion.div
        className={`rounded-xl bg-[#141429]/90 border ${projeto.is_favorite ? 'border-[#993887]' : 'border-[#191933]'} shadow-lg p-4 flex flex-col gap-2 hover:border-[#60B5B5] transition-all cursor-grab ${isDragging ? 'opacity-50 cursor-grabbing' : ''}`}
        whileHover={{ scale: 1.02, boxShadow: "0 0 8px #60B5B5, 0 0 40px #99388722" }}
        transition={{ duration: 0.2 }}
        onClick={() => onVerDetalhes && onVerDetalhes(projeto)}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold text-primary drop-shadow-sm line-clamp-1">{projeto.name}</h3>
          {projeto.is_favorite && <Star className="w-3 h-3 text-[#993887] fill-[#993887]" />}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <Progress 
            value={projeto.progress} 
            className="w-[70%] h-2 bg-[#191933] rounded-full" 
          />
          <span className="text-xs text-[#E6E6F0]/70">{projeto.progress}%</span>
        </div>
        
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
  
  // Default full card
  return (
    <motion.div
      className={`rounded-2xl bg-[#141429]/90 border ${projeto.is_favorite ? 'border-[#993887]' : 'border-[#191933]'} shadow-xl p-6 flex flex-col gap-3 relative neon-anim hover:scale-[1.025] hover:border-[#60B5B5] transition-transform cursor-pointer group`}
      whileHover={{ scale: 1.025, boxShadow: "0 0 8px #60B5B5, 0 0 40px #99388722" }}
      transition={{ duration: 0.23 }}
      onClick={() => onVerDetalhes && onVerDetalhes(projeto)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary drop-shadow-sm">{projeto.name}</span>
          {projeto.is_favorite && <Star className="w-4 h-4 text-[#993887] fill-[#993887]" />}
        </div>
        <StatusTag status={projeto.status} />
      </div>
      
      <div className="flex gap-2 flex-wrap mt-1">
        {projeto.category && (
          <TagProjeto key={`category-${projeto.category}`} variant="primary">{projeto.category}</TagProjeto>
        )}
        {projeto.tags && projeto.tags.map((tag) => (
          <TagProjeto key={`tag-${tag}`} variant="secondary">{tag}</TagProjeto>
        ))}
      </div>
      
      <div className="flex items-center gap-3 mt-2">
        <Progress 
          value={projeto.progress} 
          className="w-[70%] h-3 bg-[#191933] rounded-full" 
        />
        <span className="text-xs text-[#E6E6F0]/70">{projeto.progress}%</span>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <Button 
          onClick={() => onVerDetalhes && onVerDetalhes(projeto)} 
          size="sm" 
          variant="outline" 
          className="group/button text-xs flex items-center gap-1 border-primary/50 shadow-glow transition hover:bg-primary/90 hover:text-[#0C0C1C]"
        >
          Ver detalhes <ArrowRight className="w-4 h-4" />
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
            className="text-primary hover:bg-primary/10 h-8 w-8" 
            title="Sugerir nova etapa"
            onClick={handleSugerirEtapa}
          >
            <span className="sr-only">Sugerir nova etapa</span>
            <Bot className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
