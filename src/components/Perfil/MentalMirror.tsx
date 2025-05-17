
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { Brain } from "lucide-react";

export function MentalMirror() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [circles, setCircles] = useState([
    { id: 1, area: "Saúde", color: "#60B5B5", size: 120, intensity: 0.8, x: 50, y: 50, vx: 0.2, vy: 0.1 },
    { id: 2, area: "Criatividade", color: "#993887", size: 150, intensity: 0.9, x: 200, y: 100, vx: -0.1, vy: 0.2 },
    { id: 3, area: "Foco", color: "#E6E6F0", size: 100, intensity: 0.7, x: 150, y: 200, vx: 0.15, vy: -0.1 },
    { id: 4, area: "Finanças", color: "#4A8F7F", size: 80, intensity: 0.6, x: 250, y: 250, vx: -0.2, vy: -0.15 },
    { id: 5, area: "Relacionamentos", color: "#8A63B1", size: 110, intensity: 0.75, x: 300, y: 150, vx: 0.1, vy: -0.2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        
        setCircles(prevCircles => 
          prevCircles.map(circle => {
            let { x, y, vx, vy, size } = circle;
            
            // Update position
            x += vx;
            y += vy;
            
            // Bounce off walls
            if (x <= size/2 || x >= container.width - size/2) {
              vx = -vx;
              x = x <= size/2 ? size/2 : container.width - size/2;
            }
            
            if (y <= size/2 || y >= container.height - size/2) {
              vy = -vy;
              y = y <= size/2 ? size/2 : container.height - size/2;
            }
            
            return { ...circle, x, y, vx, vy };
          })
        );
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Espelho Mental Dinâmico</h3>
      </div>
      
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-5">
          <div className="text-center mb-6 italic text-sm text-primary/90">
            "Sua mente está mais ativa em criatividade e foco. Que tal equilibrar com saúde?"
          </div>
          
          <div 
            ref={containerRef}
            className="relative h-[400px] w-full border border-primary/10 rounded-xl bg-background/20 overflow-hidden"
          >
            {circles.map((circle) => (
              <MentalCircle 
                key={circle.id} 
                circle={circle} 
              />
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
            {circles.map((circle) => (
              <div key={circle.id} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: circle.color }}
                />
                <span className="text-xs">{circle.area}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/10 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm">Como interpretar seu Espelho Mental</h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li>Os círculos representam áreas da sua vida mental</li>
              <li>Tamanho reflete a quantidade de atenção dedicada</li>
              <li>Brilho indica engajamento recente</li>
              <li>Movimentos mostram como as áreas interagem entre si</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm">Sugestão da Athena</h4>
            <p className="text-xs text-muted-foreground">
              Seu perfil cognitivo mostra forte atividade em áreas criativas e de foco. 
              Para um desenvolvimento mais holístico, considere dedicar atenção às áreas 
              de saúde e bem-estar nas próximas semanas.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function MentalCircle({ circle }) {
  const pulseVariants = {
    pulse: {
      scale: [1, 1 + circle.intensity * 0.1, 1],
      opacity: [circle.intensity, circle.intensity + 0.2, circle.intensity],
      transition: {
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  return (
    <motion.div
      className="absolute rounded-full flex items-center justify-center text-xs font-medium cursor-pointer"
      style={{
        backgroundColor: `${circle.color}20`,
        border: `2px solid ${circle.color}50`,
        boxShadow: `0 0 15px ${circle.color}30`,
        width: circle.size,
        height: circle.size,
        left: circle.x - circle.size/2,
        top: circle.y - circle.size/2,
        color: circle.color,
      }}
      animate="pulse"
      variants={pulseVariants}
      whileHover={{ scale: 1.1 }}
    >
      {circle.area}
    </motion.div>
  );
}
