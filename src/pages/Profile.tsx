
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
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { CognitiveStats } from '@/components/Profile/CognitiveStats';
import { Highlights } from '@/components/Profile/Highlights';
import { PersonalFeed } from '@/components/Profile/PersonalFeed';
import { MindMirror } from '@/components/Profile/MindMirror';
import { QuickActions } from '@/components/Profile/QuickActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('highlights');
  
  // TODO: fetch from Supabase table "profiles" and integrate with user context
  const profileData = {
    avatarUrl: '/placeholder.svg',
    coverUrl: 'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1190&q=80',
    name: 'Athena User',
    username: 'athena_user',
    bio: 'Designer, pesquisador e apaixonado por conectar ideias. Construindo um segundo cérebro para explorar o potencial da mente humana.',
    location: 'São Paulo, Brasil',
    publicLink: 'cortex.ai/athena_user'
  };

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
          <ProfileHeader {...profileData} />
        </motion.div>

        {/* Layout em duas colunas - Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda - Fixa 30% */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            {/* Estatísticas Cognitivas */}
            <CognitiveStats />
            
            {/* Espelho Mental */}
            <div className="lg:sticky lg:top-6">
              <MindMirror />
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
                <Highlights />
              </TabsContent>

              <TabsContent value="feed" className="mt-6">
                <PersonalFeed />
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
      <QuickActions />
    </div>
  );
};

export default Profile;
