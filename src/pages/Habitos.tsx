
import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { HabitoCard, Habito } from "@/components/Habitos/HabitoCard";
import { NovoHabitoModal } from "@/components/Habitos/NovoHabitoModal";
import { HabitosViewSwitcher } from "@/components/Habitos/HabitosViewSwitcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MOCK_HABITOS: Habito[] = [
  {
    nome: "Leitura",
    proposito: "Para ganhar foco e disciplina",
    frequencia: "Diário",
    progresso: 86,
    streak: 12,
    ultimoCheck: "Hoje",
    observacaoIA: "Potencializa seu projeto X.",
    tags: ["foco", "mental"],
  },
  {
    nome: "Exercício",
    proposito: "Mais energia física",
    frequencia: "3x semana",
    progresso: 66,
    streak: 5,
    ultimoCheck: "Ontem",
    observacaoIA: "Mais disposição para estudar.",
    tags: ["saúde", "energia"],
  },
  {
    nome: "Meditação",
    proposito: "Reduzir estresse",
    frequencia: "Semanal",
    progresso: 44,
    streak: 3,
    ultimoCheck: "3 dias atrás",
    observacaoIA: "Ajuda no projeto de autoconhecimento.",
    tags: ["mente", "relax"],
  },
];

export default function Habitos() {
  const [view, setView] = useState("grid");
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [freqFiltro, setFreqFiltro] = useState("todos");

  const habitos = MOCK_HABITOS.filter(
    (h) =>
      h.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (freqFiltro === "todos" || h.frequencia === freqFiltro)
  );

  return (
    <div className="w-full max-w-5xl mx-auto mt-2">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#60B5F5] to-[#993887] leading-tight mb-1">
            Hábitos em Evolução
          </h2>
          <div className="text-sm text-foreground/60">“Cada hábito é uma célula viva. Ao cuidar dela, você fortalece sua mente.”</div>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="w-4" /> Novo Hábito
          </Button>
          <HabitosViewSwitcher active={view} setActive={setView} />
        </div>
      </motion.div>

      {/* TOOLBAR FILTROS */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-card border rounded-lg px-2 items-center">
          <Search className="w-4 text-muted-foreground" />
          <Input
            className="w-[140px] bg-transparent border-none text-foreground focus:ring-0 focus:border-b focus:border-primary/80"
            placeholder="Buscar hábito..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select value={freqFiltro} onChange={e => setFreqFiltro(e.target.value)} className="rounded bg-card px-2 border text-foreground">
          <option value="todos">Todas frequências</option>
          <option value="Diário">Diário</option>
          <option value="3x semana">3x semana</option>
          <option value="Semanal">Semanal</option>
        </select>
        <Button size="sm" variant="ghost" className="gap-1"><Filter className="w-4" /> Tags</Button>
        <Button size="sm" variant="ghost" className="gap-1"><Filter className="w-4" /> Intenção</Button>
      </div>

      {/* GRADE / OUTRAS VIEWS */}
      {view === "grid" && (
        <motion.div 
          initial="hidden" animate="visible" 
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {habitos.map((habito, i) => (
            <HabitoCard key={habito.nome} habito={habito} onCheckIn={() => {}} />
          ))}
        </motion.div>
      )}

      {view !== "grid" && (
        <div className="rounded-xl border border-primary/40 bg-card/80 p-10 flex flex-col items-center justify-center min-h-[260px] text-lg text-primary/70 font-bold shadow-inner">
          {view === "calendar" && <span>Visualização de calendário de hábitos (mock)</span>}
          {view === "relatorio" && <span>Relatório de hábitos com gráficos (mock)</span>}
        </div>
      )}

      {/* MODAL MOCK */}
      <NovoHabitoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
