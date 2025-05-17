
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChartPie, FileText, Star, Link, Download, History } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

// Sample data for visualizations
const habitData = [
  { name: 'Meditação', value: 15, fill: '#60B5B5' },
  { name: 'Leitura', value: 12, fill: '#993887' },
  { name: 'Exercício', value: 8, fill: '#7B61FF' },
  { name: 'Escrever', value: 10, fill: '#4ECDC4' }
];

const emotionData = [
  { name: 'Satisfeito', value: 35, fill: '#60B5B5' },
  { name: 'Reflexivo', value: 25, fill: '#993887' },
  { name: 'Animado', value: 20, fill: '#7B61FF' },
  { name: 'Preocupado', value: 15, fill: '#FFC857' },
  { name: 'Grato', value: 5, fill: '#4ECDC4' }
];

const projectProgressData = [
  { name: 'Jan', project1: 12, project2: 8, project3: 5 },
  { name: 'Fev', project1: 18, project2: 10, project3: 8 },
  { name: 'Mar', project1: 22, project2: 14, project3: 12 },
  { name: 'Abr', project1: 25, project2: 16, project3: 15 },
  { name: 'Mai', project1: 27, project2: 20, project3: 17 },
];

const journalEntriesData = [
  { name: '12/05', entries: 3 },
  { name: '13/05', entries: 2 },
  { name: '14/05', entries: 4 },
  { name: '15/05', entries: 1 },
  { name: '16/05', entries: 5 },
  { name: '17/05', entries: 3 },
  { name: '18/05', entries: 2 },
];

const COLORS = ['#60B5B5', '#993887', '#7B61FF', '#FFC857', '#4ECDC4'];

// Sample recommendations based on data
const recommendations = [
  {
    title: "Reforce seu hábito de meditação",
    description: "Você está 90% consistente. Continue para criar uma base sólida.",
    icon: "🧘",
    category: "habit",
    priority: "high"
  },
  {
    title: "Retome o Projeto Nova Rotina",
    description: "Este projeto está parado há 2 semanas e alinhado com seus objetivos.",
    icon: "📝",
    category: "project",
    priority: "medium"
  },
  {
    title: "Explore seu Subcérebro Criativo",
    description: "Você não acessa esta área há 10 dias. Pode haver ideias a explorar.",
    icon: "🧠",
    category: "subbrain",
    priority: "medium"
  },
  {
    title: "Considere um novo projeto de escrita",
    description: "Seus registros de diário mostram potencial para expressão criativa.",
    icon: "✍️",
    category: "suggestion",
    priority: "low"
  }
];

