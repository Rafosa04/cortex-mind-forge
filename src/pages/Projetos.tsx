import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiltroProjetos } from "@/components/Projetos/FiltroProjetos";
import { ProjetoCard } from "@/components/Projetos/ProjetoCard";
import { NovaCelulaModal } from "@/components/Projetos/NovaCelulaModal";
import { Plus, Bot } from "lucide-react";
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

// Modos de visualização possíveis, com type literal
const modosVisao = ["Lista", "Kanban", "Linha do tempo", "Galeria"] as const;
type ModoVisao = typeof modosVisao[number];

// Status types for projects
const STATUS_OPTIONS = ["ativo", "pausado", "concluído"] as const;
type StatusOption = typeof STATUS_OPTIONS[number];

export default function Projetos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [detalheAberto, setDetalheAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjectWithSteps | null>(null);
  const [modoVisao, setModoVisao] = useState<ModoVisao>("Lista");
  const [abrirAthena, setAbrirAthena] = useState(false);
  const [draggingProject, setDraggingProject] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Get all projects data and functions from the hook
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

  // Extract all unique tags from projects for filtering
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

  const handleVerDetalhes = (projeto: ProjectWithSteps) => {
    setProjetoSelecionado(projeto);
    setDetalheAberto(true);
  };

  const getProjetosPorStatus = (status: string) => {
    return projetos.filter(p => p.status === status);
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
    // Navigate to Athena chat with project context
    navigate(`/athena?project=${projeto.id}&type=etapa`);
  };

  const handleAthenaAction = (action: string) => {
    if (action === "open_chat") {
      navigate("/athena");
    }
  };
  
  // Drag and drop handling
  const handleDragStart = (projectId: string) => {
    setDraggingProject(projectId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: StatusOption) => {
    e.preventDefault();
    
    if (draggingProject) {
      const projectToUpdate = projetos.find(p => p.id === draggingProject);
      
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
        
        <FiltroProjetos 
          filterText={filterText}
          setFilterText={setFilterText}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          allTags={availableTags}
        />
        
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
            <div className="mt-4 text-base">
              {allProjetos.length === 0
                ? "Crie sua primeira célula usando o botão 'Nova Célula'."
                : "Nenhum resultado corresponde aos filtros aplicados."}
            </div>
            {allProjetos.length > 0 && projetos.length === 0 && (
              <Button 
                variant="outline" 
                className="mt-4 border-[#993887]/40" 
                onClick={() => {
                  setFilterText('');
                  setFilterTags([]);
                  setFilterStatus(null);
                }}
              >
                Limpar filtros
              </Button>
            )}
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
                    onVerDetalhes={handleVerDetalhes}
                    onRemoveProjeto={handleRemoveProjeto}
                    onToggleFavorite={handleToggleFavorite}
                    onSugerirEtapa={handleSugerirEtapa}
                  />
                ))
              )}
            </div>
          )}
          
          {/* Kanban */}
          {modoVisao === "Kanban" && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-1 fade-in min-h-[350px] overflow-x-auto pb-4">
              {STATUS_OPTIONS.map((status) => (
                <div 
                  key={status} 
                  className="flex-1 min-w-[250px] bg-[#191933]/70 rounded-xl p-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status as StatusOption)}
                >
                  <div className="font-bold text-secondary mb-3 capitalize">{status}</div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full bg-[#141429]/90" />
                      <Skeleton className="h-32 w-full bg-[#141429]/90" />
                    </div>
                  ) : getProjetosPorStatus(status).length === 0 ? (
                    <div className="text-secondary/60 italic text-sm min-h-[100px] flex items-center justify-center border border-dashed border-[#60B5B5]/20 rounded-lg">
                      Arraste projetos para aqui
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {getProjetosPorStatus(status).map((projeto) => (
                        <div
                          key={projeto.id}
                          draggable
                          onDragStart={() => handleDragStart(projeto.id)}
                        >
                          <ProjetoCard
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
          
          {/* Linha do tempo - Agora usando o componente real */}
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
                  projetos={projetos}
                  onVerDetalhes={handleVerDetalhes}
                />
              )}
            </div>
          )}
          
          {/* Galeria */}
          {modoVisao === "Galeria" && (
            <div className="rounded-xl bg-[#191933]/60 p-6 sm:p-10 text-secondary/70 flex flex-col items-center justify-center h-[320px] fade-in">
              <span className="text-xl">[Galeria de células]</span>
              <div className="mt-4 text-base">Cards em grid de galeria (em breve).</div>
              <Button 
                variant="outline" 
                className="mt-4 border-[#60B5B5]/40"
                onClick={() => toast({
                  title: "Em desenvolvimento",
                  description: "A visualização de galeria estará disponível em breve!"
                })}
              >
                Prévia
              </Button>
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
        onProjectUpdated={carregarProjetos}
      />
      
      {/* Botão flutuante "Falar com a Athena" */}
      <FloatingAthenaButton 
        onClick={() => setAbrirAthena(true)} 
        onAthenaAction={handleAthenaAction}
      />
      
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
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-lg bg-[#191933]/70 border border-[#993887]/40 text-foreground focus:outline-none focus:border-primary text-sm"
              placeholder="Pergunte algo para Athena..."
            />
            <Button 
              size="icon" 
              variant="ghost"
              className="border-[#993887]/40"
              onClick={() => {
                navigate('/athena');
                setAbrirAthena(false);
              }}
            >
              <Bot className="w-4 h-4 text-[#993887]" />
            </Button>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-xs text-primary/70 hover:text-primary cursor-pointer" onClick={() => navigate('/athena')}>
              » Como posso organizar meu projeto?
            </div>
            <div className="text-xs text-primary/70 hover:text-primary cursor-pointer" onClick={() => navigate('/athena')}>
              » Sugira etapas para a célula
            </div>
            <div className="text-xs text-primary/70 hover:text-primary cursor-pointer" onClick={() => navigate('/athena')}>
              » Ajude-me a planejar um cronograma
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
