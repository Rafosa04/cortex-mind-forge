
import { motion } from "framer-motion";

export default function Onboarding() {
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-[#16162E]/70 rounded-xl shadow-xl p-8 mt-10">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-primary mb-2"
      >
        Seja bem-vindo ao CÓRTEX!
      </motion.h2>
      <p className="text-foreground/70 mb-10 text-center">
        Vamos montar juntos seu segundo cérebro. Responda Athena para personalizar sua experiência.
      </p>
      {/* Screens/steps placeholders */}
      <div className="w-full flex flex-col gap-5">
        <div className="rounded-lg bg-background border border-card p-4 text-lg shadow">1. Qual seu principal objetivo com o CÓRTEX?</div>
        <div className="rounded-lg bg-background border border-card p-4 text-lg shadow">2. Quais áreas da vida quer gerenciar?</div>
        <div className="rounded-lg bg-background border border-card p-4 text-lg shadow">3. Prefere um uso mais visual ou minimalista?</div>
        <div className="rounded-lg bg-background border border-card p-4 text-lg shadow">4. Escolha uma paleta/de-cor:</div>
        <div className="rounded-lg bg-background border border-card p-4 text-lg shadow">5. Como quer chamar seu “Nome Mental”?</div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="mt-10 px-10 py-3 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent text-background text-lg font-bold shadow animate-card-pop"
      >
        Ativar Cérebro 🧠
      </motion.button>
    </div>
  );
}
