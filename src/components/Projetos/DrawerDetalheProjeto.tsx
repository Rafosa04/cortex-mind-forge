
import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bot, CircleCheck, CirclePlus, Trash2, Edit, Share2, Copy, FileText, Star, Eye, Calendar, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProjectWithSteps } from "@/services/projectsService";
import { useProjetos } from "@/hooks/useProjetos";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';

type Props = {
  projeto: ProjectWithSteps | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function DrawerDetalheProjeto({ projeto, open, onOpenChange }: Props) {
  const { atualizarEtapa, atualizarStatusProjeto, adicionarEtapa, removerEtapa, atualizarProjeto } = useProjetos();
  const [novaEtapa, setNovaEtapa] = useState("");
  const [adicionandoEtapa, setAdicionandoEtapa] = useState(false);
  const [statusAtual, setStatusAtual] = useState<"ativo" | "pausado" | "concluído">("ativo");
  const [editMode, setEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: "",
    description: "",
    content: "",
    isFavorite: false
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when project changes
  useEffect(() => {
    if (projeto) {
      setStatusAtual(projeto.status || "ativo");
      setEditedProject({
        name: projeto.name || "",
        description: projeto.description || "",
        content: projeto.content || "",
        isFavorite: projeto.is_favorite || false
      });
    }
  }, [projeto]);

  if (!projeto) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  const handleToggleEtapa = async (etapaId: string, concluida: boolean) => {
    await atualizarEtapa(etapaId, concluida);
  };

  const handleChangeStatus = async (novoStatus: "ativo" | "pausado" | "concluído") => {
    const success = await atualizarStatusProjeto(projeto.id, novoStatus);
    if (success) {
      setStatusAtual(novoStatus);
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
    const result = await adicionarEtapa(projeto.id, novaEtapa);
    setAdicionandoEtapa(false);

    if (result) {
      toast({
        title: "Sucesso",
        description: "Etapa adicionada com sucesso",
      });
      setNovaEtapa("");
    }
  };

  const handleRemoveEtapa = async (etapaId: string) => {
    const confirmacao = confirm("Tem certeza que deseja remover esta etapa?");
    if (!confirmacao) return;

    const success = await removerEtapa(etapaId);
    if (success) {
      toast({
        title: "Sucesso",
        description: "Etapa removida com sucesso",
      });
    }
  };

  const handleSaveEdits = async () => {
    setIsSaving(true);
    try {
      const success = await atualizarProjeto(projeto.id, {
        name: editedProject.name,
        description: editedProject.description,
        content: editedProject.content,
        is_favorite: editedProject.isFavorite
      });
      
      if (success) {
        toast({
          title: "Alterações salvas",
          description: "O projeto foi atualizado com sucesso",
        });
        setEditMode(false);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o projeto",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async () => {
    const updatedValue = !editedProject.isFavorite;
    
    setEditedProject(prev => ({
      ...prev, 
      isFavorite: updatedValue
    }));
    
    try {
      await atualizarProjeto(projeto.id, {
        is_favorite: updatedValue
      });
      
      toast({
        title: updatedValue ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: updatedValue ? "Projeto marcado como favorito" : "Projeto removido dos favoritos",
      });
    } catch (error) {
      setEditedProject(prev => ({
        ...prev, 
        isFavorite: !updatedValue  // revert on error
      }));
      
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-full max-w-lg ml-auto rounded-t-2xl md:rounded-l-2xl md:rounded-t-none h-[90vh] md:h-auto glass-morphism shadow-xl border-l-2 border-[#60B5B5]/40">
        <DrawerHeader>
          <div className="flex justify-between items-center">
            {editMode ? (
              <Input
                value={editedProject.name}
                onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
                className="text-xl font-bold text-primary"
              />
            ) : (
              <DrawerTitle className="text-2xl font-bold text-primary drop-shadow flex items-center gap-2">
                {projeto.name}
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
            )}
            <div className="flex items-center gap-2">
              {editMode ? (
                <Button 
                  size="sm"
                  onClick={handleSaveEdits}
                  disabled={isSaving}
                  className="flex items-center gap-1 bg-primary text-background hover:bg-primary/80"
                >
                  <Save className="w-4 h-4" /> Salvar
                </Button>
              ) : (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Editar" 
                  onClick={() => setEditMode(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                title={editedProject.isFavorite ? "Remover favorito" : "Favoritar"} 
                onClick={handleToggleFavorite}
                className={editedProject.isFavorite ? "text-yellow-400" : ""}
              >
                <Star className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Clonar"><Copy className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" title="Exportar"><FileText className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" title="Compartilhar"><Share2 className="w-4 h-4" /></Button>
            </div>
          </div>
          {editMode ? (
            <Textarea
              value={editedProject.description || ""}
              onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
              className="text-secondary text-sm mt-2"
              placeholder="Adicione uma descrição..."
              rows={2}
            />
          ) : (
            <DrawerDescription className="text-secondary text-sm">
              {projeto.description || "Sem descrição"}
            </DrawerDescription>
          )}
        </DrawerHeader>
        <div className="px-6 pb-6 overflow-y-auto max-h-[65vh]">
          <Tabs defaultValue="steps">
            <TabsList className="w-full bg-[#141429]/60">
              <TabsTrigger value="steps" className="flex-1">Etapas</TabsTrigger>
              <TabsTrigger value="content" className="flex-1">Anotações</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="steps" className="pt-4">
              <div className="flex flex-col gap-2">
                {projeto.steps && projeto.steps.length > 0 ? (
                  projeto.steps.map((etapa) => (
                    <motion.div
                      key={etapa.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center gap-2 p-2 rounded-lg transition ${etapa.done ? "bg-[#60B5B522]" : "bg-[#191933]/40"}`}
                    >
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
                    </motion.div>
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
            </TabsContent>
            
            <TabsContent value="content" className="pt-4">
              {editMode ? (
                <Textarea
                  value={editedProject.content || ""}
                  onChange={(e) => setEditedProject({...editedProject, content: e.target.value})}
                  className="min-h-[200px] bg-[#191933]/40 border-[#60B5B5]/20"
                  placeholder="Escreva aqui suas notas em markdown..."
                />
              ) : (
                <div className="bg-[#191933]/60 p-3 rounded-lg text-foreground/90 min-h-[200px] prose prose-sm prose-invert max-w-none">
                  {projeto.content ? (
                    <ReactMarkdown>{projeto.content}</ReactMarkdown>
                  ) : (
                    <div className="text-secondary/70 italic">
                      Nenhuma anotação adicionada. Clique em "Editar" para adicionar conteúdo.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              <ul className="text-xs text-secondary/90 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>[{formatDate(projeto.created_at)}] Projeto criado</span>
                </li>
                {projeto.steps && projeto.steps.filter(s => s.done).map((step, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span>[{formatDate(step.created_at)}] Etapa "{step.description}" concluída</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex gap-12 items-center">
            <div>
              <span className="block text-xs text-secondary">Progresso</span>
              <Progress value={projeto.progress} className="h-2 bg-[#191933]" />
              <span className="block text-xs mt-1 text-secondary">{projeto.progress}%</span>
            </div>
            <div className="space-y-1 text-xs text-secondary/80">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Criado: {formatDate(projeto.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Prazo: {formatDate(projeto.deadline)}</span>
              </div>
            </div>
          </div>
        </div>
        <DrawerClose asChild>
          <Button variant="secondary" className="w-full mt-2">Fechar</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
