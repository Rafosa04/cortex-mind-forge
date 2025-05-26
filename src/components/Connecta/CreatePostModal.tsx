
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Lightbulb, TreePine } from 'lucide-react';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string, category: 'focus' | 'expansion' | 'reflection', imageUrl?: string) => void;
  loading?: boolean;
}

const categoryOptions = [
  { value: 'focus', label: 'Clareza', icon: Brain, color: 'text-purple-400' },
  { value: 'expansion', label: 'Expansão', icon: Lightbulb, color: 'text-blue-400' },
  { value: 'reflection', label: 'Reflexão', icon: TreePine, color: 'text-green-400' }
];

export default function CreatePostModal({ open, onClose, onSubmit, loading }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'focus' | 'expansion' | 'reflection'>('focus');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit(content.trim(), category, imageUrl.trim() || undefined);
    
    // Reset form
    setContent('');
    setCategory('focus');
    setImageUrl('');
    onClose();
  };

  const selectedCategory = categoryOptions.find(opt => opt.value === category);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nova Ideia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">O que você está pensando?</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe sua reflexão, insight ou descoberta..."
              className="mt-2 bg-gray-900 border-gray-600 text-white min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2 bg-gray-900 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {categoryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="mt-2 bg-gray-900 border-gray-600 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || loading}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
