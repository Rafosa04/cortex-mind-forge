
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGenerateWithAI = () => {
    setIsGenerating(true);
    
    // Mock AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      
      // Mock suggested tags based on name
      if (formData.nome.toLowerCase().includes("trabalho") || formData.nome.toLowerCase().includes("profiss")) {
        setFormData(prev => ({
          ...prev,
          tags: "carreira, projetos, metas, produtividade",
          area: "profissional"
        }));
      } else if (formData.nome.toLowerCase().includes("saude") || formData.nome.toLowerCase().includes("fitness")) {
        setFormData(prev => ({
          ...prev,
          tags: "exercício, nutrição, bem-estar, meditação",
          area: "saude"
        }));
      } else if (formData.nome.toLowerCase().includes("escrita") || formData.nome.toLowerCase().includes("art")) {
        setFormData(prev => ({
          ...prev,
          tags: "expressão, inspiração, processo criativo",
          area: "criatividade"
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          tags: "desenvolvimento, aprendizado, organização"
        }));
      }
    }, 1500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be code to actually create the Subcérebro
    onSubmit();
  };
  
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
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="area">Área de Foco</Label>
        <Select
          id="area"
          name="area"
          value={formData.area}
          onChange={handleChange}
          className="w-full"
        >
          <option value="pessoal">Pessoal</option>
          <option value="profissional">Profissional</option>
          <option value="saude">Saúde</option>
          <option value="criatividade">Criatividade</option>
          <option value="financas">Finanças</option>
          <option value="relacionamentos">Relacionamentos</option>
          <option value="educacao">Educação</option>
          <option value="outro">Outro</option>
        </Select>
      </div>
      
      <div className="pt-2 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateWithAI}
          className="flex-1"
          disabled={!formData.nome || isGenerating}
        >
          <Brain className="mr-2" size={16} />
          {isGenerating ? "Gerando..." : "Gerar estrutura com Athena"}
        </Button>
        
        <Button type="submit" className="flex-1">
          Criar Subcérebro
        </Button>
      </div>
    </form>
  );
}
