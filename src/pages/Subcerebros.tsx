
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Brain, Trash2, Edit, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NeuralGraph } from "@/components/Subcerebros/NeuralGraph";
import { NovoSubcerebroForm } from "@/components/Subcerebros/NovoSubcerebroForm";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

export default function Subcerebros() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock function to handle node clicks
  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setIsDetailsPanelOpen(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-primary"
          >
            Subcérebros
          </motion.h2>
          <Button 
            variant="secondary" 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Subcérebro
          </Button>
        </div>
        
        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar em todos os subcérebros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <option value="all">Todos os tipos</option>
            <option value="subcerebro">Subcérebros</option>
            <option value="projeto">Projetos</option>
            <option value="habito">Hábitos</option>
            <option value="favorito">Favoritos</option>
            <option value="pensamento">Pensamentos</option>
          </Select>
          <Select defaultValue="all">
            <option value="all">Todas as áreas</option>
            <option value="pessoal">Pessoal</option>
            <option value="profissional">Profissional</option>
            <option value="saude">Saúde</option>
            <option value="criatividade">Criatividade</option>
          </Select>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-foreground/60 italic text-center"
        >
          "Cada subcérebro é uma constelação da sua consciência digital. Conecte, expanda, evolua."
        </motion.p>
      </motion.div>

      {/* Neural Graph Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full min-h-[60vh] rounded-lg shadow-xl border border-card bg-background/60 overflow-hidden relative"
      >
        <NeuralGraph onNodeClick={handleNodeClick} searchQuery={searchQuery} filterType={filterType} />
      </motion.div>

      {/* Node Details Side Panel */}
      <Sheet open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
        <SheetContent className="border-l border-card bg-background/95 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${getNodeColorClass(selectedNode?.type)}`}></span>
              {selectedNode?.label || "Detalhes do Nó"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {selectedNode && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/70">Tipo</p>
                  <p className="text-base font-normal">{formatNodeType(selectedNode.type)}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/70">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.tags?.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/70">Datas</p>
                  <div className="text-sm space-y-1">
                    <p>Criado em: {selectedNode.createdAt}</p>
                    <p>Último acesso: {selectedNode.lastAccess}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/70">Conexões</p>
                  <div className="text-sm space-y-2">
                    {selectedNode.connections?.map((conn: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-card/40">
                        <span className={`h-2 w-2 rounded-full ${getNodeColorClass(conn.type)}`}></span>
                        <span>{conn.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* Actions */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              <Button variant="default" className="w-full justify-start">
                <Brain className="mr-2" size={16} />
                Analisar com Athena
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Link className="mr-2" size={16} />
                Criar nova conexão
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="mr-2" size={16} />
                Editar metadados
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="mr-2" size={16} />
                Remover nó
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Create New Subcerebro Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-md border-card">
          <DialogHeader>
            <DialogTitle>Criar Novo Subcérebro</DialogTitle>
          </DialogHeader>
          <NovoSubcerebroForm onSubmit={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper functions
function formatNodeType(type: string): string {
  const types: Record<string, string> = {
    subcerebro: "Subcérebro",
    projeto: "Projeto",
    habito: "Hábito",
    favorito: "Favorito",
    pensamento: "Pensamento"
  };
  
  return types[type] || "Desconhecido";
}

function getNodeColorClass(type: string): string {
  const colors: Record<string, string> = {
    subcerebro: "bg-secondary",
    projeto: "bg-primary",
    habito: "bg-green-500",
    favorito: "bg-yellow-500",
    pensamento: "bg-gray-400"
  };
  
  return colors[type] || "bg-gray-500";
}
