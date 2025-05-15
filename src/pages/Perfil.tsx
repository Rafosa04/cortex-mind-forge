
import { motion } from "framer-motion";

export default function Perfil() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl p-7 shadow-lg">
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-6 text-primary"
      >
        Meu Perfil Mental
      </motion.h2>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center text-5xl font-bold">{'🤖'}</div>
        <div>
          <div className="text-lg font-semibold">Athena User</div>
          <div className="text-xs text-accent">Plano: Fundador</div>
          <div className="mt-3 flex gap-3">
            <div className="bg-primary/15 text-primary px-3 py-1 rounded text-xs">Conquistas</div>
            <div className="bg-secondary/15 text-secondary px-3 py-1 rounded text-xs">Selos: 🏆 Fundador</div>
          </div>
        </div>
      </div>
    </div>
  );
}
