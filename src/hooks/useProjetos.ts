
import { useEffect, useState } from 'react';
import { projectsService, ProjectWithSteps } from '@/services/projectsService';
import { useAuth } from '@/hooks/useAuth';

export function useProjetos() {
  const [projetos, setProjetos] = useState<ProjectWithSteps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar projetos");
      console.error("Error in useProjetos:", err);
    } finally {
      setLoading(false);
    }
  };

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
    etapas: { texto: string; feita: boolean }[] = []
  ) => {
    if (!user) return null;

    const novoProjeto = await projectsService.criarProjetoComEtapas(
      nome, descricao, categoria, status, prazo, etapas
    );

    if (novoProjeto) {
      setProjetos(prevProjetos => [novoProjeto, ...prevProjetos]);
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
    loading,
    error,
    carregarProjetos,
    criarProjeto,
    atualizarEtapa,
    atualizarStatusProjeto,
    adicionarEtapa,
    removerEtapa
  };
}
