
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, PlusCircle, X } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjetos } from "@/hooks/useProjetos";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
};

export function NovaCelulaModal({ open, onOpenChange }: Props) {
  const { criarProjeto } = useProjetos();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [etapas, setEtapas] = useState<string[]>([""]); // Começa com uma etapa vazia
  const [prazo, setPrazo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setEtapas([""]);
    setPrazo("");
    setTags([]);
    setTagInput("");
  };

  const handleAddEtapa = () => {
    setEtapas([...etapas, ""]);
  };

  const handleEtapaChange = (index: number, value: string) => {
    const novasEtapas = [...etapas];
    novasEtapas[index] = value;
    setEtapas(novasEtapas);
  };

  const handleRemoveEtapa = (index: number) => {
    if (etapas.length <= 1) return; // Manter pelo menos uma etapa
    const novasEtapas = etapas.filter((_, i) => i !== index);
    setEtapas(novasEtapas);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) {
      toast({
        title: "Tag já existe",
        description: "Esta tag já foi adicionada ao projeto",
      });
      return;
    }
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o projeto",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Filtrar etapas vazias
      const etapasFiltradas = etapas
        .filter(e => e.trim() !== "")
        .map(texto => ({ texto, feita: false }));

      const resultado = await criarProjeto(
        nome,
        descricao,
        categoria || null,
        "ativo",
        prazo || null,
        etapasFiltradas,
        tags
      );

      if (resultado) {
        toast({
          title: "Projeto criado",
          description: "O projeto foi criado com sucesso",
        });
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-md rounded-2xl bg-background border border-[#60B5B5]/60 neon-anim">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-primary drop-shadow">
            <Bot className="text-primary w-5 h-5" /> Nova Célula
          </DialogTitle>
          <DialogDescription className="text-secondary pb-2">
            Crie uma nova célula de projeto
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input 
              id="nome" 
              placeholder="Nome do projeto" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              placeholder="Descrição do projeto" 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input 
              id="categoria" 
              placeholder="Categoria do projeto" 
              value={categoria} 
              onChange={e => setCategoria(e.target.value)} 
            />
          </div>
          
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Adicionar tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
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
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(tag => (
                <Badge 
                  key={tag}
                  className="flex items-center gap-1 bg-[#993887]/30 text-[#E6E6F0] px-2 py-1"
                >
                  {tag}
                  <button 
                    className="ml-1 text-[#E6E6F0]/70 hover:text-[#E6E6F0]"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="prazo">Prazo</Label>
            <Input 
              id="prazo" 
              type="date" 
              value={prazo} 
              onChange={e => setPrazo(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Etapas</Label>
            {etapas.map((etapa, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input 
                  placeholder={`Etapa ${index + 1}`} 
                  value={etapa} 
                  onChange={e => handleEtapaChange(index, e.target.value)} 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleRemoveEtapa(index)}
                  disabled={etapas.length <= 1}
                >
                  -
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2 text-primary border-[#60B5B5]/40" 
              onClick={handleAddEtapa}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Adicionar etapa
            </Button>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              variant="default"
              className="bg-primary hover:bg-secondary text-background rounded-lg font-bold shadow"
            >
              {isLoading ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
