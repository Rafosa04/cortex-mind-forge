
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Share2, Brain, Calendar } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const posts = [
  {
    id: 1,
    content: "Estou explorando um novo método de organização para meu Segundo Cérebro. Alguém já testou o método BASB (Building a Second Brain) do Tiago Forte?",
    timestamp: "2025-05-13T10:30:00",
    likes: 12,
    comments: 5,
    shares: 2,
    type: "post"
  },
  {
    id: 2,
    content: "Acabei de concluir a primeira fase do meu projeto de IA Pessoal! O modelo já consegue classificar automaticamente minhas notas por contexto.",
    timestamp: "2025-05-10T16:45:00",
    likes: 24,
    comments: 8,
    shares: 6,
    type: "milestone",
    project: "IA Pessoal"
  },
  {
    id: 3,
    content: "Recomendação de livro: 'Hyperfocus' de Chris Bailey mudou completamente minha visão sobre atenção e produtividade.",
    timestamp: "2025-05-08T08:20:00",
    likes: 18,
    comments: 7,
    shares: 9,
    type: "recommendation"
  }
];

export function PersonalFeed() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Filter options */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="border-primary/40 bg-primary/10">
          Todos
        </Button>
        <Button size="sm" variant="ghost">Posts</Button>
        <Button size="sm" variant="ghost">Atualizações</Button>
        <Button size="sm" variant="ghost">Interações</Button>
      </div>
      
      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PostCard({ post }) {
  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-5 pt-5">
        <div className="flex items-start gap-3 mb-4">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-accent/20">AU</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Athena User</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{timeAgo(post.timestamp)}</span>
              {post.type === "milestone" && (
                <Badge className="text-xs bg-primary/20 text-primary">
                  Avanço em projeto: {post.project}
                </Badge>
              )}
              {post.type === "recommendation" && (
                <Badge className="text-xs bg-secondary/20 text-secondary">
                  Recomendação
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-sm mb-4">{post.content}</p>
        
        {post.type === "milestone" && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-md mb-3 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Novo marco alcançado</div>
              <div className="text-xs text-muted-foreground">Projeto está 75% concluído</div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-5 py-3 border-t border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{post.likes}</span>
          </div>
          <span className="mx-1">•</span>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.comments} comentários</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            <span>Brain Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Comentar</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            <span>Compartilhar</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
