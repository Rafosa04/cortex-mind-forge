
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  Lightbulb,
  Calendar,
  ExternalLink,
  Heart,
  MessageSquare
} from 'lucide-react';
import { useProfileHighlights } from '@/hooks/useProfileHighlights';
import { useAuth } from '@/hooks/useAuth';

export const Highlights: React.FC = () => {
  const { user } = useAuth();
  const { 
    projects, 
    achievements, 
    topPosts, 
    recentFavorites, 
    athenaeSuggestion,
    loading 
  } = useProfileHighlights(user?.id);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800/50 backdrop-blur-md border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Projetos em Destaque */}
      <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Projetos em Destaque</h3>
          </div>
          
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-gray-700/30 border border-gray-600/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{project.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          project.status === 'concluido' 
                            ? 'border-green-500/50 text-green-400' 
                            : project.status === 'em_andamento'
                            ? 'border-blue-500/50 text-blue-400'
                            : 'border-gray-500/50 text-gray-400'
                        }`}
                      >
                        {project.status === 'concluido' ? 'Concluído' : 
                         project.status === 'em_andamento' ? 'Em Andamento' : 'Planejado'}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-purple-400">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              Nenhum projeto encontrado. Comece criando seu primeiro projeto!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Conquistas Recentes */}
      <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-5 w-5 text-gold-400" />
            <h3 className="text-lg font-semibold text-white">Conquistas Recentes</h3>
          </div>
          
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20"
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <h4 className="font-medium text-white mb-1">{achievement.label}</h4>
                  <p className="text-sm text-purple-400">
                    {achievement.streak} dias consecutivos
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              Continue desenvolvendo seus hábitos para conquistar badges!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Post em Destaque */}
      {topPosts.length > 0 && (
        <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Post em Destaque</h3>
            </div>
            
            {topPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-gray-700/30 border border-gray-600/30"
              >
                <p className="text-gray-300 mb-3 line-clamp-3">{post.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      post.category === 'focus' 
                        ? 'border-blue-500/50 text-blue-400'
                        : post.category === 'expansion'
                        ? 'border-purple-500/50 text-purple-400'
                        : 'border-green-500/50 text-green-400'
                    }`}
                  >
                    {post.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Favoritos Recentes */}
      {recentFavorites.length > 0 && (
        <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Favoritos Recentes</h3>
            </div>
            
            <div className="space-y-3">
              {recentFavorites.map((favorite, index) => (
                <motion.div
                  key={favorite.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/30"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{favorite.title}</h4>
                    <p className="text-xs text-gray-400">
                      {favorite.type} • Acessado {favorite.accessCount} vezes
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sugestão da Athena */}
      {athenaeSuggestion && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Insight da Athena</h3>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                {athenaeSuggestion.timestamp}
              </Badge>
            </div>
            
            <p className="text-gray-300 italic">
              "{athenaeSuggestion.content}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
