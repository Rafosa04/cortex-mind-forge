
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { saveAthenaLog } from '@/utils/athenaUtils';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  projectName?: string;
  projectDescription?: string;
  onSuggestionReceived?: () => void;
}

export function AthenaProjectSuggestion({ 
  open, 
  onOpenChange,
  projectId,
  projectName,
  projectDescription,
  onSuggestionReceived
}: Props) {
  const [prompt, setPrompt] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  
  // Pre-fill prompt with project context if available
  React.useEffect(() => {
    if (projectId && projectName) {
      const defaultPrompt = projectDescription 
        ? `Analisando o projeto "${projectName}" com descrição "${projectDescription}", sugira a próxima etapa estratégica.`
        : `Analisando o projeto "${projectName}", sugira a próxima etapa estratégica.`;
      
      setPrompt(defaultPrompt);
    } else {
      setPrompt('Sugira um novo projeto baseado em minhas necessidades:');
    }
  }, [projectId, projectName, projectDescription]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt vazio',
        description: 'Por favor, forneça uma descrição da sua solicitação.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Log the interaction for Athena
      await saveAthenaLog(
        prompt,
        "Solicitação enviada para processamento. Acesse o assistente Athena para ver a resposta completa.",
        projectId ? "projeto" : "geral",
        projectId
      );
      
      toast({
        title: 'Solicitação enviada',
        description: 'A Athena está processando sua solicitação. Acesse o chat para ver a resposta.',
      });
      
      // Close dialog
      onOpenChange(false);
      
      // If callback provided, call it
      if (onSuggestionReceived) {
        onSuggestionReceived();
      }
      
      // Navigate to Athena with context
      if (projectId) {
        navigate(`/athena?project=${projectId}&type=etapa`);
      } else {
        navigate('/athena?type=novo_projeto');
      }
    } catch (error) {
      console.error("Error sending Athena request:", error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar sua solicitação para a Athena.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#141429] border-[#60B5B5]/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Bot className="h-5 w-5 text-[#993887]" /> Solicitar à Athena
          </DialogTitle>
          <DialogDescription>
            {projectId 
              ? "Envie um prompt para Athena sugerir a próxima etapa para seu projeto" 
              : "Envie um prompt para Athena criar ou sugerir um novo projeto"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="prompt" className="text-sm text-primary">
              Prompt para a Athena
            </label>
            <textarea
              id="prompt"
              rows={5}
              className="w-full p-2 bg-[#191933]/80 border border-[#993887]/40 rounded-md focus:outline-none focus:ring-1 focus:ring-[#60B5B5] text-foreground"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva o que você precisa..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            disabled={isSubmitting || !prompt.trim()}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#993887] to-[#60B5B5] text-white"
          >
            {isSubmitting ? "Enviando..." : "Enviar para Athena"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
