
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { prompt, projectId, requestType = "step" } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch project details if projectId is provided
    let projectDetails = null;
    if (projectId) {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          steps:project_steps(*)
        `)
        .eq("id", projectId)
        .single();
      
      if (error) {
        console.error("Error fetching project:", error);
      } else {
        projectDetails = data;
      }
    }
    
    // Create system prompt based on request type
    let systemPrompt = "";
    if (requestType === "step") {
      systemPrompt = "Você é um assistente especializado em gerenciamento de projetos e produtividade. Sugira uma etapa clara, específica e acionável para o projeto descrito.";
      
      if (projectDetails) {
        systemPrompt += ` O projeto "${projectDetails.name}" já tem as seguintes etapas: ${
          projectDetails.steps.map(s => `"${s.description}"`).join(", ")
        }. Sugira uma próxima etapa que seja lógica e útil para o progresso do projeto.`;
      }
    } else if (requestType === "newProject") {
      systemPrompt = "Você é um assistente especializado em gerenciamento de projetos e produtividade. Baseado na solicitação do usuário, sugira um novo projeto com título, descrição e até 5 etapas iniciais. Formate sua resposta em JSON com os campos: name, description, category, tags (array), steps (array de strings).";
    }
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Error calling OpenAI API");
    }
    
    const result = data.choices[0].message.content;
    
    // Save the interaction in athena_logs
    const { error: logError } = await supabase
      .from("athena_logs")
      .insert({
        prompt,
        response: result,
        context_type: projectId ? "projeto" : "geral",
        context_id: projectId || null,
      });
    
    if (logError) {
      console.error("Error saving Athena log:", logError);
    }
    
    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-project-steps function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
