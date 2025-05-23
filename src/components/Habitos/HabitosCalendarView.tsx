
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Plus, Check, Calendar as CalendarIcon, Settings, ChevronLeft, ChevronRight, BarChart3, Zap, Unlink } from "lucide-react";
import { Habito } from "./HabitoCard";
import { useHabitos } from "@/hooks/useHabitos";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface HabitosCalendarViewProps {
  habitos: Habito[];
}

interface CheckInData {
  habit_id: string;
  checked_in_at: string;
  habit_name?: string;
  habit_icon?: string;
}

interface DayStatus {
  date: Date;
  completed: number;
  total: number;
  isToday: boolean;
  status: 'none' | 'partial' | 'complete';
}

export function HabitosCalendarView({ habitos }: HabitosCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDateCheckIns, setSelectedDateCheckIns] = useState<CheckInData[]>([]);
  const [checkInsByDate, setCheckInsByDate] = useState<Map<string, CheckInData[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [isConnectedToGoogle, setIsConnectedToGoogle] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { checkInHabit } = useHabitos();

  useEffect(() => {
    if (selectedDate) {
      fetchCheckInsForDate(selectedDate);
    }
    fetchAllCheckIns();
    checkGoogleConnection();
  }, [selectedDate, habitos]);

  const checkGoogleConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('external_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'google_calendar')
        .single();

      setIsConnectedToGoogle(!!data);
    } catch (error) {
      console.error("Erro ao verificar conexão Google:", error);
    }
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const fetchAllCheckIns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar check-ins do mês atual
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('habit_check_ins')
        .select(`
          habit_id,
          checked_in_at,
          habits:habits(name, icon)
        `)
        .eq('user_id', user.id)
        .gte('checked_in_at', startOfMonth.toISOString())
        .lte('checked_in_at', endOfMonth.toISOString());

      if (error) throw error;

      const checkInsMap = new Map<string, CheckInData[]>();
      data?.forEach(item => {
        const dateKey = formatDateKey(new Date(item.checked_in_at));
        const checkIn = {
          habit_id: item.habit_id,
          checked_in_at: item.checked_in_at,
          habit_name: item.habits?.name,
          habit_icon: item.habits?.icon
        };

        if (checkInsMap.has(dateKey)) {
          checkInsMap.get(dateKey)!.push(checkIn);
        } else {
          checkInsMap.set(dateKey, [checkIn]);
        }
      });

      setCheckInsByDate(checkInsMap);
    } catch (error) {
      console.error("Erro ao buscar check-ins do mês:", error);
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
    if (selectedDate) {
      fetchCheckInsForDate(selectedDate);
      fetchAllCheckIns();
    }
  };

  const getDayStatus = (date: Date): DayStatus => {
    const dateKey = formatDateKey(date);
    const dayCheckIns = checkInsByDate.get(dateKey) || [];
    const totalHabits = habitos.length;
    const completedHabits = dayCheckIns.length;
    
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    let status: 'none' | 'partial' | 'complete' = 'none';
    if (completedHabits === 0) {
      status = 'none';
    } else if (completedHabits < totalHabits) {
      status = 'partial';
    } else {
      status = 'complete';
    }

    return {
      date,
      completed: completedHabits,
      total: totalHabits,
      isToday,
      status
    };
  };

  const getHabitsForDate = (): Habito[] => {
    const checkedHabitIds = selectedDateCheckIns.map(ci => ci.habit_id);
    return habitos.filter(habito => !checkedHabitIds.includes(habito.id!));
  };

  const connectGoogleCalendar = () => {
    toast({
      title: "Conectar Google Calendar",
      description: "Funcionalidade em desenvolvimento. Em breve você poderá conectar sua conta do Google Calendar!",
    });
  };

  const disconnectGoogleCalendar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('external_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', 'google_calendar');

      setIsConnectedToGoogle(false);
      toast({
        title: "Desconectado",
        description: "Google Calendar foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar o Google Calendar.",
        variant: "destructive"
      });
    }
  };

  const successRate = habitos.length > 0 
    ? Math.round((selectedDateCheckIns.length / habitos.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header com integrações Google Calendar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-dashed border-blue-200/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gradient">Integração Google Calendar</span>
              </div>
              <div className="flex gap-2">
                {isConnectedToGoogle ? (
                  <>
                    <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
                      <Check className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={disconnectGoogleCalendar}
                      className="border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <Unlink className="w-4 h-4 mr-1" />
                      Desconectar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Configurar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={connectGoogleCalendar}
                      className="border-blue-300 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Conectar Conta
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={connectGoogleCalendar}
                      className="bg-blue-600 hover:bg-blue-700 glow"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Sincronizar Hábitos
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnectedToGoogle ? (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Zap className="w-4 h-4" />
                Seus hábitos estão sincronizados com o Google Calendar. Configure lembretes e horários personalizados.
              </div>
            ) : (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Conecte sua conta do Google Calendar para sincronizar seus hábitos automaticamente e receber lembretes personalizados.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-gradient">Calendário de Hábitos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[120px] text-center">
                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border w-full"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                  month: "space-y-4 w-full flex flex-col",
                  table: "w-full h-full border-collapse space-y-1",
                  head_row: "",
                  row: "w-full mt-2",
                  cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative",
                  day_selected: "bg-primary/20 text-primary border border-primary/50 font-semibold shadow-lg",
                  day_today: "bg-accent/50 text-accent-foreground font-bold shadow-md ring-2 ring-primary/50",
                  day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                components={{
                  Day: ({ date, ...props }) => {
                    const dayStatus = getDayStatus(date);
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    
                    let statusColor = "bg-gray-500/20";
                    if (dayStatus.status === 'complete') statusColor = "bg-green-500/30";
                    else if (dayStatus.status === 'partial') statusColor = "bg-orange-500/30";
                    
                    return (
                      <motion.button
                        {...props}
                        className={`
                          h-12 w-12 p-0 font-normal relative rounded-lg transition-all duration-200
                          ${isSelected ? 'ring-2 ring-primary/60 bg-primary/10 shadow-lg scale-105' : 'hover:bg-accent/50'}
                          ${dayStatus.isToday ? 'ring-2 ring-amber-400/60 shadow-amber-400/20 shadow-lg' : ''}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="relative z-10">{date.getDate()}</span>
                        {/* Status indicator */}
                        <div 
                          className={`absolute inset-0 rounded-lg ${statusColor} transition-colors duration-200`}
                        />
                        {/* Progress dots */}
                        {dayStatus.total > 0 && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {Array.from({ length: Math.min(dayStatus.total, 3) }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  i < dayStatus.completed ? 'bg-green-400' : 'bg-gray-400/50'
                                }`}
                              />
                            ))}
                            {dayStatus.total > 3 && (
                              <span className="text-xs text-muted-foreground">+</span>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Painel lateral */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-gradient">
                  {selectedDate?.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Carregando...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Check-ins já realizados */}
                    {selectedDateCheckIns.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-green-400 flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Hábitos Concluídos
                        </h4>
                        <div className="space-y-2">
                          {selectedDateCheckIns.map((checkIn) => (
                            <motion.div
                              key={checkIn.habit_id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
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
                              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                <Check className="w-3 h-3 mr-1" /> Feito
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hábitos pendentes */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-orange-400">Hábitos Pendentes</h4>
                      {getHabitsForDate().length > 0 ? (
                        <div className="space-y-2">
                          {getHabitsForDate().map((habito) => (
                            <motion.div
                              key={habito.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50 hover:border-border/80 transition-colors"
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
                                className="bg-primary/10 hover:bg-primary/20 border-primary/30 btn-glow"
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
                          <div className="text-sm">Nenhum hábito para esta data</div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8 bg-green-500/5 rounded-lg border border-green-500/20">
                          <div className="mb-2">🎉</div>
                          <div className="text-sm font-medium text-green-400">Todos os hábitos concluídos!</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Resumo do dia */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gradient">Resumo do Dia</span>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Relatório
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso do Dia</span>
                      <span className="font-medium text-primary">{successRate}%</span>
                    </div>
                    <Progress value={successRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="font-bold text-green-400">{selectedDateCheckIns.length}</div>
                      <div className="text-xs text-muted-foreground">Concluídos</div>
                    </div>
                    <div className="text-center p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="font-bold text-orange-400">{habitos.length - selectedDateCheckIns.length}</div>
                      <div className="text-xs text-muted-foreground">Pendentes</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Streak mais longo:</span>
                    <span className="font-medium text-primary">
                      {habitos.length > 0 
                        ? Math.max(...habitos.map(h => h.streak), 0) 
                        : 0} dias 🔥
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
