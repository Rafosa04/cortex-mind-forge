
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useProfileUpload } from '@/hooks/useProfileUpload';
import { useAuth } from '@/hooks/useAuth';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const { profileData, updateProfile } = useProfile(user?.id);
  const { uploadImage, uploading } = useProfileUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    avatarUrl: '',
    coverUrl: ''
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        username: profileData.username || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
        avatarUrl: profileData.avatarUrl || '',
        coverUrl: profileData.coverUrl || ''
      });
    }
  }, [profileData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (type: 'avatar' | 'cover', file: File) => {
    const url = await uploadImage(file, type);
    if (url) {
      setFormData(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url
      }));
    }
  };

  const triggerFileInput = (type: 'avatar' | 'cover') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(type, file);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    await updateProfile(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Editar Perfil
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem de Capa */}
          <div className="relative">
            <Label className="text-sm font-medium mb-2 block">Foto de Capa</Label>
            <div className="relative h-32 w-full rounded-lg overflow-hidden group">
              <img
                src={formData.coverUrl || '/placeholder.svg'}
                alt="Capa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => triggerFileInput('cover')}
                  disabled={uploading}
                  className="text-white"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatarUrl} />
                  <AvatarFallback className="bg-purple-500/20 text-lg">
                    {formData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => triggerFileInput('avatar')}
                    disabled={uploading}
                    className="text-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <p>Clique na imagem para alterar</p>
                <p>Formato: JPG, PNG (máx. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Campos do Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Nome Completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="username" className="text-sm font-medium mb-2 block">
                Nome de Usuário
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="@seunome"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium mb-2 block">
              Biografia
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
              placeholder="Conte um pouco sobre você..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                Localização
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Cidade, País"
              />
            </div>

            <div>
              <Label htmlFor="website" className="text-sm font-medium mb-2 block">
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://seusite.com"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={uploading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {uploading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
