
import React from "react";
import { ArrowRight, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { StatusTag } from "./StatusTag";
import { TagProjeto } from "./TagProjeto";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProjectWithSteps } from "@/services/projectsService";

type Props = {
  projeto: ProjectWithSteps;
  onVerDetalhes?: () => void;
};

export function ProjetoCard({ projeto, onVerDetalhes }: Props) {
  return (
    <motion.div
      className="rounded-2xl bg-[#141429]/90 border border-[#191933] shadow-xl p-6 flex flex-col gap-3 relative neon-anim hover:scale-[1.025] hover:border-[#60B5B5] transition-transform cursor-pointer group"
      whileHover={{ scale: 1.025, boxShadow: "0 0 8px #60B5B5, 0 0 40px #99388722" }}
      transition={{ duration: 0.23 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-lg font-bold text-primary drop-shadow-sm">{projeto.name}</span>
        </div>
        <StatusTag status={projeto.status} />
      </div>
      <div className="flex gap-2 flex-wrap mt-1">
        {projeto.category && (
          <TagProjeto key={projeto.category}>{projeto.category}</TagProjeto>
        )}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Progress value={projeto.progress} className="w-[70%] h-3 bg-[#191933] rounded-full" />
        <span className="text-xs text-[#E6E6F0]/70">{projeto.progress}%</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <Button onClick={onVerDetalhes} size="sm" variant="outline" className="group/button text-xs flex items-center gap-1 border-primary/50 shadow-glow transition hover:bg-primary/90 hover:text-[#0C0C1C]">
          Ver detalhes <ArrowRight className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center shadow ring-2 ring-primary/60">
            <Bot className="w-5 h-5 text-background" />
          </div>
          <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10" title="Sugerir nova etapa">
            <span className="sr-only">Sugerir nova etapa</span>
            <Bot className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
