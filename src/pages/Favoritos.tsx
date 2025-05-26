import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, Music, Youtube, Podcast, Book, Grid, Calendar, Table, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFavorites } from "@/hooks/useFavorites";
import { AddFavoriteModal } from "@/components/Favoritos/AddFavoriteModal";
import { FavoriteCard } from "@/components/Favoritos/FavoriteCard";
import { FavoritesTableView } from "@/components/Favoritos/FavoritesTableView";
import { FavoritesTimelineView } from "@/components/Favoritos/FavoritesTimelineView";
import { Skeleton } from "@/components/ui/skeleton";

export default function Favoritos() {
  const [viewMode, setViewMode] = useState("gallery");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<string>();
  const [athenaDialog, setAthenaDialog] = useState(false);
  
  const {
    favoritesByType,
    favorites,
    loading,
    searchTerm,
    setSearchTerm,
    contentType,
    setContentType
  } = useFavorites();

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

  const handleAddFavorite = (type: string) => {
    setAddModalType(type);
    setAddModalOpen(true);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );

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
          <Button variant="default" size="sm" onClick={() => setAddModalOpen(true)} className="gap-2">
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
          <option value="video">Vídeos</option>
          <option value="podcast">Podcasts</option>
          <option value="artigo">Artigos</option>
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

      {loading ? (
        <LoadingSkeleton />
      ) : viewMode === "gallery" ? (
        <div className="space-y-10">
          {(contentType === "todos" || contentType === "musica") && favoritesByType.musica.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-bold text-primary">Músicas</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleAddFavorite('musica')}
                  className="ml-auto"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoritesByType.musica.map(favorite => (
                  <motion.div key={favorite.id} variants={itemVariants}>
                    <FavoriteCard favorite={favorite} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {(contentType === "todos" || contentType === "video") && favoritesByType.video.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-primary">Vídeos</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleAddFavorite('video')}
                  className="ml-auto"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoritesByType.video.map(favorite => (
                  <motion.div key={favorite.id} variants={itemVariants}>
                    <FavoriteCard favorite={favorite} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {(contentType === "todos" || contentType === "podcast") && favoritesByType.podcast.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Podcast className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-primary">Podcasts</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleAddFavorite('podcast')}
                  className="ml-auto"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoritesByType.podcast.map(favorite => (
                  <motion.div key={favorite.id} variants={itemVariants}>
                    <FavoriteCard favorite={favorite} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {(contentType === "todos" || contentType === "artigo") && favoritesByType.artigo.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <Book className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-bold text-primary">Artigos</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleAddFavorite('artigo')}
                  className="ml-auto"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoritesByType.artigo.map(favorite => (
                  <motion.div key={favorite.id} variants={itemVariants}>
                    <FavoriteCard favorite={favorite} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {!loading && Object.values(favoritesByType).every(arr => arr.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Nenhum favorito encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando conteúdos que inspiram sua mente
              </p>
              <Button onClick={() => setAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeiro favorito
              </Button>
            </div>
          )}
        </div>
      ) : viewMode === "table" ? (
        <FavoritesTableView favorites={favorites} />
      ) : viewMode === "timeline" ? (
        <FavoritesTimelineView favorites={favorites} />
      ) : null}

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
              Baseado nos seus favoritos, posso ajudar a encontrar padrões e sugerir organizações.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm">
              Vejo que você está construindo sua biblioteca de favoritos. Que tal organizá-los por projetos ou contextos específicos?
            </p>
            <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20 mt-3">
              <p className="text-sm font-medium text-secondary">Sugestão:</p>
              <p className="text-xs mt-1">
                Adicione tags relacionadas aos seus projetos ativos para criar conexões automáticas entre conteúdos e contextos.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Favorite Modal */}
      <AddFavoriteModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen}
        initialType={addModalType}
      />
    </div>
  );
}
