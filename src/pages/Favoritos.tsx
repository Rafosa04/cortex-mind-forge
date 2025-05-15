
import { motion } from "framer-motion";

export default function Favoritos() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.h2
        className="text-2xl font-bold mb-6 text-secondary"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Favoritos e salvos
      </motion.h2>
      <div className="flex flex-col gap-5">
        {[{ nome: "Podcast Consciência", origem: "Spotify", categoria: "Reflexão" }, { nome: "Vídeo: Hábitos", origem: "YouTube", categoria: "Hábitos" }]
          .map((c, idx) => (
            <motion.div
              key={c.nome}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="rounded-lg bg-card border border-border shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-base font-bold">{c.nome}</div>
                <div className="text-xs opacity-60">{c.origem} • {c.categoria}</div>
              </div>
              <button className="mt-2 sm:mt-0 px-4 py-1 rounded bg-primary text-background text-xs font-medium">Reutilizar</button>
            </motion.div>
        ))}
      </div>
    </div>
  );
}
