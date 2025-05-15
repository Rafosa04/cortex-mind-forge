
import React from "react";
import { Button } from "@/components/ui/button";
import { FiltroProjetos } from "@/components/Projetos/FiltroProjetos";
import { ProjetoCard } from "@/components/Projetos/ProjetoCard";
import { NovaCelulaModal } from "@/components/Projetos/NovaCelulaModal";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

// Dados mockados (trocar para fetch/supabase em versões futuras)
// Definindo explicitamente o tipo dos projetos para status literal
const projetos: {
  nome: string;
  progresso: number;
  tags: string[];
  status: "ativo" | "pausado" | "concluído";
}[] = [
  {
    nome: "Nova Rotina Saudável",
    progresso: 65,
    tags: ["saúde", "inspiração"],
    status: "ativo",
  },
  {
    nome: "TCC Neurociência",
    progresso: 25,
    tags: ["estudo"],
    status: "pausado",
  },
  {
    nome: "Organização Financeira",
    progresso: 92,
    tags: ["finanças"],
    status: "concluído",
  },
];

export default function Projetos() {
  const [modalAberto, setModalAberto] = React.useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto mt-3 fade-in">
      <header className="flex items-center justify-between py-2 mb-2 gap-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-primary drop-shadow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Meus Projetos
        </motion.h2>
        <Button
          variant="default"
          className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-secondary text-background rounded-lg font-bold shadow animate-card-pop neon-anim"
          onClick={() => setModalAberto(true)}
        >
          <Plus className="w-5 h-5" /> Nova Célula
        </Button>
        <NovaCelulaModal open={modalAberto} onOpenChange={setModalAberto} />
      </header>
      <FiltroProjetos />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 fade-in mt-1">
        {projetos.map((projeto, i) => (
          <ProjetoCard key={i} projeto={projeto} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-secondary text-center text-sm italic mt-12 select-none"
      >
        “O CÓRTEX não exibe projetos. Ele manifesta células vivas que evoluem com você.”
      </motion.div>
    </div>
  );
}
