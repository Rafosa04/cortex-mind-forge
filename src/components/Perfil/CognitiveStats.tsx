
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Layers, Check, Repeat, Star, Brain, MessageSquare, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const data = [
  { name: 'Jan', value: 12 },
  { name: 'Fev', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Abr', value: 29 },
  { name: 'Mai', value: 32 },
  { name: 'Jun', value: 25 },
  { name: 'Jul', value: 42 },
];

const chartConfig = {
  mental: {
    label: "Atividade Mental",
    color: "#60B5B5"
  }
};

export function CognitiveStats() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold">
        Estatísticas Cognitivas
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div variants={item}>
          <StatsCard
            icon={<Layers className="h-5 w-5 text-primary" />}
            title="Subcérebros"
            value="5"
            label="ativos"
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatsCard
            icon={<Check className="h-5 w-5 text-primary" />}
            title="Projetos"
            value="12"
            label="criados (3 concluídos)"
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatsCard
            icon={<Repeat className="h-5 w-5 text-primary" />}
            title="Hábitos"
            value="8"
            label="em andamento (75% consistência)"
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatsCard
            icon={<Star className="h-5 w-5 text-primary" />}
            title="Conteúdos"
            value="32"
            label="salvos e organizados"
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatsCard
            icon={<Brain className="h-5 w-5 text-primary" />}
            title="Interações"
            value="87"
            label="brain likes e conexões"
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatsCard
            icon={<MessageSquare className="h-5 w-5 text-primary" />}
            title="Comentários"
            value="24"
            label="em discussões"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Card className="overflow-hidden border-primary/10">
          <CardContent className="p-6">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Evolução da Atividade Mental
            </h4>
            <div className="h-48">
              <ChartContainer config={chartConfig}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mental" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60B5B5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#60B5B5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#E6E6F0' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    hide={true}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#191933" />
                  <ChartTooltip 
                    content={({ active, payload }) => (
                      <ChartTooltipContent 
                        active={active} 
                        payload={payload}
                        labelKey="name" 
                      />
                    )} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#60B5B5" 
                    fillOpacity={1} 
                    fill="url(#mental)" 
                    name="mental"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}

function StatsCard({ icon, title, value, label }) {
  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-sm h-full">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
        <div className="mb-2 mt-1">{icon}</div>
        <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
