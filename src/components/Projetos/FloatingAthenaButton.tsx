
import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
};

export function FloatingAthenaButton({ onClick }: Props) {
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
        onClick={onClick}
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
