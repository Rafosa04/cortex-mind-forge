
/**
 * CognitiveStats.tsx
 * Exibe estatísticas cognitivas do usuário com animações
 * Props: dados das estatísticas com tendências e valores
 * 
 * Layout: grid responsivo 2×3 (desktop) / carrossel (mobile)
 * Animações: números contam dinamicamente
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, CheckCircle, Target, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend?: 'up' | 'down';
  trendValue?: number;
}

export const CognitiveStats: React.FC = () => {
  // TODO: fetch from Supabase tables "projects", "habits", "posts", etc.
  const stats: StatCard[] = [
    {
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      label: 'Ideias Capturadas',
      value: 247,
      trend: 'up',
      trendValue: 12
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      label: 'Projetos Concluídos',
      value: 18,
      trend: 'up',
      trendValue: 3
    },
    {
      icon: <Target className="h-6 w-6 text-blue-400" />,
      label: 'Hábitos Ativos',
      value: 8,
      trend: 'up',
      trendValue: 2
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-400" />,
      label: 'Conexões Ativas',
      value: 42,
      trend: 'up',
      trendValue: 7
    }
  ];

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
