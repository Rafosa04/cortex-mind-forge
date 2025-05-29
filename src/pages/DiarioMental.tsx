
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, TrendingUp, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDiary } from '@/hooks/useDiary';
import { useDiaryAnalysis } from '@/hooks/useDiaryAnalysis';
import { DiaryEntryForm } from '@/components/Diary/DiaryEntryForm';
import { DiaryTrendsChart } from '@/components/Diary/DiaryTrendsChart';
import { DiaryInsightsPanel } from '@/components/Diary/DiaryInsightsPanel';

export default function DiarioMental() {
  const { entries, loading, deleteEntry } = useDiary();
  const { 
    sentimentTrends, 
    emotionPatterns, 
    insights, 
    exportSummary 
  } = useDiaryAnalysis();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Filtrar entradas
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmotion = filterEmotion === 'all' || entry.emotion === filterEmotion;
    const matchesType = filterType === 'all' || entry.type === filterType;
    
    return matchesSearch && matchesEmotion && matchesType;
  });

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      happy: '😊', sad: '😢', angry: '😠', anxious: '😰',
      excited: '🤩', calm: '😌', frustrated: '😤', grateful: '🙏', neutral: '😐'
    };
    return emojis[emotion as keyof typeof emojis] || '😐';
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta entrada?')) {
      await deleteEntry(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Diário Mental</h1>
            <p className="text-muted-foreground">
              Registre suas reflexões e acompanhe sua jornada emocional
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Entrada
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar nas suas reflexões..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterEmotion} onValueChange={setFilterEmotion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por emoção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as emoções</SelectItem>
              <SelectItem value="happy">😊 Feliz</SelectItem>
              <SelectItem value="sad">😢 Triste</SelectItem>
              <SelectItem value="angry">😠 Irritado</SelectItem>
              <SelectItem value="anxious">😰 Ansioso</SelectItem>
              <SelectItem value="excited">🤩 Animado</SelectItem>
              <SelectItem value="calm">😌 Tranquilo</SelectItem>
              <SelectItem value="grateful">🙏 Grato</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="livre">Reflexão Livre</SelectItem>
              <SelectItem value="gratidao">Gratidão</SelectItem>
              <SelectItem value="objetivos">Objetivos</SelectItem>
              <SelectItem value="aprendizados">Aprendizados</SelectItem>
              <SelectItem value="desafios">Desafios</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Dashboard de análise */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DiaryTrendsChart 
            sentimentTrends={sentimentTrends}
            emotionPatterns={emotionPatterns}
          />
        </div>
        <div>
          <DiaryInsightsPanel 
            insights={insights}
            onExportSummary={exportSummary}
          />
        </div>
      </div>

      {/* Lista de entradas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Suas Reflexões ({filteredEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">
                {entries.length === 0 ? 'Nenhuma entrada ainda' : 'Nenhuma entrada encontrada'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {entries.length === 0 
                  ? 'Comece registrando seus pensamentos e emoções'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
              {entries.length === 0 && (
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Primeira Entrada
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                      <div>
                        <h4 className="font-medium">
                          {entry.title || 'Entrada sem título'}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                          <Badge variant="outline" className="capitalize">
                            {entry.type.replace('_', ' ')}
                          </Badge>
                          {entry.sentiment_label && (
                            <Badge className={getSentimentColor(entry.sentiment_label)}>
                              {entry.sentiment_label === 'positive' ? 'Positivo' : 
                               entry.sentiment_label === 'negative' ? 'Negativo' : 'Neutro'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry.id);
                      }}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      Deletar
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de criação */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Entrada no Diário</DialogTitle>
          </DialogHeader>
          <DiaryEntryForm 
            onSave={() => setIsCreateModalOpen(false)}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar/Editar Entrada</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <DiaryEntryForm 
              entry={selectedEntry}
              onSave={() => setSelectedEntry(null)}
              onCancel={() => setSelectedEntry(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
