
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedItemsService, SavedItem, AthenaHighlight, AthenaReactivationSuggestion } from '@/services/savedItemsService';
import { useToast } from '@/hooks/use-toast';

export function useSavedItems() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: savedItems = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['saved-items'],
    queryFn: savedItemsService.getSavedItems,
  });

  const {
    data: athenaHighlights = [],
    isLoading: isLoadingHighlights
  } = useQuery({
    queryKey: ['athena-highlights'],
    queryFn: savedItemsService.getAthenaHighlights,
  });

  const {
    data: reactivationSuggestions = [],
    isLoading: isLoadingSuggestions
  } = useQuery({
    queryKey: ['reactivation-suggestions'],
    queryFn: savedItemsService.getReactivationSuggestions,
  });

  const createMutation = useMutation({
    mutationFn: savedItemsService.createSavedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      toast({
        title: "Item salvo com sucesso!",
        description: "O item foi adicionado aos seus salvos.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SavedItem> }) =>
      savedItemsService.updateSavedItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: savedItemsService.deleteSavedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      toast({
        title: "Item removido",
        description: "O item foi removido dos seus salvos.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const lastAccessedMutation = useMutation({
    mutationFn: savedItemsService.updateLastAccessed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
    },
  });

  const dismissHighlightMutation = useMutation({
    mutationFn: savedItemsService.dismissHighlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athena-highlights'] });
    },
  });

  const dismissSuggestionMutation = useMutation({
    mutationFn: savedItemsService.dismissReactivationSuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactivation-suggestions'] });
    },
  });

  return {
    savedItems,
    athenaHighlights,
    reactivationSuggestions,
    isLoading,
    isLoadingHighlights,
    isLoadingSuggestions,
    error,
    createSavedItem: createMutation.mutate,
    updateSavedItem: updateMutation.mutate,
    deleteSavedItem: deleteMutation.mutate,
    updateLastAccessed: lastAccessedMutation.mutate,
    dismissHighlight: dismissHighlightMutation.mutate,
    dismissSuggestion: dismissSuggestionMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
