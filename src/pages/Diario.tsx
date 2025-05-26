
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Search, Sparkles, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { useDiary, DiaryEntry } from "@/hooks/useDiary";
import { generateAthenaAnalysis, AthenaAnalysis } from "@/services/diaryService";

// Emojis for emotions
const emotionEmojis = {
  "reflexivo": "🤔",
  "satisfeito": "😌",
  "preocupado": "😟",
  "animado": "😃",
  "triste": "😔",
  "grato": "🙏",
  "ansioso": "😰",
  "inspirado": "✨",
};

// Emotion options for the diary entry form
const emotionOptions = [
  { value: "reflexivo", label: "Reflexivo 🤔" },
  { value: "satisfeito", label: "Satisfeito 😌" },
  { value: "preocupado", label: "Preocupado 😟" },
  { value: "animado", label: "Animado 😃" },
  { value: "triste", label: "Triste 😔" },
  { value: "grato", label: "Grato 🙏" },
  { value: "ansioso", label: "Ansioso 😰" },
  { value: "inspirado", label: "Inspirado ✨" },
];

export default function Diario() {
  const { entries, loading, createEntry, updateEntry, deleteEntry, searchEntries, refetch } = useDiary();
  
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAthenaModalOpen, setIsAthenaModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("reflexivo");
  const [entryType, setEntryType] = useState("livre");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [athenaAnalysis, setAthenaAnalysis] = useState<AthenaAnalysis | null>(null);
  const [reflectionResponse, setReflectionResponse] = useState("");
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const handleSubmitEntry = async () => {
    if (!diaryContent.trim()) return;

    try {
      const newEntry = await createEntry({
        title: diaryTitle.trim() || undefined,
        content: diaryContent,
        emotion: selectedEmotion,
        type: entryType,
      });

      // Close the modal
      setIsEntryModalOpen(false);
      
      // Reset the form
      setDiaryContent("");
      setDiaryTitle("");
      setSelectedEmotion("reflexivo");
      setEntryType("livre");
      
      // Generate Athena analysis
      const analysis = generateAthenaAnalysis(newEntry, entries);
      setAthenaAnalysis(analysis);
      
      // Show Athena's analysis
      setTimeout(() => {
        setIsAthenaModalOpen(true);
      }, 500);
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleUpdateEntry = async () => {
    if (!selectedEntry || !diaryContent.trim()) return;

    try {
      await updateEntry(selectedEntry.id, {
        title: diaryTitle.trim() || null,
        content: diaryContent,
        emotion: selectedEmotion,
        type: entryType,
      });

      setIsEditModalOpen(false);
      setSelectedEntry(null);
      setDiaryContent("");
      setDiaryTitle("");
      setSelectedEmotion("reflexivo");
      setEntryType("livre");
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleDeleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      await deleteEntry(entryToDelete);
      setIsDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchEntries(value);
    } else {
      refetch();
    }
  };

  const openViewModal = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  const openEditModal = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setDiaryTitle(entry.title || "");
    setDiaryContent(entry.content);
    setSelectedEmotion(entry.emotion);
    setEntryType(entry.type);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (entryId: string) => {
    setEntryToDelete(entryId);
    setIsDeleteDialogOpen(true);
  };

  const formatEntryDate = (dateStr: string) => {
    return format(new Date(dateStr), "d 'de' MMMM, HH:mm", { locale: ptBR });
  };

  const truncateText = (text: string, maxLength = 120) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Get color for entry based on emotion
  const getEntryColor = (emotion: string) => {
    const colors: Record<string, string> = {
      "reflexivo": "bg-blue-950/30",
      "satisfeito": "bg-green-950/30",
      "preocupado": "bg-orange-950/30",
      "animado": "bg-yellow-950/30",
      "triste": "bg-purple-950/30",
      "grato": "bg-pink-950/30",
      "ansioso": "bg-red-950/30",
      "inspirado": "bg-teal-950/30",
    };
    return colors[emotion] || "bg-gray-950/30";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <motion.h2
          className="text-2xl font-bold text-primary mb-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Diário Mental
        </motion.h2>
        <p className="text-foreground/70 text-sm italic mb-4">
          "Quando você escreve, sua mente respira. E o CÓRTEX escuta."
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Button 
            variant="default" 
            onClick={() => setIsEntryModalOpen(true)}
          >
            Nova Entrada
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              if (entries.length > 0) {
                const analysis = generateAthenaAnalysis(entries[0], entries);
                setAthenaAnalysis(analysis);
                setIsAthenaModalOpen(true);
              }
            }}
          >
            <Sparkles className="h-4 w-4" />
            Refletir com Athena
          </Button>
          <div className="flex items-center gap-2 bg-background border border-border rounded-md px-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por sentimento..." 
              className="h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => refetch()}
          >
            <CalendarIcon className="h-4 w-4" />
            Explorar por data
          </Button>
        </div>
      </motion.header>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando entradas...</p>
        </div>
      )}

      {/* No entries state */}
      {!loading && entries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Nenhuma entrada encontrada." : "Você ainda não tem entradas no diário."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsEntryModalOpen(true)}>
              Criar sua primeira entrada
            </Button>
          )}
        </div>
      )}

      {/* Diary entries list */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`overflow-hidden border-l-4 ${getEntryColor(entry.emotion)} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl" title={entry.emotion}>
                        {emotionEmojis[entry.emotion as keyof typeof emotionEmojis]}
                      </span>
                      <h3 className="font-medium">
                        {entry.title || "Entrada sem título"}
                      </h3>
                    </div>
                    <p className="text-foreground/80 text-sm mb-3">
                      {truncateText(entry.content)}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xs text-foreground/50 mb-1">
                      {formatEntryDate(entry.date)}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {entry.type}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs text-primary p-0"
                    onClick={() => openViewModal(entry)}
                  >
                    Ver completo
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(entry)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(entry.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* New Entry Modal */}
      <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle>Nova Entrada no Diário</DialogTitle>
            <DialogDescription>
              Registre seus pensamentos, sentimentos e reflexões. Athena irá ajudar a analisá-los.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input 
              placeholder="Título (opcional)" 
              value={diaryTitle}
              onChange={(e) => setDiaryTitle(e.target.value)}
              className="w-full"
            />

            <div>
              <label className="block text-sm text-foreground/70 mb-1">
                Tipo de registro
              </label>
              <ToggleGroup 
                type="single" 
                value={entryType}
                onValueChange={(value) => value && setEntryType(value)}
                className="justify-start"
              >
                <ToggleGroupItem value="livre">Livre</ToggleGroupItem>
                <ToggleGroupItem value="reflexivo">Reflexivo</ToggleGroupItem>
                <ToggleGroupItem value="rápido">Rápido</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-foreground/70 mb-1">
                Como você está se sentindo?
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map((emotion) => (
                  <Button 
                    key={emotion.value}
                    variant={selectedEmotion === emotion.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEmotion(emotion.value)}
                    className="transition-colors"
                  >
                    {emotion.label}
                  </Button>
                ))}
              </div>
            </div>

            <Textarea 
              placeholder="Escreva seus pensamentos, sentimentos, reflexões..."
              value={diaryContent} 
              onChange={(e) => setDiaryContent(e.target.value)}
              rows={8}
              className="resize-none"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setIsEntryModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitEntry} disabled={!diaryContent.trim()}>
                Salvar e Analisar com Athena
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Entry Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">
                {selectedEntry && emotionEmojis[selectedEntry.emotion as keyof typeof emotionEmojis]}
              </span>
              {selectedEntry?.title || "Entrada sem título"}
            </DialogTitle>
            <DialogDescription>
              {selectedEntry && (
                <>
                  {formatEntryDate(selectedEntry.date)} • {selectedEntry.type}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4">
              <div className="bg-background/50 rounded-lg p-4 border">
                <p className="text-foreground whitespace-pre-wrap">
                  {selectedEntry.content}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Fechar
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditModal(selectedEntry);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const analysis = generateAthenaAnalysis(selectedEntry, entries);
                      setAthenaAnalysis(analysis);
                      setIsViewModalOpen(false);
                      setIsAthenaModalOpen(true);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analisar com Athena
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Entry Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Entrada do Diário</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias em sua entrada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input 
              placeholder="Título (opcional)" 
              value={diaryTitle}
              onChange={(e) => setDiaryTitle(e.target.value)}
              className="w-full"
            />

            <div>
              <label className="block text-sm text-foreground/70 mb-1">
                Tipo de registro
              </label>
              <ToggleGroup 
                type="single" 
                value={entryType}
                onValueChange={(value) => value && setEntryType(value)}
                className="justify-start"
              >
                <ToggleGroupItem value="livre">Livre</ToggleGroupItem>
                <ToggleGroupItem value="reflexivo">Reflexivo</ToggleGroupItem>
                <ToggleGroupItem value="rápido">Rápido</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-foreground/70 mb-1">
                Como você está se sentindo?
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map((emotion) => (
                  <Button 
                    key={emotion.value}
                    variant={selectedEmotion === emotion.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEmotion(emotion.value)}
                    className="transition-colors"
                  >
                    {emotion.label}
                  </Button>
                ))}
              </div>
            </div>

            <Textarea 
              placeholder="Escreva seus pensamentos, sentimentos, reflexões..."
              value={diaryContent} 
              onChange={(e) => setDiaryContent(e.target.value)}
              rows={8}
              className="resize-none"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateEntry} disabled={!diaryContent.trim()}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir entrada?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A entrada será permanentemente removida do seu diário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Athena Analysis Modal */}
      <Dialog open={isAthenaModalOpen} onOpenChange={setIsAthenaModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="rounded-full w-6 h-6 flex items-center justify-center bg-primary text-background">✨</span>
              Análise da Athena
            </DialogTitle>
          </DialogHeader>

          {athenaAnalysis && (
            <div className="space-y-4">
              <p className="text-foreground/80 italic border-l-2 border-primary pl-3 py-1">
                "{athenaAnalysis.insight}"
              </p>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Sugestões da Athena:</h4>
                <ul className="space-y-2 text-sm">
                  {athenaAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>{athenaAnalysis.emotionalPattern}</span>
                  </li>
                </ul>
              </div>

              <div className="border border-border rounded-md p-3 bg-background/50">
                <h4 className="font-medium text-sm mb-2">Pergunta para refletir:</h4>
                <p className="text-primary/90 italic mb-2">
                  "{athenaAnalysis.reflectionQuestion}"
                </p>
                <Textarea 
                  placeholder="Reflita sobre esta pergunta..."
                  rows={3}
                  className="mt-2 resize-none"
                  value={reflectionResponse}
                  onChange={(e) => setReflectionResponse(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button onClick={() => {
                  setIsAthenaModalOpen(false);
                  setReflectionResponse("");
                }}>
                  Agradeço, Athena
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
