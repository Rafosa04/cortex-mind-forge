
import { motion } from "framer-motion";
import { Brain, Check, Pen, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type Habito = {
  nome: string;
  proposito: string;
  frequencia: string;
  progresso: number;
  streak: number;
  ultimoCheck: string;
  icone?: React.ReactNode;
  observacaoIA: string;
  tags: string[];
};

export function HabitoCard({ habito, onCheckIn }: { habito: Habito; onCheckIn?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025, boxShadow: "0 0 16px #60b5f5aa" }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-card border-2 border-[#4D2683]/40 shadow-md p-5 flex flex-col gap-4 animate-card-pop relative"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="text-xl font-bold text-primary mb-1">{habito.nome}</h4>
          <span className="text-xs text-foreground/80">{habito.proposito}</span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="rounded bg-secondary/20 text-xs px-2 py-1 font-semibold text-secondary">{habito.frequencia}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Progress value={habito.progresso} className="w-32 h-2 bg-background rounded" />
          <span className="text-xs text-primary font-semibold">{habito.progresso}%</span>
        </div>
        <div className="flex gap-4 mt-2">
          <span className="text-xs text-cyan-400/80 font-semibold">
            Streak: <span className="font-bold">{habito.streak}</span>🔥
          </span>
          <span className="text-xs text-muted-foreground">Último check-in: {habito.ultimoCheck}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {habito.tags.map(tag => (
          <span key={tag} className="bg-[#191933] text-xs px-2 py-0.5 rounded-full border border-primary/30 text-primary shadow">{tag}</span>
        ))}
      </div>

      {/* Botões e IA alinhados responsivamente */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex flex-wrap gap-2 justify-between items-center w-full">
          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
            <Button
              size="sm"
              variant="outline"
              className="hover-scale border-primary flex-1 min-w-[130px] md:min-w-[110px]"
              onClick={onCheckIn}
            >
              <Check className="w-4 h-4" /> Check-in
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 min-w-[130px] md:min-w-[110px]"
            >
              <Brain className="w-4 h-4 text-[#6ae1f5] animate-pulse" /> Perguntar à Athena
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 min-w-[100px] md:min-w-[90px]"
            >
              <Link className="w-4 h-4" /> Associar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 min-w-[100px] md:min-w-[90px]"
            >
              <Pen className="w-4 h-4" /> Editar
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0 ml-auto">
            <Avatar className="w-7 h-7 shadow-[0_0_0.5rem_#6ae1f5cc] ring-2 ring-cyan-400/60 animate-pulse">
              <AvatarFallback>IA</AvatarFallback>
            </Avatar>
            <span className="text-[11px] text-cyan-400/90 max-w-[150px] truncate">{habito.observacaoIA}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
