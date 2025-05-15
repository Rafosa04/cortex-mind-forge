
import { motion } from "framer-motion";

export default function Diario() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-primary mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        Diário Mental
      </motion.h2>
      <div className="rounded-lg bg-card p-5 border border-border shadow-md">
        <textarea
          rows={5}
          className="w-full rounded bg-background border border-input p-3 text-base text-foreground resize-none outline-none mb-4"
          placeholder="Escreva seus pensamentos, sentimentos, reflexões..."
        />
        <div className="flex gap-2">
          <input placeholder="Sentimento do dia" className="rounded px-3 py-2 border border-border bg-background text-xs" />
          <input type="date" className="rounded px-3 py-2 border border-border bg-background text-xs" />
        </div>
        <button className="mt-4 px-6 py-2 rounded-lg bg-primary text-background font-bold shadow">Analisar com Athena</button>
      </div>
    </div>
  );
}
