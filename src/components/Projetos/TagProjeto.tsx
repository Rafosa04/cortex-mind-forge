
import React from "react";

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

export function TagProjeto({ children }: { children: string }) {
  const colorClass = tagColors[children.toLowerCase()] || "bg-card text-primary";
  return (
    <span className={`text-xs rounded-full px-3 py-1 font-medium mr-2 mb-1 inline-block ${colorClass} shadow-sm`}>
      {children}
    </span>
  );
}
