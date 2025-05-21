
import React from "react";
import { ArrowRight, Bot, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { StatusTag } from "./StatusTag";
import { TagProjeto } from "./TagProjeto";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProjectWithSteps } from "@/services/projectsService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  projeto: ProjectWithSteps;
  onVerDetalhes?: () => void;
};

export function ProjetoCard({ projeto, onVerDetalhes }: Props) {
  const completedSteps = projeto.steps?.filter(step => step.done)?.length || 0;
  const totalSteps = projeto.steps?.length || 0;
  
  // Format deadline if it exists
  const formattedDeadline = projeto.deadline 
    ? format(new Date(projeto.deadline), "dd/MM/yyyy", { locale: ptBR })
    : null;
    
  // Check if the project is marked as favorite
  const isFavorite = projeto.is_favorite || false;

  return (
    <motion.div
      className="rounded-2xl bg-[#141429]/90 border border-[#191933] shadow-xl p-6 flex flex-col gap-3 relative hover:border-[#60B5B5] transition-all duration-300 cursor-pointer group"
      whileHover={{ scale: 1.025, boxShadow: "0 0 15px #60B5B530, 0 0 40px #99388730" }}
      transition={{ duration: 0.23 }}
      onClick={onVerDetalhes}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="text-lg font-bold text-primary drop-shadow-sm line-clamp-1">{projeto.name}</span>
          {projeto.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{projeto.description}</p>
          )}
        </div>
        <StatusTag status={projeto.status} />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-1">
        {projeto.category && (
          <TagProjeto key={projeto.category}>{projeto.category}</TagProjeto>
        )}
        
        {formattedDeadline && (
          <div className="inline-flex items-center gap-1 bg-[#191933]/80 text-xs px-2 py-1 rounded-full">
            <Calendar className="w-3 h-3 text-[#60B5B5]" />
            <span>{formattedDeadline}</span>
          </div>
        )}
        
        {isFavorite && (
          <div className="inline-flex items-center gap-1 bg-yellow-700/30 text-yellow-400/90 text-xs px-2 py-1 rounded-full">
            <span className="text-[10px]">★</span>
            <span>Favorito</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex items-center justify-between gap-3">
          <Progress value={projeto.progress} className="w-full h-2.5 bg-[#191933] rounded-full" />
          <span className="text-xs text-[#E6E6F0]/70 min-w-[30px] text-right">{projeto.progress}%</span>
        </div>
        
        {totalSteps > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3 h-3 text-primary/70" />
            <span>{completedSteps}/{totalSteps} etapas</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex items-center gap-1 border-primary/50 shadow-glow transition hover:bg-primary/90 hover:text-[#0C0C1C] group-hover:border-primary"
          onClick={(e) => {
            e.stopPropagation();
            onVerDetalhes?.();
          }}
        >
          Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/20 border border-primary/40 w-7 h-7 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>
      
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(96,181,181,0.07) 0%, transparent 70%)',
          boxShadow: 'inset 0 0 20px rgba(96,181,181,0.1)'
        }}
      />
    </motion.div>
  );
}
