
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Plus } from "lucide-react";
import { Habito } from "./HabitoCard";
import { useHabitos } from "@/hooks/useHabitos";
import { toast } from "@/components/ui/use-toast";

interface HabitosCalendarViewProps {
  habitos: Habito[];
}

export function HabitosCalendarView({ habitos }: HabitosCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { checkInHabit } = useHabitos();

  const handleCheckIn = async (habitId: string) => {
    await checkInHabit(habitId);
  };

  const connectGoogleCalendar = () => {
    // Implementação da conexão com Google Calendar
    toast({
      title: "Google Calendar",
      description: "Funcionalidade de integração com Google Calendar será implementada em breve!",
    });
  };

  const exportToGoogleCalendar = () => {
    // Implementação da exportação para Google Calendar
    toast({
      title: "Exportar para Google Calendar",
      description: "Seus hábitos serão exportados para o Google Calendar em breve!",
    });
  };

  const getHabitsForDate = (date: Date) => {
    // Aqui você pode implementar lógica para buscar hábitos específicos da data
    // Por enquanto, retorna todos os hábitos ativos
    return habitos;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Calendário de Hábitos
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={connectGoogleCalendar}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Conectar Google Calendar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportToGoogleCalendar}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Exportar
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                month: "space-y-4 w-full flex flex-col",
                table: "w-full h-full border-collapse space-y-1",
                head_row: "",
                row: "w-full mt-2",
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Lista de hábitos para a data selecionada */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Hábitos para {selectedDate?.toLocaleDateString('pt-BR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDate && getHabitsForDate(selectedDate).length > 0 ? (
              getHabitsForDate(selectedDate).map((habito) => (
                <div
                  key={habito.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{habito.icone}</span>
                    <div>
                      <div className="font-medium">{habito.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {habito.frequencia}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {habito.progresso}%
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => habito.id && handleCheckIn(habito.id)}
                    >
                      Check-in
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <div className="mb-2">📅</div>
                <div className="text-sm">Nenhum hábito programado para esta data</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo da semana */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hábitos completados:</span>
                <span className="font-medium">12/21</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxa de sucesso:</span>
                <span className="font-medium text-green-500">57%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Streak mais longo:</span>
                <span className="font-medium">8 dias 🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
