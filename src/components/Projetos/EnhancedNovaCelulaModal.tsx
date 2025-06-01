
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, PlusCircle, X, Sparkles } from "lucide-react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AthenaProjectCreator } from "./AthenaProjectCreator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
};

export function EnhancedNovaCelulaModal({ open, onOpenChange }: Props) {
  const { criarProjeto } = useProjetos();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [etapas, setEtapas] = useState<string[]>([""]); 
  const [prazo, setPrazo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<string>("");

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setEtapas([""]);
    setPrazo("");
    setTags([]);
    setTagInput("");
    setDate(undefined);
    setPriority("");
  };

  const handleAthenaProjectSuggestion = (suggestion: {
    nome: string;
    descricao: string;
    categoria?: string;
    tags: string[];
    etapas: { texto: string; feita: boolean }[];
  }) => {
    setNome(suggestion.nome);
    setDescricao(suggestion.descricao);
    setCategoria(suggestion.categoria || "");
    setTags(suggestion.tags);
    setEtapas(suggestion.etapas.map(e => e.texto));
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
    if (etapas.length <= 1) return;
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
          title: "Célula criada com sucesso",
          description: "Sua nova célula de conhecimento foi manifestada no CÓRTEX",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-[#60B5B5]/60 neon-anim">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-xl text-primary drop-shadow">
            <Bot className="text-primary w-6 h-6" /> 
            Nova Célula de Conhecimento
          </DialogTitle>
          <DialogDescription className="text-secondary text-sm">
            Manifeste uma nova célula viva que evolui com você no CÓRTEX
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#191933]">
            <TabsTrigger value="manual">Criação Manual</TabsTrigger>
            <TabsTrigger value="athena" className="text-[#993887]">
              <Sparkles className="w-4 h-4 mr-2" />
              Com Athena
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="athena" className="space-y-4">
            <AthenaProjectCreator onProjectSuggestion={handleAthenaProjectSuggestion} />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-sm mb-1">Nome da Célula</Label>
                  <Input 
                    id="nome" 
                    placeholder="Nome da sua célula de conhecimento" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria" className="text-sm mb-1">Categoria</Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pessoal">Pessoal</SelectItem>
                      <SelectItem value="trabalho">Trabalho</SelectItem>
                      <SelectItem value="estudo">Estudo</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="criativo">Criativo</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority" className="text-sm mb-1">Prioridade</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Definir prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="descricao" className="text-sm mb-1">Descrição</Label>
                  <Textarea 
                    id="descricao" 
                    placeholder="Descreva o propósito e objetivos desta célula..." 
                    value={descricao} 
                    onChange={e => setDescricao(e.target.value)} 
                    rows={3}
                    className="resize-none"
                  />
                </div>
                
                <div>
                  <Label className="text-sm mb-1">Tags de Conhecimento</Label>
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
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm mb-1">Etapas Iniciais</Label>
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
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#60B5B5]/20">
          <DialogClose asChild>
            <Button variant="secondary" size="sm">Cancelar</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            variant="default"
            className="bg-gradient-to-r from-[#993887] to-[#60B5B5] hover:from-[#993887]/80 hover:to-[#60B5B5]/80 text-white font-bold shadow-lg"
            size="sm"
          >
            {isLoading ? (
              <>
                <Bot className="w-4 h-4 mr-2 animate-spin" />
                Manifestando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Manifestar Célula
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
