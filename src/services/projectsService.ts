
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  deadline: string | null;
  status: "ativo" | "pausado" | "concluído";
  progress: number;
  created_at: string;
  user_id: string;
  tags: string[] | null;
  is_favorite: boolean;
  content: string | null;
};

export type ProjectStep = {
  id: string;
  project_id: string;
  description: string;
  done: boolean;
  order_index: number | null;
  created_at: string;
};

export type ProjectWithSteps = Project & {
  steps: ProjectStep[];
};

export const projectsService = {
  async getProjetosComEtapas(): Promise<ProjectWithSteps[]> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Fetch projects for the current user
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (projectsError) {
        throw projectsError;
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      // Fetch steps for all projects
      const projectIds = projects.map(project => project.id);
      const { data: steps, error: stepsError } = await supabase
        .from("project_steps")
        .select("*")
        .in("project_id", projectIds)
        .order("order_index", { ascending: true, nullsFirst: false });

      if (stepsError) {
        throw stepsError;
      }

      // Combine projects with their steps and calculate progress
      const projectsWithSteps = projects.map(project => {
        const projectSteps = steps?.filter(step => step.project_id === project.id) || [];
        
        // Calculate progress based on completed steps if we have steps
        let calculatedProgress = project.progress || 0;
        if (projectSteps.length > 0) {
          const completedSteps = projectSteps.filter(step => step.done).length;
          calculatedProgress = Math.round((completedSteps / projectSteps.length) * 100);
        }
        
        return {
          ...project,
          steps: projectSteps,
          progress: calculatedProgress,
          // Ensure status is one of the allowed values
          status: (project.status as "ativo" | "pausado" | "concluído") || "ativo",
          // Ensure tags is an array
          tags: project.tags || []
        } as ProjectWithSteps;
      });

      return projectsWithSteps as ProjectWithSteps[];
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Erro ao carregar projetos",
        description: error.message || "Ocorreu um erro ao carregar seus projetos",
        variant: "destructive",
      });
      return [];
    }
  },

  async criarProjetoComEtapas(
    name: string,
    description: string,
    category: string | null = null,
    status: "ativo" | "pausado" | "concluído" = "ativo",
    deadline: string | null = null,
    etapas: { texto: string; feita: boolean }[] = [],
    tags: string[] = []
  ): Promise<ProjectWithSteps | null> {
    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Create project first
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name,
          description,
          category,
          status,
          deadline,
          progress: 0, // Will calculate after adding steps
          user_id: user.id,
          tags: tags,
          is_favorite: false
        })
        .select()
        .single();

      if (projectError) {
        throw projectError;
      }

      if (!project) {
        throw new Error("Falha ao criar projeto");
      }

      // Create steps if any
      if (etapas.length > 0) {
        const stepsToInsert = etapas.map((etapa, index) => ({
          project_id: project.id,
          description: etapa.texto,
          done: etapa.feita,
          order_index: index,
        }));

        const { data: steps, error: stepsError } = await supabase
          .from("project_steps")
          .insert(stepsToInsert)
          .select();

        if (stepsError) {
          throw stepsError;
        }

        // Calculate and update progress
        const completedSteps = etapas.filter(etapa => etapa.feita).length;
        const progress = etapas.length > 0 ? Math.round((completedSteps / etapas.length) * 100) : 0;

        // Update project with calculated progress
        const { error: updateError } = await supabase
          .from("projects")
          .update({ progress })
          .eq("id", project.id);

        if (updateError) {
          throw updateError;
        }

        return {
          ...project,
          steps: steps || [],
          progress,
          // Ensure status is one of the allowed values
          status: (project.status as "ativo" | "pausado" | "concluído"),
          tags: project.tags || []
        } as ProjectWithSteps;
      }

      return {
        ...project,
        steps: [],
        progress: 0,
        // Ensure status is one of the allowed values
        status: (project.status as "ativo" | "pausado" | "concluído"),
        tags: project.tags || []
      } as ProjectWithSteps;
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Erro ao criar projeto",
        description: error.message || "Ocorreu um erro ao criar o projeto",
        variant: "destructive",
      });
      return null;
    }
  },

  async atualizarEtapa(stepId: string, done: boolean): Promise<boolean> {
    try {
      // Show temporary loading indicator
      const loadingToastId = toast({
        title: "Atualizando etapa...",
        description: "Salvando alterações...",
      });
      
      const { data: step, error: stepError } = await supabase
        .from("project_steps")
        .update({ done })
        .eq("id", stepId)
        .select()
        .single();

      if (stepError) {
        throw stepError;
      }

      // Dismiss loading toast
      toast({
        id: loadingToastId.id,
        title: "Etapa atualizada",
        description: done ? "Etapa concluída!" : "Etapa desmarcada."
      });

      // Get all steps for this project to recalculate progress
      const { data: projectSteps, error: stepsError } = await supabase
        .from("project_steps")
        .select("*")
        .eq("project_id", step.project_id);

      if (stepsError) {
        throw stepsError;
      }

      // Calculate new progress
      const completedSteps = projectSteps?.filter(s => s.done).length || 0;
      const totalSteps = projectSteps?.length || 0;
      const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      // Update project progress
      const { error: updateError } = await supabase
        .from("projects")
        .update({ progress })
        .eq("id", step.project_id);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (error: any) {
      console.error("Error updating step:", error);
      toast({
        title: "Erro ao atualizar etapa",
        description: error.message || "Ocorreu um erro ao atualizar a etapa",
        variant: "destructive",
      });
      return false;
    }
  },

  async atualizarStatusProjeto(projectId: string, status: "ativo" | "pausado" | "concluído"): Promise<boolean> {
    try {
      // Show loading indicator
      const loadingToastId = toast({
        title: "Atualizando status...",
        description: `Alterando para ${status}...`,
      });
      
      const { error } = await supabase
        .from("projects")
        .update({ status })
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      // Dismiss loading toast and show success
      toast({
        id: loadingToastId.id,
        title: "Status atualizado",
        description: `Projeto agora está ${status}`
      });

      return true;
    } catch (error: any) {
      console.error("Error updating project status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do projeto",
        variant: "destructive",
      });
      return false;
    }
  },

  async toggleFavoritoProjeto(projectId: string, isFavorite: boolean): Promise<boolean> {
    try {
      // Show temporary animation
      const loadingToastId = toast({
        title: isFavorite ? "Adicionando aos favoritos..." : "Removendo dos favoritos...",
        description: "Atualizando...",
      });
      
      const { error } = await supabase
        .from("projects")
        .update({ is_favorite: isFavorite })
        .eq("id", projectId);

      if (error) {
        throw error;
      }
      
      // Show success toast
      toast({
        id: loadingToastId.id,
        title: isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: `Projeto ${isFavorite ? "adicionado aos" : "removido dos"} favoritos`
      });

      return true;
    } catch (error: any) {
      console.error("Error updating favorite status:", error);
      toast({
        title: "Erro ao atualizar favorito",
        description: error.message || "Ocorreu um erro ao atualizar o status de favorito",
        variant: "destructive",
      });
      return false;
    }
  },

  async atualizarConteudoProjeto(projectId: string, content: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ content })
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error updating project content:", error);
      toast({
        title: "Erro ao atualizar conteúdo",
        description: error.message || "Ocorreu um erro ao atualizar o conteúdo do projeto",
        variant: "destructive",
      });
      return false;
    }
  },

  async adicionarEtapaProjeto(projectId: string, description: string): Promise<ProjectStep | null> {
    try {
      // Get current highest order_index
      const { data: highestStep, error: queryError } = await supabase
        .from("project_steps")
        .select("order_index")
        .eq("project_id", projectId)
        .order("order_index", { ascending: false })
        .limit(1);

      const nextIndex = (highestStep && highestStep.length > 0 && highestStep[0].order_index !== null)
        ? highestStep[0].order_index + 1
        : 0;

      const { data: step, error } = await supabase
        .from("project_steps")
        .insert({
          project_id: projectId,
          description,
          done: false,
          order_index: nextIndex
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Recalculate project progress
      await this.recalculateProjectProgress(projectId);

      return step;
    } catch (error: any) {
      console.error("Error adding step:", error);
      toast({
        title: "Erro ao adicionar etapa",
        description: error.message || "Ocorreu um erro ao adicionar a etapa",
        variant: "destructive",
      });
      return null;
    }
  },

  async removerEtapaProjeto(stepId: string): Promise<boolean> {
    try {
      // Get project_id before deleting
      const { data: step, error: getError } = await supabase
        .from("project_steps")
        .select("project_id")
        .eq("id", stepId)
        .single();

      if (getError) {
        throw getError;
      }

      const projectId = step.project_id;

      // Delete the step
      const { error } = await supabase
        .from("project_steps")
        .delete()
        .eq("id", stepId);

      if (error) {
        throw error;
      }

      // Recalculate project progress
      await this.recalculateProjectProgress(projectId);

      return true;
    } catch (error: any) {
      console.error("Error removing step:", error);
      toast({
        title: "Erro ao remover etapa",
        description: error.message || "Ocorreu um erro ao remover a etapa",
        variant: "destructive",
      });
      return false;
    }
  },

  async removerProjeto(projectId: string): Promise<boolean> {
    try {
      // First, delete all steps for this project
      const { error: stepsError } = await supabase
        .from("project_steps")
        .delete()
        .eq("project_id", projectId);

      if (stepsError) {
        throw stepsError;
      }

      // Then delete the project
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error removing project:", error);
      toast({
        title: "Erro ao remover projeto",
        description: error.message || "Ocorreu um erro ao remover o projeto",
        variant: "destructive",
      });
      return false;
    }
  },

  async atualizarTagsProjeto(projectId: string, tags: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ tags })
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error updating project tags:", error);
      toast({
        title: "Erro ao atualizar tags",
        description: error.message || "Ocorreu um erro ao atualizar as tags do projeto",
        variant: "destructive",
      });
      return false;
    }
  },

  async recalculateProjectProgress(projectId: string): Promise<void> {
    try {
      // Get all steps for this project
      const { data: projectSteps, error: stepsError } = await supabase
        .from("project_steps")
        .select("*")
        .eq("project_id", projectId);

      if (stepsError) {
        throw stepsError;
      }

      // Calculate new progress
      const completedSteps = projectSteps?.filter(s => s.done).length || 0;
      const totalSteps = projectSteps?.length || 0;
      const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      // Update project progress
      const { error: updateError } = await supabase
        .from("projects")
        .update({ progress })
        .eq("id", projectId);

      if (updateError) {
        throw updateError;
      }
    } catch (error: any) {
      console.error("Error recalculating progress:", error);
    }
  }
};
