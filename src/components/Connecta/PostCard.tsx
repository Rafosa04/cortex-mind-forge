
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, MessageSquare, Bookmark, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Helper function to format dates
const timeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: ptBR
  });
};

type PostCardProps = {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
      username: string;
    };
    content: string;
    createdAt: string;
    likes: number;
    comments: number;
    saves: number;
    liked: boolean;
    saved: boolean;
    category?: string;
    imageUrl?: string;
  };
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
  onShare: () => void;
};

export default function PostCard({ post, onLike, onComment, onSave, onShare }: PostCardProps) {
  return (
    <Card className="overflow-hidden bg-card/40 backdrop-blur-sm border-border/50 hover:shadow-md hover:shadow-primary/5 transition-all">
      <CardContent className="p-4">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{post.author.name}</div>
            <div className="text-xs text-muted-foreground">@{post.author.username} · {timeAgo(post.createdAt)}</div>
          </div>
        </div>
        
        {/* Post content */}
        <p className="mb-4 text-sm">{post.content}</p>
        
        {/* Post image if available */}
        {post.imageUrl && (
          <div className="mt-3 mb-3 rounded-md overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
        )}
        
        {/* Category badge */}
        {post.category && (
          <div className="mt-2 mb-1">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              post.category === "focus" && "bg-[#8B5CF6]/10 text-[#8B5CF6]",
              post.category === "expansion" && "bg-[#0EA5E9]/10 text-[#0EA5E9]",
              post.category === "reflection" && "bg-[#10B981]/10 text-[#10B981]"
            )}>
              {post.category === "focus" && "Clareza"}
              {post.category === "expansion" && "Expansão"}
              {post.category === "reflection" && "Reflexão"}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-border/30 flex justify-between">
        {/* Interaction counts */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>{post.likes} reações</span>
          <span>{post.comments} comentários</span>
          <span>{post.saves} salvos</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onLike}
            className={cn(post.liked && "text-[#8B5CF6]")}
          >
            <Brain className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onComment}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSave}
            className={cn(post.saved && "text-[#0EA5E9]")}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onShare}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
