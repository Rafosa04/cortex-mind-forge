
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useProfileUpload } from '@/hooks/useProfileUpload';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onOpenChange
}) => {
  const { profileData, updateProfile } = useProfile();
  const { uploadImage, uploading } = useProfileUpload();
  
  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    username: profileData?.username || '',
    bio: profileData?.bio || '',
    location: profileData?.location || '',
    website: profileData?.website || '',
  });

  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [tempCover, setTempCover] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
    const url = await uploadImage(file, type);
    if (url) {
      if (type === 'avatar') {
        setTempAvatar(url);
      } else {
        setTempCover(url);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        avatarUrl: tempAvatar || profileData?.avatarUrl,
        coverUrl: tempCover || profileData?.coverUrl
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Foto de Capa */}
          <div className="relative">
            <div className="h-48 w-full rounded-xl overflow-hidden bg-gradient-to-r from-purple-600/40 via-blue-500/40 to-purple-600/40">
              <img
                src={tempCover || profileData?.coverUrl}
                alt="Capa do perfil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-gray-800/80 text-white hover:bg-gray-700/80"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              Alterar Capa
            </Button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'cover');
              }}
            />
          </div>

          {/* Foto de Perfil */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-purple-500/30">
                <AvatarImage src={tempAvatar || profileData?.avatarUrl} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500">
                  {formData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gray-800 border border-gray-600 text-white hover:bg-gray-700"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
              </Button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'avatar');
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Foto do Perfil</h3>
              <p className="text-sm text-gray-400">Clique no ícone da câmera para alterar</p>
            </div>
          </div>

          {/* Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Nome de Usuário</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="@username"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="bio" className="text-white">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white resize-none"
                rows={3}
                placeholder="Conte um pouco sobre você..."
                maxLength={160}
              />
              <p className="text-xs text-gray-400 text-right">
                {formData.bio.length}/160 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Sua cidade, país"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-white">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://seu-site.com"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              className="bg-gradient-to-r from-purple-600 to-blue-500"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
