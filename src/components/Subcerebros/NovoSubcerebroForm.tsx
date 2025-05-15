
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface NovoSubcerebroFormProps {
  onSubmit: () => void;
}

export function NovoSubcerebroForm({ onSubmit }: NovoSubcerebroFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tags: "",
    area: "pessoal"
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, area: value }));
  };
  
  const handleGenerateWithAI = () => {
    if (!formData.nome) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o subcérebro antes de gerar sugestões.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simula o processo de geração com IA
    setTimeout(() => {
      setIsGenerating(false);
      
      // Gera sugestões baseadas no nome
      if (formData.nome.toLowerCase().includes("trabalho") || formData.nome.toLowerCase().includes("profiss")) {
        setFormData(prev => ({
          ...prev,
          tags: "carreira, projetos, metas, produtividade",
          area: "profissional",
          descricao: formData.descricao || "Subcérebro focado na sua vida profissional e projetos de carreira."
        }));
        
        toast({
          title: "Sugestões geradas pela Athena",
          description: "Estrutura profissional criada com base no nome fornecido."
        });
      } else if (formData.nome.toLowerCase().includes("saude") || formData.nome.toLowerCase().includes("fitness")) {
        setFormData(prev => ({
          ...prev,
          tags: "exercício, nutrição, bem-estar, meditação",
          area: "saude",
          descricao: formData.descricao || "Subcérebro para acompanhar sua saúde física e mental, hábitos e rotinas."
        }));
        
        toast({
          title: "Sugestões geradas pela Athena",
          description: "Estrutura de bem-estar criada com foco em saúde."
        });
      } else if (formData.nome.toLowerCase().includes("escrita") || formData.nome.toLowerCase().includes("art")) {
        setFormData(prev => ({
          ...prev,
          tags: "expressão, inspiração, processo criativo",
          area: "criatividade",
          descricao: formData.descricao || "Subcérebro para organizar ideias criativas, inspirações e projetos artísticos."
        }));
        
        toast({
          title: "Sugestões geradas pela Athena",
          description: "Estrutura criativa desenvolvida para suas expressões artísticas."
        });
      } else {
        setFormData(prev => ({
          ...prev,
          tags: "desenvolvimento, aprendizado, organização",
          descricao: formData.descricao || `Subcérebro para ${formData.nome.toLowerCase()}.`
        }));
        
        toast({
          title: "Sugestões geradas pela Athena",
          description: "Estrutura básica criada. Você pode personalizar conforme necessário."
        });
      }
    }, 1500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome) {
      toast({
        title: "Erro ao criar subcérebro",
        description: "O nome é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Subcérebro criado",
      description: `${formData.nome} foi adicionado com sucesso.`
    });
    
    onSubmit();
  };
  
  // Visualização de tags para o usuário
  const tagArray = formData.tags.split(",").filter(tag => tag.trim() !== "");
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Subcérebro</Label>
        <Input
          id="nome"
          name="nome"
          placeholder="Ex: Desenvolvimento Profissional"
          value={formData.nome}
          onChange={handleChange}
          required
          className="border-card bg-background/30 focus:border-secondary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          placeholder="Descreva o propósito deste subcérebro..."
          value={formData.descricao}
          onChange={handleChange}
          rows={3}
          className="border-card bg-background/30 focus:border-secondary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="Ex: carreira, metas, desenvolvimento"
          value={formData.tags}
          onChange={handleChange}
          className="border-card bg-background/30 focus:border-secondary"
        />
        
        {tagArray.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tagArray.map((tag, index) => (
              <motion.div 
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Badge variant="outline" className="bg-card/50">{tag.trim()}</Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="area">Área de Foco</Label>
        <Select
          value={formData.area}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger id="area" className="w-full border-card bg-background/30 focus:border-secondary">
            <SelectValue placeholder="Selecione uma área" />
          </SelectTrigger>
          <SelectContent className="bg-card backdrop-blur-md border-card">
            <SelectItem value="pessoal">Pessoal</SelectItem>
            <SelectItem value="profissional">Profissional</SelectItem>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="criatividade">Criatividade</SelectItem>
            <SelectItem value="financas">Finanças</SelectItem>
            <SelectItem value="relacionamentos">Relacionamentos</SelectItem>
            <SelectItem value="educacao">Educação</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateWithAI}
          className="flex-1 group relative overflow-hidden border-secondary/70"
          disabled={!formData.nome || isGenerating}
        >
          <span className="absolute inset-0 bg-secondary/20 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-md"></span>
          <Brain className="mr-2" size={16} />
          <span className="relative z-10">{isGenerating ? "Gerando..." : "Gerar estrutura com Athena"}</span>
        </Button>
        
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/80">
          Criar Subcérebro
        </Button>
      </div>
    </form>
  );
}
