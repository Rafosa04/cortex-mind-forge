
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Filter, ChevronDown, Star, 
  BookOpen, Video, FileText, MessageSquare, Calendar,
  Link as LinkIcon, Brain, Sparkles, MoreHorizontal, 
  Clock, Bookmark, Archive, ThumbsUp, Tag, List, Grid3X3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock data for saved items
const SAVED_ITEMS = [
  {
    id: 1,
    type: "article",
    title: "Como criar seu segundo cérebro digital",
    description: "Um guia completo para organizar todo seu conhecimento",
    source: "Medium",
    sourceType: "Navegador",
    thumbnail: "https://placehold.co/300x200/191933/E6E6F0/png",
    savedAt: "2023-05-15T14:30:00",
    lastAccessed: null,
    status: "Novo",
    tags: ["produtividade", "organização", "digital"],
    athenaInsight: "Relacionado ao seu interesse em produtividade"
  },
  {
    id: 2,
    type: "video",
    title: "Método PARA explicado em detalhes",
    description: "Como organizar sua segunda mente digital usando o método PARA",
    source: "YouTube",
    sourceType: "YouTube",
    thumbnail: "https://placehold.co/300x200/0C0C1C/60B5B5/png",
    savedAt: "2023-05-10T09:15:00",
    lastAccessed: "2023-05-11T16:20:00",
    status: "Conectado",
    tags: ["método PARA", "organização", "produtividade"],
    athenaInsight: "Relevante para seu projeto 'Sistema de Organização Pessoal'"
  },
  {
    id: 3,
    type: "post",
    title: "Reflexões sobre produtividade digital",
    description: "Como transformei minha organização digital em apenas 30 dias",
    source: "Connecta",
    sourceType: "Connecta",
    thumbnail: "https://placehold.co/300x200/993887/FFFFFF/png",
    savedAt: "2023-05-08T11:45:00",
    lastAccessed: "2023-05-09T10:30:00",
    status: "Reativado",
    tags: ["reflexão", "produtividade", "transformação"],
    athenaInsight: "Conecta com seu hábito de revisão semanal"
  },
  {
    id: 4,
    type: "link",
    title: "Ferramentas essenciais para segundo cérebro",
    description: "As 10 ferramentas que vão turbinar seu PKM",
    source: "notion.site",
    sourceType: "Navegador",
    thumbnail: "https://placehold.co/300x200/191933/E6E6F0/png",
    savedAt: "2023-05-05T16:20:00",
    lastAccessed: null,
    status: "Ignorado",
    tags: ["ferramentas", "PKM", "recursos"],
    athenaInsight: "Você já viu conteúdos similares recentemente"
  },
  {
    id: 5,
    type: "habit",
    title: "Revisão diária de conhecimento",
    description: "Como revisar seu segundo cérebro em apenas 10 minutos por dia",
    source: "Córtex",
    sourceType: "Navegador",
    thumbnail: "https://placehold.co/300x200/0C0C1C/60B5B5/png",
    savedAt: "2023-05-03T08:30:00",
    lastAccessed: "2023-05-04T07:45:00",
    status: "Conectado",
    tags: ["hábito", "revisão", "rotina"],
    athenaInsight: "Pode transformar em um hábito recorrente"
  },
  {
    id: 6,
    type: "link",
    title: "Organizando conhecimento com PARA método",
    description: "O sistema de organização que todos estão usando",
    source: "fortelabs.co",
    sourceType: "Navegador",
    thumbnail: "https://placehold.co/300x200/993887/FFFFFF/png",
    savedAt: "2023-05-01T19:10:00",
    lastAccessed: "2023-05-02T20:15:00",
    status: "Novo",
    tags: ["PARA", "organização", "sistema"],
    athenaInsight: null
  },
];

// Mock data for AI highlight suggestions
const AI_HIGHLIGHTS = [
  {
    id: 1,
    type: "grouping",
    title: "Agrupamento sugerido",
    description: "Você salvou 3 conteúdos sobre método PARA. Deseja agrupá-los no projeto 'Sistema de Organização Pessoal'?",
    action: "Agrupar agora",
    icon: <BookOpen className="text-cyan-400" />
  },
  {
    id: 2,
    type: "old_content",
    title: "Conteúdos não visitados",
    description: "Há 2 artigos salvos há mais de 7 dias que você ainda não revisitou.",
    action: "Revisar",
    icon: <Clock className="text-violet-400" />
  },
  {
    id: 3,
    type: "compatibility",
    title: "Compatibilidade alta",
    description: "O vídeo 'Método PARA explicado' é altamente compatível com seu novo projeto.",
    action: "Conectar ao projeto",
    icon: <Brain className="text-emerald-400" />
  }
];

