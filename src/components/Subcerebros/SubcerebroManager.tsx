
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus, Search, Filter, X, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubcerebros, Subcerebro } from '@/hooks/useSubcerebros';
import { useSubcerebroRecommendations } from '@/hooks/useSubcerebroRecommendations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubcerebroCreationForm } from './SubcerebroCreationForm';
import { SubcerebroDetail } from './SubcerebroDetail';
import { RecommendationCard } from './RecommendationCard';

interface SubcerebroManagerProps {
  onSubcerebroSelect?: (subcerebro: Subcerebro) => void;
  selectedSubcerebroId?: string;
}

export const SubcerebroManager = ({ onSubcerebroSelect, selectedSubcerebroId }: SubcerebroManagerProps) => {
  const { subcerebros, loading, deleteSubcerebro, updateSubcerebro } = useSubcerebros();
  const { 
    recommendations, 
    loading: recommendationsLoading,
    generateRecommendations,
    acceptRecommendation,
    rejectRecommendation
  } = useSubcerebroRecommendations();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSubcerebro, setSelectedSubcerebro] = useState<Subcerebro | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Filtrar subcérebros
  const filteredSubcerebros = subcerebros.filter(sub => {
    const matchesSearch = sub.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesArea = filterArea === 'all' || sub.area === filterArea;
    
    return matchesSearch && matchesArea;
  });

  // Áreas únicas
  const uniqueAreas = Array.from(new Set(subcerebros.map(s => s.area).filter(Boolean)));

  const handleDelete = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja deletar o subcérebro "${nome}"?`)) {
      await deleteSubcerebro(id);
    }
  };

  const handleSubcerebroClick = (subcerebro: Subcerebro) => {
    // Atualizar último acesso
    updateSubcerebro({
      id: subcerebro.id,
      last_access: new Date().toISOString()
    });

    setSelectedSubcerebro(subcerebro);
    setIsDetailOpen(true);
    onSubcerebroSelect?.(subcerebro);
  };

  const handleEdit = (subcerebro: Subcerebro) => {
    setSelectedSubcerebro(subcerebro);
    setIsDetailOpen(false);
    setIsCreateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e controles */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Meus Subcérebros ({filteredSubcerebros.length})
          </h3>
          <div className="flex gap-2">
            {recommendations.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setShowRecommendations(true)}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                {recommendations.length} Sugestões
              </Button>
            )}
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Subcérebro
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar subcérebros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {uniqueAreas.map(area => (
                <SelectItem key={area} value={area!}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {recommendations.length > 0 && (
            <Button 
              variant="outline"
              onClick={generateRecommendations}
              disabled={recommendationsLoading}
            >
              <Target className="h-4 w-4 mr-2" />
              Gerar Novas
            </Button>
          )}
        </div>
      </div>

      {/* Lista de subcérebros */}
      {filteredSubcerebros.length === 0 ? (
        <div className="text-center py-12 text-foreground/50">
          <Brain className="mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-medium mb-2">
            {subcerebros.length === 0 ? 'Nenhum subcérebro criado' : 'Nenhum subcérebro encontrado'}
          </h3>
          <p className="text-sm">
            {subcerebros.length === 0 
              ? 'Crie seu primeiro subcérebro para começar a organizar suas ideias'
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          {subcerebros.length === 0 && (
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="mt-4"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Subcérebro
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubcerebros.map((subcerebro) => (
            <motion.div
              key={subcerebro.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                group relative p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md
                ${selectedSubcerebroId === subcerebro.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
                }
              `}
              onClick={() => handleSubcerebroClick(subcerebro)}
            >
              {/* Cabeçalho */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <h4 className="font-medium line-clamp-1">{subcerebro.nome}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(subcerebro.id, subcerebro.nome);
                  }}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Descrição */}
              {subcerebro.descricao && (
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                  {subcerebro.descricao}
                </p>
              )}

              {/* Tags */}
              {subcerebro.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {subcerebro.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {subcerebro.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{subcerebro.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Metadados */}
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <span>{subcerebro.area || 'Sem área'}</span>
                <div className="flex items-center gap-2">
                  <span>Relevância: {subcerebro.relevancia}/10</span>
                  <div className="h-1 w-8 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${subcerebro.relevancia * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de criação/edição */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {selectedSubcerebro ? 'Editar Subcérebro' : 'Criar Novo Subcérebro'}
            </DialogTitle>
          </DialogHeader>
          <SubcerebroCreationForm 
            subcerebro={selectedSubcerebro}
            onSubmit={() => {
              setIsCreateModalOpen(false);
              setSelectedSubcerebro(null);
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Modal de recomendações */}
      <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recomendações de Conexões ({recommendations.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {recommendations.length > 0 ? (
              recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onAccept={acceptRecommendation}
                  onReject={rejectRecommendation}
                  isLoading={recommendationsLoading}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma recomendação disponível</p>
                <Button 
                  onClick={generateRecommendations}
                  className="mt-4"
                  disabled={recommendationsLoading}
                >
                  Gerar Recomendações
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Drawer de detalhes */}
      <SubcerebroDetail
        subcerebro={selectedSubcerebro}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSubcerebro(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
