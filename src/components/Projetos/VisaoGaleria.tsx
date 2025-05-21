
import React from "react";
import { ProjectWithSteps } from "@/services/projectsService";
import { Button } from "@/components/ui/button";
import { StatusTag } from "./StatusTag";
import { TagProjeto } from "./TagProjeto";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type VisaoGaleriaProps = {
  projetos: ProjectWithSteps[];
  loading: boolean;
  onVerDetalhes: (projeto: ProjectWithSteps) => void;
};

export function VisaoGaleria({ projetos, loading, onVerDetalhes }: VisaoGaleriaProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-2xl bg-[#141429]/90 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (projetos.length === 0) {
    return (
      <div className="text-center py-10 text-secondary/70">
        Nenhum projeto encontrado para mostrar na galeria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
      {projetos.map((projeto, index) => (
        <motion.div
          key={projeto.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(20,20,41,0.8) 0%, rgba(25,25,51,0.9) 100%)`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
          onClick={() => onVerDetalhes(projeto)}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>
          
          {/* Top Content */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
            <StatusTag status={projeto.status} />
            <div className="text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white/80 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {projeto.created_at ? format(new Date(projeto.created_at), "dd/MM/yyyy", { locale: ptBR }) : "Sem data"}
            </div>
          </div>
          
          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-300 group-hover:translate-y-0">
            <h3 className="font-bold text-lg text-white mb-1.5 line-clamp-1">{projeto.name}</h3>
            
            <div className="flex gap-2 flex-wrap">
              {projeto.category && (
                <TagProjeto key={projeto.category}>{projeto.category}</TagProjeto>
              )}
            </div>
            
            <div className="mt-3 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <Progress value={projeto.progress} className="h-2 w-full bg-black/50" />
              <span className="text-xs text-white/70">{projeto.progress}%</span>
            </div>
            
            {/* Hover Overlay with Button */}
            <div className="mt-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              >
                Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              
              <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center shadow ring-2 ring-primary/60">
                <Bot className="w-4 h-4 text-background" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
