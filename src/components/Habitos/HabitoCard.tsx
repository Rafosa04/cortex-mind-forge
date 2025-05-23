
import { motion } from "framer-motion";
import { Brain, Check, Pen, Link, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type Habito = {
  id?: string;
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

export function HabitoCard({ 
  habito, 
  onCheckIn, 
  onDelete 
}: { 
  habito: Habito; 
  onCheckIn?: () => void;
  onDelete?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025, boxShadow: "0 0 16px #60b5f5aa" }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-card border-2 border-[#4D2683]/40 shadow-md p-5 flex flex-col gap-4 animate-card-pop relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-primary mb-1">{habito.nome}</h4>
          <span className="text-xs text-foreground/80">{habito.proposito}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-secondary/20 text-xs px-3 py-1 font-semibold text-secondary whitespace-nowrap">
            {habito.frequencia}
          </span>
          <span className="text-2xl">{habito.icone}</span>
        </div>
      </div>

      {/* Progresso & Streak */}
      <div>
        <div className="flex items-center gap-2">
          <Progress value={habito.progresso} className="w-32 h-2 bg-background rounded" />
          <span className="text-xs text-primary font-semibold">{habito.progresso}%</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 items-center">
          <span className="text-xs text-cyan-400/80 font-semibold">
            Streak: <span className="font-bold">{habito.streak}</span>🔥
          </span>
          <span className="text-xs text-muted-foreground">Último check-in: {habito.ultimoCheck}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {habito.tags.map(tag => (
          <span key={tag} className="bg-[#191933] text-xs px-2 py-0.5 rounded-full border border-primary/30 text-primary shadow">{tag}</span>
        ))}
      </div>

      {/* Botões e blocos IA organizados */}
      <div className="flex flex-col gap-2 mt-2">
        {/* Check-in destaque */}
        <Button
          size="sm"
          variant="outline"
          className="border-primary text-primary font-semibold w-full py-2 hover-scale transition-all text-base rounded-lg"
          onClick={onCheckIn}
        >
          <Check className="w-5 h-5 mr-2" /> Check-in
        </Button>

        {/* Perguntar à Athena */}
        <div className="flex items-center gap-2 mt-1">
          <Brain className="w-4 h-4 text-[#6ae1f5]" />
          <button
            type="button"
            className="text-sm text-cyan-300 font-medium hover:underline focus:outline-none px-0 bg-transparent border-none"
            style={{ background: "none" }}
          >
            Perguntar à Athena
          </button>
          <Avatar className="w-6 h-6 ml-2 shadow-[0_0_0.4rem_#6ae1f5cc] ring-2 ring-cyan-400/60 animate-pulse">
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-cyan-400/90 max-w-[100px] truncate">{habito.observacaoIA}</span>
        </div>

        {/* Demais botões */}
        <div className="flex flex-row gap-2 w-full mt-1">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 justify-start text-sm pl-2"
          >
            <Link className="w-4 h-4 mr-1" /> Associar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 justify-start text-sm pl-2"
          >
            <Pen className="w-4 h-4 mr-1" /> Editar
          </Button>
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar Hábito</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja deletar o hábito "{habito.nome}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </motion.div>
  );
}
