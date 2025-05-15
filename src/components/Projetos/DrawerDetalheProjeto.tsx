
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bot, CircleCheck, CirclePlus, CircleMinus, Trash2, Edit, Share2, Copy, FileText, Star, Eye, EyeOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Etapa = { texto: string; feita: boolean; }
type ProjetoDetalhe = {
  nome: string;
  descricao: string;
  etapas: Etapa[];
  tags: string[];
  status: "ativo" | "pausado" | "concluído";
  progresso: number;
  datas: { criado: string; prazo: string; ultima: string; }
}

type Props = {
  projeto: ProjetoDetalhe | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function DrawerDetalheProjeto({ projeto, open, onOpenChange }: Props) {
  if (!projeto) return null;
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-full max-w-lg ml-auto rounded-t-2xl md:rounded-l-2xl md:rounded-t-none h-[90vh] md:h-auto glass-morphism shadow-xl border-l-2 border-[#60B5B5]/40">
        <DrawerHeader>
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-2xl font-bold text-primary drop-shadow flex items-center gap-2">
              {projeto.nome}
              <span className="ml-2 text-xs bg-[#191933]/60 text-[#60B5B5] px-2 py-1 rounded-lg font-normal">{projeto.status}</span>
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
          <DrawerDescription className="text-secondary text-sm">{projeto.descricao}</DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6 overflow-y-auto max-h-[65vh]">
          {/* Bloco Etapas */}
          <div>
            <span className="font-semibold text-primary mb-2 block">Etapas</span>
            <div className="flex flex-col gap-2 ">
              {projeto.etapas.map((etapa, i) => (
                <label key={i} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${etapa.feita ? "bg-[#60B5B522]" : "bg-[#191933]/40"}`}>
                  <input type="checkbox" checked={etapa.feita} readOnly className="accent-[#60B5B5] w-5 h-5" />
                  <span className={etapa.feita ? "line-through text-secondary/70" : ""}>{etapa.texto}</span>
                  {etapa.feita && <CircleCheck className="w-4 h-4 text-[#60B5B5]" />}
                </label>
              ))}
              <Button size="sm" variant="ghost" className="text-primary flex gap-1 items-center">
                <CirclePlus className="w-4 h-4" /> Adicionar etapa
              </Button>
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
              <li>[2024-04-10 09:00] Projeto criado</li>
              <li>[2024-04-15 14:38] Etapa “Início” concluída</li>
              <li>[2024-04-20 18:39] Nova tag adicionada</li>
              <li>[2024-04-29 13:00] Atualização manual</li>
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
              <Progress value={projeto.progresso} className="h-2 bg-[#191933]" />
              <span className="block text-xs mt-1 text-secondary">{projeto.progresso}%</span>
            </div>
            <div className="space-y-1 text-xs text-secondary/80">
              <div>Criado: <span>{projeto.datas.criado}</span></div>
              <div>Prazo: <span>{projeto.datas.prazo}</span></div>
              <div>Última At.: <span>{projeto.datas.ultima}</span></div>
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
