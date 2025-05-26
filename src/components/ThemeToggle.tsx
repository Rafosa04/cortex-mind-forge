
import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "h-9 w-9 rounded-full theme-toggle hover:bg-accent/10 hover:text-accent-foreground transition-all duration-300",
        className
      )}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      role="button"
      tabIndex={0}
      title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === "light" ? 0 : 180,
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut",
          scale: { duration: 0.2 }
        }}
        className="theme-toggle-icon"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
