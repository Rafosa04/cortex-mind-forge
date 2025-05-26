
/**
 * Profile.tsx
 * Página principal do perfil do usuário - layout em duas colunas em desktop
 * Integra todos os componentes do ecossistema cognitivo
 * 
 * Layout:
 *   - Desktop: coluna esquerda fixa 30%, coluna direita flexível 70%
 *   - Mobile: colunas empilhadas em ordem lógica
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { CognitiveStats } from '@/components/Profile/CognitiveStats';
import { Highlights } from '@/components/Profile/Highlights';
import { PersonalFeed } from '@/components/Profile/PersonalFeed';
import { MindMirror } from '@/components/Profile/MindMirror';
import { QuickActions } from '@/components/Profile/QuickActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('highlights');
  const { username } = useParams<{ username?: string }>();
  const { user } = useAuth();
  
  // Se tem username na URL, buscar o ID do usuário, senão usar o usuário atual
  const [profileUserId, setProfileUserId] = useState<string | undefined>();
  
  const { profileData, loading, isOwnProfile } = useProfile(profileUserId);

  useEffect(() => {
    if (username && username !== user?.id) {
      // TODO: buscar userId pelo username no futuro
      // Por enquanto, se tem username diferente, usar undefined para mostrar perfil próprio
      setProfileUserId(undefined);
    } else {
      setProfileUserId(user?.id);
    }
  }, [username, user?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleQuickActions = {
    onFollowToggle: () => {
      console.log('Toggle follow');
    },
    onMessage: () => {
      console.log('Send message');
    },
    onSilentFollow: () => {
      console.log('Silent follow');
    },
    onCloneBrains: () => {
      console.log('Clone brains');
    },
    onShare: () => {
      if (navigator.share && profileData) {
        navigator.share({
          title: `Perfil de ${profileData.name}`,
          url: window.location.href
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Perfil não encontrado</h2>
          <p className="text-gray-400">O perfil que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header do Perfil */}
        <motion.div variants={itemVariants} className="mb-8">
          <ProfileHeader 
            {...profileData}
            isOwnProfile={isOwnProfile}
          />
        </motion.div>

        {/* Layout em duas colunas - Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda - Fixa 30% */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            {/* Estatísticas Cognitivas */}
            <CognitiveStats profileUserId={profileUserId} />
            
            {/* Espelho Mental */}
            <div className="lg:sticky lg:top-6">
              <MindMirror profileUserId={profileUserId} />
            </div>
          </motion.div>

          {/* Coluna Direita - Flexível 70% */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 space-y-6"
          >
            {/* Navegação por Abas */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-700">
                <TabsTrigger 
                  value="highlights" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500"
                >
                  Destaques
                </TabsTrigger>
                <TabsTrigger 
                  value="feed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500"
                >
                  Feed Pessoal
                </TabsTrigger>
                <TabsTrigger 
                  value="activity"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500"
                >
                  Atividade
                </TabsTrigger>
              </TabsList>

              <TabsContent value="highlights" className="mt-6">
                <Highlights profileUserId={profileUserId} />
              </TabsContent>

              <TabsContent value="feed" className="mt-6">
                <PersonalFeed profileUserId={profileUserId} />
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="text-center py-12 text-gray-400">
                  <p>Histórico de atividades em desenvolvimento...</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Frase de Identidade */}
        <motion.div 
          variants={itemVariants}
          className="text-center py-12"
        >
          <p className="text-lg font-light italic text-purple-400/80">
            "Esse sou eu. Não apenas quem fui, mas o que estou me tornando."
          </p>
        </motion.div>
      </motion.div>

      {/* Ações Sociais Rápidas - Fixas */}
      {!isOwnProfile && (
        <QuickActions 
          {...handleQuickActions}
          isFollowing={false}
        />
      )}
    </div>
  );
};

export default Profile;
