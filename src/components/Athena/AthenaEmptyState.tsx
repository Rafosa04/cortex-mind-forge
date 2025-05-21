
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AthenaEmptyStateProps {
  hasSearchTerm: boolean;
}

const AthenaEmptyState: React.FC<AthenaEmptyStateProps> = ({ hasSearchTerm }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 text-center">
      <div className="py-10 flex flex-col items-center">
        <span className="text-6xl mb-4">🤔</span>
        <h3 className="text-xl font-semibold mb-2">Nenhuma conversa encontrada</h3>
        <p className="text-muted-foreground mb-4">
          {hasSearchTerm ? 
            "Não encontramos nenhuma conversa que corresponda à sua pesquisa." : 
            "Você ainda não conversou com a Athena. Experimente fazer uma pergunta!"}
        </p>
        <Button onClick={() => navigate("/")}>Ir para o Dashboard</Button>
      </div>
    </Card>
  );
};

export default AthenaEmptyState;
