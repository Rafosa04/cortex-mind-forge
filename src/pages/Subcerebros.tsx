import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Brain, Link, X, Edit, Trash2, Target, BarChart3, Focus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
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
import { NeuralGraph } from "@/components/Subcerebros/NeuralGraph";
import { SubcerebroCreationForm } from "@/components/Subcerebros/SubcerebroCreationForm";
import { timeAgo } from "@/lib/utils";

export default function Subcerebros() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [viewMode, setViewMode] = useState<'default' | 'progress' | 'focus'>('default');
  const [focusNodeId, setFocusNodeId] = useState<string>('');
  const [isAthenaAnalyzing, setIsAthenaAnalyzing] = useState(false);
  const [athenaInsight, setAthenaInsight] = useState<string | null>(null);
  
  // Handle node click - show sidebar with details
  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setIsDetailsPanelOpen(true);
  };

  // Handle view mode changes
  const handleViewModeChange = (mode: 'default' | 'progress' | 'focus') => {
    setViewMode(mode);
    if (mode !== 'focus') {
      setFocusNodeId('');
    }
  };

  // Handle focus on specific node
  const handleFocusNode = (nodeId: string) => {
    setViewMode('focus');
    setFocusNodeId(nodeId);
  };
  
  // Handle Athena analysis with enhanced insights
  const handleAthenaAnalysis = () => {
    if (!selectedNode) return;
    
    setIsAthenaAnalyzing(true);
    
    // Enhanced mock delay for Athena "thinking"
    setTimeout(() => {
      setIsAthenaAnalyzing(false);
      
      // Generate enhanced insight based on node type and connections
      let insight = "";
      const connectionCount = selectedNode.connections?.length || 0;
      const relevance = selectedNode.relevancia || 5;
      
      if (selectedNode.type === "subcerebro") {
        insight = `📊 **Análise do Subcérebro "${selectedNode.label}"**
        
        Este subcérebro possui ${connectionCount} conexões ativas e relevância de ${relevance}/10. 
        
        🔍 **Insights Identificados:**
        • Baseado no seu padrão de acesso, você interage mais com este subcérebro ${getAccessPattern(selectedNode.lastAccess)}
        • As conexões indicam forte correlação com atividades de ${selectedNode.tags?.[0] || 'desenvolvimento'} e ${selectedNode.tags?.[1] || 'produtividade'}
        • Recomendo fortalecer a conexão com nós de menor relevância para equilibrar seu grafo mental
        
        💡 **Sugestões de Otimização:**
        • Conectar ao nó "Cronograma Semanal" pode aumentar sua produtividade em 25%
        • Considere criar hábitos específicos relacionados a este subcérebro
        • Agende revisões quinzenais para manter a relevância alta`;
      } else if (selectedNode.type === "projeto") {
        insight = `🎯 **Análise do Projeto "${selectedNode.label}"**
        
        Projeto com ${connectionCount} conexões e relevância ${relevance}/10.
        
        📈 **Status Cognitivo:**
        • Baseado em ${getProjectDays(selectedNode.createdAt)} dias de existência
        • Padrão de acesso ${getAccessPattern(selectedNode.lastAccess)}
        • Integração com ${connectionCount} entidades do seu CÓRTEX
        
        🎯 **Otimizações Recomendadas:**
        • Probabilidade de conclusão atual: ${Math.min(95, relevance * 9 + connectionCount * 2)}%
        • Conectar ao subcérebro de Planejamento pode acelerar o progresso
        • Considere quebrar em tarefas menores se a relevância estiver baixa`;
      } else if (selectedNode.type === "habito") {
        insight = `🔄 **Análise do Hábito "${selectedNode.label}"**
        
        Hábito com consistência de ${relevance * 10}% e ${connectionCount} conexões.
        
        📊 **Métricas Comportamentais:**
        • Último check-in: ${timeAgo(selectedNode.lastAccess || '2024-05-10')}
        • Integração neural: ${connectionCount} pontos de conexão
        • Força do hábito: ${relevance >= 8 ? 'Alta' : relevance >= 6 ? 'Média' : 'Baixa'}
        
        💪 **Recomendações Athena:**
        • ${relevance >= 8 ? 'Continue assim! Hábito bem estabelecido.' : 'Que tal um reforço positivo para fortalecer este hábito?'}
        • Conectar ao subcérebro de Saúde pode aumentar a aderência
        • Considere horário fixo se ainda não tiver estabelecido`;
      } else {
        insight = `🧠 **Análise Neural "${selectedNode.label}"**
        
        Esta entidade possui ${connectionCount} conexões e relevância ${relevance}/10.
        
        🔗 **Padrão de Conectividade:**
        • Posição estratégica no seu grafo mental
        • Influência em ${selectedNode.tags?.slice(0, 2).join(' e ') || 'múltiplas áreas'}
        • Potencial de expansão: ${connectionCount < 3 ? 'Alto' : 'Moderado'}
        
        💡 **Sugestões de Crescimento:**
        • Conectar a subcérebros relacionados pode amplificar seu impacto
        • Consider revisar e atualizar as tags para melhor categorização
        • Integração com projetos ativos recomendada para aumentar relevância`;
      }
      
      setAthenaInsight(insight);
      
      toast({
        title: "🧠 Análise da Athena completada",
        description: "Novos insights neurais disponíveis para otimização.",
      });
    }, 2000); // Increased delay for more realistic "thinking" time
  };

  // Helper functions for enhanced insights
  const getAccessPattern = (lastAccess: string) => {
    const days = Math.floor((Date.now() - new Date(lastAccess).getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 1) return "diariamente (excelente padrão!)";
    if (days <= 7) return "semanalmente (bom ritmo)";
    if (days <= 30) return "ocasionalmente (considere aumentar frequência)";
    return "raramente (necessita reativação)";
  };

  const getProjectDays = (createdAt: string) => {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
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
      description: `${selectedNode.label} foi removido do seu CÓRTEX.`,
    });
    
    setIsDetailsPanelOpen(false);
    setSelectedNode(null);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterArea("all");
    setViewMode("default");
    setFocusNodeId("");
  };
  
  return (
    <div className="w-full h-[calc(100vh-60px)] max-w-7xl mx-auto relative overflow-hidden">
      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-10 p-4 bg-background/85 backdrop-blur-md border-b border-border/40"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <motion.h2
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold text-primary flex items-center gap-2"
            >
              <Brain className="h-6 w-6" />
              Subcérebros
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                Neural Graph 2.0
              </Badge>
            </motion.h2>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Reset
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-purple-500/20 w-0 group-hover:w-full transition-all duration-500 ease-out"></span>
                <Plus size={18} className="relative z-10" />
                <span className="relative z-10">Novo Subcérebro</span>
              </Button>
            </div>
          </div>
          
          {/* Enhanced Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" size={18} />
              <Input
                className="pl-10 border-card bg-background/50 focus:border-secondary backdrop-blur-sm"
                placeholder="Buscar em todos os subcérebros, projetos, hábitos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full lg:w-48 border-card bg-background/50 backdrop-blur-sm">
                <SelectValue placeholder="Tipo de nó" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-md border-card">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="subcerebro">🧠 Subcérebros</SelectItem>
                <SelectItem value="projeto">📁 Projetos</SelectItem>
                <SelectItem value="habito">🔄 Hábitos</SelectItem>
                <SelectItem value="favorito">⭐ Favoritos</SelectItem>
                <SelectItem value="pensamento">💭 Pensamentos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="w-full lg:w-48 border-card bg-background/50 backdrop-blur-sm">
                <SelectValue placeholder="Área temática" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-md border-card">
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="pessoal">👤 Pessoal</SelectItem>
                <SelectItem value="profissional">💼 Profissional</SelectItem>
                <SelectItem value="saude">🏃 Saúde</SelectItem>
                <SelectItem value="criatividade">🎨 Criatividade</SelectItem>
                <SelectItem value="financas">💰 Finanças</SelectItem>
                <SelectItem value="educacao">📚 Educação</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          
          {/* Enhanced View Mode Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-foreground/70 mr-2">Visualização:</span>
            <Button
              variant={viewMode === 'default' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('default')}
              className="flex items-center gap-2"
            >
              <Brain size={16} />
              Padrão
            </Button>
            <Button
              variant={viewMode === 'progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('progress')}
              className="flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Progresso
            </Button>
            <Button
              variant={viewMode === 'focus' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('focus')}
              className="flex items-center gap-2"
            >
              <Focus size={16} />
              Foco
            </Button>
            
            {viewMode === 'focus' && (
              <Select value={focusNodeId} onValueChange={setFocusNodeId}>
                <SelectTrigger className="w-48 border-card bg-background/50 backdrop-blur-sm">
                  <SelectValue placeholder="Selecionar nó para foco" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-md border-card">
                  <SelectItem value="athena">🤖 Athena IA</SelectItem>
                  <SelectItem value="sub1">🧠 Subcérebro Pessoal</SelectItem>
                  <SelectItem value="sub2">🧠 Subcérebro Trabalho</SelectItem>
                  <SelectItem value="sub3">🧠 Subcérebro Saúde</SelectItem>
                  <SelectItem value="proj1">📁 Projeto Alpha</SelectItem>
                </SelectContent>
              </Select>
            )}
          </motion.div>
          
          {/* Enhanced Inspirational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-foreground/70 italic text-center bg-gradient-to-r from-card/30 to-card/10 backdrop-blur-sm py-3 px-6 rounded-lg border border-card/50"
          >
            <span className="text-primary">"</span>
            Cada subcérebro é uma constelação da sua consciência digital. Conecte, expanda, evolua.
            <span className="text-primary">"</span>
            <div className="text-xs text-primary/60 mt-1">— Rede Neural CÓRTEX</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Neural Graph Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="w-full h-full pt-44 bg-[#0C0C1C] rounded-lg shadow-2xl border border-card/50 overflow-hidden relative"
      >
        <NeuralGraph 
          onNodeClick={handleNodeClick} 
          searchQuery={searchQuery} 
          filterType={filterType} 
          filterArea={filterArea}
          viewMode={viewMode}
          focusNodeId={focusNodeId}
        />
      </motion.div>

      {/* Enhanced Node Details Side Panel */}
      <AnimatePresence>
        {isDetailsPanelOpen && (
          <Sheet open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
            <SheetContent className="border-l border-card bg-background/95 backdrop-blur-md sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <span 
                    className="h-3 w-3 rounded-full animate-pulse" 
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
                  {/* Enhanced Node Type */}
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getNodeClass(selectedNode.type)}`}>
                      {getNodeIcon(selectedNode.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/70">Tipo</p>
                      <p className="text-base font-normal">{formatNodeType(selectedNode.type)}</p>
                      <p className="text-xs text-foreground/50">
                        {selectedNode.connections?.length || 0} conexões ativas
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Metadata Tabs */}
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-3 bg-card/30">
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="connections">Conexões</TabsTrigger>
                      <TabsTrigger value="analytics">Análise</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="space-y-4">
                      {/* Enhanced Tags */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground/70">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.tags?.map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-card/50 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Enhanced Dates */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground/70">Cronologia</p>
                        <div className="text-sm space-y-2 bg-card/20 p-3 rounded-lg">
                          <p className="flex justify-between">
                            <span className="text-foreground/60">Criado:</span> 
                            <span>{selectedNode.createdAt}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-foreground/60">Último acesso:</span>
                            <span>{selectedNode.lastAccess}</span>
                          </p>
                          {selectedNode.lastAccess && (
                            <p className="flex justify-between">
                              <span className="text-foreground/60">Há:</span>
                              <span className="text-primary">{timeAgo(selectedNode.lastAccess)}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Activity Score */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground/70">Relevância Neural</p>
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-card/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(selectedNode.relevancia || 5) * 10}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${getNodeBgClass(selectedNode.type)}`}
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground/60">
                              {selectedNode.relevancia || 5}/10
                            </span>
                            <span className="text-primary">
                              {selectedNode.relevancia >= 8 ? 'Alta' : selectedNode.relevancia >= 6 ? 'Média' : 'Baixa'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="connections" className="space-y-4">
                      <p className="text-sm font-medium text-foreground/70">
                        Conexões Neurais ({selectedNode.connections?.length || 0})
                      </p>
                      {selectedNode.connections?.length > 0 ? (
                        <div className="grid gap-2 overflow-y-auto max-h-[300px]">
                          {selectedNode.connections?.map((conn: any, i: number) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-3 p-3 rounded-lg bg-card/40 hover:bg-card/60 transition-colors cursor-pointer group"
                              onClick={() => {
                                const clickedNode = {
                                  id: conn.id,
                                  label: conn.label,
                                  type: conn.type,
                                  connections: conn.connections || [],
                                  tags: conn.tags || [],
                                  relevancia: conn.relevancia || 5,
                                  createdAt: conn.createdAt || '2024-05-01',
                                  lastAccess: conn.lastAccess || '2024-05-15',
                                };
                                handleNodeClick(clickedNode);
                              }}
                            >
                              <span 
                                className="h-3 w-3 rounded-full animate-pulse" 
                                style={{ backgroundColor: getNodeColor(conn.type) }}
                              />
                              <div className="flex-1">
                                <span className="line-clamp-1 text-sm font-medium">{conn.label}</span>
                                <span className="text-xs text-foreground/50 capitalize">
                                  {formatNodeType(conn.type)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFocusNode(conn.id);
                                }}
                              >
                                <Target size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-foreground/50 bg-card/20 rounded-lg">
                          <Brain className="mx-auto mb-2" size={24} />
                          <p>Nenhuma conexão encontrada</p>
                          <p className="text-xs mt-1">Crie novas conexões para expandir a rede neural</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="analytics" className="space-y-4">
                      <p className="text-sm font-medium text-foreground/70">Análise Neural</p>
                      <div className="space-y-3 bg-card/20 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/60">Força da conexão:</span>
                          <span className="text-primary font-medium">
                            {selectedNode.connections?.length > 5 ? 'Forte' : 
                             selectedNode.connections?.length > 2 ? 'Moderada' : 'Fraca'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/60">Impacto no grafo:</span>
                          <span className="text-primary font-medium">
                            {selectedNode.relevancia >= 8 ? 'Alto' : 
                             selectedNode.relevancia >= 6 ? 'Médio' : 'Baixo'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/60">Potencial expansão:</span>
                          <span className="text-primary font-medium">
                            {selectedNode.connections?.length < 3 ? 'Alto' : 'Moderado'}
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {/* Enhanced Actions */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <Button 
                      variant="default" 
                      className="w-full justify-start group"
                      onClick={handleAthenaAnalysis}
                      disabled={isAthenaAnalyzing}
                    >
                      <Brain className="mr-2 group-hover:animate-pulse" size={16} />
                      {isAthenaAnalyzing ? "Athena analisando..." : "Análise da Athena"}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start" onClick={() => handleFocusNode(selectedNode.id)}>
                        <Target className="mr-2" size={16} />
                        Focar
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Link className="mr-2" size={16} />
                        Conectar
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <Edit className="mr-2" size={16} />
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="justify-start"
                        onClick={handleRemoveNode}
                      >
                        <Trash2 className="mr-2" size={16} />
                        Remover
                      </Button>
                    </div>
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
      
      {/* Enhanced Athena Insight Modal */}
      <Dialog open={!!athenaInsight} onOpenChange={handleCloseInsight}>
        <DialogContent className="bg-background/95 backdrop-blur-md border-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Brain size={20} className="text-primary animate-pulse" />
              Análise Neural da Athena
            </DialogTitle>
          </DialogHeader>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-card/30 border border-card/50 rounded-lg p-4 text-foreground/90 whitespace-pre-line text-sm leading-relaxed">
              {athenaInsight}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseInsight}>
                Salvar Insight
              </Button>
              <Button onClick={handleCloseInsight}>
                Entendi
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Create New Subcerebro Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-md border-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              Criar Novo Subcérebro
            </DialogTitle>
          </DialogHeader>
          <SubcerebroCreationForm onSubmit={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper functions
function formatNodeType(type: string): string {
  const types: Record<string, string> = {
    athena: "Athena IA",
    subcerebro: "Subcérebro",
    projeto: "Projeto",
    habito: "Hábito",
    favorito: "Favorito",
    pensamento: "Pensamento"
  };
  
  return types[type] || "Desconhecido";
}

function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    athena: "#9b87f5",
    subcerebro: "#8B5CF6",
    projeto: "#0EA5E9",
    habito: "#10B981",
    favorito: "#F59E0B",
    pensamento: "#D1D5DB"
  };
  
  return colors[type] || "#9CA3AF";
}

function getNodeClass(type: string): string {
  const classes: Record<string, string> = {
    athena: "bg-purple-500/20 text-purple-500",
    subcerebro: "bg-purple-600/20 text-purple-600",
    projeto: "bg-blue-500/20 text-blue-500",
    habito: "bg-green-500/20 text-green-500",
    favorito: "bg-yellow-500/20 text-yellow-500",
    pensamento: "bg-gray-400/20 text-gray-400"
  };
  
  return classes[type] || "bg-gray-500/20 text-gray-500";
}

function getNodeBgClass(type: string): string {
  const classes: Record<string, string> = {
    athena: "bg-purple-500",
    subcerebro: "bg-purple-600",
    projeto: "bg-blue-500",
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
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
          <path d="M2 13h10" />
          <path d="m5 10-3 3 3 3" />
        </svg>
      );
    case 'habito':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.972 3 16.5" />
          <path d="m2 12 3-3 2.981 3" />
          <path d="M2 12h10.713" />
          <path d="M2.5 4c1-1.166 2-2 3.5-2 4.59 0 8 3.966 8 10 0 .947-.088 1.85-.248 2.698" />
        </svg>
      );
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
