
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiltroProjetos } from "@/components/Projetos/FiltroProjetos";
import { ProjetoCard } from "@/components/Projetos/ProjetoCard";
import { NovaCelulaModal } from "@/components/Projetos/NovaCelulaModal";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { DrawerDetalheProjeto } from "@/components/Projetos/DrawerDetalheProjeto";
import { FiltroLateralProjetos } from "@/components/Projetos/FiltroLateralProjetos";
import { FloatingAthenaButton } from "@/components/Projetos/FloatingAthenaButton";
import { useProjetos } from "@/hooks/useProjetos";
import { ProjectWithSteps } from "@/services/projectsService";
import { Skeleton } from "@/components/ui/skeleton";

// Modos de visualização possíveis, com type literal
const modosVisao = ["Lista", "Kanban", "Linha do tempo", "Galeria"] as const;
type ModoVisao = typeof modosVisao[number];

export default function Projetos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [detalheAberto, setDetalheAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjectWithSteps | null>(null);
  const [modoVisao, setModoVisao] = useState<ModoVisao>("Lista");
  const [abrirAthena, setAbrirAthena] = useState(false);
  
  const { projetos, loading, error, carregarProjetos } = useProjetos();

  const handleVerDetalhes = (projeto: ProjectWithSteps) => {
    setProjetoSelecionado(projeto);
    setDetalheAberto(true);
  };

  const getProjetosPorStatus = (status: string) => {
    return projetos.filter(p => p.status === status);
  };

  const renderLoaderCards = () => (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-[#141429]/90 border border-[#191933] shadow-xl p-6 flex flex-col gap-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-40 bg-[#191933]" />
            <Skeleton className="h-6 w-20 bg-[#191933]" />
          </div>
          <div className="flex gap-2 mt-1">
            <Skeleton className="h-4 w-20 bg-[#191933]" />
          </div>
          <Skeleton className="h-3 w-full bg-[#191933] mt-2" />
          <div className="flex justify-between mt-2">
            <Skeleton className="h-8 w-28 bg-[#191933]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-[#191933]" />
              <Skeleton className="h-8 w-8 rounded-full bg-[#191933]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full flex flex-col md:flex-row fade-in">
      {/* Filtro lateral (aparece só em md+) */}
      <FiltroLateralProjetos modo={modoVisao} setModo={setModoVisao} />
      
      <div className="flex-1 min-w-0 mt-4 md:mt-0">
        <header className="flex items-center justify-between py-2 mb-2 gap-2 sm:gap-4 flex-wrap">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-primary drop-shadow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Meus Projetos
          </motion.h2>
          <Button
            variant="default"
            className="flex items-center gap-2 px-3 sm:px-5 py-1 sm:py-2 bg-primary hover:bg-secondary text-background rounded-lg font-bold shadow animate-card-pop neon-anim"
            onClick={() => setModalAberto(true)}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Nova Célula
          </Button>
          <NovaCelulaModal open={modalAberto} onOpenChange={setModalAberto} />
        </header>
        
        <FiltroProjetos />
        
        {/* Estado de erro */}
        {error && !loading && (
          <div className="p-6 text-center">
            <p className="text-red-400 mb-2">Erro ao carregar projetos</p>
            <Button onClick={() => carregarProjetos()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        )}
        
        {/* Estado vazio */}
        {!loading && !error && projetos.length === 0 && (
          <div className="rounded-xl bg-[#191933]/60 p-6 sm:p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
            <span className="text-xl">Nenhum projeto encontrado</span>
            <div className="mt-4 text-base">Crie sua primeira célula usando o botão "Nova Célula".</div>
          </div>
        )}
        
        {/* Grid/List view */}
        <div className="relative">
          {/* Lista */}
          {modoVisao === "Lista" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7 fade-in mt-1">
              {loading ? (
                renderLoaderCards()
              ) : (
                projetos.map((projeto) => (
                  <ProjetoCard
                    key={projeto.id}
                    projeto={projeto}
                    onVerDetalhes={() => handleVerDetalhes(projeto)}
                  />
                ))
              )}
            </div>
          )}
          
          {/* Kanban */}
          {modoVisao === "Kanban" && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-1 fade-in min-h-[350px] overflow-x-auto pb-4">
              {["ativo", "pausado", "concluído"].map((status) => (
                <div key={status} className="flex-1 min-w-[250px] bg-[#191933]/70 rounded-xl p-4">
                  <div className="font-bold text-secondary mb-3 capitalize">{status}</div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full bg-[#141429]/90" />
                      <Skeleton className="h-32 w-full bg-[#141429]/90" />
                    </div>
                  ) : getProjetosPorStatus(status).length === 0 ? (
                    <div className="text-secondary/60 italic">Sem projetos neste status.</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {getProjetosPorStatus(status).map((projeto) => (
                        <ProjetoCard
                          key={projeto.id}
                          projeto={projeto}
                          onVerDetalhes={() => handleVerDetalhes(projeto)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Placeholders para outras visualizações */}
          {modoVisao === "Linha do tempo" && (
            <div className="rounded-xl bg-[#191933]/60 p-6 sm:p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
              <span className="text-xl">[Linha do tempo - mock visual]</span>
              <div className="mt-4 text-base">Visualização cronológica dos projetos (em breve).</div>
            </div>
          )}
          
          {modoVisao === "Galeria" && (
            <div className="rounded-xl bg-[#191933]/60 p-6 sm:p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
              <span className="text-xl">[Galeria de células - mock visual]</span>
              <div className="mt-4 text-base">Cards em grid de galeria (em breve).</div>
            </div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-secondary text-center text-xs sm:text-sm italic mt-8 sm:mt-12 select-none"
        >
          "O CÓRTEX não exibe projetos. Ele manifesta células vivas que evoluem com você."
        </motion.div>
      </div>
      
      {/* Drawer lateral de detalhes */}
      <DrawerDetalheProjeto
        projeto={projetoSelecionado}
        open={detalheAberto}
        onOpenChange={setDetalheAberto}
      />
      
      {/* Botão flutuante "Falar com a Athena" */}
      <FloatingAthenaButton onClick={() => setAbrirAthena(true)} />
      
      {/* Chat lateral da Athena (mock visual) */}
      {abrirAthena && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 w-full max-w-[280px] sm:max-w-xs rounded-2xl glass-morphism p-3 sm:p-4 shadow-xl border-[#993887] z-50 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#993887] text-[#E6E6F0] px-2 sm:px-3 py-1 rounded-full font-bold text-sm">Athena</span>
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
