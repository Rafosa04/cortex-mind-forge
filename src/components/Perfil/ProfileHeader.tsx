
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Link as LinkIcon, Share2, Calendar, ExternalLink, Camera, Check, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useProfileUpload } from '@/hooks/useProfileUpload';
import { useToast } from '@/hooks/use-toast';

/**
 * ProfileHeader Component
 * 
 * Displays user profile header with inline editing capabilities.
 * Handles avatar/cover uploads, profile information editing, and social actions.
 * 
 * @param userId - The user ID whose profile is being displayed
 * @param avatarUrl - Current avatar image URL
 * @param coverUrl - Current cover image URL
 * @param name - User's display name
 * @param username - User's username
 * @param bio - User's biography
 * @param location - User's location (optional)
 * @param website - User's website (optional)
 * @param publicLink - User's public profile link
 * @param joinedDate - When the user joined
 * @param isOwnProfile - Whether this is the current user's own profile
 * @param onUpdateProfile - Callback to update profile data
 */

export interface ProfileUpdate {
  avatarUrl?: string;
  coverUrl?: string;
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface ProfileHeaderProps {
  userId: string;
  avatarUrl: string;
  coverUrl: string;
  name: string;
  username: string;
  bio: string;
  location?: string;
  website?: string;
  publicLink: string;
  joinedDate: string;
  isOwnProfile: boolean;
  onUpdateProfile: (data: Partial<ProfileUpdate>) => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  avatarUrl,
  coverUrl,
  name,
  username,
  bio,
  location,
  website,
  publicLink,
  joinedDate,
  isOwnProfile,
  onUpdateProfile
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { uploadImage, uploading } = useProfileUpload();
  const { toast } = useToast();

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValues({ [field]: currentValue || '' });
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleSave = async (field: string) => {
    try {
      setSaving(true);
      const value = tempValues[field];
      await onUpdateProfile({ [field]: value });
      
      setEditingField(null);
      setTempValues({});
      
      toast({
        title: "Sucesso",
        description: `${getFieldLabel(field)} atualizado com sucesso!`
      });
      
      // Announce to screen readers
      const announcement = `${getFieldLabel(field)} salvo com sucesso`;
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);
      setTimeout(() => document.body.removeChild(liveRegion), 1000);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      name: 'Nome',
      username: 'Nome de usuário',
      bio: 'Biografia',
      location: 'Localização',
      website: 'Website'
    };
    return labels[field] || field;
  };

  const handleImageUpload = async (type: 'avatar' | 'cover', file: File) => {
    if (!isOwnProfile) return;
    
    try {
      const url = await uploadImage(file, type);
      if (url) {
        await onUpdateProfile({ [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url });
        
        const announcement = `${type === 'avatar' ? 'Avatar' : 'Capa'} atualizado com sucesso`;
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.textContent = announcement;
        document.body.appendChild(liveRegion);
        setTimeout(() => document.body.removeChild(liveRegion), 1000);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem",
        variant: "destructive"
      });
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "Link do perfil copiado para a área de transferência"
      });
    }
  };

  const renderEditableField = (
    field: string,
    currentValue: string,
    placeholder: string,
    multiline: boolean = false
  ) => {
    if (editingField === field) {
      const Component = multiline ? Textarea : Input;
      return (
        <div className="flex items-center gap-2">
          <Component
            value={tempValues[field] || ''}
            onChange={(e) => setTempValues({ ...tempValues, [field]: e.target.value })}
            placeholder={placeholder}
            className="flex-1"
            autoFocus
          />
          <Button
            size="sm"
            onClick={() => handleSave(field)}
            disabled={saving}
            aria-label={`Salvar ${getFieldLabel(field)}`}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            aria-label="Cancelar edição"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className="flex-1">{currentValue || placeholder}</span>
        {isOwnProfile && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(field, currentValue)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Editar ${getFieldLabel(field)}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="relative h-64 w-full rounded-2xl overflow-hidden group">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-blue-500/40 to-purple-600/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />
        <img
          src={coverUrl}
          alt="Capa do perfil"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        
        {isOwnProfile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => triggerFileInput('cover')}
            disabled={uploading}
            aria-label="Editar capa"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <Card className="relative -mt-16 mx-4 bg-gray-800/90 backdrop-blur-md border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Avatar className="h-24 w-24 ring-4 ring-purple-500/30">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  onClick={() => triggerFileInput('avatar')}
                  disabled={uploading}
                  aria-label="Editar avatar"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
              )}
              
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="mb-1">
                {renderEditableField('name', name, 'Nome do usuário')}
              </div>
              
              <div className="mb-3">
                {renderEditableField('username', username, 'nome_usuario')}
              </div>

              <div className="mb-4">
                {renderEditableField('bio', bio, 'Conte um pouco sobre você...', true)}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {renderEditableField('location', location, 'Sua localização')}
                  </div>
                )}
                
                {website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    {editingField === 'website' ? (
                      renderEditableField('website', website, 'https://seusite.com')
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <a
                          href={website.startsWith('http') ? website : `https://${website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-400 transition-colors flex items-center gap-1"
                        >
                          {website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        {isOwnProfile && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit('website', website)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Editar website"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Ingressou em {joinedDate}</span>
                </div>
              </div>

              <div className="mb-4">
                <Badge 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-400 bg-purple-500/10"
                >
                  {publicLink}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3">
                {!isOwnProfile && (
                  <>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                      Seguir
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Mensagem
                    </Button>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-gray-400 hover:text-white"
                  aria-label="Compartilhar perfil"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
