
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Search, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Sample diary entries for demonstration
const sampleEntries = [
  {
    id: 1,
    date: "2025-05-17T10:30:00",
    title: "Reflexão matinal",
    content: "Hoje acordei com uma sensação estranha de que preciso reorganizar minhas prioridades. Estou me sentindo um pouco sobrecarregado com tantos projetos.",
    emotion: "reflexivo",
    type: "espontânea",
    color: "bg-blue-950/30"
  },
  {
    id: 2,
    date: "2025-05-16T22:15:00",
    title: "Progresso no projeto",
    content: "Finalmente consegui avançar no projeto que estava travado. Sinto um misto de alívio e realização, embora ainda haja muito a fazer.",
    emotion: "satisfeito",
    type: "orientada",
    color: "bg-green-950/30"
  },
  {
    id: 3,
    date: "2025-05-15T18:45:00",
    title: "Conflito familiar",
    content: "A conversa difícil que tive hoje com meu irmão me deixou abalado. Preciso encontrar um meio termo entre expressar minhas necessidades e ser compreensivo.",
    emotion: "preocupado",
    type: "resumo diário",
    color: "bg-orange-950/30"
  }
];

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
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAthenaModalOpen, setIsAthenaModalOpen] = useState(false);
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("reflexivo");
  const [entryType, setEntryType] = useState("livre");

  const handleSubmitEntry = () => {
    // Here you would save the entry to your database
    console.log({
      title: diaryTitle,
      content: diaryContent,
      emotion: selectedEmotion,
      type: entryType,
      date: new Date().toISOString()
    });
    
    // Close the modal
    setIsEntryModalOpen(false);
    
    // Reset the form
    setDiaryContent("");
    setDiaryTitle("");
    setSelectedEmotion("reflexivo");
    setEntryType("livre");
    
    // Show Athena's analysis (for demonstration)
    setTimeout(() => {
      setIsAthenaModalOpen(true);
    }, 500);
  };

  const formatEntryDate = (dateStr) => {
    return format(new Date(dateStr), "d 'de' MMMM, HH:mm", { locale: ptBR });
  };

  // For truncating content in the list view
  const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
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
          >
            <Sparkles className="h-4 w-4" />
            Refletir com Athena
          </Button>
          <div className="flex items-center gap-2 bg-background border border-border rounded-md px-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por sentimento..." 
              className="h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" 
            />
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Explorar por data
          </Button>
        </div>
      </motion.header>

      {/* Diary entries list */}
      <div className="space-y-4">
        {sampleEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`overflow-hidden border-l-4 ${entry.color} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl" title={entry.emotion}>
                        {emotionEmojis[entry.emotion]}
                      </span>
                      <h3 className="font-medium">{entry.title}</h3>
                    </div>
                    <p className="text-foreground/80 text-sm mb-3">
                      {truncateText(entry.content)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-foreground/50 mb-1">
                      {formatEntryDate(entry.date)}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {entry.type}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="link" size="sm" className="text-xs text-primary">
                    Ver completo
                  </Button>
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
              <Button onClick={handleSubmitEntry}>
                Salvar e Analisar com Athena
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Athena Analysis Modal */}
      <Dialog open={isAthenaModalOpen} onOpenChange={setIsAthenaModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="rounded-full w-6 h-6 flex items-center justify-center bg-primary text-background">✨</span>
              Análise da Athena
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-foreground/80 italic border-l-2 border-primary pl-3 py-1">
              "Percebo que você mencionou sentir-se 'sobrecarregado' várias vezes nas últimas semanas. 
              Isso parece estar relacionado aos múltiplos projetos que você mencionou."
            </p>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Sugestões da Athena:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>Deseja criar um hábito de reflexão diária para gerenciar melhor seu tempo?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>Este sentimento está relacionado ao seu projeto "Organização Pessoal".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>Sua emoção predominante mudou de "ansioso" para "reflexivo" esta semana.</span>
                </li>
              </ul>
            </div>

            <div className="border border-border rounded-md p-3 bg-background/50">
              <h4 className="font-medium text-sm mb-2">Pergunta para refletir:</h4>
              <p className="text-primary/90 italic">
                "O que você poderia simplificar em sua rotina para reduzir a sensação de sobrecarga?"
              </p>
              <Textarea 
                placeholder="Reflita sobre esta pergunta..."
                rows={3}
                className="mt-2 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button onClick={() => setIsAthenaModalOpen(false)}>
                Agradeço, Athena
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
