
/**
 * Highlights.tsx
 * Exibe destaques do CÓRTEX: projetos, conquistas, posts e sugestões da Athena
 * Props: arrays tipados para cada seção
 * 
 * Seções:
 *   - Projetos em destaque (até 3)
 *   - Conquistas de hábito
 *   - Top posts do Connecta
 *   - Favoritos recentes
 *   - Última sugestão da Athena
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Folder, 
  Trophy, 
  TrendingUp, 
  Star, 
  Brain,
  ExternalLink,
  Clock
} from 'lucide-react';

export const Highlights: React.FC = () => {
  // TODO: fetch from Supabase tables "projects", "habits", "posts", "favorites", "athena_suggestions"
  const projects = [
    {
      id: '1',
      title: 'IA Pessoal Assistant',
      progress: 75,
      status: 'em_andamento' as const,
      thumbnail: '/placeholder.svg'
    },
    {
      id: '2', 
      title: 'Livro Produtividade',
      progress: 30,
      status: 'planejado' as const,
      thumbnail: '/placeholder.svg'
    },
    {
      id: '3',
      title: 'Portfolio Redesign',
      progress: 100,
      status: 'concluido' as const,
      thumbnail: '/placeholder.svg'
    }
  ];

  const achievements = [
    { label: '30 dias de leitura', streak: 30, icon: '📚' },
    { label: '15 dias de meditação', streak: 15, icon: '🧘' }
  ];

  const topPosts = [
    {
      id: '1',
      content: 'Como organizo meus projetos criativos usando o método PARA...',
      likes: 43,
      comments: 12,
      category: 'expansion' as const
    }
  ];

  const recentFavorites = [
    { title: 'Building a Second Brain', type: 'artigo', accessCount: 17 },
    { title: 'Productivity with AI', type: 'video', accessCount: 12 }
  ];

  const athenaeSuggestion = {
    content: "Notei que você está criando conteúdo sobre produtividade. Que tal conectar com seu projeto de IA pessoal para criar um sistema integrado?",
    timestamp: "há 2 dias"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Projetos em Destaque */}
      <motion.section variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Folder className="h-5 w-5 text-purple-400" />
          Projetos em Destaque
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={project.status === 'concluido' ? 'default' : 'secondary'}
                    className={
                      project.status === 'concluido' 
                        ? 'bg-green-500/20 text-green-400'
                        : project.status === 'em_andamento'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }
                  >
                    {project.status === 'concluido' ? 'Concluído' : 
                     project.status === 'em_andamento' ? 'Em andamento' : 'Planejado'}
                  </Badge>
                  <span className="text-xs text-gray-400">{project.progress}%</span>
                </div>
                
                <h4 className="font-medium text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h4>
                
                <Progress value={project.progress} className="h-2 mb-3" />
                
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver Projeto
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Conquistas de Hábito */}
      <motion.section variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Conquistas de Hábito
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{achievement.label}</h4>
                  <p className="text-sm text-gray-400">Sequência de {achievement.streak} dias</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {achievement.streak}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Top Posts do Connecta */}
      <motion.section variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Publicações em Destaque
        </h3>
        {topPosts.map((post) => (
          <Card key={post.id} className="bg-gray-700/50 border-gray-600">
            <CardContent className="p-4">
              <Badge className="mb-3 bg-blue-500/20 text-blue-400">Connecta</Badge>
              <p className="text-white mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{post.likes} likes</span>
                <span>{post.comments} comentários</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.section>

      {/* Favoritos Recentes */}
      <motion.section variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Favoritos Mais Acessados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentFavorites.map((favorite, index) => (
            <Card key={index} className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors">
              <CardContent className="p-4">
                <Badge className="mb-2 bg-purple-500/20 text-purple-400">
                  {favorite.type}
                </Badge>
                <h4 className="font-medium text-white mb-2">{favorite.title}</h4>
                <p className="text-xs text-gray-400">
                  Acessado {favorite.accessCount} vezes nos últimos 30 dias
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Sugestão da Athena */}
      <motion.section variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          Última Sugestão da Athena
        </h3>
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white italic mb-3">"{athenaeSuggestion.content}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {athenaeSuggestion.timestamp}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
                      Explorar conexão
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      Mais tarde
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
};
