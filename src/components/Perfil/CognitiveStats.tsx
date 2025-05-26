
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Zap, 
  Users, 
  Calendar,
  TrendingUp,
  BookOpen,
  Heart
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

export const CognitiveStats: React.FC = () => {
  const { user } = useAuth();
  const { profileStats, loading } = useProfile(user?.id);

  const stats = [
    {
      icon: Brain,
      label: 'Ideias Capturadas',
      value: profileStats?.ideasCaptured || 0,
      max: 100,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      description: 'Ideias e insights salvos'
    },
    {
      icon: Target,
      label: 'Projetos Concluídos',
      value: profileStats?.projectsCompleted || 0,
      max: 20,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      description: 'Projetos finalizados'
    },
    {
      icon: Zap,
      label: 'Hábitos Ativos',
      value: profileStats?.activeHabits || 0,
      max: 10,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      description: 'Hábitos em desenvolvimento'
    },
    {
      icon: Users,
      label: 'Conexões Ativas',
      value: profileStats?.activeConnections || 0,
      max: 50,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      description: 'Conexões na rede'
    }
  ];

  const additionalStats = [
    {
      icon: BookOpen,
      label: 'Posts Publicados',
      value: profileStats?.totalPosts || 0,
      color: 'text-indigo-400'
    },
    {
      icon: Heart,
      label: 'Curtidas Recebidas',
      value: profileStats?.totalLikes || 0,
      color: 'text-pink-400'
    },
    {
      icon: TrendingUp,
      label: 'Engajamento',
      value: `${Math.round(((profileStats?.totalLikes || 0) / Math.max(profileStats?.totalPosts || 1, 1)) * 100)}%`,
      color: 'text-emerald-400'
    }
  ];

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-6 w-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Estatísticas Cognitivas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const progress = Math.min((stat.value / stat.max) * 100, 100);
              
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${stat.bgColor} border border-gray-600/30`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                      <p className="text-xs text-gray-400">{stat.description}</p>
                    </div>
                    <span className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {stat.value} de {stat.max}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="border-t border-gray-600/30 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Métricas Adicionais</h4>
            <div className="grid grid-cols-3 gap-4">
              {additionalStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="text-center p-3 rounded-lg bg-gray-700/30"
                  >
                    <Icon className={`h-4 w-4 ${stat.color} mx-auto mb-1`} />
                    <p className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              Nível Avançado
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              Explorador Ativo
            </Badge>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              Construtor
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
