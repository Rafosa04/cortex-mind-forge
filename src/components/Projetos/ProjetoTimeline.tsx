
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, CheckCircle2, Circle, PauseCircle } from "lucide-react";
import { ProjectWithSteps } from "@/services/projectsService";
import { motion } from "framer-motion";

interface ProjetoTimelineProps {
  projetos: ProjectWithSteps[];
  onVerDetalhes?: (projeto: ProjectWithSteps) => void;
}

export function ProjetoTimeline({ projetos, onVerDetalhes }: ProjetoTimelineProps) {
  // Group projects by creation month
  const projetosPorMes = projetos.reduce((acc, projeto) => {
    const date = new Date(projeto.created_at);
    const monthYear = format(date, 'MMMM yyyy', { locale: ptBR });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(projeto);
    return acc;
  }, {} as Record<string, ProjectWithSteps[]>);

  // Sort months chronologically
  const mesesOrdenados = Object.keys(projetosPorMes).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'concluído': 
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pausado':
        return <PauseCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-blue-500" />;
    }
  };

  if (projetos.length === 0) {
    return (
      <div className="rounded-xl bg-[#191933]/60 p-6 sm:p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
        <span className="text-xl">Nenhum projeto para exibir</span>
        <div className="mt-4 text-base">
          Crie sua primeira célula usando o botão 'Nova Célula'.
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-container space-y-8 px-2 py-4 fade-in">
      {mesesOrdenados.map(mes => (
        <div key={mes} className="month-group">
          <motion.h3 
            className="text-lg font-bold text-secondary mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Calendar className="w-5 h-5 text-[#993887]" />
            <span className="capitalize">{mes}</span>
          </motion.h3>
          
          <div className="projects-timeline relative border-l-2 border-[#993887]/30 pl-6 ml-2 space-y-6">
            {projetosPorMes[mes].map((projeto, index) => {
              const createdDate = new Date(projeto.created_at);
              
              return (
                <motion.div 
                  key={projeto.id}
                  className="timeline-item relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => onVerDetalhes && onVerDetalhes(projeto)}
                >
                  {/* Circle marker on the timeline */}
                  <div className="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-[#993887]"></div>
                  
                  <div className="rounded-xl bg-[#141429]/90 border border-[#191933] hover:border-[#60B5B5] p-4 cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-primary">{projeto.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(projeto.status)}
                        <span className="text-xs capitalize text-secondary/80">{projeto.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-secondary/70 mb-3">
                      <Clock className="w-3 h-3 mr-1" /> 
                      {format(createdDate, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </div>
                    
                    {projeto.description && (
                      <p className="text-sm text-secondary/80 mb-3 line-clamp-2">
                        {projeto.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2">
                        {projeto.tags && projeto.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-[#191933] text-xs rounded-full text-secondary/80">
                            {tag}
                          </span>
                        ))}
                        {projeto.tags && projeto.tags.length > 2 && (
                          <span className="px-2 py-1 bg-[#191933] text-xs rounded-full text-secondary/80">
                            +{projeto.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-bold text-primary">{projeto.progress}%</span>
                        <span className="text-secondary/60">concluído</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
