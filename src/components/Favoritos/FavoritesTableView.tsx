
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Music, Youtube, Podcast, Book, ExternalLink, Trash2 } from 'lucide-react';
import { Favorite } from '@/services/favoritesService';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoritesTableViewProps {
  favorites: Favorite[];
}

export function FavoritesTableView({ favorites }: FavoritesTableViewProps) {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Plataforma</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {favorites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-muted-foreground">Nenhum favorito encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            favorites.map((favorite) => (
              <TableRow key={favorite.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(favorite.type || '')}
                    <span className="text-sm font-medium">
                      {getTypeLabel(favorite.type || '')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{favorite.title}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {favorite.platform || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {favorite.tags && favorite.tags.length > 0 ? (
                      favorite.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                    {favorite.tags && favorite.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{favorite.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {favorite.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenUrl(favorite.url)}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(favorite.id)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
