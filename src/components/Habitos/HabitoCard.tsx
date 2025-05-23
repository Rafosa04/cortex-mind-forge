
import { motion } from "framer-motion";
import { Brain, Check, Pen, Link, Trash2, Trophy } from "lucide-react";
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
import { useState } from "react";
import { HabitoDetailModal } from "./HabitoDetailModal";
import { AssociarProjetoModal } from "./AssociarProjetoModal";
import { generateHabitInsight } from "@/utils/athenaInsightUtils";
import { toast } from "@/components/ui/use-toast";

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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssociarModal, setShowAssociarModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);

  const handleAthenaClick = () => {
    // Abrir chat com contexto do hábito
    toast({
      title: "Athena Chat",
      description: `Perguntando à Athena sobre "${habito.nome}" - Funcionalidade será disponibilizada em breve!`,
    });
  };

  const handleCheckIn = async () => {
    if (!onCheckIn) return;
    
    setIsChecking(true);
    await onCheckIn();
    
    // Verificar se devemos mostrar conquista
    const shouldShowAchievement = habito.streak === 7 || habito.streak === 30;
    if (shouldShowAchievement) {
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
    
    setIsChecking(false);
  };

  // Determinar a cor do progresso com base no valor
  const getProgressColor = () => {
    if (habito.progresso < 30) return "text-red-400";
    if (habito.progresso < 70) return "text-yellow-400";
    return "text-green-400";
  };

  // Determinar a cor do streak com base no valor
  const getStreakColor = () => {
    if (habito.streak < 3) return "text-muted-foreground";
    if (habito.streak < 7) return "text-yellow-400";
    if (habito.streak < 14) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.025, boxShadow: "0 0 16px #60b5f5aa" }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-card border-2 border-[#4D2683]/40 shadow-md p-5 flex flex-col gap-4 animate-card-pop relative cursor-pointer overflow-hidden"
        onClick={() => setShowDetailModal(true)}
      >
        {/* Conquista - exibida condicionalmente */}
        {showAchievement && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 flex items-center justify-center flex-col z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Trophy className="w-16 h-16 text-yellow-200 mb-3" />
            <h3 className="text-white text-xl font-bold">Conquista Desbloqueada!</h3>
            <p className="text-white/90 text-sm">
              {habito.streak === 7 ? "7 dias seguidos!" : "30 dias! Incrível!"}
            </p>
          </motion.div>
        )}

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
            <Progress 
              value={habito.progresso} 
              className="w-32 h-2 bg-background rounded" 
              style={{
                "--progress-color": habito.progresso < 30 ? "#f87171" : 
                                    habito.progresso < 70 ? "#facc15" : "#4ade80"
              } as any}
            />
            <span className={`text-xs font-semibold ${getProgressColor()}`}>{habito.progresso}%</span>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 items-center">
            <span className={`text-xs font-semibold ${getStreakColor()}`}>
              Streak: <span className="font-bold">{habito.streak}</span>🔥
            </span>
            <span className="text-xs text-muted-foreground">
              Último check-in: {habito.ultimoCheck}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {habito.tags.map(tag => (
            <span key={tag} className="bg-[#191933] text-xs px-2 py-0.5 rounded-full border border-primary/30 text-primary shadow">{tag}</span>
          ))}
        </div>

        {/* Botões e blocos IA organizados */}
        <div className="flex flex-col gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          {/* Check-in destaque */}
          <Button
            size="sm"
            variant="outline"
            className={`border-primary text-primary font-semibold w-full py-2 hover-scale transition-all text-base rounded-lg ${isChecking ? 'animate-pulse' : ''}`}
            onClick={handleCheckIn}
            disabled={isChecking}
          >
            {isChecking ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mr-2"
              >
                <Check className="w-5 h-5" />
              </motion.div>
            ) : (
              <Check className="w-5 h-5 mr-2" />
            )}
            {isChecking ? "Registrando..." : "Check-in"}
          </Button>

          {/* Perguntar à Athena */}
          <div className="flex items-center gap-2 mt-1">
            <Brain className="w-4 h-4 text-[#6ae1f5]" />
            <button
              type="button"
              className="text-sm text-cyan-300 font-medium hover:underline focus:outline-none px-0 bg-transparent border-none"
              style={{ background: "none" }}
              onClick={handleAthenaClick}
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
              onClick={() => setShowAssociarModal(true)}
            >
              <Link className="w-4 h-4 mr-1" /> Associar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 justify-start text-sm pl-2"
              onClick={() => setShowDetailModal(true)}
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

      {/* Modais */}
      <HabitoDetailModal
        habito={habito}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />

      <AssociarProjetoModal
        habitoId={habito.id || null}
        open={showAssociarModal}
        onOpenChange={setShowAssociarModal}
      />
    </>
  );
}
