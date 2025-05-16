
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  Archive, 
  Clock, 
  Star, 
  Link as LinkIcon,
  BookOpen,
  Video, 
  FileText, 
  MessageSquare, 
  Puzzle, 
  Calendar, 
  Grid3x3, 
  List, 
  Heart,
  Brain, 
  LightbulbIcon, 
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AthenaObserver } from "@/components/Mensagens/AthenaObserver";

// Mock data for saved items
const SAVED_ITEMS = [
  {
    id: 1,
    type: "article",
    title: "Como criar um segundo cérebro eficiente",
    description: "Um guia completo para organizar conhecimento digital",
    source: "produtividade.com.br",
    sourceName: "Produtividade",
    dateAdded: "2 dias atrás",
    tags: ["produtividade", "organização"],
    aiSuggestion: "Relevante para seu projeto 'Tese'",
    thumbnail: "https://placehold.co/400x200/224/70e?text=Artigo"
  },
  {
    id: 2,
    type: "video",
    title: "Técnicas avançadas de gestão mental",
    description: "Como organizar pensamentos de forma eficiente",
    source: "youtube",
    sourceName: "Brain Academy",
    dateAdded: "1 semana atrás",
    tags: ["mental", "foco"],
    aiSuggestion: "Conecta com seu novo hábito 'Meditação'",
    thumbnail: "https://placehold.co/400x200/422/b8f?text=Video"
  },
  {
    id: 3,
    type: "audio",
    title: "Música para concentração profunda",
    description: "Lo-Fi beats para estudos e trabalho",
    source: "spotify",
    sourceName: "Focus Flow",
    dateAdded: "3 dias atrás",
    tags: ["música", "concentração"],
    aiSuggestion: "Você usa esta música durante sessões de estudo",
    thumbnail: "https://placehold.co/400x200/242/5d9?text=Audio"
  },
  {
    id: 4,
    type: "post",
    title: "Dicas para manter foco em tarefas longas",
    description: "Como vencer a procrastinação e manter a produtividade",
    source: "connecta",
    sourceName: "Maria Silva",
    dateAdded: "Ontem",
    tags: ["foco", "produtividade"],
    aiSuggestion: "Relaciona-se aos seus desafios atuais",
    thumbnail: "https://placehold.co/400x200/214/67c?text=Post"
  },
  {
    id: 5,
    type: "webpage",
    title: "Ferramentas para organização pessoal",
    description: "Top 10 apps para gerenciar o dia a dia",
    source: "tecnologia.net",
    sourceName: "Tech Review",
    dateAdded: "5 dias atrás",
    tags: ["ferramentas", "apps"],
    aiSuggestion: "Complementa seu projeto 'Produtividade'",
    thumbnail: "https://placehold.co/400x200/227/88e?text=Webpage"
  },
  {
    id: 6,
    type: "book",
    title: "Atomic Habits",
    description: "Como construir bons hábitos e quebrar maus",
    source: "amazon",
    sourceName: "James Clear",
    dateAdded: "2 semanas atrás",
    tags: ["hábitos", "desenvolvimento"],
    aiSuggestion: "Base para seus novos hábitos",
    thumbnail: "https://placehold.co/400x200/204/55b?text=Book"
  }
];

// AI reactivation suggestions
const AI_REACTIVATION = [
  {
    id: 101,
    title: "Artigos sobre produtividade",
    description: "Você salvou 3 artigos sobre este tema",
    action: "Agrupar no projeto 'Produtividade Pessoal'?",
    items: 3,
    icon: "project"
  },
  {
    id: 102,
    title: "Curso de Meditação",
    description: "Salvo há 14 dias sem visualização",
    action: "Ainda pretende assistir este conteúdo?",
    items: 1,
    icon: "reminder"
  },
  {
    id: 103,
    title: "Playlist de Foco",
    description: "Compatível com seu novo hábito de estudos",
    action: "Associar à sua rotina de estudos?",
    items: 5,
    icon: "connect"
  }
];

