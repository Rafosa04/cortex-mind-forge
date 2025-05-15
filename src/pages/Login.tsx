
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-[#111122]/80 rounded-2xl shadow-xl relative overflow-hidden max-w-md mx-auto mt-6 p-8">
      <motion.h2
        className="text-2xl font-semibold mb-3 text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-gradient">Bem-vindo de volta!</span>
      </motion.h2>
      <motion.div
        className="text-base text-foreground/80 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Athena diz: <span className="italic text-secondary">"A mente que busca conhecer a si mesma expande todo o universo."</span>
      </motion.div>
      <div className="w-full flex gap-6 text-center mb-10">
        <span className="grow py-2 border-b-2 border-primary font-medium text-primary">Login</span>
        <span className="grow py-2 text-foreground/60 hover:text-foreground cursor-pointer transition">Cadastro</span>
      </div>
      <form className="w-full flex flex-col gap-5">
        <input type="email" placeholder="E-mail" required className="rounded-md px-4 py-2 bg-background/30 border border-input text-base"/>
        <input type="password" placeholder="Senha" required className="rounded-md px-4 py-2 bg-background/30 border border-input text-base"/>
        <button type="submit" className="rounded-lg px-4 py-2 font-bold bg-primary text-primary-foreground mt-2 shadow hover:bg-primary/80 transition animate-card-pop">Entrar</button>
      </form>
      <span className="block mt-6 text-xs text-secondary">Esqueceu sua senha?</span>
    </div>
  );
}
