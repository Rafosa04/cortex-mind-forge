
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, Music, Youtube, Podcast, Book, Play, Link, Calendar, Grid, Table, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock data for the different content types
const SPOTIFY_ITEMS = [
  { 
    id: 1, 
    title: "Lo-Fi Focus", 
    artist: "ChillBeats", 
    coverUrl: "https://placehold.co/100x100/993887/FFFFFF/png",
    duration: "1:27:42",
    tags: ["foco", "trabalho", "estudo"],
    badge: "Mais ouvido de abril"
  },
  { 
    id: 2, 
    title: "Deep Work", 
    artist: "Mind Sense", 
    coverUrl: "https://placehold.co/100x100/191933/60B5B5/png",
    duration: "42:16",
    tags: ["concentração", "produtividade"],
    badge: "Combinação com projeto Tese"
  },
];

const YOUTUBE_ITEMS = [
  {
    id: 1,
    title: "Como criar um segundo cérebro digital",
    channel: "Produtivity Master",
    thumbnailUrl: "https://placehold.co/200x120/191933/E6E6F0/png",
    watchedTime: "18:42 de 24:15",
    insights: "Você assistiu 3 vídeos sobre produtividade essa semana"
  },
  {
    id: 2,
    title: "Técnicas avançadas de gestão mental",
    channel: "Brain Works",
    thumbnailUrl: "https://placehold.co/200x120/0C0C1C/60B5B5/png",
    watchedTime: "9:27 de 15:30",
    insights: "Relacionado ao seu hábito de meditação"
  }
];

const PODCAST_ITEMS = [
  {
    id: 1,
    title: "Consciência e foco digital",
    podcast: "Tech Mind",
    coverUrl: "https://placehold.co/80x80/993887/FFFFFF/png",
    highlight: "A formação de hábitos digitais depende da consciência do seu impacto mental",
    tags: ["tecnologia", "saúde mental"]
  },
  {
    id: 2,
    title: "Hábitos que transformam",
    podcast: "Evolução Diária",
    coverUrl: "https://placehold.co/80x80/191933/60B5B5/png",
    highlight: "Pequenas mudanças no dia a dia constroem resultados extraordinários",
    tags: ["hábitos", "crescimento"]
  }
];

const ARTICLE_ITEMS = [
  {
    id: 1,
    title: "Como criar um segundo cérebro eficiente",
    domain: "produtividade.com.br",
    summary: "Um guia completo para organizar conhecimento e informações no mundo digital atual.",
    category: "Produtividade"
  },
  {
    id: 2,
    title: "Neuroplasticidade e formação de hábitos",
    domain: "cienciadamente.org",
    summary: "Descobertas recentes mostram como o cérebro se adapta a novos comportamentos.",
    category: "Ciência"
  }
];

