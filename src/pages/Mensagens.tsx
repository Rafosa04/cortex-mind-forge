
import { motion } from "framer-motion";

export default function Mensagens() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-2xl font-bold text-secondary mb-6"
      >
        Mensagens Privadas
      </motion.h2>
      <div className="flex flex-col gap-5">
        <div className="rounded-xl bg-card/90 border border-card p-3 shadow flex flex-col">
          <div className="text-xs text-accent mb-2">Athena IA</div>
          <div className="text-base">
            “Que sua mente seja seu aliado, não seu limitador.”
          </div>
        </div>
        <div className="rounded-xl bg-card/90 border border-card p-3 shadow flex flex-col">
          <div className="text-xs text-primary mb-2">Você</div>
          <div className="text-base">
            (Comece uma conversa mental...)
          </div>
        </div>
        {/* Placeholder mais mensagens */}
      </div>
      <div className="mt-8 flex gap-2">
        <input placeholder="Digite..." className="bg-background px-4 py-2 rounded-lg border border-border flex-1 text-base" />
        <button className="rounded bg-primary text-background px-5 py-2 font-bold shadow">Enviar</button>
      </div>
    </div>
  );
}
