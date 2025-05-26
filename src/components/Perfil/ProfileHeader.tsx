
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Link as LinkIcon, Share2, Calendar, ExternalLink, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EditProfileModal } from './EditProfileModal';
import { useProfileUpload } from '@/hooks/useProfileUpload';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface ProfileHeaderProps {
  avatarUrl: string;
  coverUrl: string;
  name: string;
  username: string;
  bio: string;
  location?: string;
  website?: string;
  publicLink: string;
  joinedDate: string;
  isOwnProfile?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  coverUrl,
  name,
  username,
  bio,
  location,
  website,
  publicLink,
  joinedDate,
  isOwnProfile = false
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { uploadImage, uploading } = useProfileUpload();
  const { updateProfile } = useProfile();
  const { user } = useAuth();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleImageUpload = async (type: 'avatar' | 'cover', file: File) => {
    if (!isOwnProfile || !user) return;
    
    const url = await uploadImage(file, type);
    if (url) {
      await updateProfile({ [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url });
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

  return (
    <>
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
            >
              <Camera className="h-4 w-4" />
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
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-500/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-white mb-1">{name}</h1>
                <p className="text-purple-400 mb-3">@{username}</p>

                <p className="text-gray-300 mb-4 max-w-2xl">
                  {bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={website.startsWith('http') ? website : `https://${website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition-colors flex items-center gap-1"
                      >
                        {website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3" />
                      </a>
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
                  {isOwnProfile ? (
                    <Button
                      variant="outline"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => setEditModalOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                      >
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

      <EditProfileModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
      />
    </>
  );
};
