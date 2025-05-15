
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="flex flex-col items-center w-full text-center">
      <motion.h2
        className="text-4xl md:text-6xl font-bold mb-6 text-gradient-primary"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Viva o <span className="text-primary">CÓRTEX</span>
      </motion.h2>
      <div className="text-card-foreground text-xl md:text-2xl opacity-80 mb-10">
        O segundo cérebro: IA Athena em ação. Potencialize mente, processos, memórias e resultados.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-12">
        <div className="bg-card rounded-xl p-8 border border-border shadow animate-card-pop">Projetos Integrados</div>
        <div className="bg-card rounded-xl p-8 border border-border shadow animate-card-pop">IA Athena Viva</div>
        <div className="bg-card rounded-xl p-8 border border-border shadow animate-card-pop">Seu Diário Visual</div>
      </div>
      {/* Bloco “Seja Fundador” */}
      <div className="w-full max-w-xl mx-auto mt-12 p-8 bg-gradient-to-br from-primary to-secondary rounded-2xl">
        <h3 className="text-2xl font-bold text-background mb-2">Torne-se Fundador do CÓRTEX</h3>
        <div className="flex flex-col md:flex-row gap-5 mt-3">
          <button className="bg-background text-primary rounded px-8 py-3 font-bold shadow">Fundador</button>
          <button className="bg-secondary text-secondary-foreground rounded px-8 py-3 font-bold shadow">Pioneiro</button>
          <button className="bg-card text-accent rounded px-8 py-3 font-bold shadow">Investidor</button>
        </div>
      </div>
    </div>
  );
}
