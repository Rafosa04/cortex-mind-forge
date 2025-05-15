
import { motion } from "framer-motion";

export default function Subcerebros() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-primary mb-8"
      >
        Seu Grafo Mental
      </motion.h2>
      <div className="w-full min-h-[250px] rounded-lg shadow-xl border border-card flex items-center justify-center bg-background/60 text-sm text-secondary">
        {/* Placeholder: grafo visual de subcérebros */}
        Visual de grafo mental (em desenvolvimento)
      </div>
    </div>
  );
}
