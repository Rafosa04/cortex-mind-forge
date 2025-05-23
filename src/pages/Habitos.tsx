
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HabitoCard } from "@/components/Habitos/HabitoCard";
import { NovoHabitoModal } from "@/components/Habitos/NovoHabitoModal";
import { HabitosViewSwitcher } from "@/components/Habitos/HabitosViewSwitcher";
import { HabitosCalendarView } from "@/components/Habitos/HabitosCalendarView";
import { useHabitos } from "@/hooks/useHabitos";

export default function Habitos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("grid");
  const { habitos, loading, addHabit, checkInHabit, deleteHabit } = useHabitos();

  const handleCheckIn = (habitId?: string) => {
    if (habitId) {
      checkInHabit(habitId);
    }
  };

  const handleDelete = (habitId?: string) => {
    if (habitId) {
      deleteHabit(habitId);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meus Hábitos</h1>
          <Button disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Carregando...
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Hábitos</h1>
        <div className="flex items-center gap-4">
          <HabitosViewSwitcher active={activeView} setActive={setActiveView} />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Hábito
          </Button>
        </div>
      </div>

      {/* Modal de Novo Hábito */}
      <NovoHabitoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={addHabit}
      />

      {/* Conteúdo baseado na visualização ativa */}
      {activeView === "calendar" ? (
        <HabitosCalendarView habitos={habitos} />
      ) : activeView === "relatorio" ? (
        <div className="text-center text-muted-foreground py-12">
          <div className="mb-4">
            <span className="text-6xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Relatórios em desenvolvimento</h3>
          <p className="text-sm">Esta funcionalidade será implementada em breve!</p>
        </div>
      ) : (
        <>
          {/* Grid de Hábitos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {habitos.map((habito) => (
              <HabitoCard 
                key={habito.id} 
                habito={habito} 
                onCheckIn={() => handleCheckIn(habito.id)}
                onDelete={() => handleDelete(habito.id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {habitos.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-12">
              <div className="mb-4">
                <span className="text-6xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum hábito cadastrado</h3>
              <p className="text-sm mb-4">Comece adicionando um novo hábito para acompanhar seu progresso!</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Hábito
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
