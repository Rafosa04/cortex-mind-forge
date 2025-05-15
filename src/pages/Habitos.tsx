
import { motion } from "framer-motion";

export default function Habitos() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-primary mb-8"
      >
        Seus Hábitos
      </motion.h2>
      <div className="w-full flex flex-col gap-6">
        {[{ nome: "Leitura", freq: "Diário", consistencia: 78 },
          { nome: "Meditação", freq: "Semanal", consistencia: 56 }]
          .map((h, idx) => (
          <motion.div
            key={h.nome}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.12 }}
            className="rounded-lg bg-card p-5 shadow border border-border flex flex-col sm:flex-row items-center justify-between gap-5"
          >
            <div>
              <div className="text-lg font-bold">{h.nome}</div>
              <div className="text-xs text-foreground/60">Frequência: <span>{h.freq}</span></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs opacity-60 mb-1">Consistência</span>
              <div className="w-24 bg-background h-2 rounded mb-2">
                <div className="h-2 rounded bg-primary" style={{ width: `${h.consistencia}%` }} />
              </div>
              <button className="text-xs px-3 py-1 rounded bg-secondary text-secondary-foreground">Check</button>
            </div>
          </motion.div>
        ))}
      </div>
      <button className="mt-10 px-8 py-2 rounded-lg bg-primary text-background font-bold shadow animate-card-pop">Análise de Athena</button>
    </div>
  );
}