export default function Favoritos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState("todos");
  const [viewMode, setViewMode] = useState("gallery");
  const [modalOpen, setModalOpen] = useState(false);
  const [athenaDialog, setAthenaDialog] = useState(false);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-2">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#60B5F5] to-[#993887] leading-tight mb-1">
            Favoritos Inteligentes
          </h2>
          <div className="text-sm text-foreground/60">
            "Tudo que inspira sua mente, agora vive dentro do seu CÓRTEX."
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="w-4" /> Adicionar Manualmente
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-secondary/30 border-none hover:bg-secondary/50 transition-all duration-300 relative"
            onClick={() => setAthenaDialog(true)}
          >
            <Brain className="w-5 h-5 text-secondary animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
          </Button>
        </div>
      </motion.div>

      {/* TOOLBAR FILTROS */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-card border rounded-lg px-2 items-center">
          <Search className="w-4 text-muted-foreground" />
          <Input
            className="w-[140px] bg-transparent border-none text-foreground focus:ring-0 focus:border-b focus:border-primary/80"
            placeholder="Buscar favorito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={contentType} 
          onChange={e => setContentType(e.target.value)} 
          className="rounded bg-card px-2 border text-foreground"
        >
          <option value="todos">Todos tipos</option>
          <option value="musica">Músicas</option>
          <option value="videos">Vídeos</option>
          <option value="podcasts">Podcasts</option>
          <option value="artigos">Artigos</option>
        </select>
        <div className="flex gap-1 ml-auto">
          <Button 
            size="sm" 
            variant={viewMode === "gallery" ? "secondary" : "ghost"}
            onClick={() => setViewMode("gallery")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === "timeline" ? "secondary" : "ghost"}
            onClick={() => setViewMode("timeline")}
          >
            <Calendar className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === "table" ? "secondary" : "ghost"}
            onClick={() => setViewMode("table")}
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === "gallery" && (
        <div className="space-y-10">
          {/* SPOTIFY / MÚSICA */}
          {(contentType === "todos" || contentType === "musica") && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-bold text-primary">Spotify / Músicas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPOTIFY_ITEMS.map(item => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card className="bg-card border-border/60 hover:border-primary/40 transition-colors overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <img 
                            src={item.coverUrl} 
                            alt={item.title} 
                            className="w-24 h-24 object-cover" 
                          />
                          <div className="p-4 flex-1">
                            <h4 className="font-bold text-lg">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.artist}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{item.duration}</span>
                              <Button size="icon" variant="ghost" className="rounded-full w-7 h-7">
                                <Play className="w-3 h-3" />
                              </Button>
                            </div>
                            {item.badge && (
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-3 bg-card/50 flex flex-wrap justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="bg-background/50 text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          <Link className="w-3 h-3 mr-1" /> Associar
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* YOUTUBE / VÍDEOS */}
          {(contentType === "todos" || contentType === "videos") && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-primary">YouTube / Vídeos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {YOUTUBE_ITEMS.map(item => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card className="bg-card border-border/60 hover:border-primary/40 transition-colors">
                      <CardContent className="p-0">
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          className="w-full h-32 object-cover" 
                        />
                        <div className="p-4">
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.channel}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-primary/70">{item.watchedTime}</span>
                            <Button variant="ghost" size="sm" className="text-xs h-7">
                              <Link className="w-3 h-3 mr-1" /> Associar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-3 bg-secondary/10 text-xs italic">
                        <Brain className="w-4 h-4 mr-2 text-cyan-400" />
                        {item.insights}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* PODCASTS / RSS */}
          {(contentType === "todos" || contentType === "podcasts") && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Podcast className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-primary">Podcasts / RSS</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PODCAST_ITEMS.map(item => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card className="bg-card border-border/60 hover:border-primary/40 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <img 
                            src={item.coverUrl} 
                            alt={item.podcast} 
                            className="w-16 h-16 object-cover rounded-md" 
                          />
                          <div>
                            <h4 className="font-bold">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.podcast}</p>
                            <div className="flex gap-1 mt-1">
                              {item.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="bg-background/50 text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-xs italic border-l-2 border-cyan-400 pl-2 text-muted-foreground">
                          "{item.highlight}"
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-2 flex justify-between bg-card/50 gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <Play className="w-3 h-3" /> 
                          <span>22:15</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          <Link className="w-3 h-3 mr-1" /> Associar
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ARTIGOS E LINKS */}
          {(contentType === "todos" || contentType === "artigos") && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Book className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-bold text-primary">Artigos e Links</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ARTICLE_ITEMS.map(item => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card className={cn(
                      "border-l-4 bg-card hover:bg-card/80 transition-colors",
                      item.category === "Produtividade" ? "border-l-green-500" : "border-l-blue-500"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.domain}</p>
                          </div>
                          <Badge variant="outline" className="bg-background/50 text-[10px]">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {item.summary}
                        </p>
                      </CardContent>
                      <CardFooter className="px-4 py-2 flex justify-between bg-card/50">
                        <div className="flex items-center gap-1 text-xs">
                          <Brain className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-400/80">Resumo por Athena</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            Ler depois
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            <Link className="w-3 h-3 mr-1" /> Associar
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      )}

      {viewMode !== "gallery" && (
        <div className="rounded-xl border border-primary/40 bg-card/80 p-10 flex flex-col items-center justify-center min-h-[260px] text-lg text-primary/70 font-bold shadow-inner">
          {viewMode === "timeline" && <span>Visualização de linha do tempo (mock)</span>}
          {viewMode === "table" && <span>Visualização em tabela (mock)</span>}
        </div>
      )}

      {/* Athena Dialog */}
      <Dialog open={athenaDialog} onOpenChange={setAthenaDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8 bg-cyan-400/20 ring-2 ring-cyan-400/40">
                <AvatarFallback className="text-cyan-400">IA</AvatarFallback>
              </Avatar>
              <span>Insight da Athena</span>
            </DialogTitle>
            <DialogDescription>
              Baseado nos seus favoritos recentes, identifiquei alguns padrões interessantes:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm">
              Seus podcasts e vídeos favoritados sugerem um foco em produtividade e gestão mental, que se alinha com seu projeto "Tese" e o hábito de meditação que você está construindo.
            </p>
            <p className="text-sm">
              Notei que você tende a consumir conteúdo com foco em produtividade nas manhãs de terça e quinta, e música lo-fi quando está trabalhando no seu projeto "Tese".
            </p>
            <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20 mt-3">
              <p className="text-sm font-medium text-secondary">Recomendação:</p>
              <p className="text-xs mt-1">
                Considere associar a trilha "Lo-Fi Focus" diretamente ao seu projeto "Tese" para criar um gatilho de foco automático quando iniciar suas sessões de trabalho.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Manually Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar favorito manualmente</DialogTitle>
            <DialogDescription>
              Adicione um conteúdo que não foi importado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <Music className="w-4 h-4 mr-2" /> Música
              </Button>
              <Button variant="outline" className="justify-start">
                <Youtube className="w-4 h-4 mr-2" /> Vídeo
              </Button>
              <Button variant="outline" className="justify-start">
                <Podcast className="w-4 h-4 mr-2" /> Podcast
              </Button>
              <Button variant="outline" className="justify-start">
                <Book className="w-4 h-4 mr-2" /> Artigo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Selecione o tipo de conteúdo para acessar o formulário apropriado.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
