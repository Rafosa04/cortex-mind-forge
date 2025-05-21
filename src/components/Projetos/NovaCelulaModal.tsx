
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, PlusCircle, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjetos } from "@/hooks/useProjetos";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  categorias: string[];
};

export function NovaCelulaModal({ open, onOpenChange, categorias }: Props) {
  const { criarProjeto } = useProjetos();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [etapas, setEtapas] = useState<string[]>([""]); // Começa com uma etapa vazia
  const [prazo, setPrazo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setEtapas([""]);
    setPrazo("");
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
        etapasFiltradas
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
            {categorias.length > 0 ? (
              <div className="flex flex-col gap-2">
                <Input 
                  id="categoria" 
                  placeholder="Digite ou selecione uma categoria" 
                  value={categoria} 
                  onChange={e => setCategoria(e.target.value)} 
                  list="categorias-list"
                />
                <datalist id="categorias-list">
                  {categorias.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {categorias.slice(0, 5).map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      size="sm"
                      variant={categoria === cat ? "secondary" : "outline"}
                      onClick={() => setCategoria(cat)}
                      className="text-xs"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <Input 
                id="categoria" 
                placeholder="Categoria do projeto" 
                value={categoria} 
                onChange={e => setCategoria(e.target.value)} 
              />
            )}
          </div>
          
          <div>
            <Label htmlFor="prazo">Prazo</Label>
            <div className="flex items-center">
              <Input 
                id="prazo" 
                type="date" 
                value={prazo} 
                onChange={e => setPrazo(e.target.value)} 
                className="flex-1"
              />
              <Calendar className="ml-2 text-muted-foreground w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Etapas</Label>
            {etapas.map((etapa, index) => (
              <motion.div 
                key={index} 
                className="flex gap-2 items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
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
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
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
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="bg-primary hover:bg-primary/80 text-background font-medium"
            >
              {isLoading ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
