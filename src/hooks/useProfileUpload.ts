
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useProfileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadImage = async (file: File, type: 'avatar' | 'cover'): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }

    try {
      setUploading(true);

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive"
        });
        return null;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive"
        });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

      // Fazer upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL público
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Atualizar perfil no banco de dados
      const updateField = type === 'avatar' ? 'avatar_url' : 'cover_url';
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Sucesso",
        description: `${type === 'avatar' ? 'Foto de perfil' : 'Foto de capa'} atualizada com sucesso!`
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: `Erro ao fazer upload: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading
  };
};
