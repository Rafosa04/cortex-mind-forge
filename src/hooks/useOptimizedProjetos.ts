
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback } from 'react';
import { projectsService, ProjectWithSteps } from '@/services/projectsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Query keys for React Query
const QUERY_KEYS = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
};

export function useOptimizedProjetos() {
  const [filterText, setFilterText] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Main query for projects
  const {
    data: projetos = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: () => projectsService.getProjetosComEtapas(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoized filtered projects
  const filteredProjetos = useMemo(() => {
    if (!projetos.length) return [];
    
    let filtered = [...projetos];
    
    if (filterText) {
      const searchLower = filterText.toLowerCase();
      filtered = filtered.filter(projeto => 
        projeto.name.toLowerCase().includes(searchLower) || 
        (projeto.description && projeto.description.toLowerCase().includes(searchLower)) ||
        (projeto.category && projeto.category.toLowerCase().includes(searchLower)) ||
        (projeto.tags && projeto.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    if (filterTags.length > 0) {
      filtered = filtered.filter(projeto => 
        projeto.tags && filterTags.some(tag => projeto.tags?.includes(tag))
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(projeto => projeto.status === filterStatus);
    }
    
    return filtered;
  }, [projetos, filterText, filterTags, filterStatus]);

  // Mutations with optimistic updates
  const createProjetoMutation = useMutation({
    mutationFn: async (params: {
      nome: string;
      descricao: string;
      categoria?: string | null;
      status?: "ativo" | "pausado" | "concluído";
      prazo?: string | null;
      etapas?: { texto: string; feita: boolean }[];
      tags?: string[];
    }) => {
      const { nome, descricao, categoria, status = "ativo", prazo, etapas = [], tags = [] } = params;
      return projectsService.criarProjetoComEtapas(nome, descricao, categoria, status, prazo, etapas, tags);
    },
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects });
      
      const previousProjects = queryClient.getQueryData(QUERY_KEYS.projects);
      
      // Optimistic update - fix the mapping to use 'done' instead of 'completed'
      const optimisticProject: ProjectWithSteps = {
        id: `temp-${Date.now()}`,
        name: newProject.nome,
        description: newProject.descricao,
        category: newProject.categoria,
        status: newProject.status || "ativo",
        deadline: newProject.prazo,
        tags: newProject.tags || [],
        steps: newProject.etapas?.map((etapa, index) => ({
          id: `temp-step-${index}`,
          project_id: `temp-${Date.now()}`,
          description: etapa.texto,
          done: etapa.feita, // Changed from 'completed' to 'done'
          order_index: index,
          created_at: new Date().toISOString(),
        })) || [],
        progress: 0,
        is_favorite: false,
        created_at: new Date().toISOString(),
        user_id: user?.id || '',
        content: null,
      };
      
      queryClient.setQueryData(QUERY_KEYS.projects, (old: ProjectWithSteps[] = []) => 
        [optimisticProject, ...old]
      );
      
      return { previousProjects };
    },
    onError: (err, newProject, context) => {
      queryClient.setQueryData(QUERY_KEYS.projects, context?.previousProjects);
      toast({
        title: "Erro ao criar projeto",
        description: "Não foi possível criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      toast({
        title: "Projeto criado",
        description: `O projeto "${variables.nome}" foi criado com sucesso`,
      });
    },
  });

  const updateEtapaMutation = useMutation({
    mutationFn: ({ etapaId, concluida }: { etapaId: string; concluida: boolean }) =>
      projectsService.atualizarEtapa(etapaId, concluida),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ projetoId, status }: { projetoId: string; status: "ativo" | "pausado" | "concluído" }) =>
      projectsService.atualizarStatusProjeto(projetoId, status),
    onMutate: async ({ projetoId, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects });
      
      const previousProjects = queryClient.getQueryData(QUERY_KEYS.projects);
      
      queryClient.setQueryData(QUERY_KEYS.projects, (old: ProjectWithSteps[] = []) =>
        old.map(projeto => 
          projeto.id === projetoId ? { ...projeto, status } : projeto
        )
      );
      
      return { previousProjects };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(QUERY_KEYS.projects, context?.previousProjects);
    },
    onSuccess: (data, { status }) => {
      toast({
        title: "Status atualizado",
        description: `Status do projeto alterado para ${status}`
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ projetoId, isFavorite }: { projetoId: string; isFavorite: boolean }) =>
      projectsService.toggleFavoritoProjeto(projetoId, isFavorite),
    onMutate: async ({ projetoId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects });
      
      const previousProjects = queryClient.getQueryData(QUERY_KEYS.projects);
      
      queryClient.setQueryData(QUERY_KEYS.projects, (old: ProjectWithSteps[] = []) =>
        old.map(projeto => 
          projeto.id === projetoId ? { ...projeto, is_favorite: isFavorite } : projeto
        )
      );
      
      return { previousProjects };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(QUERY_KEYS.projects, context?.previousProjects);
    },
    onSuccess: (data, { isFavorite }) => {
      toast({
        title: isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: `Projeto ${isFavorite ? "adicionado aos" : "removido dos"} favoritos`
      });
    },
  });

  // Memoized functions
  const criarProjeto = useCallback((
    nome: string,
    descricao: string,
    categoria?: string | null,
    status: "ativo" | "pausado" | "concluído" = "ativo",
    prazo?: string | null,
    etapas: { texto: string; feita: boolean }[] = [],
    tags: string[] = []
  ) => {
    return createProjetoMutation.mutateAsync({
      nome, descricao, categoria, status, prazo, etapas, tags
    });
  }, [createProjetoMutation]);

  const atualizarEtapa = useCallback((etapaId: string, concluida: boolean) => {
    return updateEtapaMutation.mutateAsync({ etapaId, concluida });
  }, [updateEtapaMutation]);

  const atualizarStatusProjeto = useCallback((projetoId: string, status: "ativo" | "pausado" | "concluído") => {
    return updateStatusMutation.mutateAsync({ projetoId, status });
  }, [updateStatusMutation]);

  const toggleFavoritoProjeto = useCallback((projetoId: string, isFavorite: boolean) => {
    return toggleFavoriteMutation.mutateAsync({ projetoId, isFavorite });
  }, [toggleFavoriteMutation]);

  const carregarProjetos = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
  }, [queryClient]);

  return {
    projetos: filteredProjetos,
    allProjetos: projetos,
    loading,
    error: error?.message || null,
    carregarProjetos,
    criarProjeto,
    atualizarEtapa,
    atualizarStatusProjeto,
    toggleFavoritoProjeto,
    // Legacy methods for compatibility
    atualizarConteudoProjeto: async (projetoId: string, content: string) => 
      projectsService.atualizarConteudoProjeto(projetoId, content),
    adicionarEtapa: async (projetoId: string, descricao: string) => 
      projectsService.adicionarEtapaProjeto(projetoId, descricao),
    removerEtapa: async (etapaId: string) => 
      projectsService.removerEtapaProjeto(etapaId),
    removerProjeto: async (projetoId: string) => 
      projectsService.removerProjeto(projetoId),
    atualizarTagsProjeto: async (projetoId: string, tags: string[]) => 
      projectsService.atualizarTagsProjeto(projetoId, tags),
    // Filtering
    filterText,
    setFilterText,
    filterTags,
    setFilterTags,
    filterStatus,
    setFilterStatus,
  };
}
