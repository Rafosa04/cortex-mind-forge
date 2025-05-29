
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiary, DiaryEntry } from '@/hooks/useDiary';
import { useDiaryAnalysis } from '@/hooks/useDiaryAnalysis';
import { Save, Sparkles } from 'lucide-react';

interface DiaryEntryFormProps {
  entry?: DiaryEntry | null;
  onSave?: (entry: DiaryEntry) => void;
  onCancel?: () => void;
}

const EMOTIONS = [
  { value: 'happy', label: '😊 Feliz', color: 'text-green-600' },
  { value: 'sad', label: '😢 Triste', color: 'text-blue-600' },
  { value: 'angry', label: '😠 Irritado', color: 'text-red-600' },
  { value: 'anxious', label: '😰 Ansioso', color: 'text-yellow-600' },
  { value: 'excited', label: '🤩 Animado', color: 'text-purple-600' },
  { value: 'calm', label: '😌 Tranquilo', color: 'text-teal-600' },
  { value: 'frustrated', label: '😤 Frustrado', color: 'text-orange-600' },
  { value: 'grateful', label: '🙏 Grato', color: 'text-pink-600' },
  { value: 'neutral', label: '😐 Neutro', color: 'text-gray-600' }
];

const ENTRY_TYPES = [
  { value: 'livre', label: 'Reflexão Livre' },
  { value: 'gratidao', label: 'Gratidão' },
  { value: 'objetivos', label: 'Objetivos' },
  { value: 'aprendizados', label: 'Aprendizados' },
  { value: 'desafios', label: 'Desafios' }
];

export const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({
  entry,
  onSave,
  onCancel
}) => {
  const { createEntry, updateEntry } = useDiary();
  const { analyzeSentiment } = useDiaryAnalysis();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    emotion: entry?.emotion || '',
    type: entry?.type || 'livre'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.emotion) return;

    setLoading(true);
    try {
      // Analisar sentimento do conteúdo
      const sentiment = await analyzeSentiment(formData.content);
      
      const entryData = {
        ...formData,
        title: formData.title || undefined
      };

      let savedEntry;
      if (entry) {
        savedEntry = await updateEntry(entry.id, entryData);
      } else {
        savedEntry = await createEntry(entryData);
      }

      // Atualizar com análise de sentimento
      if (savedEntry) {
        await updateEntry(savedEntry.id, {
          sentiment_score: sentiment.score,
          sentiment_label: sentiment.label
        });
        onSave?.(savedEntry);
      }
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedEmotion = EMOTIONS.find(e => e.value === formData.emotion);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {entry ? 'Editar Entrada' : 'Nova Entrada no Diário'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Um dia produtivo, Reflexões sobre..."
            />
          </div>

          {/* Tipo de entrada */}
          <div className="space-y-2">
            <Label>Tipo de Entrada</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Emoção */}
          <div className="space-y-2">
            <Label>Como você está se sentindo? *</Label>
            <Select value={formData.emotion} onValueChange={(value) => setFormData(prev => ({ ...prev, emotion: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma emoção" />
              </SelectTrigger>
              <SelectContent>
                {EMOTIONS.map(emotion => (
                  <SelectItem key={emotion.value} value={emotion.value}>
                    <span className={emotion.color}>{emotion.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Indicador visual da emoção selecionada */}
          {selectedEmotion && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Emoção selecionada:</span>
                <span className={`font-medium ${selectedEmotion.color}`}>
                  {selectedEmotion.label}
                </span>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="space-y-2">
            <Label htmlFor="content">Suas reflexões *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Escreva sobre seus pensamentos, sentimentos, experiências do dia..."
              rows={8}
              required
            />
            <div className="text-xs text-muted-foreground">
              {formData.content.length} caracteres
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !formData.content.trim() || !formData.emotion}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : (entry ? 'Atualizar' : 'Salvar Entrada')}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
