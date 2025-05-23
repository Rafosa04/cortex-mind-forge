
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, TrendingUp, Edit, Save, X } from "lucide-react";
import { Habito } from "./HabitoCard";
import { useHabitos } from "@/hooks/useHabitos";
import { toast } from "@/components/ui/use-toast";

interface HabitoDetailModalProps {
  habito: Habito | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HabitoDetailModal({ habito, open, onOpenChange }: HabitoDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome: '',
    proposito: '',
    frequencia: '',
    tags: [] as string[],
    observacaoIA: ''
  });
  const { updateHabit } = useHabitos();

  // Sincronizar dados quando o hábito muda
  useState(() => {
    if (habito) {
      setEditData({
        nome: habito.nome,
        proposito: habito.proposito,
        frequencia: habito.frequencia,
        tags: habito.tags,
        observacaoIA: habito.observacaoIA
      });
    }
  }, [habito]);

  const handleSave = async () => {
    if (!habito?.id) return;
    
    try {
      await updateHabit(habito.id, {
        name: editData.nome,
        description: editData.proposito,
        frequency: editData.frequencia,
        tags: editData.tags,
        ai_observation: editData.observacaoIA
      });
      
      toast({
        title: "Hábito atualizado",
        description: "As informações foram salvas com sucesso!"
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    }
  };

  const addTag = (tag: string) => {
    if (tag && !editData.tags.includes(tag)) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!habito) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{habito.icone}</span>
            {isEditing ? (
              <Input
                value={editData.nome}
                onChange={(e) => setEditData(prev => ({ ...prev, nome: e.target.value }))}
                className="text-lg font-semibold"
              />
            ) : (
              habito.nome
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </Button>
            {isEditing && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="w-4 h-4" />
                Propósito
              </div>
              {isEditing ? (
                <Textarea
                  value={editData.proposito}
                  onChange={(e) => setEditData(prev => ({ ...prev, proposito: e.target.value }))}
                  placeholder="Descreva o propósito do hábito"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{habito.proposito}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Frequência
              </div>
              {isEditing ? (
                <select 
                  value={editData.frequencia} 
                  onChange={(e) => setEditData(prev => ({ ...prev, frequencia: e.target.value }))}
                  className="w-full rounded px-2 py-2 bg-background border border-border text-foreground"
                >
                  <option>Diário</option>
                  <option>3x semana</option>
                  <option>Semanal</option>
                </select>
              ) : (
                <Badge variant="secondary">{habito.frequencia}</Badge>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Progresso</span>
              </div>
              <div className="text-2xl font-bold text-primary">{habito.progresso}%</div>
            </div>

            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-500">{habito.streak}🔥</div>
            </div>

            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Último Check-in</span>
              </div>
              <div className="text-sm text-muted-foreground">{habito.ultimoCheck}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Tags</div>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editData.tags : habito.tags).map((tag, index) => (
                <Badge key={index} variant="outline" className="relative">
                  {tag}
                  {isEditing && (
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {isEditing && (
                <Input
                  placeholder="Adicionar tag"
                  className="w-32 h-6 text-xs"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Observação da IA */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Observação da Athena</div>
            {isEditing ? (
              <Textarea
                value={editData.observacaoIA}
                onChange={(e) => setEditData(prev => ({ ...prev, observacaoIA: e.target.value }))}
                placeholder="Observação personalizada da IA"
              />
            ) : (
              <p className="text-sm text-cyan-400 bg-card p-3 rounded border">
                {habito.observacaoIA}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
