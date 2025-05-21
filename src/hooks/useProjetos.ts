
import { useEffect, useState } from 'react';
import { projectsService, ProjectWithSteps } from '@/services/projectsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function useProjetos() {
  const [projetos, setProjetos] = useState<ProjectWithSteps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProjetos, setFilteredProjetos] = useState<ProjectWithSteps[]>([]);
  const [filterText, setFilterText] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { user } = useAuth();

  const carregarProjetos = async () => {
    if (!user) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await projectsService.getProjetosComEtapas();
      setProjetos(data);
      setFilteredProjetos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar projetos");
      console.error("Error in useProjetos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter criteria or projects change
  useEffect(() => {
    if (!projetos.length) {
      setFilteredProjetos([]);
      return;
    }
    
    let filtered = [...projetos];
    
    // Apply text filter
    if (filterText) {
      const searchLower = filterText.toLowerCase();
      filtered = filtered.filter(projeto => 
        projeto.name.toLowerCase().includes(searchLower) || 
        (projeto.description && projeto.description.toLowerCase().includes(searchLower)) ||
        (projeto.category && projeto.category.toLowerCase().includes(searchLower)) ||
        (projeto.tags && projeto.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    // Apply tags filter
    if (filterTags.length > 0) {
      filtered = filtered.filter(projeto => 
        projeto.tags && filterTags.some(tag => projeto.tags?.includes(tag))
      );
    }
    
    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(projeto => projeto.status === filterStatus);
    }
    
    setFilteredProjetos(filtered);
  }, [projetos, filterText, filterTags, filterStatus]);

  useEffect(() => {
    if (user) {
      carregarProjetos();
    }
  }, [user]);

  const criarProjeto = async (
    nome: string,
    descricao: string,
    categoria?: string | null,
    status: "ativo" | "pausado" | "concluído" = "ativo",
    prazo?: string | null,
    etapas: { texto: string; feita: boolean }[] = [],
    tags: string[] = []
  ) => {
    if (!user) return null;

    const novoProjeto = await projectsService.criarProjetoComEtapas(
      nome, descricao, categoria, status, prazo, etapas, tags
    );

    if (novoProjeto) {
      setProjetos(prevProjetos => [novoProjeto, ...prevProjetos]);
      // Also update filtered projects
      setFilteredProjetos(prevFiltered => [novoProjeto, ...prevFiltered]);
      toast({
        title: "Projeto criado",
        description: `O projeto "${nome}" foi criado com sucesso`,
      });
    }

    return novoProjeto;
  };

  const atualizarEtapa = async (etapaId: string, concluida: boolean) => {
    const sucesso = await projectsService.atualizarEtapa(etapaId, concluida);

    if (sucesso) {
      // Reload projects to get updated progress
      carregarProjetos();
    }

    return sucesso;
  };

  const atualizarStatusProjeto = async (projetoId: string, status: "ativo" | "pausado" | "concluído") => {
    const sucesso = await projectsService.atualizarStatusProjeto(projetoId, status);

    if (sucesso) {
      setProjetos(prevProjetos => 
        prevProjetos.map(projeto => 
          projeto.id === projetoId ? { ...projeto, status } : projeto
        )
      );
      setFilteredProjetos(prevFiltered =>
        prevFiltered.map(projeto =>
          projeto.id === projetoId ? { ...projeto, status } : projeto
        )
      );
      toast({
        title: "Status atualizado",
        description: `Status do projeto alterado para ${status}`
      });
    }

    return sucesso;
  };

  const toggleFavoritoProjeto = async (projetoId: string, isFavorite: boolean) => {
    const sucesso = await projectsService.toggleFavoritoProjeto(projetoId, isFavorite);

    if (sucesso) {
      setProjetos(prevProjetos => 
        prevProjetos.map(projeto => 
          projeto.id === projetoId ? { ...projeto, is_favorite: isFavorite } : projeto
        )
      );
      setFilteredProjetos(prevFiltered =>
        prevFiltered.map(projeto =>
          projeto.id === projetoId ? { ...projeto, is_favorite: isFavorite } : projeto
        )
      );
      toast({
        title: isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: `Projeto ${isFavorite ? "adicionado aos" : "removido dos"} favoritos`
      });
    }

    return sucesso;
  };

  const atualizarConteudoProjeto = async (projetoId: string, content: string) => {
    const sucesso = await projectsService.atualizarConteudoProjeto(projetoId, content);

    if (sucesso) {
      setProjetos(prevProjetos => 
        prevProjetos.map(projeto => 
          projeto.id === projetoId ? { ...projeto, content } : projeto
        )
      );
      setFilteredProjetos(prevFiltered =>
        prevFiltered.map(projeto =>
          projeto.id === projetoId ? { ...projeto, content } : projeto
        )
      );
    }

    return sucesso;
  };

  const adicionarEtapa = async (projetoId: string, descricao: string) => {
    const novaEtapa = await projectsService.adicionarEtapaProjeto(projetoId, descricao);
    
    if (novaEtapa) {
      carregarProjetos(); // Reload to get updated progress
      toast({
        title: "Etapa adicionada",
        description: "Nova etapa adicionada ao projeto"
      });
    }

    return novaEtapa;
  };

  const removerEtapa = async (etapaId: string) => {
    const sucesso = await projectsService.removerEtapaProjeto(etapaId);
    
    if (sucesso) {
      carregarProjetos(); // Reload to get updated progress
      toast({
        title: "Etapa removida",
        description: "Etapa removida do projeto"
      });
    }

    return sucesso;
  };

  const removerProjeto = async (projetoId: string) => {
    const sucesso = await projectsService.removerProjeto(projetoId);
    
    if (sucesso) {
      setProjetos(prevProjetos => 
        prevProjetos.filter(projeto => projeto.id !== projetoId)
      );
      setFilteredProjetos(prevFiltered => 
        prevFiltered.filter(projeto => projeto.id !== projetoId)
      );
      toast({
        title: "Projeto removido",
        description: "O projeto foi removido com sucesso"
      });
    }

    return sucesso;
  };

  const atualizarTagsProjeto = async (projetoId: string, tags: string[]) => {
    const sucesso = await projectsService.atualizarTagsProjeto(projetoId, tags);
    
    if (sucesso) {
      setProjetos(prevProjetos => 
        prevProjetos.map(projeto => 
          projeto.id === projetoId ? { ...projeto, tags } : projeto
        )
      );
      setFilteredProjetos(prevFiltered =>
        prevFiltered.map(projeto =>
          projeto.id === projetoId ? { ...projeto, tags } : projeto
        )
      );
      toast({
        title: "Tags atualizadas",
        description: "As tags do projeto foram atualizadas"
      });
    }

    return sucesso;
  };

  return {
    projetos: filteredProjetos,
    allProjetos: projetos,
    loading,
    error,
    carregarProjetos,
    criarProjeto,
    atualizarEtapa,
    atualizarStatusProjeto,
    toggleFavoritoProjeto,
    atualizarConteudoProjeto,
    adicionarEtapa,
    removerEtapa,
    removerProjeto,
    atualizarTagsProjeto,
    // Filtering
    filterText,
    setFilterText,
    filterTags,
    setFilterTags,
    filterStatus,
    setFilterStatus
  };
}
