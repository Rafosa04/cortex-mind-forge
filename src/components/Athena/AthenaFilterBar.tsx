
import React from "react";
import { Search, Reply } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AthenaFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loadHistory: () => void;
}

const AthenaFilterBar: React.FC<AthenaFilterBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  loadHistory 
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Pesquisar no histórico..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        onClick={loadHistory}
        className="flex items-center gap-2"
      >
        <Reply size={16} />
        <span>Atualizar</span>
      </Button>
    </div>
  );
};

export default AthenaFilterBar;
