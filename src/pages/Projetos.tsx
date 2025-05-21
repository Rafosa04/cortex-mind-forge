
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiltroProjetos, ProjetoFiltros } from "@/components/Projetos/FiltroProjetos";
import { NovaCelulaModal } from "@/components/Projetos/NovaCelulaModal";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { DrawerDetalheProjeto } from "@/components/Projetos/DrawerDetalheProjeto";
import { FiltroLateralProjetos } from "@/components/Projetos/FiltroLateralProjetos";
import { FloatingAthenaButton } from "@/components/Projetos/FloatingAthenaButton";
import { useProjetos } from "@/hooks/useProjetos";
import { ProjectWithSteps } from "@/services/projectsService";
import { VisaoLista } from "@/components/Projetos/VisaoLista";
import { VisaoKanban } from "@/components/Projetos/VisaoKanban";
import { VisaoLinhaTempo } from "@/components/Projetos/VisaoLinhaTempo";
import { VisaoGaleria } from "@/components/Projetos/VisaoGaleria";
import { DateRange } from "react-day-picker";

// Modos de visualização possíveis, com type literal
const modosVisao = ["Lista", "Kanban", "Linha do tempo", "Galeria"] as const;
type ModoVisao = typeof modosVisao[number];

export default function Projetos() {
  // App state
  const [modalAberto, setModalAberto] = useState(false);
  const [detalheAberto, setDetalheAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjectWithSteps | null>(null);
  const [modoVisao, setModoVisao] = useState<ModoVisao>("Lista");
  const [abrirAthena, setAbrirAthena] = useState(false);
  
  // Filtering state
  const [filtros, setFiltros] = useState<ProjetoFiltros>({
    search: "",
    status: null,
    tag: null,
    dateRange: null
  });
  
  // Get projects data and functions
  const { projetos, categorias, loading, error, carregarProjetos, filtrarProjetos } = useProjetos();

  // Apply filters when they change
  useEffect(() => {
    const aplicarFiltros = async () => {
      await filtrarProjetos(filtros);
    };
    
    aplicarFiltros();
  }, [filtros, filtrarProjetos]);

  // Handle project detail view
  const handleVerDetalhes = (projeto: ProjectWithSteps) => {
    setProjetoSelecionado(projeto);
    setDetalheAberto(true);
  };

  // Handle filter changes
  const handleFilterChange = (novosFiltros: ProjetoFiltros) => {
    setFiltros(novosFiltros);
  };

  // Clear a specific filter
  const handleLimparFiltro = (filtroKey: keyof ProjetoFiltros) => {
    setFiltros(prev => ({
      ...prev,
      [filtroKey]: filtroKey === 'dateRange' ? null : ''
    }));
  };

  // Render current view based on the selected mode
  const renderCurrentView = () => {
    switch (modoVisao) {
      case "Kanban":
        return (
          <VisaoKanban 
            projetos={projetos} 
            loading={loading} 
            onVerDetalhes={handleVerDetalhes} 
          />
        );
      case "Linha do tempo":
        return (
          <VisaoLinhaTempo 
            projetos={projetos} 
            loading={loading} 
            onVerDetalhes={handleVerDetalhes}
          />
        );
      case "Galeria":
        return (
          <VisaoGaleria 
            projetos={projetos} 
            loading={loading} 
            onVerDetalhes={handleVerDetalhes}
          />
        );
      default: // Lista
        return (
          <VisaoLista 
            projetos={projetos} 
            loading={loading} 
            onVerDetalhes={handleVerDetalhes}
          />
        );
    }
  };

  // Animation variants for page elements
  const containerAnimations = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimations = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full flex flex-col md:flex-row fade-in"
      variants={containerAnimations}
      initial="hidden"
      animate="show"
    >
      {/* Filtro lateral (aparece só em md+) */}
      <FiltroLateralProjetos 
        modo={modoVisao} 
        setModo={setModoVisao} 
        filtros={filtros}
        onLimparFiltro={handleLimparFiltro}
        categorias={categorias}
        isLoading={loading}
      />
      
      <div className="flex-1 min-w-0 mt-4 md:mt-0">
        <motion.header 
          className="flex items-center justify-between py-2 mb-2 gap-2 sm:gap-4 flex-wrap"
          variants={itemAnimations}
        >
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
            className="flex items-center gap-2 px-3 sm:px-5 py-1 sm:py-2 bg-primary hover:bg-secondary text-background rounded-lg font-bold shadow neon-anim"
            onClick={() => setModalAberto(true)}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Nova Célula
          </Button>
          <NovaCelulaModal 
            open={modalAberto} 
            onOpenChange={setModalAberto}
            categorias={categorias}
          />
        </motion.header>
        
        <motion.div variants={itemAnimations}>
          <FiltroProjetos 
            onFilterChange={handleFilterChange}
            categorias={categorias}
            isLoading={loading}
          />
        </motion.div>
        
        {/* Estado de erro */}
        {error && !loading && (
          <motion.div 
            className="p-6 text-center bg-red-900/20 border border-red-500/30 rounded-xl mt-4"
            variants={itemAnimations}
          >
            <p className="text-red-400 mb-2">{error}</p>
            <Button onClick={() => carregarProjetos()} variant="outline">
              Tentar novamente
            </Button>
          </motion.div>
        )}
        
        {/* Estado vazio */}
        {!loading && !error && projetos.length === 0 && (
          <motion.div 
            className="rounded-xl bg-[#191933]/60 p-6 sm:p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in"
            variants={itemAnimations}
          >
            <span className="text-xl">Nenhum projeto encontrado</span>
            <div className="mt-4 text-base">
              {Object.values(filtros).some(f => f !== null && f !== '') 
                ? "Tente remover alguns filtros para ver mais resultados."
                : "Crie sua primeira célula usando o botão \"Nova Célula\"."}
            </div>
          </motion.div>
        )}
        
        {/* View container */}
        <motion.div 
          className="relative min-h-[300px]"
          variants={itemAnimations}
        >
          {renderCurrentView()}
        </motion.div>
        
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
      
      {/* Chat lateral da Athena */}
      {abrirAthena && (
        <motion.div 
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 w-full max-w-[280px] sm:max-w-xs rounded-2xl glass-morphism p-3 sm:p-4 shadow-xl border-[#993887] z-50"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
      )}
    </motion.div>
  );
}
