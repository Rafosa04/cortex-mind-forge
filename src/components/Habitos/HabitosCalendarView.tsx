
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Plus, Check, Calendar as CalendarIcon, Settings } from "lucide-react";
import { Habito } from "./HabitoCard";
import { useHabitos } from "@/hooks/useHabitos";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface HabitosCalendarViewProps {
  habitos: Habito[];
}

interface CheckInData {
  habit_id: string;
  checked_in_at: string;
  habit_name?: string;
  habit_icon?: string;
}

export function HabitosCalendarView({ habitos }: HabitosCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDateCheckIns, setSelectedDateCheckIns] = useState<CheckInData[]>([]);
  const [checkInDates, setCheckInDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const { checkInHabit } = useHabitos();

  useEffect(() => {
    if (selectedDate) {
      fetchCheckInsForDate(selectedDate);
      fetchAllCheckInDates();
    }
  }, [selectedDate, habitos]);

  const formatDateForQuery = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const fetchAllCheckInDates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('habit_check_ins')
        .select('checked_in_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const dates = data?.map(item => new Date(item.checked_in_at)) || [];
      setCheckInDates(dates);
    } catch (error) {
      console.error("Erro ao buscar datas de check-in:", error);
    }
  };

  const fetchCheckInsForDate = async (date: Date) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('habit_check_ins')
        .select(`
          habit_id,
          checked_in_at,
          habits:habits(name, icon)
        `)
        .eq('user_id', user.id)
        .gte('checked_in_at', startOfDay.toISOString())
        .lte('checked_in_at', endOfDay.toISOString());

      if (error) throw error;

      const checkIns = data?.map(item => ({
        habit_id: item.habit_id,
        checked_in_at: item.checked_in_at,
        habit_name: item.habits?.name,
        habit_icon: item.habits?.icon
      })) || [];
      
      setSelectedDateCheckIns(checkIns);
    } catch (error) {
      console.error("Erro ao buscar check-ins:", error);
      toast({
        title: "Erro ao carregar check-ins",
        description: "Não foi possível carregar os check-ins para esta data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (habitId: string) => {
    await checkInHabit(habitId);
    // Atualizar a lista de check-ins após o check-in
    if (selectedDate) {
      fetchCheckInsForDate(selectedDate);
      fetchAllCheckInDates();
    }
  };

  const connectGoogleCalendar = () => {
    toast({
      title: "Conectar Google Calendar",
      description: "Funcionalidade em desenvolvimento. Em breve você poderá conectar sua conta do Google Calendar!",
    });
  };

  const exportToGoogleCalendar = () => {
    toast({
      title: "Exportar Hábitos",
      description: "Em breve você poderá exportar seus hábitos como eventos do Google Calendar!",
    });
  };

  const syncWithGoogleCalendar = () => {
    toast({
      title: "Sincronizar Calendário",
      description: "Funcionalidade de sincronização automática será implementada em breve!",
    });
  };

  const getHabitsForDate = (): Habito[] => {
    // Retorna os hábitos que ainda não foram marcados nesta data
    const checkedHabitIds = selectedDateCheckIns.map(ci => ci.habit_id);
    return habitos.filter(habito => !checkedHabitIds.includes(habito.id!));
  };

  const isCheckInDate = (date: Date): boolean => {
    return checkInDates.some(checkInDate => 
      checkInDate.getDate() === date.getDate() &&
      checkInDate.getMonth() === date.getMonth() &&
      checkInDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com integrações Google Calendar */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Integração Google Calendar
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={connectGoogleCalendar}
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <ExternalLink className="w-4 h-4" />
                Conectar Conta
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={syncWithGoogleCalendar}
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Settings className="w-4 h-4" />
                Sincronizar
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={exportToGoogleCalendar}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Exportar Hábitos
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            Conecte sua conta do Google Calendar para sincronizar seus hábitos automaticamente e receber lembretes personalizados.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Calendário de Hábitos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                modifiers={{
                  completed: (date) => isCheckInDate(date),
                }}
                modifiersClassNames={{
                  completed: "bg-green-500/20 text-green-700 font-bold border-green-500/30",
                }}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                  month: "space-y-4 w-full flex flex-col",
                  table: "w-full h-full border-collapse space-y-1",
                  head_row: "",
                  row: "w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  day_selected: "bg-primary/10 text-primary border-2 border-primary/50 font-semibold",
                  day_today: "bg-accent/50 text-accent-foreground font-medium",
                  day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Lista de hábitos para a data selecionada */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {selectedDate?.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Carregando check-ins...</p>
                </div>
              ) : (
                <>
                  {/* Check-ins já realizados */}
                  {selectedDateCheckIns.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2 text-green-500">Hábitos Concluídos</h4>
                      <div className="space-y-2">
                        {selectedDateCheckIns.map((checkIn) => (
                          <div
                            key={checkIn.habit_id}
                            className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{checkIn.habit_icon}</span>
                              <div>
                                <div className="font-medium">{checkIn.habit_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(checkIn.checked_in_at).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-500/20 text-green-500">
                              <Check className="w-3 h-3 mr-1" /> Concluído
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hábitos pendentes */}
                  <h4 className="text-sm font-medium mb-2">Hábitos Pendentes</h4>
                  {getHabitsForDate().length > 0 ? (
                    <div className="space-y-2">
                      {getHabitsForDate().map((habito) => (
                        <motion.div
                          key={habito.id}
                          className="flex items-center justify-between p-3 bg-card rounded-lg border"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => habito.id && handleCheckIn(habito.id)}
                            className="bg-primary/10 hover:bg-primary/20 border-primary/30"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Check-in
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : selectedDateCheckIns.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="mb-2">📅</div>
                      <div className="text-sm">Nenhum hábito programado para esta data</div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8 bg-green-500/5 rounded-lg border border-green-500/20">
                      <div className="mb-2">🎉</div>
                      <div className="text-sm">Todos os hábitos foram concluídos para esta data!</div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Resumo da data */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hábitos completados:</span>
                  <span className="font-medium">
                    {selectedDateCheckIns.length}/{habitos.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de sucesso:</span>
                  <span className="font-medium text-green-500">
                    {habitos.length > 0 
                      ? Math.round((selectedDateCheckIns.length / habitos.length) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Streak mais longo:</span>
                  <span className="font-medium">
                    {habitos.length > 0 
                      ? Math.max(...habitos.map(h => h.streak), 0) 
                      : 0} dias 🔥
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
