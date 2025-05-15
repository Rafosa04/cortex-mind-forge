
import { motion } from "framer-motion";

export default function Agenda() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-primary mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Agenda Mental
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{ atividade: "Revisar projeto X", bloco: "09:00-10:30" }, { atividade: "Meditação", bloco: "18:00-18:20" }]
          .map((b, idx) => (
            <motion.div
              key={b.atividade}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.11 }}
              className="rounded-xl bg-card border border-border shadow p-5 flex flex-col justify-between"
            >
              <div className="text-base font-bold">{b.atividade}</div>
              <div className="text-xs opacity-60 mt-2">{b.bloco}</div>
              <button className="mt-5 px-3 py-2 rounded bg-secondary text-secondary-foreground text-xs">Integrar</button>
            </motion.div>
        ))}
      </div>
    </div>
  );
}
