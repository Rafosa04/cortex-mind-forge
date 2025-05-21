
import React from "react";
import { ProjectWithSteps } from "@/services/projectsService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";
import { StatusTag } from "./StatusTag";
import { motion } from "framer-motion";

type VisaoLinhaTempoProps = {
  projetos: ProjectWithSteps[];
  loading: boolean;
  onVerDetalhes: (projeto: ProjectWithSteps) => void;
};

export function VisaoLinhaTempo({ projetos, loading, onVerDetalhes }: VisaoLinhaTempoProps) {
  // Group projects by month
  const projetosPorMes = React.useMemo(() => {
    const grupos: Record<string, ProjectWithSteps[]> = {};
    
    projetos.forEach(projeto => {
      const data = projeto.created_at;
      if (!data) return;
      
      const mesAno = format(new Date(data), 'MMMM yyyy', { locale: ptBR });
      if (!grupos[mesAno]) {
        grupos[mesAno] = [];
      }
      
      grupos[mesAno].push(projeto);
    });
    
    // Sort by date (newest first)
    return Object.entries(grupos).sort((a, b) => {
      const dataA = new Date(a[1][0].created_at || "");
      const dataB = new Date(b[1][0].created_at || "");
      return dataB.getTime() - dataA.getTime();
    });
  }, [projetos]);

  if (loading) {
    return (
      <div className="space-y-10 mt-4 w-full max-w-3xl mx-auto">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-40 bg-[#191933]/80 rounded-lg animate-pulse"></div>
            <div className="h-32 w-full bg-[#191933]/60 rounded-xl animate-pulse"></div>
            <div className="h-32 w-full bg-[#191933]/60 rounded-xl animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (projetos.length === 0) {
    return (
      <div className="text-center py-10 text-secondary/70">
        Nenhum projeto encontrado para mostrar na linha do tempo.
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-4 w-full max-w-3xl mx-auto">
      {projetosPorMes.map(([mesAno, projetosDoMes], groupIndex) => (
        <motion.div 
          key={mesAno}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-gradient capitalize pl-2 border-l-4 border-primary/70">
            {mesAno}
          </h3>
          
          <div className="relative border-l-2 border-dashed border-[#60B5B5]/30 ml-3 pl-6 space-y-6">
            {projetosDoMes.map((projeto, index) => (
              <motion.div
                key={projeto.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (groupIndex * 0.1) + (index * 0.05), duration: 0.3 }}
                className="relative"
              >
                <div className="absolute w-4 h-4 rounded-full bg-primary left-[-38px] top-5 shadow-[0_0_8px_rgba(96,181,181,0.6)]"></div>
                <Card animate={false} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-lg font-bold text-primary">{projeto.name}</div>
                        <div className="flex items-center text-xs text-secondary/70 mt-1">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {projeto.created_at && format(new Date(projeto.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusTag status={projeto.status} />
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => onVerDetalhes(projeto)}>
                          Detalhes <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                    {projeto.description && (
                      <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {projeto.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
