
import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { HabitoCard, Habito } from "@/components/Habitos/HabitoCard";
import { NovoHabitoModal } from "@/components/Habitos/NovoHabitoModal";
import { HabitosViewSwitcher } from "@/components/Habitos/HabitosViewSwitcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Usamos o tipo existente, mas adaptamos para o formato do Supabase
type HabitoSupabase = {
  id: string;
  name: string;
  description: string;
  frequency: string;
  goal: number | null;
  progress: number | null;
  user_id: string;
  created_at: string | null;
};

// Função para converter dados do Supabase para o formato usado no componente
const mapSupabaseToHabito = (habitoSupabase: HabitoSupabase): Habito => {
  // Calcula o progresso em porcentagem
  const progressPercent = habitoSupabase.progress && habitoSupabase.goal 
    ? Math.round((habitoSupabase.progress / habitoSupabase.goal) * 100)
    : 0;

  // Calcula o último check (mockado por enquanto)
  const daysAgo = Math.floor(Math.random() * 5);
  let ultimoCheck = "Hoje";
  if (daysAgo === 1) ultimoCheck = "Ontem";
  else if (daysAgo > 1) ultimoCheck = `${daysAgo} dias atrás`;

  return {
    nome: habitoSupabase.name,
    proposito: habitoSupabase.description || "Sem descrição",
    frequencia: habitoSupabase.frequency || "Diário",
    progresso: progressPercent,
    streak: Math.floor(Math.random() * 20), // Mockado por enquanto
    ultimoCheck,
    observacaoIA: "Integrado com Athena IA.", // Mockado por enquanto
    tags: ["novo"], // Mockado por enquanto
    id: habitoSupabase.id // Adicionamos o ID para referência
  };
};

