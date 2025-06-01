import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EnhancedFiltroProjetos } from "@/components/Projetos/EnhancedFiltroProjetos";
import { EnhancedProjetoCard } from "@/components/Projetos/EnhancedProjetoCard";
import { EnhancedNovaCelulaModal } from "@/components/Projetos/EnhancedNovaCelulaModal";
import { AthenaCommandBar } from "@/components/Projetos/AthenaCommandBar";
import { Plus, Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { DrawerDetalheProjeto } from "@/components/Projetos/DrawerDetalheProjeto";
import { FiltroLateralProjetos } from "@/components/Projetos/FiltroLateralProjetos";
import { FloatingAthenaButton } from "@/components/Projetos/FloatingAthenaButton";
import { useProjetos } from "@/hooks/useProjetos";
import { ProjectWithSteps } from "@/services/projectsService";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ProjetoTimeline } from "@/components/Projetos/ProjetoTimeline";
import { ProjetoGaleria } from "@/components/Projetos/ProjetoGaleria";

const modosVisao = ["Lista", "Kanban", "Linha do tempo", "Galeria"] as const;
type ModoVisao = typeof modosVisao[number];

const STATUS_OPTIONS = ["ativo", "pausado", "concluído"] as const;
type StatusOption = typeof STATUS_OPTIONS[number];

