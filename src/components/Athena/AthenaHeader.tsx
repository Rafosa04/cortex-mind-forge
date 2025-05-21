
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface AthenaHeaderProps {
  clearHistory: () => void;
}

const AthenaHeader: React.FC<AthenaHeaderProps> = ({ clearHistory }) => {
  return (
    <div className="p-3 pb-2 flex items-center justify-between bg-card/90 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarFallback className="text-sm font-semibold text-primary-foreground">🧠</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-sm">Athena IA</h3>
          <p className="text-xs text-foreground/70">Seu assistente pessoal</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-full hover:bg-destructive/20"
        onClick={clearHistory}
        title="Limpar histórico"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

export default AthenaHeader;
