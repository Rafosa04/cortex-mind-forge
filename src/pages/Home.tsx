
import { motion } from "framer-motion";

const summaryData = [
  { title: "Projetos", color: "bg-primary", value: 3 },
  { title: "Hábitos", color: "bg-secondary", value: 7 },
  { title: "Diário", color: "bg-[#22223E]", value: 12 },
  { title: "Favoritos", color: "bg-accent", value: 22 },
  { title: "Notificações", color: "bg-card", value: 2 },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto animate-fade-in">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gradient-primary"
      >
        Olá, eu sou <span className="text-primary">Athena</span> 🧠
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-lg md:text-xl text-foreground/80 mb-10"
      >
        Bem-vindo ao seu segundo cérebro digital. Veja seu panorama mental:
      </motion.p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16">
        {summaryData.map((item, idx) => (
          <motion.div
            key={item.title}
            className={`rounded-xl p-4 min-h-[110px] flex flex-col items-center justify-center shadow-lg ${item.color} text-card-foreground border border-border animate-card-pop`}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.6, type: "spring" }}
          >
            <span className="text-3xl font-bold mb-1">{item.value}</span>
            <span className="uppercase text-xs tracking-wider opacity-70">{item.title}</span>
          </motion.div>
        ))}
      </div>
      {/* Botão flutuante para Chat Athena */}
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
