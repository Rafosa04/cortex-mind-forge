import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import PostCard from "@/components/Connecta/PostCard";
import FeedTabs from "@/components/Connecta/FeedTabs";
import FeedTypeSelector from "@/components/Connecta/FeedTypeSelector";
import SuggestedConnections from "@/components/Connecta/SuggestedConnections";
import NewPostButton from "@/components/Connecta/NewPostButton";
import NewPostModal from "@/components/Connecta/NewPostModal";

// Define the type for a post to ensure consistency
interface Post {
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
}

// Dados de exemplo para a demonstração
const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Marina Silva",
      avatar: "https://i.pravatar.cc/150?img=1",
      username: "marina.criativa"
    },
    content: "Descobri que manter um diário de ideias aumentou minha produtividade em 30%. Comecei anotando qualquer pensamento que surgia durante o dia e, depois de uma semana, consegui identificar padrões criativos que nunca havia percebido antes.",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    likes: 24,
    comments: 5,
    saves: 3,
    liked: false,
    saved: false,
    category: "focus" as const
  },
  {
    id: "2",
    author: {
      name: "Rafael Mendes",
      avatar: "https://i.pravatar.cc/150?img=4",
      username: "rafa_dev"
    },
    content: "Depois de estudar o conceito de 'flow state', comecei a experimentar técnicas para induzir esse estado mental durante meus projetos. A combinação de música instrumental específica, respiração controlada e eliminação de distrações tem funcionado incrivelmente bem.\n\nConsigo manter foco total por até 2 horas seguidas agora. Alguém mais tem técnicas para compartilhar?",
    imageUrl: "https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    likes: 42,
    comments: 13,
    saves: 7,
    liked: true,
    saved: false,
    category: "expansion" as const
  },
  {
    id: "3",
    author: {
      name: "Carla Duarte",
      avatar: "https://i.pravatar.cc/150?img=5",
      username: "carla.mindfulness"
    },
    content: "Finalmente terminei meu projeto de visualização de dados que compara meus hábitos ao longo do último ano. É fascinante ver como pequenas mudanças de rotina geraram impactos tão significativos nos meus níveis de energia e foco mental.",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    likes: 18,
    comments: 7,
    saves: 9,
    liked: false,
    saved: true,
    category: "reflection" as const
  }
];

const mockConnections = [
  {
    id: "1",
    name: "Daniel Costa",
    username: "daniel.costa",
    avatar: "https://i.pravatar.cc/150?img=11",
    commonElements: 3,
    type: "project" as const
  },
  {
    id: "2",
    name: "Júlia Santos",
    username: "julia.mindset",
    avatar: "https://i.pravatar.cc/150?img=9",
    commonElements: 2,
    type: "habit" as const
  },
  {
    id: "3",
    name: "Matheus Alves",
    username: "math.dev",
    avatar: "https://i.pravatar.cc/150?img=12",
    commonElements: 5,
    type: "favorite" as const
  }
];

export default function Connecta() {
  const [activeTab, setActiveTab] = useState("feed");
  const [feedType, setFeedType] = useState("all");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Simular diferentes feeds baseados no tipo selecionado
  useEffect(() => {
    let filtered = [...mockPosts];
    
    if (feedType !== "all") {
      // Aplicar filtros diferentes com base no tipo de feed
      if (feedType === "clarity") {
        filtered = mockPosts.filter(post => post.category === "focus");
      } else if (feedType === "expansion") {
        filtered = mockPosts.filter(post => post.category === "expansion");
      } else if (feedType === "reflection") {
        filtered = mockPosts.filter(post => post.category === "reflection");
      }
    }
    
    setPosts(filtered);
  }, [feedType]);
  
  const handleAddPost = (content: string, imageUrl?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: "Você",
        avatar: "https://i.pravatar.cc/150?img=2",
        username: "seu.usuario"
      },
      content,
      imageUrl,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      saves: 0,
      liked: false,
      saved: false,
      category: "reflection" // Default category for new posts
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-primary mb-2">Connecta</h1>
        <p className="text-sm text-foreground/70">
          Conecte-se pelo que você pensa. Evolua com quem te entende.
        </p>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Feed principal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full lg:w-2/3"
        >
          <div className="flex justify-between items-center mb-4">
            <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
            <FeedTypeSelector activeType={feedType} onChange={setFeedType} />
          </div>
          
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </motion.div>
        
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/3 space-y-6"
        >
          <SuggestedConnections connections={mockConnections} />
          
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Impacto Cognitivo</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Engajamento positivo</span>
                  <span className="text-primary">68%</span>
                </div>
                <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Conexões de qualidade</span>
                  <span className="text-primary">42%</span>
                </div>
                <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Compartilhamento de conhecimento</span>
                  <span className="text-primary">75%</span>
                </div>
                <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Feed Neuronal</h3>
            <p className="text-xs text-foreground/70 mb-3">
              Seu feed está atualmente otimizado para conteúdo que estimula reflexão e crescimento baseado em seus hábitos recentes.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-background/30 text-center p-2 rounded-md">
                <div className="text-[10px] text-foreground/60">Clareza</div>
                <div className="text-xs font-medium text-primary mt-1">45%</div>
              </div>
              <div className="bg-background/30 text-center p-2 rounded-md">
                <div className="text-[10px] text-foreground/60">Expansão</div>
                <div className="text-xs font-medium text-primary mt-1">30%</div>
              </div>
              <div className="bg-background/30 text-center p-2 rounded-md">
                <div className="text-[10px] text-foreground/60">Reflexão</div>
                <div className="text-xs font-medium text-primary mt-1">25%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <NewPostButton onClick={() => setIsPostModalOpen(true)} />
      
      <NewPostModal
        open={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPost={handleAddPost}
        userAvatar="https://i.pravatar.cc/150?img=2"
        userName="Você"
      />
    </div>
  );
}
