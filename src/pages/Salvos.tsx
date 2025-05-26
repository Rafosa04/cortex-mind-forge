
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
import { useSavedItems } from "@/hooks/useSavedItems";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function to get icon by content type
const getContentTypeIcon = (type: string) => {
  switch (type) {
    case "article":
    case "artigo":
      return <FileText className="w-4 h-4 text-blue-400" />;
    case "video":
      return <Video className="w-4 h-4 text-red-400" />;
    case "post":
      return <MessageSquare className="w-4 h-4 text-violet-400" />;
    case "habit":
    case "hábito":
      return <Calendar className="w-4 h-4 text-green-400" />;
    case "link":
      return <LinkIcon className="w-4 h-4 text-cyan-400" />;
    case "music":
    case "musica":
    case "música":
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
  const {
    savedItems,
    athenaHighlights,
    reactivationSuggestions,
    isLoading,
    createSavedItem,
    updateSavedItem,
    deleteSavedItem,
    updateLastAccessed,
    dismissHighlight,
    dismissSuggestion,
    isCreating,
    isDeleting
  } = useSavedItems();

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(null);
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("todos");
  const [addItemModal, setAddItemModal] = useState(false);
  const [athenaModal, setAthenaModal] = useState(false);

  // Form state for adding new item
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    type: "",
    source: "",
    source_type: "Manual",
    url: "",
    tags: "" as string,
    thumbnail: ""
  });

  // Filtered items based on search and filter selections
  const filteredItems = savedItems.filter(item => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply type filter
    const matchesType = selectedTypeFilter === null || 
      item.type === selectedTypeFilter;
    
    // Apply source filter
    const matchesSource = selectedSourceFilter === null || 
      item.source_type === selectedSourceFilter;
    
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

  const handleCreateItem = () => {
    if (!newItem.title || !newItem.type) return;

    // Convert tags string to array
    const tagsArray = newItem.tags
      ? newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : [];

    createSavedItem({
      ...newItem,
      tags: tagsArray,
      thumbnail: newItem.thumbnail || "https://placehold.co/300x200/191933/E6E6F0/png"
    });

    setNewItem({
      title: "",
      description: "",
      type: "",
      source: "",
      source_type: "Manual",
      url: "",
      tags: "",
      thumbnail: ""
    });
    setAddItemModal(false);
  };

  const handleOpenUrl = (item: any) => {
    if (item.url) {
      updateLastAccessed(item.id);
      window.open(item.url, '_blank');
    }
  };

  const handleArchiveItem = (id: string) => {
    updateSavedItem({ id, updates: { status: 'Arquivado' } });
  };

  const handleReactivateItem = (id: string) => {
    updateSavedItem({ id, updates: { status: 'Reativado' } });
  };

  const handleIgnoreItem = (id: string) => {
    updateSavedItem({ id, updates: { status: 'Ignorado' } });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando seus salvos...</p>
          </div>
        </div>
      </div>
    );
  }

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
              disabled={isCreating}
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
              {athenaHighlights.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              )}
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
          
          {/* Filter popovers remain the same */}
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
                  variant={selectedTypeFilter === "music" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedTypeFilter(selectedTypeFilter === "music" ? null : "music")}
                >
                  <Star className="h-3 w-3 mr-2" /> Música
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Additional filter popovers remain the same */}
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
                <Button 
                  variant={selectedSourceFilter === "Manual" ? "default" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setSelectedSourceFilter(selectedSourceFilter === "Manual" ? null : "Manual")}
                >
                  Manual
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
      {athenaHighlights.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-400" /> 
            <span>Destaques da Athena</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {athenaHighlights.map(highlight => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-card/80 to-card/20 border border-violet-500/20 rounded-lg p-4 flex flex-col"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-gradient-to-br from-violet-900/50 to-blue-900/30 p-2 border border-violet-500/20">
                    <Brain className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-violet-300">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{highlight.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" className="text-primary/80 hover:text-primary">
                    {highlight.action}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => dismissHighlight(highlight.id)}
                    className="text-muted-foreground hover:text-muted-foreground"
                  >
                    Dispensar
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      
      {/* Reactivation Feed */}
      {reactivationSuggestions.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" /> 
            <span>Reativação Inteligente</span>
          </h2>
          
          <Carousel>
            <CarouselContent>
              {reactivationSuggestions.map((item) => (
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
                          src={item.thumbnail || "https://placehold.co/300x200/191933/E6E6F0/png"} 
                          alt={item.title} 
                          className="w-full h-32 object-cover" 
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md rounded-md px-2 py-0.5 flex items-center">
                          {getContentTypeIcon(item.content_type || '')}
                          <span className="text-xs ml-1 text-white">
                            {item.content_type?.charAt(0).toUpperCase() + (item.content_type?.slice(1) || '')}
                          </span>
                        </div>
                      </div>
                      <CardContent className="py-3 flex-grow">
                        <h3 className="font-medium line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        <div className="mt-3 text-xs border-l-2 border-cyan-500 pl-2 py-1 bg-cyan-950/20">
                          <Brain className="inline-block w-3 h-3 text-cyan-400 mb-0.5 mr-1" />
                          <span className="text-cyan-300">{item.action_question}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-3 justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => dismissSuggestion(item.id)}
                        >
                          Ignorar
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => handleReactivateItem(item.related_item_id || '')}
                        >
                          Reativar
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
      )}

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
                      src={item.thumbnail || "https://placehold.co/300x200/191933/E6E6F0/png"} 
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
                      src={item.thumbnail || "https://placehold.co/300x200/191933/E6E6F0/png"} 
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
                      {item.tags && item.tags.map((tag, idx) => (
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
                        {formatDate(item.saved_at)}
                      </div>
                      
                      {item.athena_insight && (
                        <div className="flex items-center gap-1 text-xs">
                          <Brain className="h-3 w-3 text-cyan-400" />
                          <span className="text-cyan-300/80 text-xs">{item.athena_insight}</span>
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
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleOpenUrl(item)}
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Abrir</TooltipContent>
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
                        <DropdownMenuItem onClick={() => handleReactivateItem(item.id)}>
                          <FileText className="h-4 w-4 mr-2" /> Reativar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleIgnoreItem(item.id)}>
                          <Clock className="h-4 w-4 mr-2" /> Ignorar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchiveItem(item.id)}>
                          <Archive className="h-4 w-4 mr-2" /> Arquivar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteSavedItem(item.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Archive className="h-4 w-4 mr-2" /> Excluir
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
              <Label className="text-sm font-medium mb-2">Tipo de conteúdo</Label>
              <Select value={newItem.type} onValueChange={(value) => setNewItem({...newItem, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Artigo</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="habit">Hábito</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="music">Música</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Título *
              </Label>
              <Input 
                id="title" 
                placeholder="Nome do conteúdo" 
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea 
                id="description" 
                placeholder="Descreva brevemente o conteúdo" 
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">
                Fonte
              </Label>
              <Input 
                id="source" 
                placeholder="Nome da fonte (ex: YouTube, Medium)" 
                value={newItem.source}
                onChange={(e) => setNewItem({...newItem, source: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                URL
              </Label>
              <Input 
                id="url" 
                placeholder="URL do conteúdo" 
                value={newItem.url}
                onChange={(e) => setNewItem({...newItem, url: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input 
                id="tags" 
                placeholder="Separadas por vírgula (ex: produtividade, organização)" 
                value={newItem.tags}
                onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAddItemModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateItem} disabled={!newItem.title || !newItem.type || isCreating}>
                {isCreating ? "Adicionando..." : "Adicionar Item"}
              </Button>
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
                Você tem {savedItems.length} itens salvos. {savedItems.filter(item => item.status === 'Novo').length} são novos e aguardam sua atenção.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-900/40">
              <h3 className="text-sm font-medium text-violet-300 mb-2">
                Recomendações
              </h3>
              <p className="text-sm">
                Considere revisar itens mais antigos para mantê-los organizados e relevantes ao seu aprendizado atual.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
