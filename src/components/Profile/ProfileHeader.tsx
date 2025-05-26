
/**
 * ProfileHeader.tsx
 * Exibe informações básicas do usuário e CTA de edição.
 * Props:
 *   - avatarUrl: string — URL do avatar
 *   - coverUrl: string — URL da imagem de capa
 *   - name: string — Nome completo do usuário
 *   - username: string — Nome de usuário único
 *   - bio: string — Biografia do usuário
 *   - location?: string — Localização (opcional)
 *   - publicLink: string — Link público do perfil
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, Link as LinkIcon, Share2, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileHeaderProps {
  avatarUrl: string;
  coverUrl: string;
  name: string;
  username: string;
  bio: string;
  location?: string;
  publicLink: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  coverUrl,
  name,
  username,
  bio,
  location,
  publicLink
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [currentBio, setCurrentBio] = useState(bio);

  const handleAthenaeSuggestion = () => {
    // TODO: integrate with Athena endpoint "/profile/bio-suggestion"
    console.log('Solicitando sugestão da Athena para bio...');
  };

  const handleShare = () => {
    // TODO: implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${name}`,
        url: publicLink
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Imagem de Capa */}
      <div className="relative h-64 w-full rounded-2xl overflow-hidden">
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
      </div>

      {/* Conteúdo do Perfil */}
      <Card className="relative -mt-16 mx-4 bg-gray-800/90 backdrop-blur-md border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Animado */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Avatar className="h-24 w-24 ring-4 ring-purple-500/30">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Informações do Usuário */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">{name}</h1>
              <p className="text-purple-400 mb-3">@{username}</p>

              {/* Bio Editável */}
              <div className="mb-4">
                {isEditingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={currentBio}
                      onChange={(e) => setCurrentBio(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setIsEditingBio(false)}
                        className="bg-gradient-to-r from-purple-600 to-blue-500"
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCurrentBio(bio);
                          setIsEditingBio(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAthenaeSuggestion}
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      >
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Sugestão IA
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-gray-300 cursor-pointer hover:text-white transition-colors"
                    onClick={() => setIsEditingBio(true)}
                  >
                    {currentBio}
                  </p>
                )}
              </div>

              {/* Localização e Link */}
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400 mb-4">
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href={`https://${publicLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors"
                  >
                    {publicLink}
                  </a>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => setIsEditingBio(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
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
