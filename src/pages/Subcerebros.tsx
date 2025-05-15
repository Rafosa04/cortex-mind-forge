
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Brain, Trash2, Edit, Link, LayoutGrid, Album, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { NeuralGraph } from "@/components/Subcerebros/NeuralGraph";
import { NovoSubcerebroForm } from "@/components/Subcerebros/NovoSubcerebroForm";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Subcerebros() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [isAthenaAnalyzing, setIsAthenaAnalyzing] = useState(false);
  const [athenaInsight, setAthenaInsight] = useState<string | null>(null);
  
  // Handle node click - show sidebar with details
  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setIsDetailsPanelOpen(true);
  };
  
  // Handle Athena analysis
  const handleAthenaAnalysis = () => {
    if (!selectedNode) return;
    
    setIsAthenaAnalyzing(true);
    
    // Mock delay for Athena "thinking"
    setTimeout(() => {
      setIsAthenaAnalyzing(false);
      
      // Generate mock insight based on node type
      let insight = "";
      
      if (selectedNode.type === "subcerebro") {
        insight = `Este subcérebro está conectado a ${selectedNode.connections.length} entidades. 
                  Observo que você tendeu a acessá-lo mais frequentemente em dias úteis, 
                  geralmente relacionado a atividades de ${selectedNode.tags[0]} e ${selectedNode.tags[1]}. 
                  Sugiro conectá-lo também ao nó de "Cronograma do Projeto" para aumentar sua produtividade nesta área.`;
      } else if (selectedNode.type === "projeto") {
        insight = `Este projeto está ativo há 5 dias e conectado a ${selectedNode.connections.length} outras entidades. 
                  Baseado no seu padrão de uso, você tende a trabalhar nele principalmente à tarde. 
                  Recomendo criar um hábito específico para avançar neste projeto diariamente e aumentar sua chance de conclusão em 40%.`;
      } else if (selectedNode.type === "habito") {
        insight = `Este hábito está conectado a ${selectedNode.connections.length} entidades no seu CÓRTEX. 
                  Sua consistência está em 87% nos últimos 10 dias. Continue assim! 
                  Percebo que este hábito está fortalecendo especialmente sua área de ${selectedNode.tags[0]}.`;
      } else {
        insight = `Esta entidade está conectada a ${selectedNode.connections.length} outros nós e 
                  parece ser parte importante do seu fluxo de pensamento sobre ${selectedNode.tags[0]}. 
                  Sugiro associá-la também ao subcérebro de Desenvolvimento Pessoal para maximizar seu impacto.`;
      }
      
      setAthenaInsight(insight);
      
      toast({
        title: "Análise da Athena completada",
        description: "Novos insights disponíveis.",
      });
    }, 2000);
  };
  
  // Close the Athena insight dialog
  const handleCloseInsight = () => {
    setAthenaInsight(null);
  };
  
  // Handle node removal
  const handleRemoveNode = () => {
    if (!selectedNode) return;
    
    toast({
      title: `${formatNodeType(selectedNode.type)} removido`,
      description: `${selectedNode.label} foi removido com sucesso.`,
    });
    
    setIsDetailsPanelOpen(false);
    setSelectedNode(null);
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Header Section with animations */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <Brain className="h-6 w-6" />
            Subcérebros
          </motion.h2>
          <Button 
            variant="secondary" 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-secondary/20 w-0 group-hover:w-full transition-all duration-500 ease-out"></span>
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Novo Subcérebro</span>
          </Button>
        </div>
        
        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" size={18} />
            <Input
              className="pl-10 border-card bg-background/30 focus:border-secondary"
              placeholder="Buscar em todos os subcérebros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full lg:w-48 border-card bg-background/30">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-card">
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="subcerebro">Subcérebros</SelectItem>
              <SelectItem value="projeto">Projetos</SelectItem>
              <SelectItem value="habito">Hábitos</SelectItem>
              <SelectItem value="favorito">Favoritos</SelectItem>
              <SelectItem value="pensamento">Pensamentos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-full lg:w-48 border-card bg-background/30">
              <SelectValue placeholder="Todas as áreas" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-card">
              <SelectItem value="all">Todas as áreas</SelectItem>
              <SelectItem value="pessoal">Pessoal</SelectItem>
              <SelectItem value="profissional">Profissional</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="criatividade">Criatividade</SelectItem>
              <SelectItem value="financas">Finanças</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm text-foreground/70 italic text-center bg-card/20 backdrop-blur-sm py-2 px-4 rounded-md border border-card/50"
        >
          <span className="block md:hidden">
            "Conecte, expanda, evolua."
          </span>
          <span className="hidden md:block">
            "Cada subcérebro é uma constelação da sua consciência digital. Conecte, expanda, evolua."
          </span>
        </motion.div>
      </motion.div>

      {/* Neural Graph Area with animated entry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="w-full min-h-[70vh] rounded-lg shadow-xl border border-card bg-background/30 backdrop-blur-sm overflow-hidden relative"
      >
        <NeuralGraph 
          onNodeClick={handleNodeClick} 
          searchQuery={searchQuery} 
          filterType={filterType} 
          filterArea={filterArea}
        />
        
        {/* Visual hint overlay - shows only on initial load */}
        <motion.div 
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="text-center bg-background/50 backdrop-blur-sm p-5 rounded-xl">
            <Brain size={48} className="mx-auto mb-3 text-primary opacity-80" />
            <p className="text-foreground/70">Interaja com os nós para visualizar detalhes</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Node Details Side Panel */}
      <AnimatePresence>
        {isDetailsPanelOpen && (
          <Sheet open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
            <SheetContent className="border-l border-card bg-background/95 backdrop-blur-md sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <span 
                    className="h-3 w-3 rounded-full" 
                    style={{ 
                      backgroundColor: selectedNode?.type ? getNodeColor(selectedNode.type) : undefined 
                    }}
                  ></span>
                  <span className="line-clamp-1">{selectedNode?.label || "Detalhes do Nó"}</span>
                </SheetTitle>
              </SheetHeader>
              
              {selectedNode && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Node Type */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${getNodeClass(selectedNode.type)}`}>
                      {getNodeIcon(selectedNode.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/70">Tipo</p>
                      <p className="text-base font-normal">{formatNodeType(selectedNode.type)}</p>
                    </div>
                  </div>
                  
                  {/* Metadata Tabs */}
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-2 bg-card/30">
                      <TabsTrigger value="info">Informações</TabsTrigger>
                      <TabsTrigger value="connections">Conexões</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="space-y-4">
                      {/* Tags */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground/70">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.tags?.map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-card/50">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dates */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground/70">Datas</p>
                        <div className="text-sm space-y-1 bg-card/20 p-2 rounded-md">
                          <p className="flex justify-between">
                            <span className="text-foreground/60">Criado em:</span> 
                            <span>{selectedNode.createdAt}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-foreground/60">Último acesso:</span>
                            <span>{selectedNode.lastAccess}</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Activity Score */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground/70">Relevância</p>
                        <div className="h-2 w-full bg-card/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedNode.relevancia || 5) * 10}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${getNodeBgClass(selectedNode.type)}`}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="connections" className="space-y-4">
                      <p className="text-sm font-medium text-foreground/70">Conexões</p>
                      <div className="grid gap-2 overflow-y-auto max-h-[300px]">
                        {selectedNode.connections?.map((conn: any, i: number) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-2 p-2 rounded-md bg-card/40 hover:bg-card/60 transition-colors cursor-pointer"
                            onClick={() => {
                              const clickedNode = {
                                id: conn.id,
                                label: conn.label,
                                type: conn.type
                              };
                              handleNodeClick(clickedNode);
                            }}
                          >
                            <span 
                              className="h-2 w-2 rounded-full" 
                              style={{ backgroundColor: getNodeColor(conn.type) }}
                            />
                            <span className="line-clamp-1">{conn.label}</span>
                            <span className="ml-auto text-xs text-foreground/50 capitalize">
                              {formatNodeType(conn.type)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {/* Actions */}
                  <div className="border-t border-border pt-4 flex flex-col gap-3">
                    <Button 
                      variant="default" 
                      className="w-full justify-start"
                      onClick={handleAthenaAnalysis}
                      disabled={isAthenaAnalyzing}
                    >
                      <Brain className="mr-2" size={16} />
                      {isAthenaAnalyzing ? "Analisando..." : "Analisar com Athena"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Link className="mr-2" size={16} />
                      Criar nova conexão
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="mr-2" size={16} />
                      Editar metadados
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={handleRemoveNode}
                    >
                      <Trash2 className="mr-2" size={16} />
                      Remover nó
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
      
      {/* Athena Insight Modal */}
      <Dialog open={!!athenaInsight} onOpenChange={handleCloseInsight}>
        <DialogContent className="bg-background/95 backdrop-blur-md border-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Brain size={18} className="text-primary" />
              Insight da Athena
            </DialogTitle>
          </DialogHeader>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-card/30 border border-card/50 rounded-lg p-4 text-foreground/90">
              {athenaInsight}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleCloseInsight}>Entendi</Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Create New Subcerebro Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-md border-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              Criar Novo Subcérebro
            </DialogTitle>
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
    pensamento: "Pensamento",
    athena: "Athena IA"
  };
  
  return types[type] || "Desconhecido";
}

function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    athena: "#9f7aea", // lilás
    subcerebro: "#993887", // roxo
    projeto: "#60B5B5", // azul
    habito: "#34D399", // verde
    favorito: "#FBBF24", // amarelo
    pensamento: "#D1D5DB" // cinza claro
  };
  
  return colors[type] || "#9CA3AF";
}

function getNodeClass(type: string): string {
  const classes: Record<string, string> = {
    athena: "bg-purple-500/20 text-purple-500",
    subcerebro: "bg-secondary/20 text-secondary",
    projeto: "bg-primary/20 text-primary",
    habito: "bg-green-500/20 text-green-500",
    favorito: "bg-yellow-500/20 text-yellow-500",
    pensamento: "bg-gray-400/20 text-gray-400"
  };
  
  return classes[type] || "bg-gray-500/20 text-gray-500";
}

function getNodeBgClass(type: string): string {
  const classes: Record<string, string> = {
    athena: "bg-purple-500",
    subcerebro: "bg-secondary",
    projeto: "bg-primary",
    habito: "bg-green-500",
    favorito: "bg-yellow-500",
    pensamento: "bg-gray-400"
  };
  
  return classes[type] || "bg-gray-500";
}

function getNodeIcon(type: string) {
  switch (type) {
    case 'athena':
      return <Brain size={20} />;
    case 'subcerebro':
      return <Brain size={20} />;
    case 'projeto':
      return <LayoutGrid size={20} />;
    case 'habito':
      return <Album size={20} />;
    case 'favorito':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    case 'pensamento':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      );
    default:
      return <div className="w-5 h-5 rounded-full bg-current"></div>;
  }
}