export default function Insights() {
  const [timeFrame, setTimeFrame] = useState("week");
  const [athenaAnalysisActive, setAthenaAnalysisActive] = useState(false);

  const handleGenerateAnalysis = () => {
    setAthenaAnalysisActive(true);
    // In a real app, this would trigger an API call to generate a new analysis
    setTimeout(() => {
      // Simulate analysis completion
    }, 1500);
  };

  // Helper to format date periods
  const getTimeframePeriod = () => {
    const endDate = new Date();
    let startDate;
    
    switch(timeFrame) {
      case "week":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }
    
    return `${format(startDate, "d 'de' MMMM", { locale: ptBR })} - ${format(endDate, "d 'de' MMMM", { locale: ptBR })}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-primary drop-shadow mb-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Insights da Mente
        </motion.h2>
        
        <p className="text-foreground/70 text-sm italic mb-6 max-w-2xl">
          "Dados te mostram o que foi. Insights te revelam quem você está se tornando."
        </p>

        {/* Time Frame Selector */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Últimos 30 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          <span className="text-foreground/70">
            {getTimeframePeriod()}
          </span>
          
          <div className="flex-1"></div>
          
          <Button 
            variant="default" 
            onClick={handleGenerateAnalysis}
            className="gap-2 bg-primary hover:bg-secondary text-primary-foreground"
          >
            <span className="rounded-full bg-background/20 w-6 h-6 inline-flex items-center justify-center text-primary-foreground">
              ✨
            </span>
            Gerar análise com Athena
          </Button>
        </div>

        {/* Athena Welcome */}
        <motion.div 
          className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-background/30 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="rounded-full bg-secondary/20 w-12 h-12 flex items-center justify-center text-xl">
            🧠
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground/90">Athena</h3>
            <p className="text-foreground/70">Vamos entender o que sua mente vem criando...</p>
          </div>
        </motion.div>
      </motion.header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Mental Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs for different insight categories */}
          <Tabs defaultValue="habits" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="habits">🧩 Hábitos</TabsTrigger>
              <TabsTrigger value="projects">🧠 Projetos</TabsTrigger>
              <TabsTrigger value="journal">💬 Diário</TabsTrigger>
              <TabsTrigger value="connections">🔗 Conexões</TabsTrigger>
            </TabsList>
            
            {/* Habits Tab */}
            <TabsContent value="habits" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-md font-medium mb-4">Consistência de hábitos</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={habitData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {habitData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-md font-medium mb-4">Horário com maior adesão</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { time: 'Manhã', count: 15 },
                            { time: 'Tarde', count: 8 },
                            { time: 'Noite', count: 12 }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="count" fill="#60B5B5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-md font-medium mb-4">Progresso em projetos</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={projectProgressData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="project1" stroke="#60B5B5" strokeWidth={2} />
                        <Line type="monotone" dataKey="project2" stroke="#993887" strokeWidth={2} />
                        <Line type="monotone" dataKey="project3" stroke="#7B61FF" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Journal Tab */}
            <TabsContent value="journal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-md font-medium mb-4">Emoções predominantes</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={emotionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {emotionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-md font-medium mb-4">Registro de entradas</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={journalEntriesData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="entries" fill="#993887" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-md font-medium mb-4">Palavras mais utilizadas</h3>
                  <div className="bg-[#191933]/50 rounded-xl p-4 h-24 flex flex-wrap gap-2 items-center justify-center">
                    {['Crescimento', 'Foco', 'Propósito', 'Mente', 'Aprendizado', 'Evolução', 'Desafio', 'Clareza'].map((word, index) => (
                      <span 
                        key={index} 
                        className="text-foreground/80" 
                        style={{ 
                          fontSize: `${1 + (Math.random() * 0.8)}rem`,
                          opacity: 0.7 + (Math.random() * 0.3)
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Connections Tab */}
            <TabsContent value="connections" className="space-y-4">
              <Card>
                <CardContent className="pt-6 pb-6">
                  <h3 className="text-md font-medium mb-6">Subcérebros mais ativos</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Criativo", percent: 78 },
                      { name: "Organizacional", percent: 65 },
                      { name: "Desenvolvimento pessoal", percent: 52 },
                      { name: "Aprendizado", percent: 40 }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="text-primary">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-border/50 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: '0%' }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Athena Analysis Section */}
          <motion.div 
            className="border border-secondary/30 rounded-xl bg-card/50 p-6 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-secondary/30 w-10 h-10 flex items-center justify-center text-lg">
                ✨
              </span>
              <h3 className="text-lg font-medium text-foreground/90">Análise da Athena</h3>
            </div>
            
            <p className="text-foreground/80 leading-relaxed border-l-2 border-secondary/50 pl-4 py-1 italic">
              "Nesta semana, você manteve 87% de consistência em seus hábitos e avançou em 2 projetos criativos. 
              Suas entradas de diário apontaram foco em propósito e produtividade. 
              Há uma correlação interessante entre seus momentos reflexivos e progressos nos projetos."
            </p>
            
            <div className="pt-2">
              <h4 className="text-md font-medium mb-2">Padrões detectados:</h4>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Maior produtividade nas manhãs de segunda e quarta</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Temas de autocuidado têm diminuído nos registros de diário</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Aumento de 23% nas conexões mentais entre subcérebro criativo e organizacional</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                Ver análises anteriores
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Recommendations */}
        <div className="space-y-6">
          {/* Recommendations Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium mb-4 text-foreground/90">Recomendações Personalizadas</h3>
            <div className="space-y-3">
              {recommendations.map((item, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex gap-3 items-start">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-foreground/70">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Export Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-medium mb-4">Exportação e Histórico</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Exportar como PDF
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Exportar como CSV
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <History className="h-4 w-4" />
                  Insights de abril 2024
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Mental Distribution Overview */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-medium mb-4">Distribuição Mental</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Projetos', value: 40, fill: '#60B5B5' },
                        { name: 'Hábitos', value: 25, fill: '#993887' },
                        { name: 'Diário', value: 20, fill: '#7B61FF' },
                        { name: 'Conexões', value: 15, fill: '#FFC857' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border rounded-lg p-2 shadow-lg text-xs">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary">{`Valor: ${payload[0].value}`}</p>
      </div>
    );
  }
  
  return null;
};
