
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
  contextId?: string
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
        context_id: contextId
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
  
  return { fetchHistory };
};
