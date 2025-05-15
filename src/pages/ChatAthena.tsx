
import { motion } from "framer-motion";

export default function ChatAthena() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      transition={{ duration: 0.33 }}
      className="fixed bottom-4 right-4 w-[350px] max-w-[95vw] z-50 bg-background/95 border border-primary rounded-2xl shadow-2xl p-4 flex flex-col"
    >
      <div className="flex items-center mb-2">
        <span className="rounded-full w-9 h-9 flex items-center justify-center bg-primary text-background mr-2 text-lg">🧠</span>
        <span className="font-bold text-md">Athena Chat</span>
      </div>
      <div className="flex-1 min-h-[90px] mb-3">
        <span className="text-foreground/70 animate-pulse">Athena está digitando resposta...</span>
      </div>
      <input type="text" placeholder="Fale com Athena..." className="rounded px-3 py-2 border border-border bg-background w-full mb-2"/>
      <button className="rounded-lg bg-primary text-background font-bold py-2">Enviar</button>
    </motion.div>
  );
}
