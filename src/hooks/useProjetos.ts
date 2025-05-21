
import { useEffect, useState, useCallback } from 'react';
import { projectsService, ProjectWithSteps, ProjectUpdateData } from '@/services/projectsService';
import { useAuth } from '@/hooks/useAuth';
import { DateRange } from 'react-day-picker';

export type ProjetoFiltros = {
  search: string;
  status: string | null;
  tag: string | null;
  dateRange: DateRange | null;
};

export function useProjetos() {
  const [projetos, setProjetos] = useState<ProjectWithSteps[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const carregarProjetos = useCallback(async () => {
    if (!user) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await projectsService.getProjetosComEtapas();
      setProjetos(data);
      
      // Load categories
      const categoriasData = await projectsService.getAllCategorias();
      setCategorias(categoriasData);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar projetos");
      console.error("Error in useProjetos:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Run carregarProjetos when the hook is first used and user is available
  useEffect(() => {
    if (user) {
      carregarProjetos();
    }
  }, [user, carregarProjetos]);

  const filtrarProjetos = useCallback(async (filtros: ProjetoFiltros) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const filtroParams = {
        search: filtros.search || undefined,
        status: filtros.status || undefined,
        tag: filtros.tag || undefined,
        dateFrom: filtros.dateRange?.from || undefined,
        dateTo: filtros.dateRange?.to || undefined,
      };
      
      const data = await projectsService.getProjetoComFiltros(filtroParams);
      setProjetos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao filtrar projetos");
      console.error("Error filtering projects:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const criarProjeto = async (
    nome: string,
    descricao: string,
    categoria?: string | null,
    status: "ativo" | "pausado" | "concluído" = "ativo",
    prazo?: string | null,
    etapas: { texto: string; feita: boolean }[] = []
  ) => {
    if (!user) return null;

    const novoProjeto = await projectsService.criarProjetoComEtapas(
      nome, descricao, categoria, status, prazo, etapas
    );

    if (novoProjeto) {
      setProjetos(prevProjetos => [novoProjeto, ...prevProjetos]);
      
      // Update categories if new category was added
      if (categoria && !categorias.includes(categoria)) {
        setCategorias(prev => [...prev, categoria]);
      }
    }

    return novoProjeto;
  };

  const atualizarProjeto = async (projetoId: string, dados: ProjectUpdateData) => {
    const sucesso = await projectsService.atualizarProjeto(projetoId, dados);

    if (sucesso) {
      // Update the projects list with new data
      setProjetos(prevProjetos => 
        prevProjetos.map(projeto => 
          projeto.id === projetoId ? { ...projeto, ...dados } : projeto
        )
      );
      
      // If category was updated, refresh categories list
      if (dados.category) {
        const categoriasData = await projectsService.getAllCategorias();
        setCategorias(categoriasData);
      }
    }

    return sucesso;
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
    }

    return sucesso;
  };

  const adicionarEtapa = async (projetoId: string, descricao: string) => {
    const novaEtapa = await projectsService.adicionarEtapaProjeto(projetoId, descricao);
    
    if (novaEtapa) {
      carregarProjetos(); // Reload to get updated progress
    }

    return novaEtapa;
  };

  const removerEtapa = async (etapaId: string) => {
    const sucesso = await projectsService.removerEtapaProjeto(etapaId);
    
    if (sucesso) {
      carregarProjetos(); // Reload to get updated progress
    }

    return sucesso;
  };

  return {
    projetos,
    categorias,
    loading,
    error,
    carregarProjetos,
    filtrarProjetos,
    criarProjeto,
    atualizarProjeto,
    atualizarEtapa,
    atualizarStatusProjeto,
    adicionarEtapa,
    removerEtapa
  };
}
