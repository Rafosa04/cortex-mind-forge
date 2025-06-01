
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProjectData {
  project_id: string;
  project_name: string;
  project_description: string;
  project_tags: string[];
  project_steps: Array<{ name: string; status: string }>;
  project_progress: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get user from JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const projectData: ProjectData = await req.json();

    // Fetch related entities from the database
    const [diaryEntries, habits, savedItems, subcerebros] = await Promise.all([
      fetchDiaryEntries(supabaseClient, user.id, projectData.project_tags),
      fetchHabits(supabaseClient, user.id, projectData.project_tags),
      fetchSavedItems(supabaseClient, user.id, projectData.project_tags),
      fetchSubcerebros(supabaseClient, user.id, projectData.project_tags),
    ]);

    // Generate insights using a simple rule-based system
    // In a real implementation, you would call an LLM API here
    const insights = generateInsights(projectData, {
      diary_entries: diaryEntries,
      habits: habits,
      saved_items: savedItems,
      subcerebros: subcerebros,
      connecta_posts: []
    });

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-project-insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchDiaryEntries(supabase: any, userId: string, tags: string[]) {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('id, title, content, created_at, emotion')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching diary entries:', error);
    return [];
  }

  return data.map((entry: any) => ({
    id: entry.id,
    title: entry.title || `Diário de ${new Date(entry.created_at).toLocaleDateString('pt-BR')}`,
    summary: entry.content?.substring(0, 100) + '...' || 'Sem conteúdo',
    action_label: 'Ver Diário',
    type: 'diary_entry',
    created_at: entry.created_at
  }));
}

async function fetchHabits(supabase: any, userId: string, tags: string[]) {
  const { data, error } = await supabase
    .from('habits')
    .select('id, name, description, streak, progress, tags, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }

  return data.map((habit: any) => ({
    id: habit.id,
    title: habit.name,
    summary: `${habit.streak} dias de streak • ${habit.progress}% de progresso`,
    action_label: 'Ver Hábito',
    type: 'habit',
    created_at: habit.created_at
  }));
}

async function fetchSavedItems(supabase: any, userId: string, tags: string[]) {
  const { data, error } = await supabase
    .from('saved_items')
    .select('id, title, description, type, tags, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching saved items:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    summary: item.description?.substring(0, 100) + '...' || 'Sem descrição',
    action_label: 'Ver Item',
    type: 'saved_item',
    created_at: item.created_at
  }));
}

async function fetchSubcerebros(supabase: any, userId: string, tags: string[]) {
  const { data, error } = await supabase
    .from('subcerebros')
    .select('id, nome, descricao, area, tags, relevancia, created_at')
    .eq('user_id', userId)
    .order('relevancia', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching subcerebros:', error);
    return [];
  }

  return data.map((sub: any) => ({
    id: sub.id,
    title: sub.nome,
    summary: `${sub.area || 'Área indefinida'} • Relevância: ${sub.relevancia}/10`,
    action_label: 'Ver Subcérebro',
    type: 'subcerebro',
    created_at: sub.created_at
  }));
}

function generateInsights(projectData: ProjectData, relatedEntities: any) {
  const insights: any = {
    insights_summary: generateInsightsSummary(projectData, relatedEntities),
    suggestions: generateSuggestions(projectData, relatedEntities),
    related_entities_display: relatedEntities
  };

  return insights;
}

function generateInsightsSummary(projectData: ProjectData, relatedEntities: any): string {
  const totalConnections = 
    relatedEntities.diary_entries.length +
    relatedEntities.habits.length +
    relatedEntities.saved_items.length +
    relatedEntities.subcerebros.length;

  if (totalConnections === 0) {
    return `Analisando "${projectData.project_name}", identifico oportunidades para criar conexões mais profundas com seu ecossistema CÓRTEX. Este projeto pode se beneficiar de hábitos de apoio, reflexões no diário e organização em subcérebros relevantes.`;
  }

  const progressText = projectData.project_progress < 30 ? 'inicial' : 
                      projectData.project_progress < 70 ? 'em desenvolvimento' : 'avançado';

  return `Com base na análise de "${projectData.project_name}" (${progressText}), encontrei ${totalConnections} conexões potenciais em seu CÓRTEX. Essas sinergias podem acelerar seu progresso e criar uma rede de conhecimento mais robusta.`;
}

function generateSuggestions(projectData: ProjectData, relatedEntities: any) {
  const suggestions: any[] = [];

  // Suggest creating a habit if progress is low
  if (projectData.project_progress < 30) {
    suggestions.push({
      type: 'creation',
      entity_type: 'habit',
      entity_id: null,
      title: 'Criar Hábito de Progresso',
      description: `Para acelerar "${projectData.project_name}", considere criar um hábito diário relacionado ao projeto.`,
      action_label: 'Criar Hábito',
      action_payload: { type: 'habit', prefill_name: `Trabalhar em ${projectData.project_name}` },
      relevance_score: 'high'
    });
  }

  // Suggest diary reflection if there are many steps
  if (projectData.project_steps.length > 5) {
    suggestions.push({
      type: 'creation',
      entity_type: 'diary_entry',
      entity_id: null,
      title: 'Reflexão sobre Progresso',
      description: 'Com várias etapas em andamento, uma reflexão no diário pode ajudar a clarificar próximos passos.',
      action_label: 'Escrever Reflexão',
      action_payload: { type: 'diary', prefill_title: `Reflexão sobre ${projectData.project_name}` },
      relevance_score: 'medium'
    });
  }

  // Suggest connecting to existing subcerebro
  if (relatedEntities.subcerebros.length > 0) {
    const topSubcerebro = relatedEntities.subcerebros[0];
    suggestions.push({
      type: 'connection',
      entity_type: 'subcerebro',
      entity_id: topSubcerebro.id,
      title: `Conectar ao Subcérebro "${topSubcerebro.title}"`,
      description: 'Este projeto tem afinidade temática com um dos seus subcérebros existentes.',
      action_label: 'Ver Conexão',
      action_payload: { id: topSubcerebro.id },
      relevance_score: 'high'
    });
  }

  return suggestions;
}
