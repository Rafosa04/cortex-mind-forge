
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search, Users } from "lucide-react";
import PostCard from "@/components/Connecta/PostCard";
import ConnectionsSidebar from "@/components/Connecta/ConnectionsSidebar";
import SuggestionsPanel from "@/components/Connecta/SuggestionsPanel";
import { useToast } from "@/hooks/use-toast";
import { PostType, ConnectionType, ConversationType, UserSuggestionType } from "@/types/connecta";

export default function Connecta() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");
  const [showConnectionsSidebar, setShowConnectionsSidebar] = useState(false);

  // TODO: fetch posts from Supabase table "posts"
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

  // TODO: fetch conversations from "messages" 
  const [conversations, setConversations] = useState<ConversationType[]>([
    {
      id: "1",
      participant: {
        name: "Ana Silva",
        avatar: "/placeholder.svg",
        username: "anasilva"
      },
      lastMessage: "Adorei sua reflexão sobre criatividade!",
      timestamp: "2024-05-14T14:30:00",
      unreadCount: 2,
      isOnline: true
    }
  ]);

  // TODO: fetch connections from "connections"
  const [connections, setConnections] = useState<ConnectionType[]>([
    {
      id: "1",
      name: "Lucas Santos",
      avatar: "/placeholder.svg",
      username: "lucassantos",
      status: "pending",
      mutualConnections: 5
    },
    {
      id: "2",
      name: "Maria Costa",
      avatar: "/placeholder.svg",
      username: "mariacosta",
      status: "suggested",
      mutualConnections: 3,
      commonInterests: ["Filosofia", "Tecnologia"]
    }
  ]);

  // TODO: fetch user suggestions from "user_suggestions"
  const [suggestions, setSuggestions] = useState<UserSuggestionType[]>([
    {
      id: "1",
      name: "Pedro Oliveira",
      avatar: "/placeholder.svg", 
      username: "pedrooliveira",
      commonCells: 8,
      mutualConnections: 2,
      isFollowing: false
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
    // TODO: Open comment modal/thread
    toast({
      title: "Comentário",
      description: "Funcionalidade de comentários em desenvolvimento",
    });
  };

  // Handle post share
  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    toast({
      title: "Compartilhar",
      description: "Funcionalidade de compartilhamento em desenvolvimento",
    });
  };

  // Handle new post
  const handleNewPost = () => {
    // TODO: Open create post modal
    toast({
      title: "Nova Ideia",
      description: "Funcionalidade para criar nova postagem em desenvolvimento",
    });
  };

  // Handle message selection
  const handleMessageSelect = (conversationId: string) => {
    // TODO: Open chat interface
    toast({
      title: "Conversa",
      description: `Abrindo conversa ${conversationId}`,
    });
  };

  // Handle connection accept
  const handleAccept = (connectionId: string) => {
    // TODO: Accept connection in database
    setConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: "accepted" as const }
          : conn
      )
    );
    toast({
      title: "Conexão aceita",
      description: "Conexão estabelecida com sucesso!",
    });
  };

  // Handle connection reject
  const handleReject = (connectionId: string) => {
    // TODO: Reject connection in database
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    toast({
      title: "Conexão rejeitada",
      description: "Solicitação rejeitada.",
    });
  };

  // Handle follow user
  const handleFollow = (userId: string) => {
    // TODO: Follow/unfollow user in database
    setSuggestions(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
    toast({
      title: "Seguindo",
      description: "Agora você está seguindo este usuário!",
    });
  };

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "trending":
        return [...posts].sort((a, b) => b.likes - a.likes);
      case "following":
        return posts.filter((_, index) => index % 2 === 0); // Mock following filter
      default:
        return posts;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Connections */}
        <motion.div 
          className="w-1/4 min-w-80 h-screen sticky top-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ConnectionsSidebar
            conversations={conversations}
            connections={connections}
            onMessageSelect={handleMessageSelect}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 min-h-screen px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Header with tagline */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8 text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2">
              CONNECTA
            </h1>
            <p className="text-gray-400 text-lg">
              Conecte-se pelo que você pensa. Evolua com quem te entende.
            </p>
          </motion.div>

          {/* Action bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tabs for feed filtering */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-gray-800">
              <TabsTrigger 
                value="feed"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                Feed
              </TabsTrigger>
              <TabsTrigger 
                value="trending"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                Em Alta
              </TabsTrigger>
              <TabsTrigger 
                value="following"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                Seguindo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4 mt-6">
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
            </TabsContent>

            <TabsContent value="trending" className="space-y-4 mt-6">
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
            </TabsContent>

            <TabsContent value="following" className="space-y-4 mt-6">
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
            </TabsContent>
          </Tabs>

          {/* Floating New Post Button */}
          <motion.div
            className="fixed bottom-8 right-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleNewPost}
              size="lg" 
              className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg shadow-purple-500/20"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Sidebar - Suggestions */}
        <motion.div 
          className="w-1/4 min-w-80 h-screen sticky top-0 px-4 py-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SuggestionsPanel
            suggestions={suggestions}
            onFollow={handleFollow}
          />
        </motion.div>
      </div>
    </div>
  );
}
