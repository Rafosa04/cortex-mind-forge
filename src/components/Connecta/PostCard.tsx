
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, MessageSquare, Share, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
      username: string;
    };
    content: string;
    imageUrl?: string;
    createdAt: string;
    likes: number;
    comments: number;
    saves: number;
    liked: boolean;
    saved: boolean;
    category?: "focus" | "expansion" | "reflection";
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [saves, setSaves] = useState(post.saves);
  const [expanded, setExpanded] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const handleSave = () => {
    if (saved) {
      setSaves((prev) => prev - 1);
    } else {
      setSaves((prev) => prev + 1);
    }
    setSaved(!saved);
  };

  const getCategoryStyle = () => {
    switch (post.category) {
      case "focus":
        return "border-l-primary";
      case "expansion":
        return "border-l-secondary";
      case "reflection":
        return "border-l-accent";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mb-4"
    >
      <Card 
        className={`overflow-hidden backdrop-blur-sm bg-card/90 border-card border-l-4 ${getCategoryStyle()} hover:bg-card/95 transition-all duration-300`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{post.author.name}</div>
              <div className="text-xs text-foreground/60">@{post.author.username} · {timeAgo(post.createdAt)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            animate={{ height: expanded ? 'auto' : expanded ? '100%' : '100%' }}
            transition={{ duration: 0.3 }}
            className={`${!expanded && post.content.length > 240 ? 'line-clamp-4' : ''}`}
          >
            <p className="text-foreground/90 text-sm whitespace-pre-wrap">{post.content}</p>
          </motion.div>
          
          {post.content.length > 240 && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="text-primary text-xs mt-2 hover:underline"
            >
              {expanded ? "Ver menos" : "Ver mais"}
            </button>
          )}

          {post.imageUrl && (
            <div className="mt-3 rounded-md overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt="Post image" 
                className="w-full h-auto object-cover rounded-md hover:scale-[1.01] transition-transform duration-300" 
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-border/40 pt-3 pb-3 flex justify-between">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1 px-2 py-1 h-8"
              onClick={handleLike}
            >
              <Brain 
                className={`w-4 h-4 ${liked ? 'text-primary fill-primary' : 'text-foreground/70'} transition-colors duration-300`} 
              /> 
              <span>{likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1 px-2 py-1 h-8"
            >
              <MessageSquare className="w-4 h-4 text-foreground/70" /> 
              <span>{post.comments}</span>
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs px-2 py-1 h-8"
              onClick={handleSave}
            >
              <Bookmark 
                className={`w-4 h-4 ${saved ? 'text-primary fill-primary' : 'text-foreground/70'} transition-colors duration-300`} 
              />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs px-2 py-1 h-8"
            >
              <Share className="w-4 h-4 text-foreground/70" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
