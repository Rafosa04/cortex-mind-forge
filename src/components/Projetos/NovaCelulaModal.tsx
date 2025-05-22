
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  const [date, setDate] = useState<Date | undefined>(undefined);

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setEtapas([""]);
    setPrazo("");
    setTags([]);
    setTagInput("");
    setDate(undefined);
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

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setPrazo(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      setPrazo('');
    }
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-[#60B5B5]/60 neon-anim">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 text-lg text-primary drop-shadow">
            <Bot className="text-primary w-5 h-5" /> Nova Célula
          </DialogTitle>
          <DialogDescription className="text-secondary text-sm">
            Crie uma nova célula de projeto
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="nome" className="text-sm mb-1">Nome</Label>
            <Input 
              id="nome" 
              placeholder="Nome do projeto" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="descricao" className="text-sm mb-1">Descrição</Label>
            <Textarea 
              id="descricao" 
              placeholder="Descrição do projeto" 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              rows={2}
              className="resize-none"
            />
          </div>
          
          <div>
            <Label htmlFor="categoria" className="text-sm mb-1">Categoria</Label>
            <Input 
              id="categoria" 
              placeholder="Categoria do projeto" 
              value={categoria} 
              onChange={e => setCategoria(e.target.value)} 
            />
          </div>
          
          <div>
            <Label className="text-sm mb-1">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Adicionar tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1"
              />
              <Button 
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                variant="outline"
                className="border-[#993887]/40 text-secondary whitespace-nowrap"
                size="sm"
              >
                Adicionar
              </Button>
            </div>
            {tags.length > 0 && (
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
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="prazo" className="text-sm mb-1">Prazo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm mb-1">Etapas</Label>
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
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2 text-primary border-[#60B5B5]/40" 
              onClick={handleAddEtapa}
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Adicionar etapa
            </Button>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              variant="default"
              className="bg-primary hover:bg-secondary text-background rounded-lg font-bold shadow"
              size="sm"
            >
              {isLoading ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
