
import { motion } from "framer-motion";

export default function Projetos() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-secondary mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Meus projetos mentais
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        {/* Placeholder de cards de projetos */}
        {[1, 2].map(n => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * n }}
            className="rounded-xl bg-card p-6 shadow border border-border"
          >
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Projeto {n}
            </h3>
            <div className="text-xs mb-2">Status: <span className="text-secondary">Em progresso</span></div>
            <div className="w-full h-2 bg-background rounded-full my-3">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${40 * n}%` }} />
            </div>
            <button className="mt-4 text-secondary underline">Ver detalhes</button>
          </motion.div>
        ))}
      </div>
      <motion.button
        className="mt-10 px-8 py-2 rounded-lg bg-primary text-background font-bold shadow animate-card-pop"
        whileHover={{ scale: 1.06 }}
      >
        Criar com Athena
      </motion.button>
    </div>
  );
}
