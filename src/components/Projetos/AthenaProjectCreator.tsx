
import React, { useState } from "react";
import { Bot, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface AthenaProjectCreatorProps {
  onProjectSuggestion?: (suggestion: {
    nome: string;
    descricao: string;
    categoria?: string;
    tags: string[];
    etapas: { texto: string; feita: boolean }[];
  }) => void;
}

export function AthenaProjectCreator({ onProjectSuggestion }: AthenaProjectCreatorProps) {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Descrição necessária",
        description: "Descreva sua ideia para que a Athena possa ajudar",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation (in real implementation, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate project suggestion based on description
      const suggestion = generateProjectSuggestion(description);
      
      if (onProjectSuggestion) {
        onProjectSuggestion(suggestion);
      }
      
      toast({
        title: "Projeto sugerido pela Athena",
        description: "Revise e ajuste a sugestão conforme necessário",
      });
      
      setShowForm(false);
      setDescription("");
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar sugestão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProjectSuggestion = (desc: string) => {
    // Simple AI simulation based on keywords
    const lowerDesc = desc.toLowerCase();
    
    let categoria = "geral";
    let tags: string[] = [];
    let etapas: { texto: string; feita: boolean }[] = [];
    
    // Determine category and tags based on keywords
    if (lowerDesc.includes("estudo") || lowerDesc.includes("aprender")) {
      categoria = "educação";
      tags = ["aprendizado", "desenvolvimento"];
      etapas = [
        { texto: "Definir objetivos de aprendizado", feita: false },
        { texto: "Criar cronograma de estudos", feita: false },
        { texto: "Selecionar recursos e materiais", feita: false },
        { texto: "Estabelecer marcos de progresso", feita: false }
      ];
    } else if (lowerDesc.includes("trabalho") || lowerDesc.includes("profissional")) {
      categoria = "trabalho";
      tags = ["profissional", "carreira"];
      etapas = [
        { texto: "Definir escopo do projeto", feita: false },
        { texto: "Identificar stakeholders", feita: false },
        { texto: "Criar plano de execução", feita: false },
        { texto: "Estabelecer métricas de sucesso", feita: false }
      ];
    } else if (lowerDesc.includes("casa") || lowerDesc.includes("pessoal")) {
      categoria = "pessoal";
      tags = ["casa", "vida pessoal"];
      etapas = [
        { texto: "Listar tarefas necessárias", feita: false },
        { texto: "Priorizar por urgência", feita: false },
        { texto: "Definir cronograma", feita: false },
        { texto: "Executar e acompanhar progresso", feita: false }
      ];
    } else {
      etapas = [
        { texto: "Pesquisar e planejar", feita: false },
        { texto: "Definir próximos passos", feita: false },
        { texto: "Executar primeira fase", feita: false },
        { texto: "Revisar e ajustar", feita: false }
      ];
    }
    
    return {
      nome: desc.slice(0, 50) + (desc.length > 50 ? "..." : ""),
      descricao: `Projeto gerado pela Athena com base na descrição: "${desc}"`,
      categoria,
      tags,
      etapas
    };
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="w-full border-[#993887]/40 text-[#993887] hover:bg-[#993887]/10"
        >
          <Bot className="w-4 h-4 mr-2" />
          <Sparkles className="w-4 h-4 mr-2" />
          Criar Projeto com Athena
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 border border-[#993887]/40 rounded-lg p-4 bg-[#993887]/5"
          >
            <div className="flex items-center gap-2 text-[#993887] font-medium">
              <Bot className="w-5 h-5" />
              Athena - Criador de Projetos
            </div>
            
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva sua ideia de projeto... Ex: 'Quero organizar meus estudos de programação' ou 'Preciso renovar minha casa'"
              rows={3}
              className="resize-none bg-background/50"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
                className="flex-1 bg-[#993887] hover:bg-[#993887]/80"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Projeto
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  setShowForm(false);
                  setDescription("");
                }}
                variant="outline"
                disabled={isGenerating}
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
