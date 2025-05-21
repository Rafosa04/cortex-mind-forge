
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
  content?: string | null;
  is_favorite?: boolean | null;
  tags?: string[] | null;
};

export type ProjectStep = {
  id: string;
  project_id: string;
  description: string;
  done: boolean | null;
  order_index: number | null;
  created_at: string;
};

export type ProjectWithSteps = Project & {
  steps: ProjectStep[];
};

export type ProjectUpdateData = {
  name?: string;
  description?: string;
  category?: string;
  deadline?: string;
  status?: "ativo" | "pausado" | "concluído";
  content?: string;
  is_favorite?: boolean;
  tags?: string[];
};

export const projectsService = {
  async getProjetosComEtapas(): Promise<ProjectWithSteps[]> {
    try {
      // Fetch projects for the current user
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
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
          status: (project.status as "ativo" | "pausado" | "concluído") || "ativo"
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

  async getAllCategorias(): Promise<string[]> {
    try {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("category")
        .not("category", "is", null);

      if (error) {
        throw error;
      }

      // Extract unique categories
      const categorias = [...new Set(projects.map(p => p.category).filter(Boolean))];
      return categorias as string[];
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async criarProjetoComEtapas(
    name: string,
    description: string,
    category: string | null = null,
    status: "ativo" | "pausado" | "concluído" = "ativo",
    deadline: string | null = null,
    etapas: { texto: string; feita: boolean }[] = []
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
          user_id: user.id // Add the user_id here
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
        const progress = Math.round((completedSteps / etapas.length) * 100);

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
          status: (project.status as "ativo" | "pausado" | "concluído") 
        } as ProjectWithSteps;
      }

      return {
        ...project,
        steps: [],
        progress: 0,
        status: (project.status as "ativo" | "pausado" | "concluído") 
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

  async atualizarProjeto(
    projectId: string, 
    data: ProjectUpdateData
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        title: "Erro ao atualizar projeto",
        description: error.message || "Ocorreu um erro ao atualizar o projeto",
        variant: "destructive",
      });
      return false;
    }
  },

  async atualizarEtapa(stepId: string, done: boolean): Promise<boolean> {
    try {
      const { data: step, error: stepError } = await supabase
        .from("project_steps")
        .update({ done })
        .eq("id", stepId)
        .select()
        .single();

      if (stepError) {
        throw stepError;
      }

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
      const { error } = await supabase
        .from("projects")
        .update({ status })
        .eq("id", projectId);

      if (error) {
        throw error;
      }

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
  },
  
  async getProjetoComFiltros(
    filtros: {
      search?: string;
      status?: string | null;
      tag?: string | null;
      dateFrom?: Date | null;
      dateTo?: Date | null;
    }
  ): Promise<ProjectWithSteps[]> {
    try {
      // Start with a basic query
      let query = supabase
        .from("projects")
        .select("*");

      // Apply filters
      if (filtros.status) {
        query = query.eq("status", filtros.status);
      }

      if (filtros.tag) {
        query = query.eq("category", filtros.tag);
      }
      
      if (filtros.search) {
        query = query.or(`name.ilike.%${filtros.search}%,description.ilike.%${filtros.search}%,category.ilike.%${filtros.search}%`);
      }

      if (filtros.dateFrom) {
        query = query.gte("created_at", filtros.dateFrom.toISOString());
      }

      if (filtros.dateTo) {
        // Add 1 day to include the end date
        const endDate = new Date(filtros.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt("created_at", endDate.toISOString());
      }

      // Execute the query
      const { data: projects, error } = await query.order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      // Fetch steps for filtered projects
      const projectIds = projects.map(project => project.id);
      const { data: steps, error: stepsError } = await supabase
        .from("project_steps")
        .select("*")
        .in("project_id", projectIds)
        .order("order_index", { ascending: true });

      if (stepsError) {
        throw stepsError;
      }

      // Build the final result
      const result = projects.map(project => {
        const projectSteps = steps?.filter(step => step.project_id === project.id) || [];
        
        // Calculate progress if needed
        let progress = project.progress || 0;
        if (projectSteps.length > 0) {
          const completedSteps = projectSteps.filter(step => step.done).length;
          progress = Math.round((completedSteps / projectSteps.length) * 100);
        }

        return {
          ...project,
          steps: projectSteps,
          progress,
          status: (project.status as "ativo" | "pausado" | "concluído") || "ativo"
        } as ProjectWithSteps;
      });

      return result;
    } catch (error: any) {
      console.error("Error fetching filtered projects:", error);
      toast({
        title: "Erro ao carregar projetos filtrados",
        description: error.message || "Ocorreu um erro ao aplicar os filtros",
        variant: "destructive",
      });
      return [];
    }
  }
};
