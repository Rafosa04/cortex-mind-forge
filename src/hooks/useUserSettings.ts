
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserSettings {
  id?: string;
  user_id?: string;
  
  // Configurações visuais
  theme: string;
  display_mode: string;
  typography: string;
  animation_speed: string;
  athena_avatar: string;
  custom_primary_color?: string;
  custom_secondary_color?: string;
  
  // Configurações da IA Athena
  interaction_level: string;
  ai_style: string;
  interventions: string;
  memory_access: string;
  ai_language: string;
  
  // Configurações de notificações
  notif_messages: boolean;
  notif_ai_suggestions: boolean;
  notif_new_connections: boolean;
  notif_habit_progress: boolean;
  notif_weekly_report: boolean;
  
  // Canais de notificação
  channel_app: boolean;
  channel_email: boolean;
  channel_push: boolean;
  notification_frequency: string;
  
  // Configurações de privacidade
  profile_visibility: string;
  subbrain_sharing: boolean;
  
  // Configurações de performance
  economy_mode: boolean;
  offline_mode: boolean;
  auto_save: boolean;
  visual_compression: boolean;
  
  // Recursos do laboratório
  lab_neuronal_feed: boolean;
  lab_collaborative_subbrains: boolean;
  lab_voice_generation: boolean;
  lab_immersive_mode: boolean;
}

const defaultSettings: Omit<UserSettings, 'id' | 'user_id'> = {
  theme: 'dark',
  display_mode: 'minimalista',
  typography: 'moderna',
  animation_speed: 'fluida',
  athena_avatar: 'ativado',
  interaction_level: 'media',
  ai_style: 'neutra',
  interventions: 'somente-contexto',
  memory_access: 'permitir',
  ai_language: 'português',
  notif_messages: true,
  notif_ai_suggestions: true,
  notif_new_connections: true,
  notif_habit_progress: true,
  notif_weekly_report: true,
  channel_app: true,
  channel_email: false,
  channel_push: true,
  notification_frequency: 'imediato',
  profile_visibility: 'privado',
  subbrain_sharing: false,
  economy_mode: false,
  offline_mode: false,
  auto_save: true,
  visual_compression: false,
  lab_neuronal_feed: false,
  lab_collaborative_subbrains: false,
  lab_voice_generation: false,
  lab_immersive_mode: false,
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        // Criar configurações padrão se não existirem
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: user?.id,
          ...defaultSettings
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Erro ao criar configurações padrão:', error);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...updates }));
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_settings')
        .update(defaultSettings)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...defaultSettings }));
      
      toast({
        title: "Sucesso",
        description: "Configurações restauradas para o padrão!"
      });
    } catch (error) {
      console.error('Erro ao restaurar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível restaurar as configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const clearCache = async () => {
    try {
      // Limpar localStorage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('cortex_') || key.includes('cache')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Limpar sessionStorage
      const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
        key.startsWith('cortex_') || key.includes('cache')
      );
      
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      toast({
        title: "Sucesso",
        description: "Cache local limpo com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast({
        title: "Erro",
        description: "Não foi possível limpar o cache",
        variant: "destructive"
      });
    }
  };

  return {
    settings,
    loading,
    saving,
    updateSettings,
    resetToDefaults,
    clearCache
  };
};
