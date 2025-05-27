
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

      // Validar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive"
        });
        return null;
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

      console.log('Iniciando upload do arquivo:', fileName);

      // Remover arquivo anterior se existir
      const { data: existingFiles } = await supabase.storage
        .from('profiles')
        .list(user.id, {
          search: `${type}-`
        });

      if (existingFiles && existingFiles.length > 0) {
        for (const existingFile of existingFiles) {
          await supabase.storage
            .from('profiles')
            .remove([`${user.id}/${existingFile.name}`]);
        }
      }

      // Fazer upload do novo arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('Upload realizado com sucesso:', uploadData);

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('URL pública gerada:', publicUrl);

      // Atualizar perfil no banco de dados
      const updateField = type === 'avatar' ? 'avatar_url' : 'cover_url';
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }

      console.log('Perfil atualizado com sucesso');

      toast({
        title: "Sucesso",
        description: `${type === 'avatar' ? 'Foto de perfil' : 'Foto de capa'} atualizada com sucesso!`
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Erro completo no upload:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro desconhecido ao fazer upload",
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
