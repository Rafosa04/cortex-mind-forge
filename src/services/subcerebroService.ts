
import { supabase } from '@/integrations/supabase/client';

// Buscar projetos, hábitos e outras entidades para criar conexões
export const getConnectableEntities = async (userId: string) => {
  try {
    console.log('Buscando entidades conectáveis para o usuário:', userId);

    // Buscar projetos
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name, category, tags, status')
      .eq('user_id', userId)
      .limit(50);

    // Buscar hábitos
    const { data: habits } = await supabase
      .from('habits')
      .select('id, name, tags, frequency')
      .eq('user_id', userId)
      .limit(50);

    // Buscar favoritos
    const { data: favorites } = await supabase
      .from('favorites')
      .select('id, title, type, tags')
      .eq('user_id', userId)
      .limit(50);

    // Buscar itens salvos
    const { data: savedItems } = await supabase
      .from('saved_items')
      .select('id, title, type, tags')
      .eq('user_id', userId)
      .limit(50);

    return {
      projects: projects || [],
      habits: habits || [],
      favorites: favorites || [],
      savedItems: savedItems || []
    };
  } catch (error) {
    console.error('Erro ao buscar entidades conectáveis:', error);
    return {
      projects: [],
      habits: [],
      favorites: [],
      savedItems: []
    };
  }
};

// Sugerir conexões automáticas baseadas em tags e áreas
export const suggestConnections = async (
  subcerebroId: string,
  subcerebroTags: string[],
  subcerebroArea?: string
) => {
  try {
    console.log('Sugerindo conexões para subcérebro:', subcerebroId, subcerebroTags, subcerebroArea);

    const suggestions = [];

    // Buscar projetos com tags similares
    if (subcerebroTags.length > 0) {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, tags, category')
        .overlaps('tags', subcerebroTags)
        .limit(10);

      if (projects) {
        suggestions.push(...projects.map(p => ({
          id: p.id,
          name: p.name,
          type: 'projeto',
          reason: `Tags em comum: ${subcerebroTags.filter(tag => p.tags?.includes(tag)).join(', ')}`
        })));
      }
    }

    // Buscar hábitos com tags similares
    if (subcerebroTags.length > 0) {
      const { data: habits } = await supabase
        .from('habits')
        .select('id, name, tags')
        .overlaps('tags', subcerebroTags)
        .limit(10);

      if (habits) {
        suggestions.push(...habits.map(h => ({
          id: h.id,
          name: h.name,
          type: 'habito',
          reason: `Tags em comum: ${subcerebroTags.filter(tag => h.tags?.includes(tag)).join(', ')}`
        })));
      }
    }

    return suggestions;
  } catch (error) {
    console.error('Erro ao sugerir conexões:', error);
    return [];
  }
};
