
/**
 * MindMirror.tsx
 * Espelho mental dinâmico com círculos pulsantes e interativos
 * Props:
 *   - profileUserId: string opcional para visualizar perfil de outro usuário
 *   - diagnostic: string com diagnóstico da Athena
 * 
 * Visual: SVG com círculos animados e conectados
 * Interatividade: hover para tooltip, clique para navegação
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RotateCcw } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useProfileHighlights } from '@/hooks/useProfileHighlights';

interface MindCircle {
  id: string;
  label: string;
  intensity: number; // [0-100]
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface MindMirrorProps {
  profileUserId?: string;
  diagnostic?: string;
  onReassess?: () => void;
}

export const MindMirror: React.FC<MindMirrorProps> = ({
  profileUserId,
  diagnostic,
  onReassess
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { profileStats } = useProfile(profileUserId);
  const { projects, achievements, topPosts } = useProfileHighlights(profileUserId);
  
  const [circles, setCircles] = useState<MindCircle[]>([]);
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);

  // Generate mind circles based on user data
  useEffect(() => {
    if (profileStats) {
      const newCircles: MindCircle[] = [
        {
          id: '1',
          label: 'Criatividade',
          intensity: Math.min(90, (topPosts.length * 20) + 50),
          color: '#8B5CF6',
          x: 150,
          y: 100,
          vx: 0.5,
          vy: 0.3
        },
        {
          id: '2',
          label: 'Foco',
          intensity: Math.min(85, (profileStats.projectsCompleted * 15) + 40),
          color: '#06B6D4',
          x: 250,
          y: 150,
          vx: -0.3,
          vy: 0.4
        },
        {
          id: '3',
          label: 'Hábitos',
          intensity: Math.min(80, (profileStats.activeHabits * 10) + 30),
          color: '#10B981',
          x: 100,
          y: 200,
          vx: 0.4,
          vy: -0.2
        },
        {
          id: '4',
          label: 'Conexões',
          intensity: Math.min(75, (profileStats.activeConnections * 5) + 25),
          color: '#F59E0B',
          x: 300,
          y: 80,
          vx: -0.2,
          vy: 0.5
        },
        {
          id: '5',
          label: 'Projetos',
          intensity: Math.min(70, (projects.length * 12) + 35),
          color: '#EF4444',
          x: 200,
          y: 250,
          vx: 0.3,
          vy: -0.4
        }
      ];
      setCircles(newCircles);
    }
  }, [profileStats, projects, topPosts]);

  // Animação dos círculos
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const padding = 50;
        
        setCircles(prevCircles => 
          prevCircles.map(circle => {
            if (!circle.x || !circle.y || !circle.vx || !circle.vy) return circle;
            
            let { x, y, vx, vy } = circle;
            const radius = (circle.intensity / 100) * 30 + 20;
            
            // Atualizar posição
            x += vx;
            y += vy;
            
            // Verificar colisão com bordas
            if (x <= radius + padding || x >= container.width - radius - padding) {
              vx = -vx;
              x = x <= radius + padding ? radius + padding : container.width - radius - padding;
            }
            
            if (y <= radius + padding || y >= 300 - radius - padding) {
              vy = -vy;
              y = y <= radius + padding ? radius + padding : 300 - radius - padding;
            }
            
            return { ...circle, x, y, vx, vy };
          })
        );
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const handleCircleClick = (circleId: string) => {
    // TODO: implement navigation to related section
    console.log(`Navegando para seção relacionada ao círculo: ${circleId}`);
  };

  const handleReassess = () => {
    // TODO: integrate with Athena endpoint "/profile/reassess-mind"
    onReassess?.();
    console.log('Solicitando reavaliação da Athena...');
  };

  const defaultDiagnostic = diagnostic || "Sua mente está mais ativa em criatividade e foco. Que tal equilibrar com saúde?";

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Espelho Mental Dinâmico
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReassess}
            className="text-gray-400 hover:text-purple-400"
            aria-label="Reavaliar mente"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Diagnóstico da Athena */}
        <div className="text-center mb-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-sm italic text-purple-300">"{defaultDiagnostic}"</p>
        </div>

        {/* Espelho Mental SVG */}
        <div 
          ref={containerRef}
          className="relative w-full h-80 bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700"
        >
          <svg className="w-full h-full">
            {/* Conexões entre círculos */}
            {circles.map((circle, index) => (
              circles.slice(index + 1).map((otherCircle, otherIndex) => {
                if (!circle.x || !circle.y || !otherCircle.x || !otherCircle.y) return null;
                
                const distance = Math.sqrt(
                  Math.pow(circle.x - otherCircle.x, 2) + 
                  Math.pow(circle.y - otherCircle.y, 2)
                );
                
                // Só desenhar conexão se os círculos estiverem próximos
                if (distance < 150) {
                  return (
                    <line
                      key={`${circle.id}-${otherCircle.id}`}
                      x1={circle.x}
                      y1={circle.y}
                      x2={otherCircle.x}
                      y2={otherCircle.y}
                      stroke="rgba(139, 92, 246, 0.2)"
                      strokeWidth="1"
                      opacity={1 - distance / 150}
                    />
                  );
                }
                return null;
              })
            ))}

            {/* Círculos mentais */}
            {circles.map((circle) => {
              if (!circle.x || !circle.y) return null;
              
              const radius = (circle.intensity / 100) * 30 + 20;
              
              return (
                <motion.g key={circle.id}>
                  {/* Círculo de fundo pulsante */}
                  <motion.circle
                    cx={circle.x}
                    cy={circle.y}
                    r={radius}
                    fill={`${circle.color}20`}
                    stroke={circle.color}
                    strokeWidth="2"
                    className="cursor-pointer"
                    animate={{
                      r: [radius, radius + 5, radius],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{
                      duration: 2 + (circle.intensity / 100),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleCircleClick(circle.id)}
                    onMouseEnter={() => setHoveredCircle(circle.id)}
                    onMouseLeave={() => setHoveredCircle(null)}
                  />
                  
                  {/* Texto do círculo */}
                  <text
                    x={circle.x}
                    y={circle.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="500"
                    className="pointer-events-none select-none"
                  >
                    {circle.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredCircle && (
            <div className="absolute top-4 left-4 bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm">
              {(() => {
                const circle = circles.find(c => c.id === hoveredCircle);
                return circle ? (
                  <div>
                    <div className="font-medium text-white">{circle.label}</div>
                    <div className="text-gray-400">Intensidade: {circle.intensity}%</div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Legenda */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {circles.map((circle) => (
            <div key={circle.id} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: circle.color }}
              />
              <span className="text-gray-300">{circle.label}</span>
              <span className="text-gray-500 ml-auto">{circle.intensity}%</span>
            </div>
          ))}
        </div>

        {/* Como interpretar */}
        <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Como interpretar</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Tamanho reflete intensidade atual</li>
            <li>• Movimento mostra dinâmica mental</li>
            <li>• Conexões indicam áreas relacionadas</li>
            <li>• Clique para navegar até a seção</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
