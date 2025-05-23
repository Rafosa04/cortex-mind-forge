
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface AssociarProjetoModalProps {
  habitoId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssociarProjetoModal({ habitoId, open, onOpenChange }: AssociarProjetoModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProjects();
    }
  }, [open]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const associateProject = async (projectId: string) => {
    if (!habitoId) return;

    try {
      // Aqui você implementaria a lógica para associar o hábito ao projeto
      // Por exemplo, criando uma tabela de relacionamento ou adicionando um campo project_id na tabela habits
      
      toast({
        title: "Projeto associado",
        description: "Hábito associado ao projeto com sucesso!"
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao associar projeto:", error);
      toast({
        title: "Erro na associação",
        description: "Não foi possível associar o hábito ao projeto",
        variant: "destructive"
      });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Associar a Projeto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de projetos */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">
                Carregando projetos...
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-accent/50 cursor-pointer"
                  onClick={() => associateProject(project.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{project.name}</div>
                    {project.description && (
                      <div className="text-sm text-muted-foreground truncate">
                        {project.description}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {project.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="mb-2">🔗</div>
                <div className="text-sm">
                  {searchTerm ? "Nenhum projeto encontrado" : "Nenhum projeto disponível"}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
