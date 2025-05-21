
import React from "react";

type TagProjetoProps = {
  children: string;
  variant?: "primary" | "secondary" | "neutral" | "custom";
};

/**
 * Tag visual para projetos (saúde, estudo, etc).
 * Cores fixas no tema CÓRTEX (azul, roxo, cinza).
 */
const tagColors: Record<string, string> = {
  saúde: "bg-[#60B5B5] text-[#0C0C1C]",
  estudo: "bg-[#993887] text-[#E6E6F0]",
  finanças: "bg-[#8E9196] text-[#E6E6F0]",
  inspiração: "bg-[#7E69AB] text-[#E6E6F0]",
};

// Variant colors for tags
const variantColors: Record<string, string> = {
  primary: "bg-[#60B5B5]/20 text-[#60B5B5] border border-[#60B5B5]/40",
  secondary: "bg-[#993887]/20 text-[#993887] border border-[#993887]/40",
  neutral: "bg-[#8E9196]/20 text-[#E6E6F0] border border-[#8E9196]/40",
  custom: "",
};

export function TagProjeto({ children, variant }: TagProjetoProps) {
  // If it's a category-based color, use that
  const tagLower = children.toLowerCase();
  const categoryColor = tagColors[tagLower];
  
  // If variant is provided, use that instead
  const variantColor = variant ? variantColors[variant] : "";
  
  // Default to category color, then variant color, then fallback
  const colorClass = categoryColor || variantColor || "bg-card text-primary border border-primary/20";
  
  return (
    <span className={`text-xs rounded-full px-3 py-1 font-medium mr-2 mb-1 inline-block ${colorClass} shadow-sm`}>
      {children}
    </span>
  );
}
