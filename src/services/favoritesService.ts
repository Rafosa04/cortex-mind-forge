
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];
export type FavoriteUpdate = Database['public']['Tables']['favorites']['Update'];

export const favoritesService = {
  async getFavorites(): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }

    return data || [];
  },

  async createFavorite(favorite: Omit<FavoriteInsert, 'user_id'>): Promise<Favorite> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        ...favorite,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating favorite:', error);
      throw error;
    }

    return data;
  },

  async updateFavorite(id: string, updates: Partial<FavoriteUpdate>): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating favorite:', error);
      throw error;
    }

    return data;
  },

  async deleteFavorite(id: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    }
  },

  async getFavoritesByType(type: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites by type:', error);
      throw error;
    }

    return data || [];
  },
};
