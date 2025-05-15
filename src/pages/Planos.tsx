
import { motion } from "framer-motion";

const plans = [
  { nome: "Gratuito", preco: "R$0", destaque: false },
  { nome: "Pessoal", preco: "R$19/mês", destaque: false },
  { nome: "Expansivo", preco: "R$49/mês", destaque: true },
  { nome: "Fundador", preco: "R$297 vitalício", destaque: true },
  { nome: "Pioneiro", preco: "R$197 vitalício", destaque: false },
];

export default function Planos() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl font-bold mb-7 text-secondary"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Planos & Benefícios IA
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {plans.map((p, idx) => (
          <motion.div
            key={p.nome}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.13 }}
            className={`rounded-xl p-6 shadow-lg border-2 ${p.destaque ? "bg-primary text-background border-secondary" : "bg-card border-border"} flex flex-col items-center`}
          >
            <div className="text-xl font-bold mb-1">{p.nome}</div>
            <div className="text-2xl font-semibold mb-3">{p.preco}</div>
            {p.destaque && <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs mb-2">Destaque</div>}
            <button className="mt-3 px-7 py-2 rounded bg-secondary text-secondary-foreground font-bold">Escolher</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
