
import React, { useState, useRef, useEffect } from "react";
import { Bot, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { saveAthenaLog } from "@/utils/athenaUtils";
import { useNavigate } from "react-router-dom";

interface AthenaCommandBarProps {
  onCommand?: (command: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export function AthenaCommandBar({ onCommand, onSearch, className = "" }: AthenaCommandBarProps) {
  const [input, setInput] = useState("");
  const [isAthenaMode, setIsAthenaMode] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const athenaSuggestions = [
    "Crie uma célula para organizar meu projeto de estudos",
    "Sugira próximos passos para projetos ativos",
    "Conecte este projeto ao Subcérebro de Produtividade",
    "Analise projetos que precisam de atenção",
    "Categorize projetos por urgência",
  ];

  useEffect(() => {
    if (isAthenaMode) {
      setSuggestions(athenaSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [isAthenaMode]);

  const handleInputChange = (value: string) => {
    setInput(value);
    
    if (value.startsWith("@athena") || value.startsWith("@Athena")) {
      setIsAthenaMode(true);
    } else {
      setIsAthenaMode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    if (isAthenaMode || input.startsWith("@athena") || input.startsWith("@Athena")) {
      // Comando da Athena
      const command = input.replace(/@athena\s*/i, "").trim();
      
      await saveAthenaLog(
        command,
        "Comando recebido. Processando solicitação...",
        "projeto"
      );
      
      toast({
        title: "Athena ativada",
        description: "Comando enviado. Abra o chat da Athena para ver a resposta.",
      });
      
      if (onCommand) {
        onCommand(command);
      }
      
      // Navegar para Athena com contexto
      navigate(`/athena?command=${encodeURIComponent(command)}`);
    } else {
      // Busca normal
      if (onSearch) {
        onSearch(input);
      }
    }
    
    setInput("");
    setIsAthenaMode(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(`@Athena ${suggestion}`);
    setIsAthenaMode(true);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center gap-2">
            {isAthenaMode ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1"
              >
                <Bot className="w-4 h-4 text-[#993887]" />
                <Sparkles className="w-3 h-3 text-[#60B5B5] animate-pulse" />
              </motion.div>
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              isAthenaMode 
                ? "Digite um comando para a Athena..." 
                : "Buscar projetos ou digite @Athena para comandos de IA..."
            }
            className={`pl-12 pr-16 h-12 bg-[#191933]/70 border ${
              isAthenaMode 
                ? "border-[#993887]/60 ring-1 ring-[#993887]/30" 
                : "border-[#60B5B5]/40"
            } transition-all duration-200`}
          />
          
          <Button
            type="submit"
            size="sm"
            className={`absolute right-2 ${
              isAthenaMode 
                ? "bg-gradient-to-r from-[#993887] to-[#60B5B5] hover:from-[#993887]/80 hover:to-[#60B5B5]/80" 
                : "bg-[#60B5B5] hover:bg-[#60B5B5]/80"
            }`}
            disabled={!input.trim()}
          >
            {isAthenaMode ? <Bot className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {suggestions.length > 0 && input.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#191933] border border-[#993887]/40 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-[#993887]/20">
              <div className="flex items-center gap-2 text-sm text-[#993887] font-medium">
                <Bot className="w-4 h-4" />
                Comandos sugeridos da Athena
              </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#993887]/10 hover:text-white transition-colors border-b border-[#993887]/10 last:border-0"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
