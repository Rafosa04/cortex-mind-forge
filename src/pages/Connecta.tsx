
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MessageSquare, Brain, Bookmark, Share, Bell, Search, Users } from "lucide-react";
import PostCard from "@/components/Connecta/PostCard";
import ConnectionsSidebar from "@/components/Connecta/ConnectionsSidebar";
import { useToast } from "@/hooks/use-toast";

type FeedCategory = "focus" | "expansion" | "reflection";
type PostType = {
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
  category: FeedCategory;
  imageUrl?: string;
};

export default function Connecta() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");
  const [showConnectionsSidebar, setShowConnectionsSidebar] = useState(false);
  const [feedMode, setFeedMode] = useState<FeedCategory>("focus");
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: "1",
      author: {
        name: "Matheus Alencar",
        avatar: "/placeholder.svg",
        username: "matheusalencar"
      },
      content: "Acabo de conectar meu Subcérebro de Produtividade com a Athena IA. Os lembretes contextuais estão revolucionando minha rotina matinal! #AthenaTips",
      createdAt: "2024-05-14T09:30:00",
      likes: 24,
      comments: 5,
      saves: 7,
      liked: false,
      saved: false,
      category: "focus"
    },
    {
      id: "2",
      author: {
        name: "Sofia Torres",
        avatar: "/placeholder.svg",
        username: "sofiatorres"
      },
      content: "Meu novo projeto de visualização de hábitos está disponível para todos os usuários Córtex. Visualize seus padrões mentais de forma tridimensional!",
      imageUrl: "/placeholder.svg",
      createdAt: "2024-05-14T10:15:00",
      likes: 42,
      comments: 13,
      saves: 18,
      liked: true,
      saved: false,
      category: "expansion"
    },
    {
      id: "3",
      author: {
        name: "Daniel Moretti",
        avatar: "/placeholder.svg",
        username: "danielmoretti"
      },
      content: "Reflexão do dia: Como a integração entre diferentes subcérebros tem potencializado seu processo criativo? Para mim, conectar 'Estudos Filosóficos' + 'Música' gerou insights inesperados.",
      createdAt: "2024-05-14T11:45:00",
      likes: 17,
      comments: 8,
      saves: 5,
      liked: false,
      saved: true,
      category: "reflection"
    }
  ]);

  // Handle post like
  const handleLike = (postId: string) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  // Handle post save
  const handleSave = (postId: string) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            saved: !post.saved,
            saves: post.saved ? post.saves - 1 : post.saves + 1
          };
        }
        return post;
      })
    );
  };

  // Handle post comment
  const handleComment = (postId: string) => {
    toast({
      title: "Comentário",
      description: "Funcionalidade de comentários em desenvolvimento",
    });
  };

  // Handle post share
  const handleShare = (postId: string) => {
    toast({
      title: "Compartilhar",
      description: "Funcionalidade de compartilhamento em desenvolvimento",
    });
  };

  // Handle new post
  const handleNewPost = () => {
    toast({
      title: "Nova Ideia",
      description: "Funcionalidade para criar nova postagem em desenvolvimento",
    });
  };

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "trending":
        return [...posts].sort((a, b) => b.likes - a.likes);
      case "following":
        return posts.filter((_, index) => index % 2 === 0); // Mocked following filter
      default:
        return posts.filter(post => post.category === feedMode);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with tagline */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">
          CONNECTA
        </h1>
        <p className="text-sm text-muted-foreground">
          Conecte-se pelo que você pensa. Evolua com quem te entende.
        </p>
      </motion.div>

      <div className="flex gap-4">
        {/* Main content area */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Feed filter bar */}
          <div className="flex justify-between items-center mb-6">
            {/* Tabs for feed filtering */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="trending">Em Alta</TabsTrigger>
                <TabsTrigger value="following">Seguindo</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search button */}
            <Button variant="ghost" size="icon" className="ml-2">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Notifications button */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* Connections button - toggles sidebar */}
            <Button 
              variant={showConnectionsSidebar ? "secondary" : "ghost"} 
              size="icon"
              onClick={() => setShowConnectionsSidebar(!showConnectionsSidebar)}
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>

          {/* Neural Feed Selector - only shown on main feed tab */}
          {activeTab === "feed" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-card/30 backdrop-blur-sm p-3 rounded-lg border border-border/50"
            >
              <p className="text-xs text-muted-foreground mb-2">Feed Neuronal Vivo</p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={feedMode === "focus" ? "default" : "outline"}
                  className={feedMode === "focus" ? "bg-[#8B5CF6] hover:bg-[#7C3AED]" : ""}
                  onClick={() => setFeedMode("focus")}
                >
                  Feed de Clareza
                </Button>
                <Button 
                  size="sm" 
                  variant={feedMode === "expansion" ? "default" : "outline"}
                  className={feedMode === "expansion" ? "bg-[#0EA5E9] hover:bg-[#0284C7]" : ""}
                  onClick={() => setFeedMode("expansion")}
                >
                  Feed de Expansão
                </Button>
                <Button 
                  size="sm" 
                  variant={feedMode === "reflection" ? "default" : "outline"}
                  className={feedMode === "reflection" ? "bg-[#10B981] hover:bg-[#059669]" : ""}
                  onClick={() => setFeedMode("reflection")}
                >
                  Feed de Espelho
                </Button>
              </div>
            </motion.div>
          )}

          {/* Posts feed */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {getFilteredPosts().map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <PostCard 
                    post={post}
                    onLike={() => handleLike(post.id)}
                    onComment={() => handleComment(post.id)}
                    onSave={() => handleSave(post.id)}
                    onShare={() => handleShare(post.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Floating New Post Button */}
          <motion.div
            className="fixed bottom-8 right-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleNewPost}
              size="lg" 
              className="rounded-full w-14 h-14 bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-lg shadow-purple-500/20"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Connections sidebar (conditionally shown) */}
        <AnimatePresence>
          {showConnectionsSidebar && (
            <ConnectionsSidebar onClose={() => setShowConnectionsSidebar(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
