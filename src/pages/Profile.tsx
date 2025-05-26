
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
import { useProfileHighlights } from '@/hooks/useProfileHighlights';
import { useAuth } from '@/hooks/useAuth';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('highlights');
  const { username } = useParams<{ username?: string }>();
  const { user } = useAuth();
  
  // TODO: dados reais via useProfile - integração completa com Supabase
  const [profileUserId, setProfileUserId] = useState<string | undefined>();
  
  const { profileData, loading: profileLoading, isOwnProfile } = useProfile(profileUserId);
  const { 
    projects, 
    achievements, 
    topPosts, 
    recentFavorites, 
    athenaeSuggestion, 
    loading: highlightsLoading 
  } = useProfileHighlights(profileUserId);

  useEffect(() => {
    if (username && username !== user?.id) {
      // TODO: buscar userId pelo username no futuro
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

  // Loading state - while any hook is loading
  if (profileLoading || highlightsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400" aria-label="Carregando perfil">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Error state - if profile is not found
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
        {/* Header do Perfil - dados reais via useProfile */}
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
            {/* Estatísticas Cognitivas - dados reais via useProfile */}
            <CognitiveStats profileUserId={profileUserId} />
            
            {/* Espelho Mental - dados reais com athenaeSuggestion */}
            <div className="lg:sticky lg:top-6">
              <MindMirror 
                profileUserId={profileUserId} 
                diagnostic={athenaeSuggestion?.content}
              />
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

              {/* TODO: dados reais via useProfileHighlights */}
              <TabsContent value="highlights" className="mt-6">
                <Highlights profileUserId={profileUserId} />
              </TabsContent>

              {/* TODO: dados reais via useConnectaPosts */}
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

      {/* Ações Sociais Rápidas - Fixas - apenas para perfis de outros usuários */}
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
