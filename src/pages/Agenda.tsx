
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Tipos dos blocos mentais
type TipoBloco = "Projetos" | "Hábitos" | "Descanso" | "Reuniões" | "Tarefas";

// Interface para os blocos mentais
interface BlocoMental {
  id: string;
  atividade: string;
  bloco: string;
  tipo: TipoBloco;
  subcerebroRelacionado?: string;
  concluido: boolean;
}

// Dados de exemplo para os blocos mentais
const blocosMentaisIniciais: BlocoMental[] = [
  { id: "1", atividade: "Revisar projeto X", bloco: "09:00-10:30", tipo: "Projetos", subcerebroRelacionado: "Trabalho", concluido: false },
  { id: "2", atividade: "Meditação", bloco: "18:00-18:20", tipo: "Hábitos", subcerebroRelacionado: "Bem-estar", concluido: false },
  { id: "3", atividade: "Reunião com equipe", bloco: "14:00-15:00", tipo: "Reuniões", subcerebroRelacionado: "Trabalho", concluido: false },
  { id: "4", atividade: "Ler artigo sobre IA", bloco: "20:00-21:00", tipo: "Tarefas", subcerebroRelacionado: "Conhecimento", concluido: false },
  { id: "5", atividade: "Descanso ativo", bloco: "12:00-12:30", tipo: "Descanso", subcerebroRelacionado: "Bem-estar", concluido: false },
];

// Cores para cada tipo de bloco
const coresBloco: Record<TipoBloco, string> = {
  "Projetos": "bg-indigo-500/20 border-indigo-500 text-indigo-300",
  "Hábitos": "bg-green-500/20 border-green-500 text-green-300",
  "Descanso": "bg-blue-500/20 border-blue-500 text-blue-300",
  "Reuniões": "bg-purple-500/20 border-purple-500 text-purple-300",
  "Tarefas": "bg-amber-500/20 border-amber-500 text-amber-300",
};

