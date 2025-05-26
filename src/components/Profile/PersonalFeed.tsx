
/**
 * PersonalFeed.tsx
 * Feed pessoal do usuário com infinite scroll e filtros
 * Props: 
 *   - onLoadMore: callback para carregar mais posts
 *   - onFilterChange: callback para mudança de filtro
 * 
 * Funcionalidades:
 *   - Lista paginada com infinite scroll
 *   - Filtros por tipo de conteúdo
 *   - Marcações de evolução nos posts
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  CheckCircle,
  Calendar,
  Filter
} from 'lucide-react';

interface PersonalFeedProps {
  onLoadMore?: () => void;
  onFilterChange?: (filter: string) => void;
}

export const PersonalFeed: React.FC<PersonalFeedProps> = ({
  onLoadMore,
  onFilterChange
}) => {
  const [filter, setFilter] = useState('todos');

  // TODO: fetch from Supabase table "posts" filtered by user
  const posts = [
    {
      id: '1',
      content: 'Estou explorando um novo método de organização para meu Segundo Cérebro. Alguém já testou o método BASB (Building a Second Brain) do Tiago Forte?',
      timestamp: '2025-05-13T10:30:00',
      likes: 12,
      comments: 5,
      shares: 2,
      type: 'post' as const,
      evolutionTag: null
    },
    {
      id: '2',
      content: 'Acabei de concluir a primeira fase do meu projeto de IA Pessoal! O modelo já consegue classificar automaticamente minhas notas por contexto.',
      timestamp: '2025-05-10T16:45:00',
      likes: 24,
      comments: 8,
      shares: 6,
      type: 'milestone' as const,
      project: 'IA Pessoal',
      evolutionTag: 'projeto'
    },
    {
      id: '3',
      content: 'Recomendação de livro: "Hyperfocus" de Chris Bailey mudou completamente minha visão sobre atenção e produtividade.',
      timestamp: '2025-05-08T08:20:00',
      likes: 18,
      comments: 7,
      shares: 9,
      type: 'recommendation' as const,
      evolutionTag: null
    }
  ];

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `há ${diffInHours}h`;
    }
    return `há ${Math.floor(diffInHours / 24)} dias`;
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    onFilterChange?.(value);
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
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Feed Pessoal</h3>
        
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="projetos">Projetos</SelectItem>
            <SelectItem value="habitos">Hábitos</SelectItem>
            <SelectItem value="ia">IA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Posts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>

      {/* Botão Carregar Mais */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={onLoadMore}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Carregar mais posts
        </Button>
      </div>
    </div>
  );
};

interface PostCardProps {
  post: {
    id: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares?: number;
    type: 'post' | 'milestone' | 'recommendation';
    project?: string;
    evolutionTag?: string | null;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `há ${diffInHours}h`;
    }
    return `há ${Math.floor(diffInHours / 24)} dias`;
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700 hover:bg-gray-800/80 transition-colors">
      <CardContent className="p-6">
        {/* Header do Post */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-purple-500/20">AU</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white">Athena User</span>
              {post.evolutionTag && (
                <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {post.evolutionTag}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {formatTimeAgo(post.timestamp)}
              </span>
              
              {post.type === 'milestone' && post.project && (
                <Badge className="text-xs bg-blue-500/20 text-blue-400">
                  Projeto: {post.project}
                </Badge>
              )}
              
              {post.type === 'recommendation' && (
                <Badge className="text-xs bg-yellow-500/20 text-yellow-400">
                  Recomendação
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <p className="text-white mb-4 leading-relaxed">{post.content}</p>

        {/* Milestone específico */}
        {post.type === 'milestone' && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">Novo marco alcançado</div>
              <div className="text-xs text-gray-400">Projeto está 75% concluído</div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {post.comments}
            </span>
            {post.shares && (
              <span className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                {post.shares}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Curtir
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
              <MessageSquare className="h-4 w-4 mr-1" />
              Comentar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
