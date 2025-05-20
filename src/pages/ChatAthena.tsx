
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatAthena() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirecionar para a home, já que o chat agora está disponível em todas as páginas
    navigate("/");
  }, [navigate]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-full"
    >
      <p className="text-center text-lg">O Chat da Athena agora está disponível em todas as páginas.</p>
      <p className="text-center text-sm mt-2">Redirecionando...</p>
    </motion.div>
  );
}
