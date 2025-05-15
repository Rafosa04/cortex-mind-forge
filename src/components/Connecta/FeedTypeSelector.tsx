
import { useState } from "react";
import { motion } from "framer-motion";

interface FeedTypeSelectorProps {
  activeType: string;
  onChange: (type: string) => void;
}

export default function FeedTypeSelector({ activeType, onChange }: FeedTypeSelectorProps) {
  const feedTypes = [
    { id: "all", label: "Todos" },
    { id: "clarity", label: "Clareza", description: "Conteúdos para foco" },
    { id: "expansion", label: "Expansão", description: "Descoberta e curiosidade" },
    { id: "reflection", label: "Espelho", description: "Reflexão pessoal" }
  ];

  const [isOpen, setIsOpen] = useState(false);
  
  const currentType = feedTypes.find(type => type.id === activeType) || feedTypes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/40 bg-background/50 hover:bg-card/40 transition-colors"
      >
        <span className="text-xs font-medium">Feed:</span>
        <span className="text-xs text-primary">{currentType.label}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-1 right-0 w-48 bg-card border border-border rounded-md shadow-lg z-10"
        >
          {feedTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                onChange(type.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-background/70 ${
                activeType === type.id ? "bg-background/50 text-primary" : "text-foreground"
              }`}
            >
              <div className="font-medium">{type.label}</div>
              {type.description && (
                <div className="text-[10px] text-foreground/60 mt-0.5">{type.description}</div>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
