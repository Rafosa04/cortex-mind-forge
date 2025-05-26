
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback } from 'react';
import { favoritesService, Favorite, FavoriteInsert } from '@/services/favoritesService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const QUERY_KEYS = {
  favorites: ['favorites'] as const,
  favoritesByType: (type: string) => ['favorites', 'type', type] as const,
};

export function useFavorites() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState('todos');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Main query for favorites
  const {
    data: favorites = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.favorites,
    queryFn: () => favoritesService.getFavorites(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filtered favorites
  const filteredFavorites = useMemo(() => {
    let filtered = [...favorites];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(favorite =>
        favorite.title.toLowerCase().includes(searchLower) ||
        (favorite.tags && favorite.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Filter by content type
    if (contentType !== 'todos') {
      filtered = filtered.filter(favorite => favorite.type === contentType);
    }

    return filtered;
  }, [favorites, searchTerm, contentType]);

  // Group favorites by type
  const favoritesByType = useMemo(() => {
    return {
      musica: filteredFavorites.filter(f => f.type === 'musica'),
      video: filteredFavorites.filter(f => f.type === 'video'),
      podcast: filteredFavorites.filter(f => f.type === 'podcast'),
      artigo: filteredFavorites.filter(f => f.type === 'artigo'),
    };
  }, [filteredFavorites]);

  // Create favorite mutation
  const createFavoriteMutation = useMutation({
    mutationFn: (favorite: Omit<FavoriteInsert, 'user_id'>) =>
      favoritesService.createFavorite(favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
      toast({
        title: "Favorito adicionado",
        description: "Item adicionado aos favoritos com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar favorito",
        description: "Não foi possível adicionar o item aos favoritos",
        variant: "destructive",
      });
    },
  });

  // Update favorite mutation
  const updateFavoriteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Favorite> }) =>
      favoritesService.updateFavorite(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
      toast({
        title: "Favorito atualizado",
        description: "Item atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar favorito",
        description: "Não foi possível atualizar o item",
        variant: "destructive",
      });
    },
  });

  // Delete favorite mutation
  const deleteFavoriteMutation = useMutation({
    mutationFn: (id: string) => favoritesService.deleteFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
      toast({
        title: "Favorito removido",
        description: "Item removido dos favoritos",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover favorito",
        description: "Não foi possível remover o item",
        variant: "destructive",
      });
    },
  });

  // Functions
  const createFavorite = useCallback((favorite: Omit<FavoriteInsert, 'user_id'>) => {
    return createFavoriteMutation.mutateAsync(favorite);
  }, [createFavoriteMutation]);

  const updateFavorite = useCallback((id: string, updates: Partial<Favorite>) => {
    return updateFavoriteMutation.mutateAsync({ id, updates });
  }, [updateFavoriteMutation]);

  const deleteFavorite = useCallback((id: string) => {
    return deleteFavoriteMutation.mutateAsync(id);
  }, [deleteFavoriteMutation]);

  const refreshFavorites = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
  }, [queryClient]);

  return {
    favorites: filteredFavorites,
    favoritesByType,
    allFavorites: favorites,
    loading,
    error: error?.message || null,
    searchTerm,
    setSearchTerm,
    contentType,
    setContentType,
    createFavorite,
    updateFavorite,
    deleteFavorite,
    refreshFavorites,
    isCreating: createFavoriteMutation.isPending,
    isUpdating: updateFavoriteMutation.isPending,
    isDeleting: deleteFavoriteMutation.isPending,
  };
}
