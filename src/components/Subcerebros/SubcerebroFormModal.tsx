
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useSubcerebros, CreateSubcerebroData, Subcerebro } from '@/hooks/useSubcerebros';
import { X, Plus } from 'lucide-react';

interface SubcerebroFormModalProps {
  onSubmit: () => void;
  subcerebro?: Subcerebro | null;
  initialData?: Partial<CreateSubcerebroData>;
}

const AREAS_PREDEFINIDAS = [
  'Pessoal',
  'Profissional',
  'Saúde',
  'Criatividade',
  'Finanças',
  'Educação',
  'Relacionamentos',
  'Hobbies',
  'Tecnologia',
  'Espiritualidade'
];

export const SubcerebroFormModal = ({ onSubmit, subcerebro, initialData }: SubcerebroFormModalProps) => {
  const { createSubcerebro, updateSubcerebro } = useSubcerebros();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateSubcerebroData>({
    nome: subcerebro?.nome || initialData?.nome || '',
    descricao: subcerebro?.descricao || initialData?.descricao || '',
    tags: subcerebro?.tags || initialData?.tags || [],
    area: subcerebro?.area || initialData?.area || '',
    relevancia: subcerebro?.relevancia || initialData?.relevancia || 5
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      return;
    }

    setLoading(true);
    try {
      let success = false;

      if (subcerebro) {
        // Modo edição
        success = await updateSubcerebro({
          id: subcerebro.id,
          ...formData
        });
      } else {
        // Modo criação
        const result = await createSubcerebro(formData);
        success = !!result;
      }

      if (success) {
        onSubmit();
      }
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Subcérebro *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          placeholder="Ex: Desenvolvimento Pessoal, Projetos Criativos..."
          required
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva o propósito e escopo deste subcérebro..."
          rows={3}
        />
      </div>

      {/* Área */}
      <div className="space-y-2">
        <Label htmlFor="area">Área Temática</Label>
        <Select
          value={formData.area}
          onValueChange={(value) => setFormData(prev => ({ ...prev, area: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma área" />
          </SelectTrigger>
          <SelectContent>
            {AREAS_PREDEFINIDAS.map(area => (
              <SelectItem key={area} value={area.toLowerCase()}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Adicionar tag..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Relevância */}
      <div className="space-y-2">
        <Label>Relevância: {formData.relevancia}/10</Label>
        <Slider
          value={[formData.relevancia]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, relevancia: value }))}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-foreground/60">
          <span>Baixa</span>
          <span>Média</span>
          <span>Alta</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || !formData.nome.trim()} className="flex-1">
          {loading ? (subcerebro ? 'Atualizando...' : 'Criando...') : (subcerebro ? 'Atualizar Subcérebro' : 'Criar Subcérebro')}
        </Button>
      </div>
    </form>
  );
};
