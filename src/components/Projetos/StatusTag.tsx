
import React from "react";
import { Check, Pause, Activity } from "lucide-react";

export function StatusTag({ status }: { status: "ativo" | "pausado" | "concluído" }) {
  const statusMap = {
    ativo: {
      text: "Ativo",
      icon: <Activity className="w-3.5 h-3.5 mr-1 inline-block text-[#60B5B5]" />,
      color: "bg-[#25303a] text-[#60B5B5]",
    },
    pausado: {
      text: "Pausado",
      icon: <Pause className="w-3.5 h-3.5 mr-1 inline-block text-[#993887]" />,
      color: "bg-[#231b23] text-[#993887]",
    },
    concluído: {
      text: "Concluído",
      icon: <Check className="w-3.5 h-3.5 mr-1 inline-block text-[#E6E6F0]" />,
      color: "bg-[#25272e] text-[#E6E6F0]",
    },
  };
  const item = statusMap[status];
  return (
    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${item.color} shadow-inner`}>
      {item.icon} {item.text}
    </span>
  );
}