export default function Projetos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [detalheAberto, setDetalheAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjectWithSteps | null>(null);
  const [modoVisao, setModoVisao] = useState<ModoVisao>("Lista");
  const [abrirAthena, setAbrirAthena] = useState(false);
  const [draggingProject, setDraggingProject] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterDeadline, setFilterDeadline] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { 
    projetos, 
    allProjetos,
    loading, 
    error, 
    carregarProjetos, 
    removerProjeto,
    toggleFavoritoProjeto,
    atualizarStatusProjeto,
    filterText,
    setFilterText,
    filterTags,
    setFilterTags,
    filterStatus,
    setFilterStatus
  } = useProjetos();

  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    if (allProjetos.length) {
      const tags = new Set<string>();
      allProjetos.forEach(projeto => {
        if (projeto.tags) {
          projeto.tags.forEach(tag => tags.add(tag));
        }
      });
      setAvailableTags(Array.from(tags));
    }
  }, [allProjetos]);

  const getFilteredProjetos = () => {
    let filtered = [...projetos];
    
    // AI Priority filtering
    if (filterPriority) {
      filtered = filtered.filter(projeto => {
        const daysSinceCreation = Math.floor(
          (new Date().getTime() - new Date(projeto.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        switch (filterPriority) {
          case "critical":
            return projeto.deadline && new Date(projeto.deadline) < new Date();
          case "attention":
            return projeto.status === "ativo" && daysSinceCreation > 14 && projeto.progress < 20;
          case "good":
            return projeto.progress > 60 && projeto.status === "ativo";
          default:
            return true;
        }
      });
    }
    
    // Deadline filtering
    if (filterDeadline) {
      const today = new Date();
      filtered = filtered.filter(projeto => {
        if (!projeto.deadline && filterDeadline === "no-deadline") return true;
        if (!projeto.deadline) return false;
        
        const deadline = new Date(projeto.deadline);
        const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filterDeadline) {
          case "overdue":
            return diffDays < 0;
          case "week":
            return diffDays >= 0 && diffDays <= 7;
          case "month":
            return diffDays >= 0 && diffDays <= 30;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const handleVerDetalhes = (projeto: ProjectWithSteps) => {
    setProjetoSelecionado(projeto);
    setDetalheAberto(true);
  };

  const getProjetosPorStatus = (status: string) => {
    return getFilteredProjetos().filter(p => p.status === status);
  };

  const handleRemoveProjeto = async (projetoId: string) => {
    const result = await removerProjeto(projetoId);
    if (result && projetoSelecionado?.id === projetoId) {
      setDetalheAberto(false);
    }
    return result;
  };

  const handleToggleFavorite = async (projetoId: string, isFavorite: boolean) => {
    return await toggleFavoritoProjeto(projetoId, isFavorite);
  };

  const handleSugerirEtapa = (projeto: ProjectWithSteps) => {
    navigate(`/athena?project=${projeto.id}&type=etapa`);
  };

  const handleAthenaAction = (action: string) => {
    if (action === "open_chat") {
      navigate("/athena");
    }
  };

  const handleAthenaCommand = (command: string) => {
    toast({
      title: "Comando Athena processado",
      description: "Verifique o chat da Athena para ver a resposta",
    });
  };

  const handleAthenaSearch = (query: string) => {
    setFilterText(query);
  };

  const handleAthenaFilter = (query: string) => {
    if (query.includes("atenção")) {
      setFilterPriority("attention");
    }
    toast({
      title: "Filtro IA aplicado",
      description: query,
    });
  };
  
  const handleDragStart = (projectId: string) => {
    setDraggingProject(projectId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: StatusOption) => {
    e.preventDefault();
    
    if (draggingProject) {
      const projectToUpdate = getFilteredProjetos().find(p => p.id === draggingProject);
      
      if (projectToUpdate && projectToUpdate.status !== newStatus) {
        atualizarStatusProjeto(draggingProject, newStatus);
        toast({
          title: "Status atualizado",
          description: `Projeto movido para ${newStatus}`
        });
      }
      
      setDraggingProject(null);
    }
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
      <FiltroLateralProjetos modo={modoVisao} setModo={setModoVisao} />
      
      <div className="flex-1 min-w-0 mt-4 md:mt-0">
        <header className="flex items-center justify-between py-2 mb-4 gap-2 sm:gap-4 flex-wrap">
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#993887] via-[#60B5B5] to-primary bg-clip-text text-transparent drop-shadow">
              Minhas Células de Conhecimento
            </h2>
            <p className="text-sm text-secondary/70 mt-1">
              Células vivas que evoluem com você • Potencializadas pela Athena
            </p>
          </motion.div>
          
          <Button
            variant="default"
            className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#993887] to-[#60B5B5] hover:from-[#993887]/80 hover:to-[#60B5B5]/80 text-white rounded-lg font-bold shadow-lg neon-anim"
            onClick={() => setModalAberto(true)}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> 
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Nova Célula
          </Button>
        </header>
        
        {/* Enhanced Command Bar with Athena Integration */}
        <AthenaCommandBar 
          onCommand={handleAthenaCommand}
          onSearch={handleAthenaSearch}
          className="mb-6"
        />
        
        <EnhancedFiltroProjetos 
          filterText={filterText}
          setFilterText={setFilterText}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterDeadline={filterDeadline}
          setFilterDeadline={setFilterDeadline}
          allTags={availableTags}
          onAthenaFilter={handleAthenaFilter}
        />
        
        {error && !loading && (
          <div className="p-6 text-center">
            <p className="text-red-400 mb-2">Erro ao carregar células</p>
            <Button onClick={() => carregarProjetos()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        )}
        
        {!loading && !error && getFilteredProjetos().length === 0 && (
          <div className="rounded-xl bg-[#191933]/60 p-6 sm:p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
            <Bot className="w-16 h-16 text-[#993887]/50 mb-4" />
            <span className="text-xl mb-2">Nenhuma célula encontrada</span>
            <div className="mt-4 text-base text-center max-w-md">
              {allProjetos.length === 0
                ? "Manifeste sua primeira célula de conhecimento e comece sua jornada no CÓRTEX."
                : "Nenhum resultado corresponde aos filtros aplicados."}
            </div>
            {allProjetos.length > 0 && getFilteredProjetos().length === 0 && (
              <Button 
                variant="outline" 
                className="mt-4 border-[#993887]/40" 
                onClick={() => {
                  setFilterText('');
                  setFilterTags([]);
                  setFilterStatus(null);
                  setFilterPriority(null);
                  setFilterDeadline(null);
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}
        
        <div className="relative">
          {modoVisao === "Lista" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7 fade-in mt-1">
              {loading ? (
                renderLoaderCards()
              ) : (
                getFilteredProjetos().map((projeto) => (
                  <EnhancedProjetoCard
                    key={projeto.id}
                    projeto={projeto}
                    onVerDetalhes={handleVerDetalhes}
                    onRemoveProjeto={handleRemoveProjeto}
                    onToggleFavorite={handleToggleFavorite}
                    onSugerirEtapa={handleSugerirEtapa}
                  />
                ))
              )}
            </div>
          )}
          
          {modoVisao === "Kanban" && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-1 fade-in min-h-[350px] overflow-x-auto pb-4">
              {STATUS_OPTIONS.map((status) => (
                <div 
                  key={status} 
                  className="flex-1 min-w-[250px] bg-[#191933]/70 rounded-xl p-4 border border-[#60B5B5]/20"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status as StatusOption)}
                >
                  <div className="font-bold text-secondary mb-3 capitalize flex items-center gap-2">
                    {status}
                    <span className="text-xs bg-[#60B5B5]/20 px-2 py-1 rounded-full">
                      {getProjetosPorStatus(status).length}
                    </span>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full bg-[#141429]/90" />
                      <Skeleton className="h-32 w-full bg-[#141429]/90" />
                    </div>
                  ) : getProjetosPorStatus(status).length === 0 ? (
                    <div className="text-secondary/60 italic text-sm min-h-[100px] flex items-center justify-center border border-dashed border-[#60B5B5]/20 rounded-lg">
                      Arraste células para aqui
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {getProjetosPorStatus(status).map((projeto) => (
                        <div
                          key={projeto.id}
                          draggable
                          onDragStart={() => handleDragStart(projeto.id)}
                        >
                          <EnhancedProjetoCard
                            projeto={projeto}
                            onVerDetalhes={handleVerDetalhes}
                            onRemoveProjeto={handleRemoveProjeto}
                            onToggleFavorite={handleToggleFavorite}
                            onSugerirEtapa={handleSugerirEtapa}
                            variant="compact"
                            isDragging={draggingProject === projeto.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {modoVisao === "Linha do tempo" && (
            <div className="mt-1 pb-6 fade-in">
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-12 w-48 bg-[#191933]/70" />
                  <div className="space-y-4 ml-6">
                    <Skeleton className="h-32 w-full bg-[#141429]/90" />
                    <Skeleton className="h-32 w-full bg-[#141429]/90" />
                  </div>
                  <Skeleton className="h-12 w-40 bg-[#191933]/70 mt-8" />
                </div>
              ) : (
                <ProjetoTimeline 
                  projetos={getFilteredProjetos()}
                  onVerDetalhes={handleVerDetalhes}
                />
              )}
            </div>
          )}
          
          {modoVisao === "Galeria" && (
            <div className="mt-1 pb-6 fade-in">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-60 w-full bg-[#141429]/90 rounded-xl" />
                  ))}
                </div>
              ) : (
                <ProjetoGaleria 
                  projetos={getFilteredProjetos()}
                  onVerDetalhes={handleVerDetalhes}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mt-8 sm:mt-12 select-none"
        >
          <div className="text-sm text-[#993887]/80 font-medium mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            CÓRTEX • Inteligência Conectada
          </div>
          <div className="text-xs text-secondary/60 italic">
            "Células vivas que evoluem, pensam e se conectam • Potencializadas pela Athena"
          </div>
        </motion.div>
      </div>
      
      <DrawerDetalheProjeto
        projeto={projetoSelecionado}
        open={detalheAberto}
        onOpenChange={setDetalheAberto}
        onProjectUpdated={carregarProjetos}
      />
      
      <FloatingAthenaButton 
        onClick={() => setAbrirAthena(true)} 
        onAthenaAction={handleAthenaAction}
      />
      
      <EnhancedNovaCelulaModal open={modalAberto} onOpenChange={setModalAberto} />
    </div>
  );
}
