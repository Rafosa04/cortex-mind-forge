
import { supabase } from '@/integrations/supabase/client';

export interface SavedItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  source?: string;
  source_type?: string;
  type: string;
  url?: string;
  thumbnail?: string;
  tags?: string[];
  status?: string;
  athena_insight?: string;
  saved_at: string;
  last_accessed?: string;
  created_at: string;
  updated_at: string;
}

export interface AthenaHighlight {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  action?: string;
  created_at: string;
  dismissed: boolean;
}

export interface AthenaReactivationSuggestion {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  action_question?: string;
  thumbnail?: string;
  content_type?: string;
  related_item_id?: string;
  created_at: string;
  dismissed: boolean;
}

export const savedItemsService = {
  async getSavedItems() {
    const { data, error } = await supabase
      .from('saved_items')
      .select('*')
      .order('saved_at', { ascending: false });

    if (error) throw error;
    return data as SavedItem[];
  },

  async createSavedItem(item: Omit<SavedItem, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'saved_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_items')
      .insert([{ ...item, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data as SavedItem;
  },

  async updateSavedItem(id: string, updates: Partial<SavedItem>) {
    const { data, error } = await supabase
      .from('saved_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SavedItem;
  },

  async deleteSavedItem(id: string) {
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateLastAccessed(id: string) {
    const { error } = await supabase
      .from('saved_items')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async getAthenaHighlights() {
    const { data, error } = await supabase
      .from('athena_highlights')
      .select('*')
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;
    return data as AthenaHighlight[];
  },

  async getReactivationSuggestions() {
    const { data, error } = await supabase
      .from('athena_reactivation_suggestions')
      .select('*')
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    return data as AthenaReactivationSuggestion[];
  },

  async dismissHighlight(id: string) {
    const { error } = await supabase
      .from('athena_highlights')
      .update({ dismissed: true })
      .eq('id', id);

    if (error) throw error;
  },

  async dismissReactivationSuggestion(id: string) {
    const { error } = await supabase
      .from('athena_reactivation_suggestions')
      .update({ dismissed: true })
      .eq('id', id);

    if (error) throw error;
  }
};