export default function Agenda() {
  const [blocosMentais, setBlocosMentais] = useState<BlocoMental[]>(blocosMentaisIniciais);
  const [activeDay, setActiveDay] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<string>("dia");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [currentFocusBlock, setCurrentFocusBlock] = useState<BlocoMental | null>(null);
  const [tempoRestante, setTempoRestante] = useState<number>(0);

  // Função para marcar um bloco como concluído
  const marcarConcluido = (id: string) => {
    setBlocosMentais(blocos => 
      blocos.map(bloco => 
        bloco.id === id 
          ? { ...bloco, concluido: !bloco.concluido } 
          : bloco
      )
    );
    toast.success("Status do bloco atualizado!");
  };

  // Função para ativar o modo foco em um bloco específico
  const ativarModoFoco = (bloco: BlocoMental) => {
    setCurrentFocusBlock(bloco);
    setFocusMode(true);
    // Calcular tempo em minutos para o cronômetro (exemplo: 30 minutos)
    setTempoRestante(30 * 60);
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
  const totalBlocos = blocosMentais.length;
  const blocosConcluidos = blocosMentais.filter(bloco => bloco.concluido).length;
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
            <h3 className="text-xl font-bold mb-2">{currentFocusBlock.atividade}</h3>
            <p className="text-muted-foreground">{currentFocusBlock.bloco}</p>
            {currentFocusBlock.subcerebroRelacionado && (
              <Badge variant="outline" className="mt-2">
                {currentFocusBlock.subcerebroRelacionado}
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
              marcarConcluido(currentFocusBlock.id);
              sairModoFoco();
            }}>
              Concluir Bloco
            </Button>
          </div>
        </motion.div>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Novo Bloco Mental
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Bloco Mental</DialogTitle>
                  </DialogHeader>
                  <NovoBlocoMentalForm />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" onClick={() => toast.info("Sincronização com Google Agenda em breve!")}>
                <Calendar className="mr-1 h-4 w-4" /> Sincronizar
              </Button>
              
              <Button variant="secondary" size="sm" onClick={() => toast.success("Sugestões da Athena carregadas!")}>
                Ver sugestões da Athena
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
              {blocosMentais.map((bloco) => (
                <motion.div
                  key={bloco.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border flex justify-between items-center ${coresBloco[bloco.tipo]} ${bloco.concluido ? 'opacity-50' : ''}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{bloco.atividade}</h4>
                      <Badge variant="outline" className="text-xs">
                        {bloco.tipo}
                      </Badge>
                    </div>
                    <div className="text-xs mt-1 opacity-80">{bloco.bloco}</div>
                    {bloco.subcerebroRelacionado && (
                      <div className="text-xs mt-1 opacity-70">
                        Subcérebro: {bloco.subcerebroRelacionado}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => marcarConcluido(bloco.id)}
                    >
                      {bloco.concluido ? 'Desfazer' : 'Concluir'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => ativarModoFoco(bloco)}
                    >
                      Foco
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Painel Lateral - Resumo do Dia */}
        <div className="space-y-6">
          {/* Resumo dos blocos do dia */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
                  className="bg-primary h-2 rounded-full"
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
              {blocosMentais.map((bloco) => (
                <div 
                  key={bloco.id} 
                  className={`flex items-center justify-between py-1 px-2 rounded text-xs ${
                    bloco.concluido ? "line-through opacity-50" : ""
                  }`}
                >
                  <span>{bloco.bloco} - {bloco.atividade}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => marcarConcluido(bloco.id)}
                  >
                    {bloco.concluido ? "↩" : "✓"}
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Estatísticas do dia */}
          <motion.div
            initial={{ opacity: 0, x: 20, delay: 0.2 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-card border border-border p-4"
          >
            <h3 className="text-lg font-medium mb-3">Distribuição Mental</h3>
            <div className="flex items-center justify-around my-4">
              {Object.keys(coresBloco).map((tipo) => (
                <div key={tipo} className="flex flex-col items-center">
                  <div 
                    className={`w-3 h-3 rounded-full ${coresBloco[tipo as TipoBloco].split(' ')[0]}`} 
                  />
                  <div className="text-xs mt-1">{tipo}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Sua distribuição mental está focada em Projetos e Tarefas hoje.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Componente de formulário para criar novo bloco mental
function NovoBlocoMentalForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Novo bloco mental criado!");
    // Aqui você implementaria a lógica para adicionar o novo bloco
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="nome" className="text-sm font-medium">
            Nome do bloco
          </label>
          <input
            id="nome"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ex: Revisão do projeto X"
          />
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="tipo" className="text-sm font-medium">
            Tipo
          </label>
          <select
            id="tipo"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Projetos">Projetos</option>
            <option value="Hábitos">Hábitos</option>
            <option value="Descanso">Descanso</option>
            <option value="Reuniões">Reuniões</option>
            <option value="Tarefas">Tarefas</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="horarioInicio" className="text-sm font-medium">
              Horário de início
            </label>
            <input
              id="horarioInicio"
              type="time"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="horarioFim" className="text-sm font-medium">
              Horário de término
            </label>
            <input
              id="horarioFim"
              type="time"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="subcerebroRelacionado" className="text-sm font-medium">
            Subcérebro relacionado
          </label>
          <select
            id="subcerebroRelacionado"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione...</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Bem-estar">Bem-estar</option>
            <option value="Conhecimento">Conhecimento</option>
            <option value="Criatividade">Criatividade</option>
          </select>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="descricao" className="text-sm font-medium">
            Descrição (opcional)
          </label>
          <textarea
            id="descricao"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Detalhes sobre este bloco mental..."
          ></textarea>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Sugestão da Athena: Reserve 25 minutos para este bloco e associe ao subcérebro de Produtividade.")}
        >
          Sugestão da Athena
        </Button>
        <Button type="submit">Criar Bloco</Button>
      </div>
    </form>
  );
}
