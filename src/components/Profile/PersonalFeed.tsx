
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
import { useConnectaPosts } from '@/hooks/useConnectaPosts';
import { useProfile } from '@/hooks/useProfile';

interface PersonalFeedProps {
  profileUserId?: string;
  onLoadMore?: () => void;
  onFilterChange?: (filter: string) => void;
}

export const PersonalFeed: React.FC<PersonalFeedProps> = ({
  profileUserId,
  onLoadMore,
  onFilterChange
}) => {
  const [filter, setFilter] = useState('todos');
  const { posts, loading } = useConnectaPosts();
  const { profileData } = useProfile(profileUserId);

  // Filtrar posts do usuário específico
  const userPosts = posts.filter(post => 
    profileUserId ? post.author.username === profileData?.username : true
  );

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-800/60 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

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
        {userPosts.length > 0 ? userPosts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <PostCard post={post} />
          </motion.div>
        )) : (
          <div className="text-center py-12 text-gray-400">
            <p>Nenhum post encontrado</p>
          </div>
        )}
      </motion.div>

      {/* Botão Carregar Mais */}
      {userPosts.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Carregar mais posts
          </Button>
        </div>
      )}
    </div>
  );
};

interface PostCardProps {
  post: any;
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
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-purple-500/20">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white">{post.author.name}</span>
              <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                projeto
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {formatTimeAgo(post.createdAt)}
              </span>
              
              <Badge className="text-xs bg-blue-500/20 text-blue-400">
                {post.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <p className="text-white mb-4 leading-relaxed">{post.content}</p>

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
            <span className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              {post.saves}
            </span>
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
