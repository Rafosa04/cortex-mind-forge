
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, CheckCircle, Target, Star, TrendingUp, TrendingDown, Users, Heart } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend?: 'up' | 'down';
  trendValue?: number;
  color: string;
}

interface CognitiveStatsProps {
  profileUserId?: string;
}

export const CognitiveStats: React.FC<CognitiveStatsProps> = ({ profileUserId }) => {
  const { profileStats, loading } = useProfile(profileUserId);

  const stats: StatCard[] = [
    {
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      label: 'Ideias Capturadas',
      value: profileStats?.ideasCaptured || 0,
      trend: 'up',
      trendValue: 12,
      color: 'purple'
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      label: 'Projetos Concluídos',
      value: profileStats?.projectsCompleted || 0,
      trend: 'up',
      trendValue: 3,
      color: 'green'
    },
    {
      icon: <Target className="h-6 w-6 text-blue-400" />,
      label: 'Hábitos Ativos',
      value: profileStats?.activeHabits || 0,
      trend: 'up',
      trendValue: 2,
      color: 'blue'
    },
    {
      icon: <Users className="h-6 w-6 text-yellow-400" />,
      label: 'Conexões Ativas',
      value: profileStats?.activeConnections || 0,
      trend: 'up',
      trendValue: 7,
      color: 'yellow'
    },
    {
      icon: <Star className="h-6 w-6 text-orange-400" />,
      label: 'Posts Publicados',
      value: profileStats?.totalPosts || 0,
      trend: 'up',
      trendValue: 5,
      color: 'orange'
    },
    {
      icon: <Heart className="h-6 w-6 text-red-400" />,
      label: 'Curtidas Recebidas',
      value: profileStats?.totalLikes || 0,
      trend: 'up',
      trendValue: 24,
      color: 'red'
    }
  ];

  // Loading state com skeleton
  if (loading) {
    return (
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-700/50 rounded-lg p-4 h-24"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          Estatísticas Cognitivas
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <StatCardComponent key={index} stat={stat} delay={index * 0.1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardComponentProps {
  stat: StatCard;
  delay: number;
}

const StatCardComponent: React.FC<StatCardComponentProps> = ({ stat, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
      const steps = 30;
      const increment = stat.value / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [stat.value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        {stat.icon}
        {stat.trend && (
          <div className={`flex items-center gap-1 text-xs ${
            stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {stat.trendValue && `+${stat.trendValue}`}
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-white mb-1">
        {count}
      </div>
      
      <div className="text-xs text-gray-400">
        {stat.label}
      </div>
    </motion.div>
  );
};
