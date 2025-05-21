import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectStep = Database['public']['Tables']['project_steps']['Row'];

export type ProjectWithSteps = Project & {
  steps: ProjectStep[];
};

const mapProject = (row: any): Project => ({
  id: row.id,
  created_at: row.created_at,
  name: row.name,
  description: row.description,
  user_id: row.user_id,
  status: row.status,
  progress: row.progress,
  category: row.category,
  deadline: row.deadline,
  content: row.content,
  is_favorite: row.is_favorite,
  tags: row.tags
});

const mapProjectStep = (row: any): ProjectStep => ({
  id: row.id,
  created_at: row.created_at,
  project_id: row.project_id,
  description: row.description,
  done: row.done,
  order_index: row.order_index || 0 // Providing a default of 0 for order_index
});

export const projectsService = {
  async getProjetos(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar projetos:", error);
        throw new Error(error.message);
      }

      return data ? data.map(mapProject) : [];
    } catch (error: any) {
      console.error("Erro inesperado ao buscar projetos:", error);
      throw new Error(error.message);
    }
  },

  async getProjetosComEtapas(): Promise<ProjectWithSteps[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_steps (
            id,
            created_at,
            project_id,
            description,
            done,
            order_index
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar projetos com etapas:", error);
        throw new Error(error.message);
      }

      return data ? data.map(project => ({
        ...mapProject(project),
        steps: (project.project_steps || []).map(mapProjectStep)
      })) : [];
    } catch (error: any) {
      console.error("Erro inesperado ao buscar projetos com etapas:", error);
      throw new Error(error.message);
    }
  },

  async criarProjeto(
    name: string,
    description: string,
    category?: string | null,
    status: "ativo" | "pausado" | "concluído" = "ativo",
    deadline?: string | null,
    tags: string[] = []
  ): Promise<Project | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user?.id;
      
      if (!user_id) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { name, description, status, category, deadline, tags, user_id }
        ])
        .select('*')
        .single();

      if (error) {
        console.error("Erro ao criar projeto:", error);
        throw new Error(error.message);
      }

      return data ? mapProject(data) : null;
    } catch (error: any) {
      console.error("Erro inesperado ao criar projeto:", error);
      throw new Error(error.message);
    }
  },

  async criarProjetoComEtapas(
    name: string,
    description: string,
    category?: string | null,
    status: "ativo" | "pausado" | "concluído" = "ativo",
    deadline?: string | null,
    etapas: { texto: string; feita: boolean }[] = [],
    tags: string[] = []
  ): Promise<ProjectWithSteps | null> {
    try {
      // 1. Create the project
      const project = await this.criarProjeto(name, description, category, status, deadline, tags);
      
      if (!project) {
        console.error("Failed to create project");
        return null;
      }
      
      // 2. Create the steps for the project
      const steps = [];
      for (const etapa of etapas) {
        const newStep = await this.adicionarEtapaProjeto(project.id, etapa.texto, etapa.feita);
        if (newStep) {
          steps.push(newStep);
        }
      }
      
      // 3. Return the project with its steps
      return {
        ...project,
        steps: steps
      };
    } catch (error: any) {
      console.error("Error creating project with steps:", error);
      throw new Error(error.message);
    }
  },

  async atualizarEtapa(etapaId: string, done: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_steps')
        .update({ done })
        .eq('id', etapaId);

      if (error) {
        console.error("Erro ao atualizar etapa:", error);
        throw new Error(error.message);
      }

      return true;
    } catch (error: any) {
      console.error("Erro inesperado ao atualizar etapa:", error);
      throw new Error(error.message);
    }
  },

  async atualizarStatusProjeto(projetoId: string, status: "ativo" | "pausado" | "concluído"): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projetoId);

      if (error) {
        console.error("Erro ao atualizar status do projeto:", error);
        throw new Error(error.message);
      }

      return true;
    } catch (error: any) {
      console.error("Erro inesperado ao atualizar status do projeto:", error);
      throw new Error(error.message);
    }
  },

  async toggleFavoritoProjeto(projetoId: string, is_favorite: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_favorite })
        .eq('id', projetoId);

      if (error) {
        console.error("Erro ao atualizar favorito do projeto:", error);
        throw new Error(error.message);
      }

      return true;
    } catch (error: any) {
      console.error("Erro inesperado ao atualizar favorito do projeto:", error);
      throw new Error(error.message);
    }
  },

  async atualizarConteudoProjeto(projetoId: string, content: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ content })
        .eq('id', projetoId);

      if (error) {
        console.error("Erro ao atualizar conteúdo do projeto:", error);
        throw new Error(error.message);
      }

      return true;
    } catch (error: any) {
      console.error("Erro inesperado ao atualizar conteúdo do projeto:", error);
      throw new Error(error.message);
    }
  },

  async adicionarEtapaProjeto(projetoId: string, description: string, done: boolean = false): Promise<ProjectStep | null> {
    try {
      const { data, error } = await supabase
        .from('project_steps')
        .insert([{ project_id: projetoId, description, done }])
        .select('*')
        .single();

      if (error) {
        console.error("Erro ao adicionar etapa ao projeto:", error);
        throw new Error(error.message);
      }

      return data ? mapProjectStep(data) : null;
    } catch (error: any) {
      console.error("Erro inesperado ao adicionar etapa ao projeto:", error);
      throw new Error(error.message);
    }
  },

  async removerEtapaProjeto(etapaId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_steps')
        .delete()
        .eq('id', etapaId);

      if (error) {
        console.error("Erro ao remover etapa do projeto:", error);
        throw new Error(error.message);
      }

      return true;
    } catch (error: any) {
      console.error("Erro inesperado ao remover etapa do projeto:", error);
      throw new Error(error.message);
    }
  },

  async removerProjeto(projetoId: string): Promise<boolean> {
    try {
      // First, delete all steps related to the project
      const { error: stepsError } = await supabase
        .from('project_steps')
        .delete()
        .eq('project_id', projetoId);

      if (stepsError) {
        console.error("Erro ao remover etapas do projeto:", stepsError);
        throw new Error(stepsError.message);
      }

      // Then, delete the project itself
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projetoId);

      if (projectError) {
        console.error("Erro ao remover projeto:", projectError);
        throw new Error(projectError.message);
      }

      toast({
        title: "Projeto removido",
        description: "O projeto foi removido com sucesso"
      });

      return true;
    } catch (error: any) {
      console.error("Erro inesperado ao remover projeto:", error);
      throw new Error(error.message);
    }
  },

  async atualizarTagsProjeto(projetoId: string, tags: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ tags: tags })
        .eq('id', projetoId);

      if (error) {
        console.error("Erro ao atualizar tags do projeto:", error);
        throw new Error(error.message);
      }

      toast({
        title: "Tags atualizadas",
        description: "As tags do projeto foram atualizadas"
      });

      return true;
    } catch (error: any) {
      console.error("Erro inesperado ao atualizar tags do projeto:", error);
      throw new Error(error.message);
    }
  },
};