// Mock data for reactivation feed
const REACTIVATION_ITEMS = [
  {
    id: 1,
    type: "unused",
    title: "Método PARA explicado em detalhes",
    description: "Você salvou este vídeo há 22 dias",
    actionQuestion: "Você ainda pretende assistir isso?",
    thumbnail: "https://placehold.co/300x200/0C0C1C/60B5B5/png",
    contentType: "video"
  },
  {
    id: 2,
    type: "new_project",
    title: "Ferramentas essenciais para segundo cérebro",
    description: "Você criou um novo projeto relacionado",
    actionQuestion: "Este artigo pode ajudar no seu novo projeto 'Sistema Digital'",
    thumbnail: "https://placehold.co/300x200/191933/E6E6F0/png",
    contentType: "article"
  },
  {
    id: 3,
    type: "habit_completed",
    title: "Lo-Fi Focus Beats",
    description: "Você completou seu hábito de meditação",
    actionQuestion: "Esta música se conecta ao seu estado atual",
    thumbnail: "https://placehold.co/300x200/993887/FFFFFF/png",
    contentType: "music"
  }
];

// Helper function to get icon by content type
const getContentTypeIcon = (type: string) => {
  switch (type) {
    case "article":
      return <FileText className="w-4 h-4 text-blue-400" />;
    case "video":
      return <Video className="w-4 h-4 text-red-400" />;
    case "post":
      return <MessageSquare className="w-4 h-4 text-violet-400" />;
    case "habit":
      return <Calendar className="w-4 h-4 text-green-400" />;
    case "link":
      return <LinkIcon className="w-4 h-4 text-cyan-400" />;
    case "music":
      return <Bookmark className="w-4 h-4 text-amber-400" />;
    default:
      return <Star className="w-4 h-4 text-yellow-400" />;
  }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function Salvos() {
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(null);
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("todos");
  const [addItemModal, setAddItemModal] = useState(false);
  const [athenaModal, setAthenaModal] = useState(false);

  // Filtered items based on search and filter selections
  const filteredItems = SAVED_ITEMS.filter(item => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = selectedTypeFilter === null || 
      item.type === selectedTypeFilter;
    
    // Apply source filter
    const matchesSource = selectedSourceFilter === null || 
      item.sourceType === selectedSourceFilter;
    
    // Apply status filter
    const matchesStatus = selectedStatusFilter === null || 
      item.status === selectedStatusFilter;
    
    // Apply tab filter
    const matchesTab = activeTab === "todos" || 
      (activeTab === "arquivados" && item.status === "Arquivado");
    
    return matchesSearch && matchesType && matchesSource && 
      matchesStatus && matchesTab;
  });

  // Animation variants for items
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 mb-2">
              Salvos Ativos
            </h1>
            <p className="text-muted-foreground text-sm italic">
              "Nada se perde. Tudo o que te inspira vive aqui, à espera do seu momento."
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setAddItemModal(true)}
              variant="default" 
              className="gap-1 bg-gradient-to-r from-blue-600 to-violet-600"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar manualmente</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative border-violet-800/40 bg-transparent hover:bg-violet-800/20"
              onClick={() => setAthenaModal(true)}
            >
              <Brain className="h-5 w-5 text-violet-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            </Button>
          </div>
        </div>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 py-2">
          <div className="relative flex-grow max-w-xs bg-card/80 rounded-md border border-border/50">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nos salvos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-0 pl-8 bg-transparent"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-3 w-3" />
                <span>Tipo</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="grid grid-cols-2 gap-1">
                <Button 
                  variant={selectedTypeFilter === "article" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedTypeFilter(selectedTypeFilter === "article" ? null : "article")}
                >
                  <FileText className="h-3 w-3 mr-2" /> Artigo
                </Button>
                <Button 
                  variant={selectedTypeFilter === "video" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedTypeFilter(selectedTypeFilter === "video" ? null : "video")}
                >
                  <Video className="h-3 w-3 mr-2" /> Vídeo
                </Button>
                <Button 
                  variant={selectedTypeFilter === "post" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedTypeFilter(selectedTypeFilter === "post" ? null : "post")}
                >
                  <MessageSquare className="h-3 w-3 mr-2" /> Post
                </Button>
                <Button 
                  variant={selectedTypeFilter === "habit" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedTypeFilter(selectedTypeFilter === "habit" ? null : "habit")}
                >
                  <Calendar className="h-3 w-3 mr-2" /> Hábito
                </Button>
                <Button 
                  variant={selectedTypeFilter === "link" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedTypeFilter(selectedTypeFilter === "link" ? null : "link")}
                >
                  <LinkIcon className="h-3 w-3 mr-2" /> Link
                </Button>
                <Button 
                  variant={selectedTypeFilter === "other" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedTypeFilter(selectedTypeFilter === "other" ? null : "other")}
                >
                  <Star className="h-3 w-3 mr-2" /> Outro
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-3 w-3" />
                <span>Origem</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="grid gap-1">
                <Button 
                  variant={selectedSourceFilter === "Connecta" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedSourceFilter(selectedSourceFilter === "Connecta" ? null : "Connecta")}
                >
                  Connecta
                </Button>
                <Button 
                  variant={selectedSourceFilter === "YouTube" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedSourceFilter(selectedSourceFilter === "YouTube" ? null : "YouTube")}
                >
                  YouTube
                </Button>
                <Button 
                  variant={selectedSourceFilter === "Spotify" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedSourceFilter(selectedSourceFilter === "Spotify" ? null : "Spotify")}
                >
                  Spotify
                </Button>
                <Button 
                  variant={selectedSourceFilter === "Navegador" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedSourceFilter(selectedSourceFilter === "Navegador" ? null : "Navegador")}
                >
                  Navegador
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-3 w-3" />
                <span>Status</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="grid gap-1">
                <Button 
                  variant={selectedStatusFilter === "Novo" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedStatusFilter(selectedStatusFilter === "Novo" ? null : "Novo")}
                >
                  Novo
                </Button>
                <Button 
                  variant={selectedStatusFilter === "Conectado" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedStatusFilter(selectedStatusFilter === "Conectado" ? null : "Conectado")}
                >
                  Conectado
                </Button>
                <Button 
                  variant={selectedStatusFilter === "Reativado" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedStatusFilter(selectedStatusFilter === "Reativado" ? null : "Reativado")}
                >
                  Reativado
                </Button>
                <Button 
                  variant={selectedStatusFilter === "Ignorado" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedStatusFilter(selectedStatusFilter === "Ignorado" ? null : "Ignorado")}
                >
                  Ignorado
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-1">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="todos" className="mt-2" onValueChange={setActiveTab}>
          <TabsList className="bg-background/30">
            <TabsTrigger value="todos">Todos os Salvos</TabsTrigger>
            <TabsTrigger value="arquivados">Arquivados</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
      
      {/* AI Highlights Section */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" /> 
          <span>Destaques da Athena</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_HIGHLIGHTS.map(highlight => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-card/80 to-card/20 border border-violet-500/20 rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-gradient-to-br from-violet-900/50 to-blue-900/30 p-2 border border-violet-500/20">
                  {highlight.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-violet-300">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{highlight.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="self-start mt-3 text-primary/80 hover:text-primary">
                {highlight.action}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Reactivation Feed */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" /> 
          <span>Reativação Inteligente</span>
        </h2>
        
        <Carousel>
          <CarouselContent>
            {REACTIVATION_ITEMS.map((item) => (
              <CarouselItem key={item.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <Card className="bg-card/30 border-violet-500/20 overflow-hidden h-full flex flex-col">
                    <div className="relative">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-32 object-cover" 
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md rounded-md px-2 py-0.5 flex items-center">
                        {getContentTypeIcon(item.contentType)}
                        <span className="text-xs ml-1 text-white">
                          {item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)}
                        </span>
                      </div>
                    </div>
                    <CardContent className="py-3 flex-grow">
                      <h3 className="font-medium line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      <div className="mt-3 text-xs border-l-2 border-cyan-500 pl-2 py-1 bg-cyan-950/20">
                        <Brain className="inline-block w-3 h-3 text-cyan-400 mb-0.5 mr-1" />
                        <span className="text-cyan-300">{item.actionQuestion}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-3 justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        Ignorar
                      </Button>
                      <Button variant="default" size="sm" className="h-7 px-2 text-xs">
                        Ação sugerida
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-end gap-1 mt-2">
            <CarouselPrevious className="relative h-8 w-8 left-0 -translate-y-0" />
            <CarouselNext className="relative h-8 w-8 right-0 -translate-y-0" />
          </div>
        </Carousel>
      </section>

      {/* Main Content Grid */}
      <section>
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" /> 
          <span>Seus Conteúdos Salvos</span>
          <span className="text-sm text-muted-foreground ml-2">({filteredItems.length} itens)</span>
        </h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}
        >
          {filteredItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card 
                className={`group border-violet-500/20 hover:border-violet-400/40 transition-all duration-300 ${
                  viewMode === "list" ? "flex flex-row overflow-hidden" : ""
                }`}
              >
                {viewMode === "grid" && (
                  <div className="relative">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-40 object-cover" 
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1">
                      {getContentTypeIcon(item.type)}
                      <span className="text-xs">{item.source}</span>
                    </div>
                    {item.status === "Novo" && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="bg-blue-500 text-white text-xs">Novo</Badge>
                      </div>
                    )}
                    {item.status === "Conectado" && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="bg-green-600 text-white text-xs">Conectado</Badge>
                      </div>
                    )}
                    {item.status === "Reativado" && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="bg-amber-500 text-white text-xs">Reativado</Badge>
                      </div>
                    )}
                  </div>
                )}
                
                {viewMode === "list" && (
                  <div className="relative w-32 h-full shrink-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1">
                      {getContentTypeIcon(item.type)}
                    </div>
                  </div>
                )}
                
                <div className={`flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                  <CardContent className={`${viewMode === "list" ? "py-3" : ""}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium line-clamp-2">{item.title}</h3>
                      
                      {viewMode === "list" && (
                        <div className="shrink-0 ml-2">
                          {item.status === "Novo" && (
                            <Badge variant="default" className="bg-blue-500 text-white text-xs">Novo</Badge>
                          )}
                          {item.status === "Conectado" && (
                            <Badge variant="default" className="bg-green-600 text-white text-xs">Conectado</Badge>
                          )}
                          {item.status === "Reativado" && (
                            <Badge variant="default" className="bg-amber-500 text-white text-xs">Reativado</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="bg-card/30 text-[10px] border-violet-500/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(item.savedAt)}
                      </div>
                      
                      {item.athenaInsight && (
                        <div className="flex items-center gap-1 text-xs">
                          <Brain className="h-3 w-3 text-cyan-400" />
                          <span className="text-cyan-300/80 text-xs">{item.athenaInsight}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter 
                    className={`border-t border-border/30 bg-card/50 pt-3 pb-3 flex justify-between ${
                      viewMode === "list" ? "mt-auto" : ""
                    }`}
                  >
                    <TooltipProvider>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Associar</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Reagir</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Tag className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Etiquetar</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" /> Transformar em célula
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" /> Deixar para depois
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" /> Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-card/20 rounded-lg border border-dashed border-border">
            <Bookmark className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground">Nenhum item encontrado</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Tente ajustar seus filtros ou adicione novos itens
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setAddItemModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar item
            </Button>
          </div>
        )}
      </section>
      
      {/* Add Manually Modal */}
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar item manualmente</DialogTitle>
            <DialogDescription>
              Salve um novo conteúdo diretamente no seu segundo cérebro
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Tipo de conteúdo</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Artigo
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Video className="h-4 w-4 mr-2" /> Vídeo
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" /> Post
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" /> Hábito
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <LinkIcon className="h-4 w-4 mr-2" /> Link
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Star className="h-4 w-4 mr-2" /> Outro
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input id="title" placeholder="Nome do conteúdo" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Input id="description" placeholder="Descreva brevemente o conteúdo" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">
                Origem
              </label>
              <Input id="source" placeholder="URL ou origem do conteúdo" />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAddItemModal(false)}>
                Cancelar
              </Button>
              <Button>Adicionar Item</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Athena Insight Modal */}
      <Dialog open={athenaModal} onOpenChange={setAthenaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              <span>Insight da Athena</span>
            </DialogTitle>
            <DialogDescription>
              Análise dos seus padrões de conteúdo salvos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-900/40">
              <h3 className="text-sm font-medium text-cyan-300 mb-2">
                Padrões Detectados
              </h3>
              <p className="text-sm">
                Você salvou 4 itens relacionados a "organização digital" e "segundo cérebro" nos últimos 14 dias. 
                Isso indica um forte interesse nesta área.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-900/40">
              <h3 className="text-sm font-medium text-violet-300 mb-2">
                Conexões Potenciais
              </h3>
              <p className="text-sm">
                Os artigos salvos sobre o método PARA se alinham com seu projeto 
                "Sistema de Organização Pessoal" e com seu novo hábito 
                "Revisão diária de conhecimento".
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-950/40 to-blue-950/20 p-3 rounded-lg border border-violet-700/20">
              <h3 className="text-sm font-medium text-violet-300 mb-2 flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Recomendação personalizada</span>
              </h3>
              <p className="text-sm">
                Sugiro criar um subcérebro dedicado a "Métodos de Organização" para 
                agrupar estes conteúdos salvos e facilitar seu processo de implementação.
              </p>
              <Button variant="default" size="sm" className="mt-2 bg-gradient-to-r from-blue-600 to-violet-600">
                Criar Subcérebro Sugerido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
