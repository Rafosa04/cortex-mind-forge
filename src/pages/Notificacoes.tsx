
import { motion } from "framer-motion";

export default function Notificacoes() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-primary mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        Notificações
      </motion.h2>
      <div className="flex flex-col gap-4">
        {[{ tipo: "IA", conteudo: "Nova sugestão da Athena." }, { tipo: "Sistema", conteudo: "Atualização diária gerada." }]
          .map((n, idx) => (
            <motion.div
              key={n.tipo + idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="rounded-lg bg-card border border-border p-3 flex items-center shadow"
            >
              <span className="rounded px-3 py-1 mr-3 bg-primary/20 text-primary text-xs font-semibold">{n.tipo}</span>
              <span>{n.conteudo}</span>
            </motion.div>
        ))}
      </div>
    </div>
  );
}
