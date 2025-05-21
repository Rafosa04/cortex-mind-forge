
import React, { useEffect, useState } from "react";
import { ProjectWithSteps } from "@/services/projectsService";
import { ProjetoCard } from "./ProjetoCard";
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay,
  DragStartEvent,
  MouseSensor, 
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface KanbanViewProps {
  projetos: ProjectWithSteps[];
  onVerDetalhes: (projeto: ProjectWithSteps) => void;
  onRemoveProjeto: (projetoId: string) => Promise<boolean>;
  onToggleFavorite: (projetoId: string, isFavorite: boolean) => Promise<boolean>;
  onSugerirEtapa: (projeto: ProjectWithSteps) => void;
  onUpdateStatus: (projetoId: string, status: "ativo" | "pausado" | "concluído") => Promise<boolean>;
  loading: boolean;
}

export function KanbanView({
  projetos,
  onVerDetalhes,
  onRemoveProjeto,
  onToggleFavorite,
  onSugerirEtapa,
  onUpdateStatus,
  loading
}: KanbanViewProps) {
  const [activeProject, setActiveProject] = useState<ProjectWithSteps | null>(null);
  const [updatingProjects, setUpdatingProjects] = useState<string[]>([]);
  
  // Configure DnD sensors to handle both mouse and touch interactions
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // Group projects by status
  const getProjetosPorStatus = (status: string) => {
    return projetos.filter(p => p.status === status);
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedProject = projetos.find(p => p.id === active.id);
    
    if (draggedProject) {
      setActiveProject(draggedProject);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveProject(null);
      return;
    }
    
    // If the drop target is one of our status columns
    if (over.id === 'ativo' || over.id === 'pausado' || over.id === 'concluído') {
      const projectId = active.id as string;
      const newStatus = over.id as "ativo" | "pausado" | "concluído";
      
      const draggedProject = projetos.find(p => p.id === projectId);
      if (!draggedProject || draggedProject.status === newStatus) {
        setActiveProject(null);
        return;
      }
      
      // Add to updating projects to show loading indicator
      setUpdatingProjects(prev => [...prev, projectId]);
      
      try {
        const success = await onUpdateStatus(projectId, newStatus);
        if (success) {
          toast({
            title: "Status atualizado",
            description: `Projeto movido para ${newStatus}`
          });
        }
      } catch (error) {
        console.error("Error updating project status:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status do projeto",
          variant: "destructive"
        });
      } finally {
        // Remove from updating projects
        setUpdatingProjects(prev => prev.filter(id => id !== projectId));
        setActiveProject(null);
      }
    }
  };
  
  const statusColumns = [
    { id: "ativo", title: "Ativos" },
    { id: "pausado", title: "Pausados" },
    { id: "concluído", title: "Concluídos" }
  ];

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-1 fade-in min-h-[350px] overflow-x-auto pb-4">
        {statusColumns.map((column) => (
          <motion.div 
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 min-w-[250px] bg-[#191933]/70 rounded-xl p-4"
            id={column.id}
          >
            <div className="font-bold text-secondary mb-3 capitalize">{column.title}</div>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-32 w-full bg-[#141429]/90 rounded-xl animate-pulse"></div>
                <div className="h-32 w-full bg-[#141429]/90 rounded-xl animate-pulse"></div>
              </div>
            ) : getProjetosPorStatus(column.id).length === 0 ? (
              <div className="text-secondary/60 italic">Sem projetos neste status.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {getProjetosPorStatus(column.id).map((projeto) => (
                  <div key={projeto.id} className="relative" id={projeto.id}>
                    <ProjetoCard
                      projeto={projeto}
                      onVerDetalhes={onVerDetalhes}
                      onRemoveProjeto={onRemoveProjeto}
                      onToggleFavorite={onToggleFavorite}
                      onSugerirEtapa={onSugerirEtapa}
                      draggable
                    />
                    {updatingProjects.includes(projeto.id) && (
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Loader className="animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <DragOverlay>
        {activeProject ? (
          <div className="opacity-80 transform scale-105 shadow-xl">
            <ProjetoCard
              projeto={activeProject}
              onVerDetalhes={() => {}}
              onRemoveProjeto={() => Promise.resolve(false)}
              onToggleFavorite={() => Promise.resolve(false)}
              onSugerirEtapa={() => {}}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
