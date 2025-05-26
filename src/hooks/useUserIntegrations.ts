
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserIntegration {
  id: string;
  user_id: string;
  service_name: string;
  is_connected: boolean;
  permissions?: any;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export const useUserIntegrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<UserIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadIntegrations();
    }
  }, [user?.id]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user?.id)
        .order('service_name');

      if (error) throw error;

      if (data && data.length > 0) {
        setIntegrations(data);
      } else {
        // Criar integrações padrão se não existirem
        await createDefaultIntegrations();
      }
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as integrações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultIntegrations = async () => {
    const defaultServices = [
      'Spotify', 'YouTube', 'Google Agenda', 'Alexa', 'RSS/Podcasts'
    ];

    try {
      const integrationData = defaultServices.map(service => ({
        user_id: user?.id!,
        service_name: service,
        is_connected: false
      }));

      const { data, error } = await supabase
        .from('user_integrations')
        .insert(integrationData)
        .select();

      if (error) throw error;
      if (data) setIntegrations(data);
    } catch (error) {
      console.error('Erro ao criar integrações padrão:', error);
    }
  };

  const toggleConnection = async (integrationId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from('user_integrations')
        .update({ 
          is_connected: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', integrationId);

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, is_connected: newStatus }
            : integration
        )
      );

      const integration = integrations.find(i => i.id === integrationId);
      toast({
        title: newStatus ? "Conectado" : "Desconectado",
        description: `${integration?.service_name} ${newStatus ? 'conectado' : 'desconectado'} com sucesso!`
      });
    } catch (error) {
      console.error('Erro ao alterar conexão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a conexão",
        variant: "destructive"
      });
    }
  };

  const updatePermissions = async (integrationId: string, permissions: any) => {
    try {
      const { error } = await supabase
        .from('user_integrations')
        .update({ 
          permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', integrationId);

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, permissions }
            : integration
        )
      );

      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as permissões",
        variant: "destructive"
      });
    }
  };

  return {
    integrations,
    loading,
    toggleConnection,
    updatePermissions,
    refreshIntegrations: loadIntegrations
  };
};
