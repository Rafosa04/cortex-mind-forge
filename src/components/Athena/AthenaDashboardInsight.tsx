
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AthenaDashboardInsightProps {
  insight: string | null;
  loading: boolean;
  actionText?: string;
  actionUrl?: string;
}

const AthenaDashboardInsight: React.FC<AthenaDashboardInsightProps> = ({
  insight,
  loading,
  actionText = "Falar com Athena",
  actionUrl = "/athena"
}) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-card/50 relative animate-pulse">
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center">
          <span className="text-primary-foreground text-lg font-bold">A</span>
        </div>
        <div className="h-4 w-3/4 bg-muted rounded my-2"></div>
        <div className="h-4 w-1/2 bg-muted rounded my-2"></div>
        <div className="mt-4 flex justify-end">
          <div className="h-9 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-lg bg-card/50 relative">
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <span className="text-primary-foreground text-lg font-bold">A</span>
      </div>
      <p className="pl-6">{insight || "Athena está analisando seus dados para gerar insights personalizados."}</p>
      
      <div className="mt-4 flex justify-end">
        <Button onClick={() => navigate(actionUrl)}>
          {actionText}
        </Button>
      </div>
    </div>
  );
};

export default AthenaDashboardInsight;
