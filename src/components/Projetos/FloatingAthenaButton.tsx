
import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAthenaLog } from "@/utils/athenaUtils";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

type Props = {
  onClick?: () => void;
  onAthenaAction?: (action: string) => void;
};

export function FloatingAthenaButton({ onClick, onAthenaAction }: Props) {
  const location = useLocation();
  
  // Não mostrar o botão na página do Connecta para evitar conflito
  if (location.pathname === '/connecta') {
    return null;
  }

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    // If no click handler is provided, create a default interaction with Athena
    const prompt = "Quais são as melhores práticas para gerenciar projetos no CÓRTEX?";
    
    await saveAthenaLog(
      prompt,
      "Solicitação recebida. Abra Athena para visualizar a resposta completa.",
      "geral"
    );
    
    toast({
      title: "Athena ativada",
      description: "Abra o assistente Athena para ver sua resposta",
    });
    
    if (onAthenaAction) {
      onAthenaAction("open_chat");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 0.5 
      }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Button
        className="rounded-full h-14 w-14 bg-gradient-to-br from-secondary to-primary text-white shadow-[0_0_20px_rgba(153,56,135,0.3)] pulse-anim"
        onClick={handleClick}
        title="Falar com a Athena"
      >
        <Bot className="w-6 h-6" />
        <span className="sr-only">Falar com a Athena</span>
        
        {/* Decorative rings */}
        <span className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20" />
        <span className="absolute inset-[-4px] rounded-full border border-white/10" />
      </Button>
    </motion.div>
  );
}
