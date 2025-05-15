
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface NewPostButtonProps {
  onClick: () => void;
}

export default function NewPostButton({ onClick }: NewPostButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 flex items-center justify-center gap-2 rounded-full bg-primary shadow-lg shadow-primary/20 text-primary-foreground px-4 py-3 font-medium z-10"
      onClick={onClick}
    >
      <Plus className="h-5 w-5" />
      <span>Nova Ideia</span>
    </motion.button>
  );
}
