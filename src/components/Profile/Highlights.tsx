
/**
 * Highlights.tsx
 * Componente de destaques do CÓRTEX - projetos, conquistas, posts e favoritos
 * Props:
 *   - profileUserId: string opcional para visualizar perfil de outro usuário
 * 
 * Exibe os principais destaques do usuário de forma organizada
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  CheckCircle, 
  TrendingUp, 
  Star, 
  Brain,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useProfileHighlights } from '@/hooks/useProfileHighlights';
import { useNavigate } from 'react-router-dom';

interface HighlightsProps {
  profileUserId?: string;
}

export const Highlights: React.FC<HighlightsProps> = ({ profileUserId }) => {
  const { 
    projects, 
    achievements, 
    topPosts, 
    recentFavorites, 
    athenaeSuggestion, 
    loading 
  } = useProfileHighlights(profileUserId);
  
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-800/60 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Projetos em Destaque */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Projetos em Destaque
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/projetos')}
            className="text-purple-400 hover:text-purple-300"
          >
            Ver todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((project) => (
            <Card key={project.id} className="bg-gray-800/60 border-gray-700 hover:bg-gray-800/80 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className={`${
                      project.status === 'em_andamento' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : project.status === 'concluido'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {project.status === 'em_andamento' ? 'Em andamento' : 
                     project.status === 'concluido' ? 'Concluído' : 'Planejado'}
                  </Badge>
                  <span className="text-xs text-gray-400">{project.progress}%</span>
                </div>
                <h4 className="font-medium text-white mb-2">{project.title}</h4>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Conquistas de Hábito */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Conquistas de Hábito
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/habitos')}
            className="text-green-400 hover:text-green-300"
          >
            Ver todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.slice(0, 2).map((achievement, index) => (
            <Card key={index} className="bg-gray-800/60 border-gray-700">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-medium text-white">{achievement.label}</h4>
                  <p className="text-sm text-green-400">{achievement.streak} dias consecutivos</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Posts com Maior Impacto */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Posts com Maior Impacto
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/connecta')}
            className="text-blue-400 hover:text-blue-300"
          >
            Ver no Connecta
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        {topPosts.length > 0 ? (
          <Card className="bg-gray-800/60 border-gray-700">
            <CardContent className="p-4">
              <Badge className="mb-3 bg-blue-500/20 text-blue-400">
                {topPosts[0].category}
              </Badge>
              <p className="text-white mb-3">{topPosts[0].content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{topPosts[0].likes} likes</span>
                <span>{topPosts[0].comments} comentários</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-800/60 border-gray-700">
            <CardContent className="p-4 text-center text-gray-400">
              <p>Nenhum post encontrado ainda</p>
            </CardContent>
          </Card>
        )}
      </motion.section>

      {/* Favoritos Recentes */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Favoritos Recentes
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/favoritos')}
            className="text-yellow-400 hover:text-yellow-300"
          >
            Ver todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentFavorites.slice(0, 2).map((favorite, index) => (
            <Card key={index} className="bg-gray-800/60 border-gray-700">
              <CardContent className="p-4">
                <Badge className="mb-2 bg-yellow-500/20 text-yellow-400">
                  {favorite.type}
                </Badge>
                <h4 className="font-medium text-white mb-2">{favorite.title}</h4>
                <p className="text-xs text-gray-400">
                  Acessado {favorite.accessCount} vezes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Sugestão da Athena */}
      {athenaeSuggestion && (
        <motion.section variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Sugestão da Athena
          </h3>
          
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white mb-3 italic">"{athenaeSuggestion.content}"</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Sugerido {athenaeSuggestion.timestamp}
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/athena')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Explorar com Athena
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </motion.div>
  );
};
