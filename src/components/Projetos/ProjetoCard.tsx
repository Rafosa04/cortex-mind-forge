
// Use an import statement here to import the necessary components
// from other files in the project
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProjectWithSteps } from "@/services/projectsService";
import { Bot, Trash2, Star } from "lucide-react";
import { TagProjeto } from "./TagProjeto";
import { StatusTag } from "./StatusTag";
import { useDraggable } from "@dnd-kit/core";

type ProjetoStatus = "ativo" | "pausado" | "concluído";

type ProjetoCardProps = {
  projeto: ProjectWithSteps;
  onVerDetalhes: (projeto: ProjectWithSteps) => void;
  onRemoveProjeto: (projetoId: string) => Promise<boolean>;
  onToggleFavorite: (projetoId: string, isFavorite: boolean) => Promise<boolean>;
  onSugerirEtapa: (projeto: ProjectWithSteps) => void;
  draggable?: boolean;
  isDragging?: boolean;
};

export function ProjetoCard({
  projeto,
  onVerDetalhes,
  onRemoveProjeto,
  onToggleFavorite,
  onSugerirEtapa,
  draggable = false,
  isDragging = false
}: ProjetoCardProps) {
  // Set up draggable functionality if draggable is true
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: projeto.id,
    disabled: !draggable
  });

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja remover o projeto "${projeto.name}"?`)) {
      await onRemoveProjeto(projeto.id);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleFavorite(projeto.id, !projeto.is_favorite);
  };

  const handleSugerirEtapa = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSugerirEtapa(projeto);
  };

  // Calculate if project has any completed steps
  const hasCompletedSteps = projeto.steps && projeto.steps.some(step => step.done);
  const completedStepsCount = projeto.steps ? projeto.steps.filter(step => step.done).length : 0;
  const totalStepsCount = projeto.steps ? projeto.steps.length : 0;
  
  // Style for draggable element
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 999 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 8px 20px rgba(0, 0, 0, 0.3)' : undefined,
  } : undefined;

  // Make sure projeto.status is properly typed
  const projectStatus = (projeto.status || "ativo") as ProjetoStatus;

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      style={style}
      {...(draggable ? { ...attributes, ...listeners } : {})}
      className={draggable ? "touch-manipulation" : ""}
    >
      <Card 
        onClick={() => onVerDetalhes(projeto)}
        className={`cursor-pointer bg-[#141429]/90 border-[#191933] hover:border-[#60B5B5]/40 ${isDragging ? 'scale-105' : ''}`}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg font-bold text-primary line-clamp-1">{projeto.name}</CardTitle>
            <button onClick={handleToggleFavorite} className="focus:outline-none">
              <Star 
                className={`w-5 h-5 ${projeto.is_favorite ? "fill-[#993887] text-[#993887]" : "text-gray-400"} transition-colors duration-300`}
              />
            </button>
          </div>
          
          {projeto.description && (
            <CardDescription className="text-sm text-secondary/80 line-clamp-2 h-10">
              {projeto.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          {/* Tags */}
          {projeto.tags && projeto.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {projeto.tags.slice(0, 3).map((tag) => (
                <TagProjeto key={tag}>{tag}</TagProjeto>
              ))}
              {projeto.tags.length > 3 && (
                <span className="text-xs text-secondary/70">+{projeto.tags.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Status and Progress */}
          <div className="flex justify-between items-center mb-3">
            <StatusTag status={projectStatus} />
            
            <div className="text-xs text-secondary/80">
              {totalStepsCount > 0 ? (
                <span>{completedStepsCount}/{totalStepsCount} etapas</span>
              ) : (
                <span>Sem etapas</span>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <Progress value={projeto.progress} className="h-1.5 mb-3" />
          
          {/* Actions */}
          <div className="flex justify-between items-center mt-3">
            <Button 
              size="sm"
              variant="ghost" 
              className="text-xs px-2 py-1 h-7 hover:bg-[#60B5B5]/10 hover:text-primary border border-transparent hover:border-[#60B5B5]/20"
              onClick={(e) => {
                e.stopPropagation();
                onVerDetalhes(projeto);
              }}
            >
              Ver detalhes
            </Button>
            
            <div className="flex gap-1">
              <Button 
                size="icon"
                variant="ghost" 
                className="h-7 w-7 hover:bg-[#993887]/10 hover:text-[#993887]"
                onClick={handleSugerirEtapa}
              >
                <Bot className="h-4 w-4" />
              </Button>
              
              <Button 
                size="icon"
                variant="ghost" 
                className="h-7 w-7 hover:bg-red-500/10 hover:text-red-400"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
