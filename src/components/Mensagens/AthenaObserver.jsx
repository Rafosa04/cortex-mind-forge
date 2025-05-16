
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export const AthenaObserver = () => {
  const [pulseState, setPulseState] = useState(0);
  const [showTip, setShowTip] = useState(false);
  
  // Random appearance of Athena tips
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(true);
    }, 15000); // Show tip after 15 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  // Pulse animation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseState(prev => (prev + 1) % 2);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Popover open={showTip}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-secondary/10 relative"
            onClick={() => setShowTip(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: pulseState ? 1 : 0.9,
                opacity: pulseState ? 1 : 0.7
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <Info className="h-4 w-4 text-secondary" />
            </motion.div>
            
            {/* Decorative rings */}
            <motion.div
              className="absolute inset-0 rounded-full border border-secondary/30"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ 
                scale: pulseState ? 1.2 : 1,
                opacity: pulseState ? 0 : 0.4
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 p-3" 
          side="bottom" 
          align="end"
        >
          <div className="text-xs space-y-2">
            <p className="font-medium text-secondary">Athena está observando</p>
            <p className="text-muted-foreground">
              Essa conversa tem ideias valiosas. Deseja salvar os pontos principais?
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7"
                onClick={() => setShowTip(false)}
              >
                Agora não
              </Button>
              <Button 
                size="sm" 
                className="text-xs h-7"
                onClick={() => setShowTip(false)}
              >
                Salvar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