export default function Salvos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [athenaDialog, setAthenaDialog] = useState(false);
  const [detailSheet, setDetailSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter items based on search term and filters
  const filteredItems = SAVED_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesSource = sourceFilter === "all" || item.source === sourceFilter;
    
    return matchesSearch && matchesType && matchesSource;
  });

  const openDetail = (item) => {
    setSelectedItem(item);
    setDetailSheet(true);
  };

  // Icon mapper for different content types
  const getItemIcon = (type, className = "w-5 h-5") => {
    switch(type) {
      case "video": return <Video className={className} />;
      case "article": return <FileText className={className} />;
      case "post": return <MessageSquare className={className} />;
      case "habit": return <Puzzle className={className} />;
      case "audio": return <Sparkles className={className} />;
      case "book": return <BookOpen className={className} />;
      default: return <LinkIcon className={className} />;
    }
  };

  // Background color mapper for different content types
  const getItemColor = (type) => {
    switch(type) {
      case "video": return "from-purple-500/20 to-indigo-500/10";
      case "article": return "from-blue-500/20 to-cyan-500/10";
      case "post": return "from-green-500/20 to-emerald-500/10";
      case "habit": return "from-orange-500/20 to-amber-500/10";
      case "audio": return "from-pink-500/20 to-rose-500/10";
      case "book": return "from-cyan-500/20 to-blue-500/10";
      default: return "from-gray-500/20 to-slate-500/10";
    }
  };

  // Icon for AI reactivation items
  const getReactivationIcon = (type) => {
    switch(type) {
      case "project": return <Puzzle className="w-5 h-5 text-cyan-400" />;
      case "reminder": return <Clock className="w-5 h-5 text-amber-400" />;
      case "connect": return <Brain className="w-5 h-5 text-purple-400" />;
      default: return <Star className="w-5 h-5 text-indigo-400" />;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
            Salvos Ativos
          </h2>
          <div className="text-sm text-foreground/60">
            "Nada se perde. Tudo o que te inspira vive aqui, à espera do seu momento."
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
            className="w-[180px] sm:w-[220px] bg-transparent border-none text-foreground focus:ring-0 focus:border-b focus:border-primary/80"
            placeholder="Buscar conteúdo salvo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={typeFilter} 
          onChange={e => setTypeFilter(e.target.value)} 
          className="rounded bg-card px-2 border text-foreground"
        >
          <option value="all">Todos tipos</option>
          <option value="article">Artigos</option>
          <option value="video">Vídeos</option>
          <option value="audio">Áudios</option>
          <option value="post">Posts</option>
          <option value="book">Livros</option>
        </select>
        <select
          value={sourceFilter} 
          onChange={e => setSourceFilter(e.target.value)} 
          className="rounded bg-card px-2 border text-foreground"
        >
          <option value="all">Todas origens</option>
          <option value="connecta">Connecta</option>
          <option value="youtube">YouTube</option>
          <option value="spotify">Spotify</option>
          <option value="amazon">Livros</option>
        </select>
        <div className="flex gap-1 ml-auto">
          <Button 
            size="sm" 
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === "calendar" ? "secondary" : "ghost"}
            onClick={() => setViewMode("calendar")}
          >
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AI REACTIVATION SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-primary">Sugestões da Athena</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_REACTIVATION.map(item => (
            <Card 
              key={item.id} 
              className="bg-card/80 border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getReactivationIcon(item.icon)}
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs italic border-l-2 border-cyan-400 pl-2 text-secondary">
                  {item.action}
                </p>
              </CardContent>
              <CardFooter className="px-4 py-2 justify-between bg-card/50 flex-wrap gap-2">
                <Badge variant="outline" className="bg-background/50 text-[10px]">
                  {item.items} {item.items > 1 ? 'itens' : 'item'}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Ignorar</Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs">Aplicar</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* MAIN CONTENT */}
      {viewMode === "grid" && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredItems.map(item => (
            <motion.div key={item.id} variants={itemVariants} onClick={() => openDetail(item)}>
              <Card className={`bg-gradient-to-br ${getItemColor(item.type)} hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden`}>
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm p-1 rounded-md flex items-center gap-1">
                    {getItemIcon(item.type, "w-3 h-3")}
                    <span className="text-[10px] capitalize">{item.type}</span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-background/50 text-[10px]">
                      {item.source}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{item.dateAdded}</span>
                  </div>
                  
                  <h3 className="font-bold text-md mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  
                  {item.aiSuggestion && (
                    <div className="flex gap-1 items-center mt-2 text-[11px] text-cyan-400">
                      <Brain className="w-3 h-3 text-cyan-400" />
                      {item.aiSuggestion}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="px-4 py-3 bg-card/40 flex items-center justify-between">
                  <div className="flex gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-background/50 text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs">
                    Conectar
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {viewMode !== "grid" && (
        <div className="rounded-xl border border-primary/40 bg-card/80 p-10 flex flex-col items-center justify-center min-h-[260px] text-lg text-primary/70 font-bold shadow-inner">
          {viewMode === "list" && <span>Visualização em lista (mock)</span>}
          {viewMode === "calendar" && <span>Visualização em calendário (mock)</span>}
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
              Baseado na sua atividade recente e nos itens salvos, identifiquei alguns padrões:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm">
              Seus artigos e vídeos salvos mostram um foco em produtividade e organização mental, que se alinha com seu projeto atual "Tese".
            </p>
            <p className="text-sm">
              Você tem tendência a salvar conteúdo sobre foco e concentração nas segundas-feiras, possivelmente se preparando para a semana.
            </p>
            <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20 mt-3">
              <p className="text-sm font-medium text-secondary">Recomendação:</p>
              <p className="text-xs mt-1">
                Agrupar seus recursos de produtividade em um subcérebro dedicado para consulta rápida quando estiver trabalhando na sua tese.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Manually Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar salvo manualmente</DialogTitle>
            <DialogDescription>
              Adicione um conteúdo diretamente à sua biblioteca de salvos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" /> Artigo
              </Button>
              <Button variant="outline" className="justify-start">
                <Video className="w-4 h-4 mr-2" /> Vídeo
              </Button>
              <Button variant="outline" className="justify-start">
                <Sparkles className="w-4 h-4 mr-2" /> Áudio
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="w-4 h-4 mr-2" /> Post
              </Button>
              <Button variant="outline" className="justify-start">
                <LinkIcon className="w-4 h-4 mr-2" /> Link
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="w-4 h-4 mr-2" /> Livro
              </Button>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">URL do conteúdo</h4>
              <Input placeholder="Cole o link aqui..." className="mb-2" />
              <p className="text-xs text-muted-foreground">
                Cole o link do conteúdo e Athena tentará extrair automaticamente as informações.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet open={detailSheet} onOpenChange={setDetailSheet}>
        <SheetContent className="bg-gradient-to-br from-background to-card border-l-border w-full sm:max-w-md">
          {selectedItem && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle className="text-xl">{selectedItem.title}</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <img 
                    src={selectedItem.thumbnail} 
                    alt={selectedItem.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-full">
                    {getItemIcon(selectedItem.type)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Badge variant="secondary">{selectedItem.sourceName}</Badge>
                    <span className="text-xs text-muted-foreground">{selectedItem.dateAdded}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">{selectedItem.description}</p>
                  
                  <div className="flex flex-wrap gap-1 pt-2">
                    {selectedItem.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <p className="text-sm font-medium text-secondary">Athena diz:</p>
                  </div>
                  <p className="text-xs">
                    {selectedItem.aiSuggestion}. Deseja criar uma conexão com este projeto agora?
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Ações</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="default" className="w-full justify-center gap-1">
                      <LinkIcon className="w-4 h-4" /> Associar
                    </Button>
                    <Button variant="outline" className="w-full justify-center gap-1">
                      <Archive className="w-4 h-4" /> Arquivar
                    </Button>
                    <Button variant="outline" className="w-full justify-center gap-1">
                      <Clock className="w-4 h-4" /> Para depois
                    </Button>
                    <Button variant="outline" className="w-full justify-center gap-1">
                      <Heart className="w-4 h-4" /> Favoritar
                    </Button>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium mb-2">Transformar em:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                      <Puzzle className="w-5 h-5 mb-1" />
                      <span className="text-xs">Projeto</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                      <Calendar className="w-5 h-5 mb-1" />
                      <span className="text-xs">Hábito</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                      <FileText className="w-5 h-5 mb-1" />
                      <span className="text-xs">Nota</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Observer */}
      <div className="fixed bottom-6 right-6">
        <AthenaObserver />
      </div>
    </div>
  );
}
