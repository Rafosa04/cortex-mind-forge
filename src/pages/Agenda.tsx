
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAgendaEvents, AgendaEvent } from "@/hooks/useAgendaEvents";

// Cores para cada tipo de bloco
const coresBloco: Record<AgendaEvent['event_type'], string> = {
  "Projetos": "bg-indigo-500/20 border-indigo-500 text-indigo-300",
  "Hábitos": "bg-green-500/20 border-green-500 text-green-300",
  "Descanso": "bg-blue-500/20 border-blue-500 text-blue-300",
  "Reuniões": "bg-purple-500/20 border-purple-500 text-purple-300",
  "Tarefas": "bg-amber-500/20 border-amber-500 text-amber-300",
};

export default function Agenda() {
  const { events, loading, createEvent, markAsCompleted, deleteEvent } = useAgendaEvents();
  const [activeDay, setActiveDay] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<string>("dia");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [currentFocusBlock, setCurrentFocusBlock] = useState<AgendaEvent | null>(null);
  const [tempoRestante, setTempoRestante] = useState<number>(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtrar eventos do dia selecionado
  const eventosFilteredByDay = events.filter(event => 
    activeDay && isSameDay(parseISO(event.start_time), activeDay)
  );

  // Função para marcar um bloco como concluído
  const marcarConcluido = async (id: string, currentStatus: boolean) => {
    await markAsCompleted(id, !currentStatus);
  };

  // Função para ativar o modo foco em um bloco específico
  const ativarModoFoco = (bloco: AgendaEvent) => {
    setCurrentFocusBlock(bloco);
    setFocusMode(true);
    const startTime = parseISO(bloco.start_time);
    const endTime = parseISO(bloco.end_time);
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    setTempoRestante(durationMinutes * 60);
  };

  // Função para formatar o tempo restante
  const formatarTempoRestante = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  // Função para sair do modo foco
  const sairModoFoco = () => {
    setFocusMode(false);
    setCurrentFocusBlock(null);
  };

  // Estatísticas dos blocos do dia
  const totalBlocos = eventosFilteredByDay.length;
  const blocosConcluidos = eventosFilteredByDay.filter(bloco => bloco.completed).length;
  const porcentagemConcluida = totalBlocos > 0 ? Math.round((blocosConcluidos / totalBlocos) * 100) : 0;

  // Função para gerar dica da Athena com base nas estatísticas
  const getDicaAthena = () => {
    if (porcentagemConcluida >= 70) {
      return "Você cumpriu mais de 70% dos blocos agendados hoje. Excelente ritmo!";
    } else if (porcentagemConcluida >= 50) {
      return "Você está no caminho certo! Já cumpriu metade dos blocos planejados.";
    } else {
      return "Lembre-se de dar pequenos passos consistentes. Cada bloco concluído é uma vitória!";
    }
  };

  // Renderiza o modo foco
  if (focusMode && currentFocusBlock) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl p-8 rounded-xl bg-card border border-border shadow-lg flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-primary mb-2">Modo Foco</h2>
          <div className="text-4xl font-mono font-bold my-8 text-primary">
            {formatarTempoRestante(tempoRestante)}
          </div>
          
          <div className="my-6 text-center">
            <h3 className="text-xl font-bold mb-2">{currentFocusBlock.title}</h3>
            <p className="text-muted-foreground">
              {format(parseISO(currentFocusBlock.start_time), 'HH:mm')} - {format(parseISO(currentFocusBlock.end_time), 'HH:mm')}
            </p>
            {currentFocusBlock.subcrebro_relacionado && (
              <Badge variant="outline" className="mt-2">
                {currentFocusBlock.subcrebro_relacionado}
              </Badge>
            )}
          </div>
          
          <div className="my-6 py-4 px-6 rounded-lg bg-secondary/30 text-center">
            <p className="italic text-secondary-foreground">
              "Concentre-se no processo, não no resultado. A qualidade da sua atenção determina a qualidade dos resultados."
            </p>
            <p className="text-xs mt-2 text-muted-foreground">- Athena IA</p>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" size="lg" onClick={sairModoFoco}>
              <Clock className="mr-2 h-4 w-4" /> Pausar
            </Button>
            <Button variant="default" size="lg" onClick={() => {
              marcarConcluido(currentFocusBlock.id, currentFocusBlock.completed);
              sairModoFoco();
            }}>
              Concluir Bloco
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  // Componente principal da página
  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-primary">Agenda Mental</h1>
        <p className="text-sm text-muted-foreground mt-1">
          "Sua mente cria. Sua agenda manifesta."
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna Principal - Calendário e Blocos */}
        <div className="lg:col-span-3 space-y-6">
          {/* Cabeçalho de Controles */}
          <div className="flex flex-wrap justify-between items-center gap-3 p-4 rounded-lg bg-card border border-border">
            <Tabs defaultValue={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="dia">Dia</TabsTrigger>
                <TabsTrigger value="semana">Semana</TabsTrigger>
                <TabsTrigger value="mes">Mês</TabsTrigger>
                <TabsTrigger value="foco">Foco</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap gap-2">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Novo Bloco Mental
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Bloco Mental</DialogTitle>
                  </DialogHeader>
                  <NovoBlocoMentalForm 
                    onClose={() => setIsCreateModalOpen(false)}
                    selectedDate={activeDay}
                    onEventCreated={createEvent}
                  />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" onClick={() => toast.info("Sincronização com Google Agenda em breve!")}>
                <Calendar className="mr-1 h-4 w-4" /> Sincronizar
              </Button>
            </div>
          </div>

          {/* Visualização do Calendário */}
          <div className="rounded-lg bg-card border border-border p-4">
            <div className="mb-4">
              <CalendarComponent
                mode="single"
                selected={activeDay}
                onSelect={setActiveDay}
                className="rounded-md bg-card"
              />
            </div>

            <h3 className="text-lg font-medium mb-3 mt-6">Blocos Agendados</h3>
            <div className="space-y-3">
              {eventosFilteredByDay.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum evento agendado para este dia</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Criar primeiro evento
                  </Button>
                </div>
              ) : (
                eventosFilteredByDay.map((bloco) => (
                  <motion.div
                    key={bloco.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border flex justify-between items-center ${coresBloco[bloco.event_type]} ${bloco.completed ? 'opacity-50' : ''}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{bloco.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {bloco.event_type}
                        </Badge>
                      </div>
                      <div className="text-xs mt-1 opacity-80">
                        {format(parseISO(bloco.start_time), 'HH:mm')} - {format(parseISO(bloco.end_time), 'HH:mm')}
                      </div>
                      {bloco.subcrebro_relacionado && (
                        <div className="text-xs mt-1 opacity-70">
                          Subcérebro: {bloco.subcrebro_relacionado}
                        </div>
                      )}
                      {bloco.description && (
                        <div className="text-xs mt-1 opacity-70">
                          {bloco.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => marcarConcluido(bloco.id, bloco.completed)}
                      >
                        {bloco.completed ? 'Desfazer' : 'Concluir'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => ativarModoFoco(bloco)}
                      >
                        Foco
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive"
                        onClick={() => deleteEvent(bloco.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Painel Lateral - Resumo do Dia */}
        <div className="space-y-6">
          {/* Resumo dos blocos do dia */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-card border border-border p-4"
          >
            <h3 className="text-lg font-medium mb-4">Blocos do Dia</h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Progresso</span>
                <span className="text-sm font-medium">{porcentagemConcluida}%</span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${porcentagemConcluida}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-secondary/20 text-sm italic">
              <p>{getDicaAthena()}</p>
              <p className="text-xs mt-1 text-right text-muted-foreground">- Athena IA</p>
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-2">
                RESUMO
              </h4>
              {eventosFilteredByDay.map((bloco) => (
                <div 
                  key={bloco.id} 
                  className={`flex items-center justify-between py-1 px-2 rounded text-xs ${
                    bloco.completed ? "line-through opacity-50" : ""
                  }`}
                >
                  <span>
                    {format(parseISO(bloco.start_time), 'HH:mm')} - {bloco.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => marcarConcluido(bloco.id, bloco.completed)}
                  >
                    {bloco.completed ? "↩" : "✓"}
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Estatísticas do dia */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-lg bg-card border border-border p-4"
          >
            <h3 className="text-lg font-medium mb-3">Distribuição Mental</h3>
            <div className="flex items-center justify-around my-4">
              {Object.keys(coresBloco).map((tipo) => {
                const count = eventosFilteredByDay.filter(e => e.event_type === tipo).length;
                return (
                  <div key={tipo} className="flex flex-col items-center">
                    <div 
                      className={`w-3 h-3 rounded-full ${coresBloco[tipo as keyof typeof coresBloco].split(' ')[0]}`} 
                    />
                    <div className="text-xs mt-1">{tipo}</div>
                    <div className="text-xs text-muted-foreground">{count}</div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {totalBlocos > 0 
                ? `Você tem ${totalBlocos} blocos agendados para hoje.`
                : "Nenhum bloco agendado para hoje."
              }
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Componente de formulário para criar novo bloco mental
function NovoBlocoMentalForm({ 
  onClose, 
  selectedDate, 
  onEventCreated 
}: { 
  onClose: () => void;
  selectedDate?: Date;
  onEventCreated: (event: Omit<AgendaEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<AgendaEvent | null>;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'Tarefas' as AgendaEvent['event_type'],
    start_time: '',
    end_time: '',
    subcrebro_relacionado: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const baseDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    
    const eventData = {
      title: formData.title,
      description: formData.description || undefined,
      event_type: formData.event_type,
      start_time: `${baseDate}T${formData.start_time}:00`,
      end_time: `${baseDate}T${formData.end_time}:00`,
      subcrebro_relacionado: formData.subcrebro_relacionado || undefined,
      completed: false
    };

    const result = await onEventCreated(eventData);
    
    if (result) {
      onClose();
      setFormData({
        title: '',
        description: '',
        event_type: 'Tarefas',
        start_time: '',
        end_time: '',
        subcrebro_relacionado: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Nome do bloco *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Revisão do projeto X"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="event_type">Tipo *</Label>
          <Select 
            value={formData.event_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value as AgendaEvent['event_type'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Projetos">Projetos</SelectItem>
              <SelectItem value="Hábitos">Hábitos</SelectItem>
              <SelectItem value="Descanso">Descanso</SelectItem>
              <SelectItem value="Reuniões">Reuniões</SelectItem>
              <SelectItem value="Tarefas">Tarefas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start_time">Horário de início *</Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="end_time">Horário de término *</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              required
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="subcrebro_relacionado">Subcérebro relacionado</Label>
          <Select 
            value={formData.subcrebro_relacionado} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, subcrebro_relacionado: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum</SelectItem>
              <SelectItem value="Trabalho">Trabalho</SelectItem>
              <SelectItem value="Bem-estar">Bem-estar</SelectItem>
              <SelectItem value="Conhecimento">Conhecimento</SelectItem>
              <SelectItem value="Criatividade">Criatividade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Detalhes sobre este bloco mental..."
            className="min-h-[80px]"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button type="submit">Criar Bloco</Button>
      </div>
    </form>
  );
}
