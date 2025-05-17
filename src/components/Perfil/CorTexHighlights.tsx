import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Star, TrendingUp, Activity, Brain } from "lucide-react";

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

export function CorTexHighlights() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Projetos em destaque */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Projetos em destaque
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={item}>
            <Card className="border-primary/10 bg-card/60 backdrop-blur-sm h-full hover:border-primary/40 transition-colors group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Em andamento</Badge>
                  <span className="text-xs text-muted-foreground">75% concluído</span>
                </div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Desenvolvimento de IA Pessoal</h4>
                <p className="text-xs text-muted-foreground">Criando um assistente virtual personalizado para ajudar na organização das tarefas diárias.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="border-primary/10 bg-card/60 backdrop-blur-sm h-full hover:border-primary/40 transition-colors group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">Planejado</Badge>
                  <span className="text-xs text-muted-foreground">10% concluído</span>
                </div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Livro sobre Produtividade</h4>
                <p className="text-xs text-muted-foreground">Escrevendo um guia prático sobre como aumentar a produtividade com técnicas de segundo cérebro.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="border-primary/10 bg-card/60 backdrop-blur-sm h-full hover:border-primary/40 transition-colors group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-accent/20 text-accent hover:bg-accent/30">Concluído</Badge>
                  <span className="text-xs text-muted-foreground">100% concluído</span>
                </div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Redesign do Portfolio</h4>
                <p className="text-xs text-muted-foreground">Atualização completa do portfolio pessoal com projetos recentes e nova identidade visual.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Conquistas de hábito */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Conquistas de hábito
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={item}>
            <Card className="border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                  <Badge className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    30
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">30 dias de leitura contínua</h4>
                  <p className="text-xs text-muted-foreground">Lendo pelo menos 20 minutos por dia, sem falhar.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="border-primary/10 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-secondary/20 text-secondary">
                  <Badge className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                    15
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">15 dias de meditação</h4>
                  <p className="text-xs text-muted-foreground">Praticando mindfulness todas as manhãs.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Publicações com maior impacto */}
      <motion.section variants={item} className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Publicações com maior impacto
        </h3>
        
        <Card className="border-primary/10 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5 space-y-3">
            <Badge className="bg-accent/20 text-accent">Connecta</Badge>
            <h4 className="font-semibold">Como organizo meus projetos criativos usando o método PARA</h4>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>43 likes</span>
              <span>12 comentários</span>
              <span>8 compartilhamentos</span>
            </div>
            <Button size="sm" variant="outline" className="mt-2 text-xs border-primary/40">Ver publicação</Button>
          </CardContent>
        </Card>
      </motion.section>
      
      {/* Favoritos mais acessados */}
      <motion.section variants={item} className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Favoritos mais acessados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/10 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4 space-y-2">
              <Badge className="bg-primary/20 text-primary">Artigo</Badge>
              <h4 className="font-medium text-sm">Como construir um segundo cérebro eficiente</h4>
              <p className="text-xs text-muted-foreground">Acessado 17 vezes nos últimos 30 dias</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4 space-y-2">
              <Badge className="bg-secondary/20 text-secondary">Vídeo</Badge>
              <h4 className="font-medium text-sm">Masterclass: Produtividade com IA</h4>
              <p className="text-xs text-muted-foreground">Acessado 12 vezes nos últimos 30 dias</p>
            </CardContent>
          </Card>
        </div>
      </motion.section>
      
      {/* Última sugestão da Athena */}
      <motion.section variants={item} className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Sugestão recente da Athena
        </h3>
        
        <Card className="border-primary/10 bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
          <CardContent className="p-5 space-y-2 relative z-10">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm italic text-foreground/90">
                  "Notei que você está criando conteúdo sobre produtividade. Que tal conectar com seu projeto de IA pessoal para criar um sistema integrado?"
                </p>
                <p className="text-xs text-muted-foreground mt-2">Sugerido há 2 dias</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs border-primary/40">
                Explorar conexão
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Mais tarde
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}
