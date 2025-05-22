
import React from "react";
import { ProjectWithSteps } from "@/services/projectsService";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Star, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProjetoGaleriaProps {
  projetos: ProjectWithSteps[];
  onVerDetalhes?: (projeto: ProjectWithSteps) => void;
  onToggleFavorite?: (projetoId: string, isFavorite: boolean) => Promise<boolean>;
}

export function ProjetoGaleria({ 
  projetos, 
  onVerDetalhes, 
  onToggleFavorite 
}: ProjetoGaleriaProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 fade-in">
      {projetos.map((projeto) => (
        <motion.div
          key={projeto.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <Card animate className="h-full flex flex-col overflow-hidden group hover:border-[#60B5B5]/60 transition-all">
            <div 
              className="h-40 bg-gradient-to-br from-[#141429] to-[#993887]/40 overflow-hidden flex items-center justify-center relative"
              onClick={() => onVerDetalhes && onVerDetalhes(projeto)}
            >
              {/* Cover representation based on project name */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#191933]/60 text-[80px] font-bold text-white/10">
                {projeto.name.charAt(0)}
              </div>
              
              {/* Overlay with preview text */}
              <div className="absolute inset-0 bg-[#141429]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-primary border-[#60B5B5]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerDetalhes && onVerDetalhes(projeto);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" /> Visualizar
                </Button>
              </div>
              
              {/* Favorite button */}
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-[#141429]/50 hover:bg-[#141429]/70 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(projeto.id, !projeto.is_favorite);
                  }}
                >
                  <Star
                    className={`w-4 h-4 ${projeto.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-secondary/50"}`}
                  />
                </Button>
              )}
              
              {/* Status indicator */}
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs bg-[#141429]/70 text-secondary/90 capitalize">
                {projeto.status}
              </div>
            </div>
            
            <CardContent className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-primary mb-1 line-clamp-1">{projeto.name}</h3>
              
              <div className="text-xs text-secondary/70 flex items-center mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(projeto.created_at), "d MMM yyyy", { locale: ptBR })}
              </div>
              
              {projeto.description && (
                <p className="text-sm text-secondary/80 line-clamp-2 mb-3">
                  {projeto.description}
                </p>
              )}
              
              <div className="mt-auto">
                {/* Progress bar */}
                <div className="w-full bg-[#191933] h-1.5 rounded-full overflow-hidden mb-1">
                  <div 
                    className="bg-[#60B5B5] h-full rounded-full" 
                    style={{ width: `${projeto.progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-secondary/60">Progresso</span>
                  <span className="font-medium text-primary">{projeto.progress}%</span>
                </div>
                
                {/* Tags */}
                {projeto.tags && projeto.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {projeto.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-[#191933] text-xs rounded-full text-secondary/70">
                        {tag}
                      </span>
                    ))}
                    {projeto.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-[#191933] text-xs rounded-full text-secondary/70">
                        +{projeto.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
