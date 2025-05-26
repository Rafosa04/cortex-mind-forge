
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Youtube, Podcast, Book, ExternalLink, Trash2, Clock } from 'lucide-react';
import { Favorite } from '@/services/favoritesService';
import { useFavorites } from '@/hooks/useFavorites';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FavoritesTimelineViewProps {
  favorites: Favorite[];
}

export function FavoritesTimelineView({ favorites }: FavoritesTimelineViewProps) {
  const { deleteFavorite, isDeleting } = useFavorites();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'musica':
        return <Music className="w-4 h-4 text-green-400" />;
      case 'video':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'podcast':
        return <Podcast className="w-4 h-4 text-purple-400" />;
      case 'artigo':
        return <Book className="w-4 h-4 text-blue-400" />;
      default:
        return <Book className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'musica':
        return 'Música';
      case 'video':
        return 'Vídeo';
      case 'podcast':
        return 'Podcast';
      case 'artigo':
        return 'Artigo';
      default:
        return 'Conteúdo';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este favorito?')) {
      await deleteFavorite(id);
    }
  };

  const handleOpenUrl = (url: string | null) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Group favorites by date
  const groupedFavorites = favorites.reduce((groups, favorite) => {
    const date = format(new Date(favorite.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(favorite);
    return groups;
  }, {} as Record<string, Favorite[]>);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-bold mb-2">Nenhum favorito encontrado</h3>
        <p className="text-muted-foreground">
          Sua linha do tempo aparecerá aqui quando você adicionar favoritos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedFavorites)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, dayFavorites]) => (
          <div key={date} className="relative">
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {format(new Date(date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Timeline items */}
            <div className="space-y-4 ml-6">
              {dayFavorites.map((favorite, index) => (
                <div key={favorite.id} className="relative">
                  {/* Timeline connector */}
                  <div className="absolute -left-6 top-6 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm"></div>
                  {index < dayFavorites.length - 1 && (
                    <div className="absolute -left-5 top-9 w-px h-16 bg-border"></div>
                  )}

                  {/* Content card */}
                  <Card className="bg-card border-border/60 hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(favorite.type || '')}
                          <h4 className="font-bold text-lg">{favorite.title}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(favorite.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(favorite.id)}
                            disabled={isDeleting}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(favorite.type || '')}
                          </Badge>
                          {favorite.platform && (
                            <span className="text-sm text-muted-foreground">
                              {favorite.platform}
                            </span>
                          )}
                        </div>

                        {favorite.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenUrl(favorite.url)}
                            className="text-xs h-7"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Abrir
                          </Button>
                        )}
                      </div>

                      {favorite.tags && favorite.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {favorite.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
