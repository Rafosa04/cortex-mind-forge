
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react';

export const PersonalFeed: React.FC = () => {
  // Mock data - replace with real data from hooks
  const feedItems = [
    {
      id: '1',
      type: 'post',
      content: 'Acabei de conectar minha rotina matinal com meu projeto de IA pessoal. A produtividade disparou! 🚀',
      timestamp: '2h atrás',
      category: 'productivity',
      likes: 12,
      comments: 3,
      isLiked: false,
      isSaved: true
    },
    {
      id: '2',
      type: 'achievement',
      content: 'Completei 30 dias consecutivos de meditação! 🧘‍♂️',
      timestamp: '1 dia atrás',
      category: 'habit',
      likes: 25,
      comments: 8,
      isLiked: true,
      isSaved: false
    },
    {
      id: '3',
      type: 'insight',
      content: 'Descoberta interessante: meus picos de criatividade acontecem sempre após exercícios físicos. Conectando os pontos! 💡',
      timestamp: '3 dias atrás',
      category: 'insight',
      likes: 18,
      comments: 5,
      isLiked: false,
      isSaved: true
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity':
        return 'border-blue-500/50 text-blue-400';
      case 'habit':
        return 'border-green-500/50 text-green-400';
      case 'insight':
        return 'border-purple-500/50 text-purple-400';
      default:
        return 'border-gray-500/50 text-gray-400';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'productivity':
        return 'Produtividade';
      case 'habit':
        return 'Hábito';
      case 'insight':
        return 'Insight';
      default:
        return 'Geral';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Seu Feed Pessoal</h3>
        <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
          <TrendingUp className="h-4 w-4 mr-2" />
          Ver Tendências
        </Button>
      </div>

      <div className="space-y-4">
        {feedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400">
                      EU
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{item.timestamp}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(item.category)}`}
                      >
                        {getCategoryLabel(item.category)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`text-gray-400 hover:text-white gap-2 ${
                            item.isLiked ? 'text-red-400' : ''
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${item.isLiked ? 'fill-current' : ''}`} />
                          <span>{item.likes}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{item.comments}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-gray-400 hover:text-white ${
                          item.isSaved ? 'text-yellow-400' : ''
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${item.isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">Você chegou ao fim do seu feed pessoal</p>
        <Button variant="outline" className="border-purple-500/50 text-purple-400">
          Criar Novo Post
        </Button>
      </div>
    </div>
  );
};
