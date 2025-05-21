
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

/**
 * Salva o log de uma interação com a Athena no Supabase
 * @param prompt - A pergunta ou comando enviado pelo usuário
 * @param response - A resposta gerada pela Athena
 * @param contextType - O tipo de contexto da interação (ex: "projeto", "hábito", "geral")
 * @param contextId - O ID do contexto relacionado (opcional)
 * @returns Promise com o resultado da operação
 */
export const saveAthenaLog = async (
  prompt: string,
  response: string,
  contextType: string = "geral",
  contextId?: string,
  isFavorite: boolean = false
) => {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado ao salvar log da Athena");
      return { error: "Usuário não autenticado" };
    }
    
    // Inserir o log na tabela athena_logs
    const { data, error } = await supabase
      .from("athena_logs")
      .insert({
        user_id: user.id,
        prompt,
        response,
        context_type: contextType,
        context_id: contextId,
        is_favorite: isFavorite
      });
      
    if (error) {
      console.error("Erro ao salvar log da Athena:", error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error("Erro ao salvar log da Athena:", error);
    return { error };
  }
};

/**
 * Hook para buscar histórico de interações com a Athena
 */
export const useAthenaHistory = () => {
  const { user } = useAuth();
  
  const fetchHistory = async () => {
    if (!user) {
      toast({
        title: "Não autorizado",
        description: "Você precisa estar logado para ver o histórico.",
        variant: "destructive"
      });
      return { data: null, error: "Usuário não autenticado" };
    }
    
    const { data, error } = await supabase
      .from("athena_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
      
    if (error) {
      toast({
        title: "Erro ao buscar histórico",
        description: "Não foi possível carregar seu histórico de conversas.",
        variant: "destructive"
      });
      return { data: null, error };
    }
    
    return { data, error: null };
  };
  
  /**
   * Alternar favorito em uma interação com Athena
   */
  const toggleFavorite = async (logId: string, currentIsFavorite: boolean) => {
    if (!user) {
      toast({
        title: "Não autorizado",
        description: "Você precisa estar logado para favoritar conversas.",
        variant: "destructive"
      });
      return { error: "Usuário não autenticado" };
    }
    
    const { data, error } = await supabase
      .from("athena_logs")
      .update({ is_favorite: !currentIsFavorite })
      .eq("id", logId)
      .eq("user_id", user.id)
      .select();
      
    if (error) {
      toast({
        title: "Erro ao alterar favorito",
        description: "Não foi possível atualizar o status de favorito.",
        variant: "destructive"
      });
      return { error };
    }
    
    return { data };
  };
  
  return { fetchHistory, toggleFavorite };
};

/**
 * Buscar detalhes de uma conversa específica com Athena pelo ID
 */
export const fetchAthenaConversation = async (conversationId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Usuário não autenticado" };
    }
    
    const { data, error } = await supabase
      .from("athena_logs")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();
      
    if (error) {
      console.error("Erro ao buscar conversa:", error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error("Erro ao buscar conversa:", error);
    return { error };
  }
};

/**
 * Buscar conversas relacionadas a um projeto ou hábito específico
 */
export const fetchContextConversations = async (contextType: string, contextId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Usuário não autenticado" };
    }
    
    const { data, error } = await supabase
      .from("athena_logs")
      .select("*")
      .eq("context_type", contextType)
      .eq("context_id", contextId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
      
    if (error) {
      console.error("Erro ao buscar conversas de contexto:", error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error("Erro ao buscar conversas de contexto:", error);
    return { error };
  }
};

/**
 * Criar um novo projeto a partir da conversa com Athena
 */
export const createProjectFromAthena = async (
  name: string,
  description: string,
  category: string | null = null,
  steps: string[] = [],
  tags: string[] = []
) => {
  try {
    // Get user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Usuário não autenticado" };
    }
    
    // Create project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        category,
        user_id: user.id,
        tags,
        status: "ativo",
      })
      .select()
      .single();
      
    if (projectError) {
      console.error("Erro ao criar projeto:", projectError);
      return { error: projectError };
    }
    
    // Create steps if provided
    if (steps.length > 0) {
      const stepsToInsert = steps.map((step, index) => ({
        project_id: project.id,
        description: step,
        done: false,
        order_index: index
      }));
      
      const { error: stepsError } = await supabase
        .from("project_steps")
        .insert(stepsToInsert);
        
      if (stepsError) {
        console.error("Erro ao criar etapas:", stepsError);
        return { error: stepsError };
      }
    }
    
    // Log the creation
    await saveAthenaLog(
      `Criar projeto "${name}" com descrição "${description}"`,
      `Projeto criado com sucesso. ID: ${project.id}`,
      "projeto",
      project.id
    );
    
    return { data: project };
  } catch (error) {
    console.error("Erro ao criar projeto da Athena:", error);
    return { error };
  }
};

/**
 * Adicionar etapas a um projeto existente a partir da conversa com Athena
 */
export const addStepsToProjectFromAthena = async (
  projectId: string,
  steps: string[]
) => {
  try {
    // Get user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Usuário não autenticado" };
    }
    
    // Verificar se o projeto pertence ao usuário
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();
      
    if (projectError || !project) {
      console.error("Erro ao verificar projeto:", projectError);
      return { error: projectError || "Projeto não encontrado" };
    }
    
    // Get current max order_index
    const { data: maxOrderStep, error: maxOrderError } = await supabase
      .from("project_steps")
      .select("order_index")
      .eq("project_id", projectId)
      .order("order_index", { ascending: false })
      .limit(1);
      
    const startIndex = maxOrderStep && maxOrderStep.length > 0 && maxOrderStep[0].order_index !== null
      ? maxOrderStep[0].order_index + 1
      : 0;
    
    // Create steps
    if (steps.length > 0) {
      const stepsToInsert = steps.map((step, index) => ({
        project_id: projectId,
        description: step,
        done: false,
        order_index: startIndex + index
      }));
      
      const { error: stepsError } = await supabase
        .from("project_steps")
        .insert(stepsToInsert);
        
      if (stepsError) {
        console.error("Erro ao criar etapas:", stepsError);
        return { error: stepsError };
      }
    }
    
    // Log the action
    await saveAthenaLog(
      `Adicionar etapas ao projeto "${project.name}": ${steps.join(", ")}`,
      `Etapas adicionadas com sucesso ao projeto "${project.name}"`,
      "projeto",
      projectId
    );
    
    // Recalculate progress
    await recalculateProjectProgress(projectId);
    
    return { data: { success: true } };
  } catch (error) {
    console.error("Erro ao adicionar etapas ao projeto:", error);
    return { error };
  }
};

/**
 * Recalcular o progresso de um projeto
 */
const recalculateProjectProgress = async (projectId: string) => {
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
  } catch (error) {
    console.error("Error recalculating progress:", error);
  }
};
