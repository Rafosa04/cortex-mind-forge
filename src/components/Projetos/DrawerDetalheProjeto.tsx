
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bot, CircleCheck, CirclePlus, CircleMinus, Trash2, Edit, Share2, Copy, FileText, Star, Eye, EyeOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProjectWithSteps } from "@/services/projectsService";
import { useProjetos } from "@/hooks/useProjetos";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  projeto: ProjectWithSteps | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function DrawerDetalheProjeto({ projeto, open, onOpenChange }: Props) {
  const { atualizarEtapa, atualizarStatusProjeto, adicionarEtapa, removerEtapa } = useProjetos();
  const [novaEtapa, setNovaEtapa] = useState("");
  const [adicionandoEtapa, setAdicionandoEtapa] = useState(false);
  const [statusAtual, setStatusAtual] = useState<"ativo" | "pausado" | "concluído">("ativo");

  // Update local status state when project changes
  React.useEffect(() => {
    if (projeto && projeto.status) {
      setStatusAtual(projeto.status);
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-full max-w-lg ml-auto rounded-t-2xl md:rounded-l-2xl md:rounded-t-none h-[90vh] md:h-auto glass-morphism shadow-xl border-l-2 border-[#60B5B5]/40">
        <DrawerHeader>
          <div className="flex justify-between items-center">
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
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" title="Editar"><Edit className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" title="Clonar"><Copy className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" title="Exportar"><FileText className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" title="Compartilhar"><Share2 className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" title="Favoritar"><Star className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" title="Remover"><Trash2 className="w-4 h-4 text-red-500" /></Button>
            </div>
          </div>
          <DrawerDescription className="text-secondary text-sm">{projeto.description || "Sem descrição"}</DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6 overflow-y-auto max-h-[65vh]">
          {/* Bloco Etapas */}
          <div>
            <span className="font-semibold text-primary mb-2 block">Etapas</span>
            <div className="flex flex-col gap-2">
              {projeto.steps && projeto.steps.length > 0 ? (
                projeto.steps.map((etapa) => (
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
          {/* Bloco Conteúdo e Histórico */}
          <div className="mt-6">
            <span className="font-semibold text-primary mb-2 block">Conteúdo / Anotações</span>
            <div className="bg-[#191933]/60 p-3 rounded-lg text-foreground/90 min-h-[64px]">Bloco de texto livre/markdown (mockado).</div>
          </div>
          <div className="mt-6">
            <span className="font-semibold text-primary mb-2 block">Histórico Narrativo</span>
            <ul className="text-xs text-secondary/90 space-y-2">
              <li>[{formatDate(projeto.created_at)}] Projeto criado</li>
              {projeto.steps && projeto.steps.filter(s => s.done).map((step, i) => (
                <li key={i}>[{formatDate(step.created_at)}] Etapa "{step.description}" concluída</li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <span className="font-semibold text-primary mb-2 block">Integrações</span>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="border-[#60B5B5]/40 text-primary gap-1 flex items-center"><Eye className="w-4 h-4" />Modo Foco</Button>
              <Button size="sm" variant="outline" className="border-[#993887]/40 text-secondary gap-1 flex items-center" ><Star className="w-4 h-4" />Favoritos</Button>
              <Button size="sm" variant="outline" className="border-[#60B5B5]/40 text-primary gap-1 flex items-center"><Share2 className="w-4 h-4" />Compartilhar</Button>
            </div>
          </div>
          {/* Progresso e Datas */}
          <div className="mt-8 flex gap-12 items-center">
            <div>
              <span className="block text-xs text-secondary">Progresso</span>
              <Progress value={projeto.progress} className="h-2 bg-[#191933]" />
              <span className="block text-xs mt-1 text-secondary">{projeto.progress}%</span>
            </div>
            <div className="space-y-1 text-xs text-secondary/80">
              <div>Criado: <span>{formatDate(projeto.created_at)}</span></div>
              <div>Prazo: <span>{formatDate(projeto.deadline)}</span></div>
              <div>Última At.: <span>{formatDate(projeto.created_at)}</span></div>
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
