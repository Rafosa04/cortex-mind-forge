
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Trophy, Clock } from "lucide-react";
import { Habito } from "./HabitoCard";

interface HabitosRelatorioViewProps {
  habitos: Habito[];
}

export function HabitosRelatorioView({ habitos }: HabitosRelatorioViewProps) {
  // Calcular estatísticas
  const totalHabits = habitos.length;
  const completedToday = habitos.filter(h => {
    const lastCheckDate = h.ultimoCheck ? new Date(h.ultimoCheck) : null;
    const today = new Date();
    return lastCheckDate && 
           lastCheckDate.getDate() === today.getDate() &&
           lastCheckDate.getMonth() === today.getMonth() &&
           lastCheckDate.getFullYear() === today.getFullYear();
  }).length;
  
  const averageProgress = totalHabits > 0 
    ? Math.round(habitos.reduce((sum, h) => sum + h.progresso, 0) / totalHabits)
    : 0;
  
  const habitosSorted = [...habitos].sort((a, b) => b.streak - a.streak);
  const topHabits = habitosSorted.slice(0, 3);
  
  // Encontrar horário mais comum de check-in (mockado por enquanto)
  const bestTime = "Entre 06:00 e 08:00";
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cards de estatísticas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Hábitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHabits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ativos e em andamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completados Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday} / {totalHabits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((completedToday / totalHabits) * 100) || 0}% de conclusão
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Nos últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Melhor Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Maior taxa de conclusão
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Hábitos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Hábitos Mais Consistentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topHabits.length > 0 ? (
              topHabits.map((habito, index) => (
                <div key={habito.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {habito.icone} {habito.nome}
                      </div>
                      <div className="text-sm text-muted-foreground">{habito.frequencia}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-semibold">{habito.streak}🔥</span>
                    <Badge variant="outline">{habito.progresso}%</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <div className="mb-2">🏆</div>
                <div className="text-sm">Continue seu progresso para ver seus hábitos mais consistentes aqui!</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recomendações da Athena */}
      <Card className="border-cyan-500/30 shadow-[0_0_10px_rgba(96,181,181,0.2)]">
        <CardHeader>
          <CardTitle className="text-gradient">Recomendações da Athena</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-card/50 rounded-lg border border-cyan-500/20">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-cyan-400 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-cyan-400">Melhore sua consistência</h4>
                <p className="text-xs text-muted-foreground">
                  Seus dados mostram que você tem maior sucesso quando completa seus hábitos pela manhã. 
                  Considere ajustar seu cronograma para aproveitar esse padrão.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-card/50 rounded-lg border border-cyan-500/20">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-cyan-400 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-cyan-400">Reorganize sua semana</h4>
                <p className="text-xs text-muted-foreground">
                  Você tende a falhar mais às segundas-feiras. Considere começar com hábitos mais fáceis neste dia
                  ou movê-los para terça, quando você tem um histórico melhor.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-card/50 rounded-lg border border-cyan-500/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-cyan-400">Mantenha o momento</h4>
                <p className="text-xs text-muted-foreground">
                  Seus hábitos têm mostrado progresso constante nas últimas semanas. Continue assim 
                  e considere adicionar um novo hábito complementar para maximizar seus resultados.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
