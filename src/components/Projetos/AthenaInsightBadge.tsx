
import React from "react";
import { Bot, AlertTriangle, Lightbulb, TrendingUp, Calendar, Link } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ProjectWithSteps } from "@/services/projectsService";

interface AthenaInsightBadgeProps {
  projeto: ProjectWithSteps;
  type?: "warning" | "suggestion" | "trend" | "connection" | "deadline";
  onClick?: () => void;
}

export function AthenaInsightBadge({ projeto, type = "suggestion", onClick }: AthenaInsightBadgeProps) {
  const getInsightContent = () => {
    const daysSinceCreation = Math.floor(
      (new Date().getTime() - new Date(projeto.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const daysUntilDeadline = projeto.deadline 
      ? Math.floor((new Date(projeto.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;

    switch (type) {
      case "warning":
        if (projeto.status === "ativo" && daysSinceCreation > 14 && projeto.progress < 20) {
          return {
            icon: AlertTriangle,
            text: "Projeto precisa de atenção",
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
            borderColor: "border-yellow-400/30"
          };
        }
        break;
        
      case "deadline":
        if (daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
          return {
            icon: Calendar,
            text: `Prazo em ${daysUntilDeadline}d`,
            color: "text-orange-400",
            bgColor: "bg-orange-400/10",
            borderColor: "border-orange-400/30"
          };
        }
        break;
        
      case "trend":
        if (projeto.progress > 80) {
          return {
            icon: TrendingUp,
            text: "Quase concluído",
            color: "text-green-400",
            bgColor: "bg-green-400/10",
            borderColor: "border-green-400/30"
          };
        }
        break;
        
      case "connection":
        if (projeto.tags && projeto.tags.length > 2) {
          return {
            icon: Link,
            text: "Conectar Subcérebro",
            color: "text-[#60B5B5]",
            bgColor: "bg-[#60B5B5]/10",
            borderColor: "border-[#60B5B5]/30"
          };
        }
        break;
        
      case "suggestion":
      default:
        if (projeto.steps.length > 0 && projeto.steps.filter(s => s.done).length === projeto.steps.length) {
          return {
            icon: Lightbulb,
            text: "Adicionar novas etapas",
            color: "text-[#993887]",
            bgColor: "bg-[#993887]/10",
            borderColor: "border-[#993887]/30"
          };
        }
        break;
    }
    
    return null;
  };

  const insight = getInsightContent();
  
  if (!insight) return null;

  const IconComponent = insight.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge
        variant="outline"
        className={`
          ${insight.color} ${insight.bgColor} ${insight.borderColor}
          text-xs px-2 py-1 flex items-center gap-1 cursor-pointer
          hover:scale-105 transition-transform duration-200
        `}
        onClick={onClick}
      >
        <Bot className="w-3 h-3" />
        <IconComponent className="w-3 h-3" />
        <span>{insight.text}</span>
      </Badge>
    </motion.div>
  );
}
