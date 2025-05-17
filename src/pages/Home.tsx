import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock data - would be replaced with actual user data in production
const summaryData = [
  { title: "Projetos", color: "bg-primary", value: 3 },
  { title: "Hábitos", color: "bg-secondary", value: 7 },
  { title: "Diário", color: "bg-[#22223E]", value: 12 },
  { title: "Favoritos", color: "bg-accent", value: 22 },
  { title: "Notificações", color: "bg-card", value: 2 },
];

const userName = "Rafael";

const aiSuggestions = [
  {
    type: "projeto",
    title: "Organize sua biblioteca digital",
    description: "Crie um sistema para catalogar seus livros e artigos"
  },
  {
    type: "hábito",
    title: "Meditação diária",
    description: "5 minutos pela manhã podem transformar seu dia"
  },
  {
    type: "conteúdo",
    title: "Artigo: Neuroplasticidade",
    description: "Você salvou isto há 3 semanas. Hora de revisitar?"
  },
  {
    type: "conexão",
    title: "Conecte-se com Marina",
    description: "Interesses similares em neurociência e produtividade"
  },
];

export default function Home() {
  const [brainLoaded, setBrainLoaded] = useState(false);

  // Simulate brain visualization loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setBrainLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto animate-fade-in px-4">
      {/* 1. Header with AI welcome message */}
      <div className="relative mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-xl bg-gradient-to-br from-[#191933]/80 to-[#22223E]/50 border border-primary/20 backdrop-blur-sm"
        >
          {/* Pulsating Athena Avatar */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(96, 181, 181, 0)",
                "0 0 0 10px rgba(96, 181, 181, 0.3)",
                "0 0 0 0 rgba(96, 181, 181, 0)"
              ]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background shadow-lg border border-primary/30"
          >
            <span className="text-4xl md:text-5xl">🧠</span>
          </motion.div>
          
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl md:text-2xl font-medium mb-2"
            >
              Bem-vindo ao seu CÓRTEX, <span className="text-primary font-semibold">{userName}</span>. Sua jornada mental começa agora.
            </motion.h2>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all duration-200 text-sm"
            >
              Deixe que eu te guie
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* 2. Digital Brain Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: brainLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden border border-border/50"
      >
        {brainLoaded ? (
          <div className="relative w-full h-full bg-[#0C0C1C] flex items-center justify-center">
            <div className="absolute inset-0 z-0 opacity-60">
              {/* Background Neural Network Pattern */}
              <div className="absolute w-32 h-32 rounded-full bg-primary/5 top-1/4 left-1/4 animate-pulse" />
              <div className="absolute w-24 h-24 rounded-full bg-secondary/5 top-1/3 right-1/3 animate-pulse" 
                style={{animationDelay: "0.5s"}}/>
              <div className="absolute w-20 h-20 rounded-full bg-accent/5 bottom-1/4 right-1/4 animate-pulse"
                style={{animationDelay: "1s"}}/>
              <div className="absolute w-16 h-16 rounded-full bg-primary/5 bottom-1/3 left-1/3 animate-pulse"
                style={{animationDelay: "1.5s"}}/>
            </div>
            
            {/* Active Neural Nodes */}
            <motion.div 
              className="relative z-10 w-full h-full"
              initial="hidden"
              animate="visible"
            >
              {/* Main Brain Node */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 20px 0px rgba(96, 181, 181, 0.5)",
                    "0 0 30px 10px rgba(96, 181, 181, 0.7)",
                    "0 0 20px 0px rgba(96, 181, 181, 0.5)"
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/30 border border-primary rounded-full flex items-center justify-center"
              >
                <Brain size={28} className="text-primary" />
              </motion.div>
              
              {/* Connected Nodes */}
              {summaryData.map((item, idx) => {
                // Calculate position in a circle around the main node
                const angle = (idx / summaryData.length) * Math.PI * 2;
                const radius = 110; // Distance from center
                const top = 50 + Math.sin(angle) * 25; // % position
                const left = 50 + Math.cos(angle) * 25; // % position
                
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.2, duration: 0.5 }}
                    className={`absolute w-12 h-12 rounded-full ${item.color}/30 border border-${item.color.replace('bg-', '')} flex items-center justify-center`}
                    style={{ top: `${top}%`, left: `${left}%` }}
                  >
                    <span className="text-lg font-medium">{item.value}</span>
                    
                    {/* Connection Line */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 0.6 }}
                      transition={{ delay: 0.7 + idx * 0.2, duration: 0.5 }}
                      className="absolute top-1/2 left-1/2 h-[1px] bg-gradient-to-r from-primary/70 to-transparent w-[60px] origin-left"
                      style={{ 
                        transform: `translateY(-50%) translateX(-50%) rotate(${angle * (180/Math.PI) + 180}deg)` 
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Brain Insight Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border text-sm text-foreground/80"
            >
              Este ponto representa sua área mais ativa: criatividade
            </motion.div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
            />
          </div>
        )}
      </motion.div>
      
      {/* 3. Main Modules as Interactive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {/* Subcérebros */}
        <ModuleCard 
          title="Subcérebros" 
          icon="🧠" 
          color="from-primary/20 to-primary/5"
          borderColor="border-primary/30"
          link="/subcerebros"
        >
          <p className="text-foreground/70 mb-3">Você tem 3 subcérebros ativos</p>
          <button className="px-4 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all duration-200 text-sm">
            Explorar
          </button>
        </ModuleCard>
        
        {/* Projetos */}
        <ModuleCard 
          title="Projetos" 
          icon="✅" 
          color="from-secondary/20 to-secondary/5"
          borderColor="border-secondary/30"
          link="/projetos"
        >
          <div className="space-y-2 mb-3">
            <div className="text-xs text-foreground/60">Últimos projetos:</div>
            <div className="text-sm truncate">• Planejamento de viagem</div>
            <div className="text-sm truncate">• Curso de especialização</div>
            <div className="text-sm truncate">• Gerenciamento financeiro</div>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-secondary/20 text-secondary hover:bg-secondary/30 transition-all duration-200 text-sm">
            Novo projeto
          </button>
        </ModuleCard>
        
        {/* Hábitos */}
        <ModuleCard 
          title="Hábitos" 
          icon="🔁" 
          color="from-accent/20 to-accent/10"
          borderColor="border-accent/30"
          link="/habitos"
        >
          <div className="w-full bg-background/50 h-2 rounded-full mb-2">
            <div className="bg-accent/70 h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-foreground/70 mb-3">75% dos hábitos concluídos esta semana</p>
          <div className="text-sm">
            <div className="font-medium">Próximos hoje:</div>
            <div className="text-foreground/70">Meditação • Leitura • Água</div>
          </div>
        </ModuleCard>
        
        {/* Favoritos */}
        <ModuleCard 
          title="Favoritos" 
          icon="⭐" 
          color="from-[#f59e0b]/20 to-[#f59e0b]/5"
          borderColor="border-[#f59e0b]/30"
          link="/favoritos"
        >
          <p className="text-foreground/70 mb-3">2 itens foram reativados para você</p>
          <button className="px-4 py-1.5 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/30 transition-all duration-200 text-sm">
            Ver favoritos
          </button>
        </ModuleCard>
        
        {/* Connecta */}
        <ModuleCard 
          title="Connecta" 
          icon="🌐" 
          color="from-[#0ea5e9]/20 to-[#0ea5e9]/5"
          borderColor="border-[#0ea5e9]/30"
          link="/connecta"
        >
          <p className="text-foreground/70">Veja o que outras mentes estão publicando</p>
          <button className="mt-3 px-4 py-1.5 rounded-lg bg-[#0ea5e9]/20 text-[#0ea5e9] hover:bg-[#0ea5e9]/30 transition-all duration-200 text-sm">
            Explorar
          </button>
        </ModuleCard>
      </div>
      
      {/* 4. Personal Progress Panel */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Seu Progresso</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Habits Completion */}
          <ProgressCard 
            title="Hábitos da Semana" 
            value={75} 
            color="primary"
          />
          
          {/* Project Progress */}
          <ProgressCard 
            title="Projetos em Andamento" 
            value={60} 
            color="secondary"
          />
          
          {/* Subcerebro Evolution */}
          <ProgressCard 
            title="Evolução dos Subcérebros" 
            value={40} 
            color="accent"
          />
        </div>
        
        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 p-4 rounded-lg bg-card/50 border border-border/50"
        >
          <p className="text-primary italic">
            "Seu foco está aumentando. Que tal reforçar seu autocuidado?"
          </p>
        </motion.div>
      </div>
      
      {/* 5. AI Suggestions Feed */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Sugestões da Athena</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {aiSuggestions.map((suggestion, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="text-xs uppercase tracking-wide mb-1 text-foreground/60">
                      {suggestion.type}
                    </div>
                    <h3 className="font-medium text-lg mb-2">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {suggestion.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 px-4 pb-4 flex justify-between">
                    <button className="text-primary text-sm hover:underline">
                      Saber mais
                    </button>
                    <button className="text-sm text-foreground/60 hover:text-foreground">
                      Depois
                    </button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
      </div>
      
      {/* 6. Identity Phrase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="w-full text-center my-10 py-6 border-t border-b border-border/30"
      >
        <p className="text-lg md:text-xl italic text-foreground/80">
          "Este não é só um app. É sua mente evoluindo."
        </p>
      </motion.div>
      
      {/* Chat Athena Floating Button - Keep existing one */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed z-50 bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent shadow-2xl flex items-center justify-center border-4 border-background/50 animate-card-pop hover:shadow-primary transition-all duration-200 ring-primary ring-2 ring-offset-background"
      >
        <span className="text-[2rem] drop-shadow text-background animate-pulse">💬</span>
        <span className="sr-only">Abrir Chat Athena</span>
      </motion.button>
    </div>
  );
}

// Module Card Component
function ModuleCard({ 
  title, 
  icon, 
  children, 
  color, 
  borderColor,
  link 
}: { 
  title: string; 
  icon: string; 
  children: React.ReactNode; 
  color: string;
  borderColor: string;
  link: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-5 border ${borderColor} shadow-lg`}
    >
      <Link to={link} className="block h-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="text-sm">
          {children}
        </div>
      </Link>
    </motion.div>
  );
}

// Progress Card Component
function ProgressCard({ 
  title, 
  value, 
  color 
}: { 
  title: string; 
  value: number; 
  color: string 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card/50 rounded-xl p-4 border border-border/50"
    >
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="w-full bg-background/50 h-2 rounded-full mb-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`bg-${color}/70 h-2 rounded-full`}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span>0%</span>
        <span className="font-medium">{value}%</span>
        <span>100%</span>
      </div>
    </motion.div>
  );
}
