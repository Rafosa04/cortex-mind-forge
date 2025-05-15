
import { motion } from "framer-motion";

export default function Configuracoes() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.33 }}
        className="text-2xl font-bold text-secondary mb-6"
      >
        Configurações
      </motion.h2>
      <div className="flex flex-col gap-6 bg-card p-7 rounded-xl shadow">
        <div>
          <div className="font-semibold mb-1">Tema</div>
          <button className="rounded px-4 py-2 bg-primary text-background mr-2">Escuro</button>
          <button className="rounded px-4 py-2 bg-background text-primary border border-primary">Claro</button>
        </div>
        <div>
          <div className="font-semibold mb-1">Modo</div>
          <button className="rounded px-3 py-1 bg-secondary text-secondary-foreground mr-2">Minimalista</button>
          <button className="rounded px-3 py-1 bg-card text-foreground border border-border">Completo</button>
        </div>
        <div>
          <div className="font-semibold mb-1">Idioma</div>
          <select className="rounded px-3 py-1 bg-background text-foreground border border-border">
            <option>Português</option>
            <option>English</option>
          </select>
        </div>
      </div>
    </div>
  );
}