export default function Habitos() {
  const [view, setView] = useState("grid");
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [freqFiltro, setFreqFiltro] = useState("todos");
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função para carregar hábitos do Supabase
  const carregarHabitos = async () => {
    try {
      setLoading(true);
      
      // Buscar os hábitos do usuário atual
      const { data, error } = await supabase
        .from('habits')
        .select('*');
      
      if (error) {
        console.error("Erro ao buscar hábitos:", error);
        toast({
          title: "Erro ao carregar hábitos",
          description: "Não foi possível buscar seus hábitos. Por favor, tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Se temos dados, mapeamos para nosso formato
      if (data && data.length > 0) {
        const habitosMapeados = data.map(habito => mapSupabaseToHabito(habito as HabitoSupabase));
        setHabitos(habitosMapeados);
      } else {
        // Se não há dados, usamos os dados mockados para demonstração
        setHabitos(MOCK_HABITOS.map(h => ({ ...h, id: Math.random().toString() })));
      }
    } catch (err) {
      console.error("Erro ao processar hábitos:", err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um problema ao processar seus hábitos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar hábitos ao montar o componente
  useEffect(() => {
    carregarHabitos();
  }, []);

  // Função para registrar check-in de um hábito
  const handleCheckIn = async (habitoId: string) => {
    try {
      const habito = habitos.find(h => h.id === habitoId);
      if (!habito) return;
      
      // Incrementar o progresso (mockado por enquanto)
      toast({
        title: "Check-in registrado!",
        description: `Você registrou um check-in para "${habito.nome}"`,
      });
      
      // Recarregar hábitos após o check-in
      // carregarHabitos(); // Descomentaremos quando implementarmos a funcionalidade completa
    } catch (err) {
      console.error("Erro ao fazer check-in:", err);
      toast({
        title: "Erro ao registrar check-in",
        description: "Não foi possível registrar seu check-in. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Função para criar novo hábito
  const handleCriarHabito = async (nome: string, proposito: string, frequencia: string) => {
    try {
      // Inserir novo hábito no Supabase
      const { data, error } = await supabase
        .from('habits')
        .insert([
          { 
            name: nome, 
            description: proposito, 
            frequency: frequencia,
            goal: 1, // Valor padrão
            progress: 0 // Inicia em 0
          }
        ])
        .select();
        
      if (error) {
        console.error("Erro ao criar hábito:", error);
        toast({
          title: "Erro ao criar hábito",
          description: "Não foi possível criar seu hábito. Por favor, tente novamente.",
          variant: "destructive"
        });
        return;
      }
      
      // Feedback para o usuário
      toast({
        title: "Hábito criado!",
        description: `O hábito "${nome}" foi criado com sucesso.`,
      });
      
      // Recarregar hábitos para mostrar o novo
      carregarHabitos();
    } catch (err) {
      console.error("Erro ao processar criação de hábito:", err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um problema ao criar seu hábito.",
        variant: "destructive"
      });
    }
  };
  
  // Filtrar hábitos conforme busca e filtros
  const habitosFiltrados = habitos.filter(
    (h) =>
      h.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (freqFiltro === "todos" || h.frequencia === freqFiltro)
  );

  // MOCK_HABITOS como fallback ou para desenvolvimento
  const MOCK_HABITOS: Habito[] = [
    {
      nome: "Leitura",
      proposito: "Para ganhar foco e disciplina",
      frequencia: "Diário",
      progresso: 86,
      streak: 12,
      ultimoCheck: "Hoje",
      observacaoIA: "Potencializa seu projeto X.",
      tags: ["foco", "mental"],
    },
    {
      nome: "Exercício",
      proposito: "Mais energia física",
      frequencia: "3x semana",
      progresso: 66,
      streak: 5,
      ultimoCheck: "Ontem",
      observacaoIA: "Mais disposição para estudar.",
      tags: ["saúde", "energia"],
    },
    {
      nome: "Meditação",
      proposito: "Reduzir estresse",
      frequencia: "Semanal",
      progresso: 44,
      streak: 3,
      ultimoCheck: "3 dias atrás",
      observacaoIA: "Ajuda no projeto de autoconhecimento.",
      tags: ["mente", "relax"],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-2">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#60B5F5] to-[#993887] leading-tight mb-1">
            Hábitos em Evolução
          </h2>
          <div className="text-sm text-foreground/60">"Cada hábito é uma célula viva. Ao cuidar dela, você fortalece sua mente."</div>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="w-4" /> <span className="hidden xs:inline">Novo Hábito</span>
          </Button>
          <HabitosViewSwitcher active={view} setActive={setView} />
        </div>
      </motion.div>

      {/* TOOLBAR FILTROS - improved for mobile */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-card border rounded-lg px-2 items-center">
          <Search className="w-4 text-muted-foreground" />
          <Input
            className="w-[100px] xs:w-[140px] bg-transparent border-none text-foreground focus:ring-0 focus:border-b focus:border-primary/80"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select 
          value={freqFiltro} 
          onChange={e => setFreqFiltro(e.target.value)} 
          className="rounded bg-card px-2 border text-foreground text-sm"
        >
          <option value="todos">Todas frequências</option>
          <option value="Diário">Diário</option>
          <option value="3x semana">3x semana</option>
          <option value="Semanal">Semanal</option>
        </select>
        <Button size="sm" variant="ghost" className="gap-1">
          <Filter className="w-4" /> 
          <span className="hidden xs:inline">Tags</span>
        </Button>
        <Button size="sm" variant="ghost" className="gap-1">
          <Filter className="w-4" /> 
          <span className="hidden xs:inline">Intenção</span>
        </Button>
      </div>

      {/* Estado de carregamento */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Carregando seus hábitos...</p>
        </div>
      )}

      {/* GRADE / OUTRAS VIEWS */}
      {!loading && view === "grid" && (
        <motion.div 
          initial="hidden" animate="visible" 
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {habitosFiltrados.length > 0 ? (
            habitosFiltrados.map((habito) => (
              <HabitoCard 
                key={habito.id || habito.nome} 
                habito={habito} 
                onCheckIn={() => handleCheckIn(habito.id || "")} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">Nenhum hábito encontrado. Que tal criar um novo?</p>
              <Button onClick={() => setModalOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Criar Hábito
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {!loading && view !== "grid" && (
        <div className="rounded-xl border border-primary/40 bg-card/80 p-4 sm:p-10 flex flex-col items-center justify-center min-h-[260px] text-lg text-primary/70 font-bold shadow-inner">
          {view === "calendar" && <span>Visualização de calendário de hábitos (mock)</span>}
          {view === "relatorio" && <span>Relatório de hábitos com gráficos (mock)</span>}
        </div>
      )}

      {/* MODAL DE NOVO HÁBITO */}
      <NovoHabitoModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSubmit={handleCriarHabito}
      />
    </div>
  );
}
