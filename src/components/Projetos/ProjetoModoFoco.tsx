
import React, { useState, useEffect } from 'react';
import { ProjectWithSteps } from '@/services/projectsService';
import { Button } from '@/components/ui/button';
import { X, MinusCircle, Minimize2, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

type Props = {
  projeto: ProjectWithSteps;
  onClose: () => void;
  onToggleEtapa?: (etapaId: string, feita: boolean) => Promise<boolean>;
};

export function ProjetoModoFoco({ projeto, onClose, onToggleEtapa }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen, onClose]);
  
  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (error) {
        console.error("Couldn't enter fullscreen mode:", error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      } catch (error) {
        console.error("Couldn't exit fullscreen mode:", error);
      }
    }
  };
  
  // Handle step toggle
  const handleToggleEtapa = async (etapaId: string, feita: boolean) => {
    if (onToggleEtapa) {
      await onToggleEtapa(etapaId, feita);
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-[#0C0C1C] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-[#191933]/50">
        <Button 
          variant="ghost" 
          className="text-primary flex items-center gap-2"
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4" />
          Sair do Modo Foco
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{projeto.name}</h1>
          {projeto.description && (
            <p className="text-secondary/80 mb-8 text-lg">{projeto.description}</p>
          )}
          
          {/* Progress */}
          <div className="mb-8 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary font-medium">Progresso</span>
              <span className="text-primary/60">{projeto.progress}%</span>
            </div>
            <Progress value={projeto.progress} className="h-3 bg-[#191933]" />
          </div>
          
          {/* Etapas */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-primary mb-4">Etapas do Projeto</h2>
            <div className="space-y-3">
              {projeto.steps && projeto.steps.length > 0 ? (
                projeto.steps.map((etapa) => (
                  <div key={etapa.id} className={`flex items-center gap-3 p-4 rounded-lg transition ${etapa.done ? "bg-[#60B5B522]" : "bg-[#191933]/40"}`}>
                    <label className="flex items-center gap-3 cursor-pointer flex-grow text-lg">
                      <input 
                        type="checkbox" 
                        checked={etapa.done} 
                        onChange={() => handleToggleEtapa(etapa.id, !etapa.done)} 
                        className="accent-[#60B5B5] w-5 h-5" 
                      />
                      <span className={etapa.done ? "line-through text-secondary/70" : ""}>
                        {etapa.description}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-secondary/70 italic p-2">Nenhuma etapa definida.</div>
              )}
            </div>
          </div>
          
          {/* Conteúdo */}
          {projeto.content && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-primary mb-4">Conteúdo / Anotações</h2>
              <div className="bg-[#191933]/60 p-6 rounded-lg text-foreground/90 whitespace-pre-wrap">
                {projeto.content}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="p-4 text-center text-secondary/60 text-sm">
        "O CÓRTEX não exibe projetos. Ele manifesta células vivas que evoluem com você."
      </footer>
    </motion.div>
  );
}
