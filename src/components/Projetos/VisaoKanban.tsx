
import React from "react";
import { ProjectWithSteps } from "@/services/projectsService";
import { ProjetoCard } from "./ProjetoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type VisaoKanbanProps = {
  projetos: ProjectWithSteps[];
  loading: boolean;
  onVerDetalhes: (projeto: ProjectWithSteps) => void;
};

export function VisaoKanban({ projetos, loading, onVerDetalhes }: VisaoKanbanProps) {
  const getProjetosPorStatus = (status: string) => {
    return projetos.filter(p => p.status === status);
  };

  const renderLoaderCards = () => (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full bg-[#141429]/90" />
      <Skeleton className="h-32 w-full bg-[#141429]/90" />
    </div>
  );

  // Create animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-1 fade-in min-h-[350px] overflow-x-auto pb-4">
      {["ativo", "pausado", "concluído"].map((status) => (
        <motion.div 
          key={status} 
          className="flex-1 min-w-[250px] bg-[#191933]/70 backdrop-blur-md rounded-xl p-4 border border-white/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-bold text-secondary mb-3 capitalize">{status}</div>
          
          {loading ? (
            renderLoaderCards()
          ) : getProjetosPorStatus(status).length === 0 ? (
            <div className="text-secondary/60 italic">Sem projetos neste status.</div>
          ) : (
            <motion.div 
              className="flex flex-col gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getProjetosPorStatus(status).map((projeto) => (
                <motion.div key={projeto.id} variants={itemVariants}>
                  <ProjetoCard
                    projeto={projeto}
                    onVerDetalhes={() => onVerDetalhes(projeto)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
