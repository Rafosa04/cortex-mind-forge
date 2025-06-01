import React, { useState, useEffect, useCallback } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bot, CircleCheck, CirclePlus, Trash2, Edit, Share2, Copy, FileText, Star, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProjectWithSteps } from "@/services/projectsService";
import { useProjetos } from "@/hooks/useProjetos";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { saveAthenaLog } from "@/utils/athenaUtils";
import { AthenaProjectSuggestion } from "./AthenaProjectSuggestion";
import { ProjetoModoFoco } from "./ProjetoModoFoco";
import { supabase } from "@/integrations/supabase/client";
import { enableRealtimeForTable } from "@/utils/supabaseUtils";
import { AthenaProjectInsights } from "./AthenaProjectInsights";

type Props = {
  projeto: ProjectWithSteps | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onProjectUpdated?: () => void;
}

export function DrawerDetalheProjeto({ projeto, open, onOpenChange, onProjectUpdated }: Props) {
  const { 
    atualizarEtapa, 
    atualizarStatusProjeto, 
    adicionarEtapa, 
    removerEtapa,
    toggleFavoritoProjeto,
    atualizarTagsProjeto,
    atualizarConteudoProjeto,
    removerProjeto
  } = useProjetos();
  
  const [novaEtapa, setNovaEtapa] = useState("");
  const [adicionandoEtapa, setAdicionandoEtapa] = useState(false);
  const [statusAtual, setStatusAtual] = useState<"ativo" | "pausado" | "concluído">("ativo");
  const [conteudo, setConteudo] = useState("");
  const [editandoConteudo, setEditandoConteudo] = useState(false);
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [projetoTags, setProjetoTags] = useState<string[]>([]);
  const [isAthenaDialogOpen, setIsAthenaDialogOpen] = useState(false);
  const [isModoFocoAtivo, setIsModoFocoAtivo] = useState(false);
  const [localProjeto, setLocalProjeto] = useState<ProjectWithSteps | null>(null);
  
  // Set up Realtime subscription when the component mounts
  useEffect(() => {
    // Enable realtime for project_steps and projects tables
    const setupRealtime = async () => {
      await enableRealtimeForTable('project_steps');
      await enableRealtimeForTable('projects');
    };
    
    setupRealtime();
    
    // Cleanup function for the channel subscription
    return () => {};
  }, []);
  
  // Update local state when project changes
  useEffect(() => {
    if (projeto) {
      setLocalProjeto(projeto);
      setStatusAtual(projeto.status as "ativo" | "pausado" | "concluído");
      setConteudo(projeto.content || "");
      setProjetoTags(projeto.tags || []);
    }
  }, [projeto]);
  
  // Set up realtime subscription for project updates
  useEffect(() => {
    if (!projeto) return;
    
    const projectId = projeto.id;
    
    // Subscribe to changes in the project_steps table
    const channel = supabase
      .channel('project-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'project_steps',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        console.log('Project steps change received:', payload);
        if (onProjectUpdated) {
          onProjectUpdated();
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${projectId}`
      }, (payload) => {
        console.log('Project change received:', payload);
        if (onProjectUpdated) {
          onProjectUpdated();
        }
        
        // Update local UI immediately for favorite toggle
        if (payload.eventType === 'UPDATE' && payload.new && localProjeto) {
          const updatedProject = payload.new as any;
          
          // Update local project state to reflect changes
          setLocalProjeto(prev => {
            if (!prev) return null;
            return {
              ...prev,
              is_favorite: updatedProject.is_favorite,
              status: updatedProject.status,
              tags: updatedProject.tags,
              content: updatedProject.content,
              progress: updatedProject.progress
            };
          });
        }
      })
      .subscribe();
    
    // Cleanup subscription when component unmounts or project changes
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projeto?.id, onProjectUpdated]);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  }, []);

  if (!localProjeto) return null;

  const handleToggleEtapa = async (etapaId: string, concluida: boolean) => {
    const sucesso = await atualizarEtapa(etapaId, concluida);
    
    // Immediately update local UI state
    if (sucesso) {
      setLocalProjeto(prev => {
        if (!prev) return null;
        
        // Update the specific step
        const updatedSteps = prev.steps.map(step => 
          step.id === etapaId ? {...step, done: concluida} : step
        );
        
        // Calculate new progress
        const totalSteps = updatedSteps.length;
        const completedSteps = updatedSteps.filter(step => step.done).length;
        const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        
        return {
          ...prev,
          steps: updatedSteps,
          progress: newProgress
        };
      });
    }
    
    return sucesso;
  };

  const handleChangeStatus = async (novoStatus: "ativo" | "pausado" | "concluído") => {
    const success = await atualizarStatusProjeto(localProjeto.id, novoStatus);
    
    if (success) {
      setStatusAtual(novoStatus);
      setLocalProjeto(prev => prev ? {...prev, status: novoStatus} : null);
      
      toast({
        title: "Status atualizado",
        description: `Status do projeto alterado para ${novoStatus}`,
      });
    }
  };

  const handleAddEtapa = async () => {
    if (!novaEtapa.trim()) {
      toast({
        title: "Erro",
        description: "A descrição da etapa não pode estar vazia",
        variant: "destructive",
      });
      return;
    }

    setAdicionandoEtapa(true);
    const result = await adicionarEtapa(localProjeto.id, novaEtapa);
    setAdicionandoEtapa(false);

    if (result) {
      toast({
        title: "Sucesso",
        description: "Etapa adicionada com sucesso",
      });
      setNovaEtapa("");
      
      // Update local state
      setLocalProjeto(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps, {
          id: result.id,
          project_id: result.project_id,
          description: result.description,
          done: result.done,
          order_index: result.order_index,
          created_at: result.created_at
        }];
        
        return {
          ...prev,
          steps: updatedSteps
        };
      });
    }
  };

  const handleRemoveEtapa = async (etapaId: string) => {
    const confirmacao = confirm("Tem certeza que deseja remover esta etapa?");
    if (!confirmacao) return;

    const success = await removerEtapa(etapaId);
    
    if (success) {
      // Update local state immediately
      setLocalProjeto(prev => {
        if (!prev) return null;
        
        const updatedSteps = prev.steps.filter(step => step.id !== etapaId);
        
        // Recalculate progress
        const totalSteps = updatedSteps.length;
        const completedSteps = updatedSteps.filter(step => step.done).length;
        const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        
        return {
          ...prev,
          steps: updatedSteps,
          progress: newProgress
        };
      });
    }
  };

  const handleToggleFavorite = async () => {
    const newFavoriteState = !localProjeto.is_favorite;
    const success = await toggleFavoritoProjeto(localProjeto.id, newFavoriteState);
    
    if (success) {
      // Update local state immediately
      setLocalProjeto(prev => prev ? {...prev, is_favorite: newFavoriteState} : null);
    }
  };

  const handleSaveContent = async () => {
    const success = await atualizarConteudoProjeto(localProjeto.id, conteudo);
    
    if (success) {
      setEditandoConteudo(false);
      setLocalProjeto(prev => prev ? {...prev, content: conteudo} : null);
      
      toast({
        title: "Conteúdo salvo",
        description: "O conteúdo do projeto foi atualizado",
      });
    }
  };

  const handleRemoveProject = async () => {
    const confirmacao = confirm(`Tem certeza que deseja remover o projeto "${localProjeto.name}"? Esta ação não pode ser desfeita.`);
    if (!confirmacao) return;

    const success = await removerProjeto(localProjeto.id);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (projetoTags.includes(tagInput.trim())) {
      toast({
        title: "Tag já existe",
        description: "Esta tag já foi adicionada ao projeto",
        variant: "destructive",
      });
      return;
    }
    setProjetoTags([...projetoTags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setProjetoTags(projetoTags.filter(t => t !== tag));
  };

  const handleSaveTags = async () => {
    const success = await atualizarTagsProjeto(localProjeto.id, projetoTags);
    
    if (success) {
      setIsTagsDialogOpen(false);
      setLocalProjeto(prev => prev ? {...prev, tags: projetoTags} : null);
    }
  };

  const handleSugerirEtapaComAthena = () => {
    setIsAthenaDialogOpen(true);
  };

  const handleModoFoco = () => {
    setIsModoFocoAtivo(true);
  };

  const exportAsPDF = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A exportação para PDF estará disponível em breve."
    });
  };
  
  const exportAsMarkdown = () => {
    // Create markdown content
    let markdown = `# ${localProjeto.name}\n\n`;
    
    if (localProjeto.description) {
      markdown += `${localProjeto.description}\n\n`;
    }
    
    markdown += `**Status:** ${localProjeto.status}\n`;
    markdown += `**Progresso:** ${localProjeto.progress}%\n`;
    
    if (localProjeto.category) {
      markdown += `**Categoria:** ${localProjeto.category}\n`;
    }
    
    if (localProjeto.tags && localProjeto.tags.length > 0) {
      markdown += `**Tags:** ${localProjeto.tags.join(', ')}\n`;
    }
    
    markdown += `**Criado em:** ${formatDate(localProjeto.created_at)}\n`;
    
    if (localProjeto.deadline) {
      markdown += `**Prazo:** ${formatDate(localProjeto.deadline)}\n`;
    }
    
    markdown += '\n## Etapas\n\n';
    
    if (localProjeto.steps && localProjeto.steps.length > 0) {
      localProjeto.steps.forEach(etapa => {
        markdown += `- [${etapa.done ? 'x' : ' '}] ${etapa.description}\n`;
      });
    } else {
      markdown += 'Nenhuma etapa definida.\n';
    }
    
    if (localProjeto.content) {
      markdown += '\n## Conteúdo / Anotações\n\n';
      markdown += localProjeto.content + '\n';
    }
    
    // Create a download link
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projeto_${localProjeto.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: "O projeto foi exportado em formato Markdown."
    });
  };
  
  const handleCloneProjeto = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de clonar projeto estará disponível em breve."
    });
  };
  
  const handleShareProjeto = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de compartilhar projeto estará disponível em breve."
    });
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="w-full max-w-4xl ml-auto rounded-t-2xl md:rounded-l-2xl md:rounded-t-none h-[90vh] md:h-auto glass-morphism shadow-xl border-l-2 border-[#60B5B5]/40">
          <DrawerHeader>
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-2xl font-bold text-primary drop-shadow flex items-center gap-2">
                {localProjeto.name}
                <div className="dropdown-select ml-2">
                  <select 
                    value={statusAtual}
                    onChange={(e) => handleChangeStatus(e.target.value as any)}
                    className="text-xs bg-[#191933]/60 text-[#60B5B5] px-2 py-1 rounded-lg font-normal border border-[#60B5B5]/40"
                  >
                    <option value="ativo">ativo</option>
                    <option value="pausado">pausado</option>
                    <option value="concluído">concluído</option>
                  </select>
                </div>
              </DrawerTitle>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Editar" 
                  onClick={() => toast({
                    title: "Edição",
                    description: "Edite os campos específicos diretamente"
                  })}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Clonar"
                  onClick={handleCloneProjeto}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Exportar"
                  onClick={exportAsMarkdown}
                >
                  <FileText className="w-4 h-4" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Compartilhar"
                  onClick={handleShareProjeto}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title={localProjeto.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  onClick={handleToggleFavorite}
                  className={localProjeto.is_favorite ? "text-[#993887]" : ""}
                >
                  <Star className={`w-4 h-4 ${localProjeto.is_favorite ? "fill-[#993887]" : ""}`} />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Remover"
                  onClick={handleRemoveProject}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
            <DrawerDescription className="text-secondary text-sm">{localProjeto.description || "Sem descrição"}</DrawerDescription>
            
            {/* Tags display */}
            <div className="flex flex-wrap gap-1 mt-2">
              {localProjeto.tags && localProjeto.tags.map(tag => (
                <Badge key={tag} className="bg-[#993887]/30 text-[#E6E6F0]">{tag}</Badge>
              ))}
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 px-2 text-xs border-[#993887]/40"
                onClick={() => setIsTagsDialogOpen(true)}
              >
                Editar tags
              </Button>
            </div>
          </DrawerHeader>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Coluna Principal (Esquerda) */}
            <div className="flex-1 px-6 pb-6 overflow-y-auto max-h-[65vh]">
              {/* Bloco Etapas */}
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary mb-2 block">Etapas</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-7 px-2 text-xs text-primary hover:bg-[#60B5B5]/10"
                    onClick={handleSugerirEtapaComAthena}
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    Sugerir com Athena
                  </Button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {localProjeto.steps && localProjeto.steps.length > 0 ? (
                    localProjeto.steps.map((etapa) => (
                      <div key={etapa.id} className={`flex items-center gap-2 p-2 rounded-lg transition ${etapa.done ? "bg-[#60B5B522]" : "bg-[#191933]/40"}`}>
                        <label className="flex items-center gap-2 cursor-pointer flex-grow">
                          <input 
                            type="checkbox" 
                            checked={etapa.done} 
                            onChange={() => handleToggleEtapa(etapa.id, !etapa.done)} 
                            className="accent-[#60B5B5] w-5 h-5" 
                          />
                          <span className={etapa.done ? "line-through text-secondary/70" : ""}>
                            {etapa.description}
                          </span>
                          {etapa.done && <CircleCheck className="w-4 h-4 text-[#60B5B5]" />}
                        </label>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => handleRemoveEtapa(etapa.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-secondary/70 italic p-2">Nenhuma etapa definida.</div>
                  )}
                  
                  <div className="mt-2 flex gap-2 items-center">
                    <Input
                      placeholder="Adicionar nova etapa..."
                      value={novaEtapa}
                      onChange={(e) => setNovaEtapa(e.target.value)}
                      className="bg-[#191933]/40 border-[#60B5B5]/20"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddEtapa()}
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-[#60B5B5] text-primary"
                      onClick={handleAddEtapa}
                      disabled={adicionandoEtapa || !novaEtapa.trim()}
                    >
                      <CirclePlus className="w-4 h-4 mr-1" />
                      {adicionandoEtapa ? "Salvando..." : "Adicionar"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Bloco Conteúdo */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-primary">Conteúdo / Anotações</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 px-2 text-xs"
                    onClick={() => setEditandoConteudo(!editandoConteudo)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    {editandoConteudo ? "Cancelar" : "Editar"}
                  </Button>
                </div>
                
                {editandoConteudo ? (
                  <div className="flex flex-col gap-2">
                    <Textarea 
                      value={conteudo} 
                      onChange={(e) => setConteudo(e.target.value)}
                      rows={5}
                      className="bg-[#191933]/60 border-[#60B5B5]/20 text-foreground/90"
                      placeholder="Anote suas ideias, questões ou referências para este projeto..."
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSaveContent}
                      className="self-end"
                    >
                      Salvar
                    </Button>
                  </div>
                ) : (
                  <div className="bg-[#191933]/60 p-3 rounded-lg text-foreground/90 min-h-[64px]">
                    {conteudo ? conteudo : "Sem conteúdo ou anotações. Clique em Editar para adicionar."}
                  </div>
                )}
              </div>
              
              {/* Histórico Narrativo */}
              <div className="mt-6">
                <span className="font-semibold text-primary mb-2 block">Histórico Narrativo</span>
                <ul className="text-xs text-secondary/90 space-y-2">
                  <li>[{formatDate(localProjeto.created_at)}] Projeto criado</li>
                  {localProjeto.steps && localProjeto.steps.filter(s => s.done).map((step, i) => (
                    <li key={i}>[{formatDate(step.created_at)}] Etapa "{step.description}" concluída</li>
                  ))}
                </ul>
              </div>
              
              {/* Integrações */}
              <div className="mt-6">
                <span className="font-semibold text-primary mb-2 block">Integrações</span>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-[#60B5B5]/40 text-primary gap-1 flex items-center"
                    onClick={handleModoFoco}
                  >
                    <Eye className="w-4 h-4" />Modo Foco
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant={localProjeto.is_favorite ? "secondary" : "outline"} 
                    className={`${!localProjeto.is_favorite ? "border-[#993887]/40 text-secondary" : ""} gap-1 flex items-center`}
                    onClick={handleToggleFavorite}
                  >
                    <Star className={`w-4 h-4 ${localProjeto.is_favorite ? "fill-white" : ""}`} />
                    {localProjeto.is_favorite ? "Favorito" : "Favoritar"}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-[#60B5B5]/40 text-primary gap-1 flex items-center"
                    onClick={handleShareProjeto}
                  >
                    <Share2 className="w-4 h-4" />Compartilhar
                  </Button>
                </div>
              </div>
              
              {/* Progresso e Datas */}
              <div className="mt-8 flex gap-12 items-center">
                <div className="flex-1">
                  <span className="block text-xs text-secondary">Progresso</span>
                  <Progress value={localProjeto.progress} className="h-2 bg-[#191933]" />
                  <span className="block text-xs mt-1 text-secondary">{localProjeto.progress}%</span>
                </div>
                <div className="space-y-1 text-xs text-secondary/80">
                  <div>Criado: <span>{formatDate(localProjeto.created_at)}</span></div>
                  <div>Prazo: <span>{formatDate(localProjeto.deadline)}</span></div>
                  <div>Última At.: <span>{formatDate(localProjeto.created_at)}</span></div>
                </div>
              </div>
            </div>
            
            {/* Coluna de Insights da Athena (Direita) */}
            <div className="w-80 border-l border-[#60B5B5]/20 p-6 overflow-y-auto bg-[#141429]/50">
              <AthenaProjectInsights projeto={localProjeto} />
            </div>
          </div>
          
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full mt-2">Fechar</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* Dialog for editing tags */}
      <Dialog open={isTagsDialogOpen} onOpenChange={setIsTagsDialogOpen}>
        <DialogContent className="bg-[#141429] border-[#60B5B5]/40">
          <DialogHeader>
            <DialogTitle className="text-primary">Editar Tags</DialogTitle>
            <DialogDescription>
              Adicione ou remova tags para categorizar seu projeto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-wrap gap-2 my-4">
            {projetoTags.map(tag => (
              <Badge 
                key={tag} 
                className="flex items-center gap-1 bg-[#993887]/30 text-[#E6E6F0] px-2 py-1"
              >
                {tag}
                <button 
                  className="ml-1 text-[#E6E6F0]/70 hover:text-[#E6E6F0]"
                  onClick={() => handleRemoveTag(tag)}
                >
                  &times;
                </button>
              </Badge>
            ))}
            {projetoTags.length === 0 && (
              <span className="text-secondary/70 text-sm italic">Nenhuma tag adicionada</span>
            )}
          </div>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nova tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="bg-[#191933] border-[#993887]/30"
            />
            <Button 
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              variant="outline"
              className="border-[#993887]/40 text-secondary"
            >
              Adicionar
            </Button>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSaveTags}>Salvar Tags</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Athena Suggestion Dialog */}
      <AthenaProjectSuggestion 
        open={isAthenaDialogOpen}
        onOpenChange={setIsAthenaDialogOpen}
        projectId={localProjeto.id}
        projectName={localProjeto.name}
        projectDescription={localProjeto.description}
      />
      
      {/* Modo Foco */}
      {isModoFocoAtivo && (
        <ProjetoModoFoco 
          projeto={localProjeto}
          onClose={() => setIsModoFocoAtivo(false)}
          onToggleEtapa={handleToggleEtapa}
        />
      )}
    </>
  );
}
