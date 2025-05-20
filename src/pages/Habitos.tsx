import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { HabitoCard, Habito } from "@/components/Habitos/HabitoCard";
import { NovoHabitoModal } from "@/components/Habitos/NovoHabitoModal";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const defaultHabitos: Habito[] = [
  {
    nome: "Caminhada matinal",
    proposito: "Mais energia e foco",
    frequencia: "Diário",
    progresso: 75,
    streak: 5,
    ultimoCheck: "Hoje",
    icone: "☀️",
    observacaoIA: "Continue assim!",
    tags: ["saúde", "manhã"],
  },
  {
    nome: "Leitura",
    proposito: "Expansão da mente",
    frequencia: "Diário",
    progresso: 50,
    streak: 3,
    ultimoCheck: "Ontem",
    icone: "📚",
    observacaoIA: "Que tal ler algo novo?",
    tags: ["conhecimento", "relaxamento"],
  },
  {
    nome: "Meditação",
    proposito: "Redução do stress",
    frequencia: "Diário",
    progresso: 100,
    streak: 7,
    ultimoCheck: "Hoje",
    icone: "🧘",
    observacaoIA: "Sua mente agradece!",
    tags: ["saúde mental", "mindfulness"],
  },
  {
    nome: "Exercício físico",
    proposito: "Melhora da saúde",
    frequencia: "3x semana",
    progresso: 25,
    streak: 1,
    ultimoCheck: "Há 2 dias",
    icone: "🏋️‍♀️",
    observacaoIA: "Não desista!",
    tags: ["saúde", "fitness"],
  },
];

export default function Habitos() {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para ver seus hábitos",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Erro ao buscar hábitos",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data) {
        const mappedHabits: Habito[] = data.map(habit => ({
          id: habit.id,
          nome: habit.name,
          proposito: habit.description || '',
          frequencia: habit.frequency || 'Diário',
          progresso: habit.progress || 0,
          streak: 0, // You might need to fetch or calculate this
          ultimoCheck: 'N/A', // You might need to fetch or calculate this
          observacaoIA: 'N/A', // You might need to fetch or calculate this
          tags: [], // You might need to fetch or calculate this
        }));
        setHabitos(mappedHabits);
      }
    } catch (error) {
      console.error("Erro ao buscar hábitos:", error);
      toast({
        title: "Erro ao buscar hábitos",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  const addHabit = async (nome: string, proposito: string, frequencia: string) => {
    try {
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para adicionar um hábito",
          variant: "destructive"
        });
        return;
      }

      const newHabit = {
        name: nome,
        description: proposito,
        frequency: frequencia,
        user_id: user.id,
        goal: 100,
        progress: 0
      };

      const { data, error } = await supabase.from('habits').insert(newHabit);

      if (error) {
        toast({
          title: "Erro ao adicionar hábito",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Hábito adicionado com sucesso!",
        description: "Continue acompanhando seu progresso",
      });
      
      // Recarregar hábitos após adicionar um novo
      fetchHabits();
    } catch (error) {
      console.error("Erro ao adicionar hábito:", error);
      toast({
        title: "Erro ao adicionar hábito",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  const handleCheckIn = () => {
    toast({
      title: "Check-in realizado!",
      description: "Continue assim para alcançar seus objetivos.",
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Hábitos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Hábito
        </Button>
      </div>

      {/* Modal de Novo Hábito */}
      <NovoHabitoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={addHabit}
      />

      {/* Grid de Hábitos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {habitos.map((habito) => (
          <HabitoCard key={habito.nome} habito={habito} onCheckIn={handleCheckIn} />
        ))}
      </div>

      {/* Empty State */}
      {habitos.length === 0 && (
        <div className="text-center text-muted-foreground">
          Nenhum hábito cadastrado. Comece adicionando um novo!
        </div>
      )}
    </div>
  );
}
