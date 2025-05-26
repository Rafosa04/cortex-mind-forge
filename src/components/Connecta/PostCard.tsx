
/**
 * PostCard - Componente de post para a rede social Connecta
 * 
 * @component
 * @example
 * <PostCard 
 *   post={post} 
 *   onLike={() => handleLike(post.id)}
 *   onSave={() => handleSave(post.id)}
 *   onComment={() => handleComment(post.id)}
 *   onShare={() => handleShare(post.id)}
 * />
 */

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, MessageSquare, Bookmark, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PostType } from "@/types/connecta";

interface PostCardProps {
  post: PostType;
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
  onShare: () => void;
}

/**
 * Formata timestamp para exibição em português
 */
const timeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: ptBR
  });
};

/**
 * Retorna classes CSS para badges de categoria
 */
const getCategoryStyles = (category: PostType['category']) => {
  const styles = {
    focus: "bg-purple-600/20 text-purple-400 border border-purple-600/30",
    expansion: "bg-blue-500/20 text-blue-400 border border-blue-500/30", 
    reflection: "bg-green-500/20 text-green-400 border border-green-500/30"
  };
  return styles[category];
};

/**
 * Retorna nome da categoria em português
 */
const getCategoryName = (category: PostType['category']) => {
  const names = {
    focus: "Clareza",
    expansion: "Expansão", 
    reflection: "Reflexão"
  };
  return names[category];
};

export default function PostCard({ post, onLike, onComment, onSave, onShare }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="bg-gray-800 rounded-2xl p-4 shadow-lg border-gray-700 hover:bg-gray-700 transition-all duration-300">
        <CardContent className="p-0">
          {/* Seção do autor */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 border border-gray-600">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="bg-gray-700 text-white">
                {post.author.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-white">
                {post.author.name}
              </div>
              <div className="text-sm text-gray-400">
                @{post.author.username} · {timeAgo(post.createdAt)}
              </div>
            </div>
          </div>
          
          {/* Conteúdo do post */}
          <p className="text-white mb-4 leading-relaxed">
            {post.content}
          </p>
          
          {/* Imagem do post (se houver) */}
          {post.imageUrl && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full h-auto max-h-80 object-cover"
              />
            </div>
          )}
          
          {/* Badge de categoria */}
          <div className="mb-4">
            <span className={cn(
              "text-xs px-3 py-1 rounded-full font-medium",
              getCategoryStyles(post.category)
            )}>
              {getCategoryName(post.category)}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="px-0 pt-4 border-t border-gray-700 flex justify-between items-center">
          {/* Contadores de interação */}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{post.likes} reações</span>
            <span>{post.comments} comentários</span>
            <span>{post.saves} salvos</span>
          </div>
          
          {/* Botões de ação */}
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onLike}
              className={cn(
                "hover:bg-gray-600 transition-colors",
                post.liked && "text-purple-400 hover:text-purple-300"
              )}
            >
              <Brain className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onComment}
              className="hover:bg-gray-600 hover:text-indigo-400 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSave}
              className={cn(
                "hover:bg-gray-600 transition-colors",
                post.saved && "text-blue-400 hover:text-blue-300"
              )}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onShare}
              className="hover:bg-gray-600 hover:text-indigo-400 transition-colors"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
