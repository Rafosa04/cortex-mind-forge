
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Youtube, Podcast, Book, Play, Link, Trash2, ExternalLink } from 'lucide-react';
import { Favorite } from '@/services/favoritesService';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteCardProps {
  favorite: Favorite;
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const { deleteFavorite, isDeleting } = useFavorites();

  const getTypeIcon = () => {
    switch (favorite.type) {
      case 'musica':
        return <Music className="w-5 h-5 text-green-400" />;
      case 'video':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'podcast':
        return <Podcast className="w-5 h-5 text-purple-400" />;
      case 'artigo':
        return <Book className="w-5 h-5 text-blue-400" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (favorite.type) {
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

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja remover este favorito?')) {
      await deleteFavorite(favorite.id);
    }
  };

  const handleOpenUrl = () => {
    if (favorite.url) {
      window.open(favorite.url, '_blank');
    }
  };

  return (
    <Card className={cn(
      "bg-card border-border/60 hover:border-primary/40 transition-colors",
      favorite.type === 'artigo' && "border-l-4 border-l-blue-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <h4 className="font-bold text-lg">{favorite.title}</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {favorite.platform && (
          <p className="text-sm text-muted-foreground mb-2">
            {favorite.platform}
          </p>
        )}

        {favorite.tags && favorite.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {favorite.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-background/50 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Adicionado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-card/50 flex justify-between">
        <Badge variant="secondary" className="text-xs">
          {getTypeLabel()}
        </Badge>
        <div className="flex gap-2">
          {favorite.url && (
            <Button variant="ghost" size="sm" onClick={handleOpenUrl} className="text-xs h-7">
              <ExternalLink className="w-3 h-3 mr-1" />
              Abrir
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-xs h-7">
            <Link className="w-3 h-3 mr-1" />
            Associar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
