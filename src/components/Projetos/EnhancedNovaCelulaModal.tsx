
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, X, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useProjetos } from "@/hooks/useProjetos";
import { AthenaProjectCreator } from "./AthenaProjectCreator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedNovaCelulaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedNovaCelulaModal({ open, onOpenChange }: EnhancedNovaCelulaModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prazo, setPrazo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [novaTag, setNovaTag] = useState("");
  const [etapas, setEtapas] = useState<{ texto: string; feita: boolean }[]>([]);
  const [novaEtapa, setNovaEtapa] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAthena, setShowAthena] = useState(false);

  const { criarProjeto } = useProjetos();

  const categorias = [
    "Educação",
    "Trabalho", 
    "Pessoal",
    "Saúde",
    "Tecnologia",
    "Criativo",
    "Financeiro",
    "Relacionamentos"
  ];

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setPrazo("");
    setTags([]);
    setNovaTag("");
    setEtapas([]);
    setNovaEtapa("");
    setShowAthena(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a célula",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      await criarProjeto(
        nome,
        descricao,
        categoria || null,
        "ativo",
        prazo || null,
        etapas,
        tags
      );
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao criar célula",
        description: "Não foi possível criar a célula. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarTag = () => {
    if (novaTag.trim() && !tags.includes(novaTag.trim())) {
      setTags([...tags, novaTag.trim()]);
      setNovaTag("");
    }
  };

  const removerTag = (tagRemover: string) => {
    setTags(tags.filter(tag => tag !== tagRemover));
  };

  const adicionarEtapa = () => {
    if (novaEtapa.trim()) {
      setEtapas([...etapas, { texto: novaEtapa.trim(), feita: false }]);
      setNovaEtapa("");
    }
  };

  const removerEtapa = (index: number) => {
    setEtapas(etapas.filter((_, i) => i !== index));
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
    if (suggestion.categoria) setCategoria(suggestion.categoria);
    setTags(suggestion.tags);
    setEtapas(suggestion.etapas);
    setShowAthena(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141429] border-[#191933]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#993887] to-[#60B5B5] bg-clip-text text-transparent">
            Nova Célula de Conhecimento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Athena Project Creator */}
          <AthenaProjectCreator onProjectSuggestion={handleAthenaProjectSuggestion} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Célula *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Aprender React com TypeScript"
                className="bg-[#191933]/70 border-[#60B5B5]/40"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva os objetivos e contexto desta célula..."
                rows={3}
                className="bg-[#191933]/70 border-[#60B5B5]/40 resize-none"
              />
            </div>

            {/* Categoria e Prazo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="bg-[#191933]/70 border-[#60B5B5]/40">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazo">Prazo Final</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="prazo"
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className="pl-10 bg-[#191933]/70 border-[#60B5B5]/40"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={novaTag}
                  onChange={(e) => setNovaTag(e.target.value)}
                  placeholder="Adicionar tag..."
                  className="bg-[#191933]/70 border-[#60B5B5]/40"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      adicionarTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarTag}
                  className="border-[#60B5B5]/40"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <AnimatePresence>
                    {tags.map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="outline"
                          className="border-[#60B5B5]/40 text-[#60B5B5] cursor-pointer hover:bg-[#60B5B5]/10"
                          onClick={() => removerTag(tag)}
                        >
                          {tag}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Etapas */}
            <div className="space-y-2">
              <Label>Etapas Iniciais</Label>
              <div className="flex gap-2">
                <Input
                  value={novaEtapa}
                  onChange={(e) => setNovaEtapa(e.target.value)}
                  placeholder="Adicionar etapa..."
                  className="bg-[#191933]/70 border-[#60B5B5]/40"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      adicionarEtapa();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarEtapa}
                  className="border-[#60B5B5]/40"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {etapas.length > 0 && (
                <div className="space-y-2 mt-3">
                  <AnimatePresence>
                    {etapas.map((etapa, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-2 p-2 bg-[#191933]/50 rounded border border-[#60B5B5]/20"
                      >
                        <span className="text-sm text-gray-300 flex-1">{etapa.texto}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerEtapa(index)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="border-[#60B5B5]/40"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !nome.trim()}
                className="bg-gradient-to-r from-[#993887] to-[#60B5B5] hover:from-[#993887]/80 hover:to-[#60B5B5]/80"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Manifestar Célula
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
