
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search } from "lucide-react";
import PostCard from "@/components/Connecta/PostCard";
import ConnectionsSidebar from "@/components/Connecta/ConnectionsSidebar";
import SuggestionsPanel from "@/components/Connecta/SuggestionsPanel";
import CreatePostModal from "@/components/Connecta/CreatePostModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useConnectaPosts } from "@/hooks/useConnectaPosts";
import { useConnectaConnections } from "@/hooks/useConnectaConnections";
import { PostType } from "@/types/connecta";

export default function Connecta() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Hooks para dados reais
  const {
    posts,
    loading: postsLoading,
    createPost,
    toggleLike,
    toggleSave
  } = useConnectaPosts();

  const {
    conversations,
    connections,
    suggestions,
    loading: connectionsLoading,
    acceptConnection,
    rejectConnection,
    followUser
  } = useConnectaConnections();

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
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para criar um post",
        variant: "destructive"
      });
      return;
    }
    setShowCreateModal(true);
  };

  // Handle post creation with proper error handling
  const handleCreatePost = async (content: string, category: 'focus' | 'expansion' | 'reflection', imageUrl?: string) => {
    try {
      console.log('Criando post:', { content, category, imageUrl });
      const result = await createPost(content, category, imageUrl);
      console.log('Post criado com sucesso:', result);
      
      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso.",
      });
      
      return result;
    } catch (error: any) {
      console.error('Erro ao criar post:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o post. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Handle message selection
  const handleMessageSelect = (conversationId: string) => {
    toast({
      title: "Conversa",
      description: `Abrindo conversa ${conversationId}`,
    });
  };

  // Convert ConnectaPost to PostType for PostCard component
  const convertToPostType = (connectaPost: any): PostType => {
    return {
      id: connectaPost.id,
      author: connectaPost.author,
      content: connectaPost.content,
      createdAt: connectaPost.createdAt,
      likes: connectaPost.likes,
      comments: connectaPost.comments,
      saves: connectaPost.saves,
      liked: connectaPost.liked,
      saved: connectaPost.saved,
      category: connectaPost.category as PostType['category'],
      imageUrl: connectaPost.imageUrl
    };
  };

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "trending":
        return [...posts].sort((a, b) => b.likes - a.likes);
      case "following":
        // TODO: Filtrar posts de usuários seguidos
        return posts.filter((_, index) => index % 2 === 0);
      default:
        return posts;
    }
  };

  // Verificar se o usuário está logado
  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent mb-4">
            CONNECTA
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Conecte-se pelo que você pensa. Evolua com quem te entende.
          </p>
          <p className="text-gray-500">
            Faça login para acessar a rede social
          </p>
        </div>
      </div>
    );
  }

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
            onAccept={acceptConnection}
            onReject={rejectConnection}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 min-h-screen px-6 pb-24"
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
              {postsLoading ? (
                <div className="text-center py-8 text-gray-400">
                  Carregando posts...
                </div>
              ) : getFilteredPosts().length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">Nenhum post encontrado</p>
                  <p className="text-sm">Seja o primeiro a compartilhar uma ideia!</p>
                </div>
              ) : (
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
                        post={convertToPostType(post)}
                        onLike={() => toggleLike(post.id)}
                        onComment={() => handleComment(post.id)}
                        onSave={() => toggleSave(post.id)}
                        onShare={() => handleShare(post.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4 mt-6">
              {postsLoading ? (
                <div className="text-center py-8 text-gray-400">
                  Carregando posts em alta...
                </div>
              ) : (
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
                        post={convertToPostType(post)}
                        onLike={() => toggleLike(post.id)}
                        onComment={() => handleComment(post.id)}
                        onSave={() => toggleSave(post.id)}
                        onShare={() => handleShare(post.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="following" className="space-y-4 mt-6">
              {postsLoading ? (
                <div className="text-center py-8 text-gray-400">
                  Carregando posts de quem você segue...
                </div>
              ) : (
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
                        post={convertToPostType(post)}
                        onLike={() => toggleLike(post.id)}
                        onComment={() => handleComment(post.id)}
                        onSave={() => toggleSave(post.id)}
                        onShare={() => handleShare(post.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>

          {/* Floating New Post Button */}
          <motion.div
            className="fixed bottom-8 right-8 z-50"
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
            onFollow={followUser}
          />
        </motion.div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
