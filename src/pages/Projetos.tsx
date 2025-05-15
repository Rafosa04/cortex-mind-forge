
import React from "react";
import { Button } from "@/components/ui/button";
import { FiltroProjetos } from "@/components/Projetos/FiltroProjetos";
import { ProjetoCard } from "@/components/Projetos/ProjetoCard";
import { NovaCelulaModal } from "@/components/Projetos/NovaCelulaModal";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { DrawerDetalheProjeto } from "@/components/Projetos/DrawerDetalheProjeto";
import { FiltroLateralProjetos } from "@/components/Projetos/FiltroLateralProjetos";
import { FloatingAthenaButton } from "@/components/Projetos/FloatingAthenaButton";

// Mock dos projetos com detalhes extra
const projetos = [
  {
    nome: "Nova Rotina Saudável",
    progresso: 65,
    tags: ["saúde", "inspiração"],
    status: "ativo",
    descricao: "Crie e mantenha hábitos positivos para uma vida mais saudável.",
    datas: { criado: "2023-12-10", prazo: "2024-08-01", ultima: "2024-05-10" },
    etapas: [
      { texto: "Definir hábitos", feita: true },
      { texto: "Registrar diariamente", feita: false },
      { texto: "Revisão semanal", feita: false },
    ]
  },
  {
    nome: "TCC Neurociência",
    progresso: 25,
    tags: ["estudo"],
    status: "pausado",
    descricao: "Desenvolvimento do trabalho final sobre pesquisa em Neurociência.",
    datas: { criado: "2024-01-10", prazo: "2024-07-14", ultima: "2024-04-18" },
    etapas: [
      { texto: "Revisão bibliográfica", feita: true },
      { texto: "Escrever introdução", feita: false },
      { texto: "Desenvolvimento", feita: false },
    ]
  },
  {
    nome: "Organização Financeira",
    progresso: 92,
    tags: ["finanças"],
    status: "concluído",
    descricao: "Organização de contas, orçamento mensal e objetivos financeiros.",
    datas: { criado: "2023-08-14", prazo: "2024-03-30", ultima: "2024-03-30" },
    etapas: [
      { texto: "Analisar extratos", feita: true },
      { texto: "Elaborar planilha", feita: true },
      { texto: "Definir metas", feita: true },
    ]
  },
];

// Modos de visualização possíveis
const modosVisao = ["Lista", "Kanban", "Linha do tempo", "Galeria"] as const;

export default function Projetos() {
  const [modalAberto, setModalAberto] = React.useState(false);
  const [detalheAberto, setDetalheAberto] = React.useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = React.useState<typeof projetos[0] | null>(null);
  const [modoVisao, setModoVisao] = React.useState<typeof modosVisao[number]>("Lista");
  const [abrirAthena, setAbrirAthena] = React.useState(false);

  const handleVerDetalhes = (projeto: typeof projetos[0]) => {
    setProjetoSelecionado(projeto);
    setDetalheAberto(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-row fade-in">
      {/* Filtro lateral (aparece só em md+) */}
      <FiltroLateralProjetos modo={modoVisao} setModo={setModoVisao} />
      <div className="flex-1 min-w-0">
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

        {/* Grid/List view simulada */}
        <div className="relative">
          {modoVisao === "Lista" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 fade-in mt-1">
              {projetos.map((projeto, i) => (
                <ProjetoCard
                  key={i}
                  projeto={projeto}
                  onVerDetalhes={() => handleVerDetalhes(projeto)}
                />
              ))}
            </div>
          )}
          {modoVisao === "Kanban" && (
            <div className="flex gap-6 mt-1 fade-in min-h-[350px]">
              {["ativo", "pausado", "concluído"].map((status) => (
                <div key={status} className="flex-1 bg-[#191933]/70 rounded-xl p-4">
                  <div className="font-bold text-secondary mb-3 capitalize">{status}</div>
                  {projetos.filter(p => p.status === status).length === 0 && (
                    <div className="text-secondary/60 italic">Sem projetos neste status.</div>
                  )}
                  {projetos.filter(p => p.status === status).map((projeto, i) => (
                    <ProjetoCard
                      key={i}
                      projeto={projeto}
                      onVerDetalhes={() => handleVerDetalhes(projeto)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          {modoVisao === "Linha do tempo" && (
            <div className="rounded-xl bg-[#191933]/60 p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
              <span className="text-xl">[Linha do tempo - mock visual]</span>
              <div className="mt-4 text-base">Visualização cronológica dos projetos (em breve).</div>
            </div>
          )}
          {modoVisao === "Galeria" && (
            <div className="rounded-xl bg-[#191933]/60 p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
              <span className="text-xl">[Galeria de células - mock visual]</span>
              <div className="mt-4 text-base">Cards em grid de galeria (em breve).</div>
            </div>
          )}
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
      {/* Drawer lateral de detalhes */}
      <DrawerDetalheProjeto
        projeto={projetoSelecionado as any}
        open={detalheAberto}
        onOpenChange={setDetalheAberto}
      />
      {/* Botão flutuante “Falar com a Athena” */}
      <FloatingAthenaButton onClick={() => setAbrirAthena(true)} />
      {/* Chat lateral da Athena (mock visual) */}
      {abrirAthena && (
        <div className="fixed bottom-24 right-8 w-full max-w-xs rounded-2xl glass-morphism p-4 shadow-xl border-[#993887] z-50 animate-fade-in ">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#993887] text-[#E6E6F0] px-3 py-1 rounded-full font-bold text-sm">Athena</span>
              <span className="text-xs text-secondary/80">IA Contextual</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setAbrirAthena(false)}>x</Button>
          </div>
          <div className="text-primary mb-2">Como posso ajudar nos seus projetos?</div>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg bg-[#191933]/70 border border-[#993887]/40 text-foreground focus:outline-none focus:border-primary mb-2 text-sm"
            placeholder="Pergunte algo para Athena..."
            disabled
          />
          <small className="text-xs text-secondary/60">(Chat limitado a visual, integração futura)</small>
        </div>
      )}
    </div>
  );
}
