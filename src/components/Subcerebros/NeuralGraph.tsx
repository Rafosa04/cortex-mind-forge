
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Mock data for visualization
const mockNodes = [
  { id: 1, label: "Cérebro Principal", type: "subcerebro", tags: ["core", "central"], createdAt: "15/05/2025", lastAccess: "15/05/2025", connections: [
    { id: 2, label: "Projeto Alpha", type: "projeto" },
    { id: 3, label: "Hábito de Meditação", type: "habito" }
  ]},
  { id: 2, label: "Projeto Alpha", type: "projeto", tags: ["trabalho", "prioridade"], createdAt: "10/05/2025", lastAccess: "14/05/2025", connections: [
    { id: 1, label: "Cérebro Principal", type: "subcerebro" },
    { id: 4, label: "Artigo sobre IA", type: "favorito" }
  ]},
  { id: 3, label: "Hábito de Meditação", type: "habito", tags: ["saúde", "foco"], createdAt: "05/05/2025", lastAccess: "15/05/2025", connections: [
    { id: 1, label: "Cérebro Principal", type: "subcerebro" },
    { id: 5, label: "Insight sobre paz mental", type: "pensamento" }
  ]},
  { id: 4, label: "Artigo sobre IA", type: "favorito", tags: ["tecnologia", "aprendizado"], createdAt: "12/05/2025", lastAccess: "13/05/2025", connections: [
    { id: 2, label: "Projeto Alpha", type: "projeto" }
  ]},
  { id: 5, label: "Insight sobre paz mental", type: "pensamento", tags: ["reflexão", "bem-estar"], createdAt: "14/05/2025", lastAccess: "14/05/2025", connections: [
    { id: 3, label: "Hábito de Meditação", type: "habito" }
  ]},
  { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro", tags: ["crescimento", "evolução"], createdAt: "01/05/2025", lastAccess: "10/05/2025", connections: [
    { id: 7, label: "Livro Atomic Habits", type: "favorito" },
    { id: 8, label: "Hábito de Leitura", type: "habito" }
  ]},
  { id: 7, label: "Livro Atomic Habits", type: "favorito", tags: ["leitura", "produtividade"], createdAt: "02/05/2025", lastAccess: "09/05/2025", connections: [
    { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" }
  ]},
  { id: 8, label: "Hábito de Leitura", type: "habito", tags: ["conhecimento", "rotina"], createdAt: "03/05/2025", lastAccess: "15/05/2025", connections: [
    { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" }
  ]}
];

const getNodeColor = (type: string) => {
  const colors: Record<string, string> = {
    subcerebro: "#993887", // roxo (secondary)
    projeto: "#60B5B5", // azul (primary)
    habito: "#34D399", // verde
    favorito: "#FBBF24", // amarelo
    pensamento: "#9CA3AF" // cinza
  };
  
  return colors[type] || "#9CA3AF";
};

interface NeuralGraphProps {
  onNodeClick: (node: any) => void;
  searchQuery: string;
  filterType: string;
}

export function NeuralGraph({ onNodeClick, searchQuery, filterType }: NeuralGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipNode, setTooltipNode] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>(mockNodes);
  
  // Canvas animation and drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Node positions and physics
    const nodePositions = nodes.map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));
    
    // Animation loop
    let animationFrameId: number;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections first (so they appear behind nodes)
      nodes.forEach((node, idx) => {
        if (node.connections) {
          node.connections.forEach((conn: any) => {
            const targetIdx = nodes.findIndex(n => n.id === conn.id);
            if (targetIdx >= 0) {
              const sourceX = nodePositions[idx].x;
              const sourceY = nodePositions[idx].y;
              const targetX = nodePositions[targetIdx].x;
              const targetY = nodePositions[targetIdx].y;
              
              // Draw connection line with pulse animation
              const time = Date.now() / 1000;
              const pulse = Math.sin(time * 5 + idx) * 0.5 + 0.5; // Value between 0 and 1
              
              ctx.beginPath();
              ctx.moveTo(sourceX, sourceY);
              ctx.lineTo(targetX, targetY);
              
              // Create gradient with pulse effect
              const gradient = ctx.createLinearGradient(sourceX, sourceY, targetX, targetY);
              
              const sourceColor = getNodeColor(node.type);
              const targetColor = getNodeColor(nodes[targetIdx].type);
              
              // Make pulse move along the line
              const pulsePos = (Math.sin(time * 2 + idx) * 0.5 + 0.5);
              gradient.addColorStop(0, `${sourceColor}40`); // 25% opacity
              gradient.addColorStop(pulsePos, `${targetColor}FF`); // 100% opacity at pulse position
              gradient.addColorStop(1, `${targetColor}40`); // 25% opacity
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          });
        }
      });
      
      // Draw nodes
      nodes.forEach((node, idx) => {
        const { x, y } = nodePositions[idx];
        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNode === node.id;
        
        const nodeSize = node.type === 'subcerebro' ? 30 : 20;
        
        // Node background glow
        ctx.beginPath();
        ctx.arc(x, y, nodeSize + 8, 0, Math.PI * 2);
        ctx.fillStyle = `${getNodeColor(node.type)}30`;
        ctx.fill();
        
        // Node main circle
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        
        // Different style for selected/hovered nodes
        if (isSelected) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = getNodeColor(node.type);
          ctx.fillStyle = getNodeColor(node.type);
        } else if (isHovered) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = getNodeColor(node.type);
          ctx.fillStyle = `${getNodeColor(node.type)}CC`; // 80% opacity
        } else {
          ctx.shadowBlur = 5;
          ctx.shadowColor = getNodeColor(node.type);
          ctx.fillStyle = `${getNodeColor(node.type)}99`; // 60% opacity
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // For subcerebros, add inner details
        if (node.type === 'subcerebro') {
          ctx.beginPath();
          ctx.arc(x, y, nodeSize - 10, 0, Math.PI * 2);
          ctx.fillStyle = `${getNodeColor(node.type)}70`;
          ctx.fill();
        }
        
        // Pulse animation for all nodes
        const time = Date.now() / 1000;
        const pulse = Math.sin(time * 2 + idx) * 0.5 + 0.5; // Value between 0 and 1
        
        ctx.beginPath();
        ctx.arc(x, y, nodeSize + 5 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `${getNodeColor(node.type)}${Math.floor(pulse * 80).toString(16)}`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Simple physics for node movement
      nodePositions.forEach((pos, idx) => {
        // Apply velocity
        pos.x += pos.vx;
        pos.y += pos.vy;
        
        // Bounce off edges
        if (pos.x < 40 || pos.x > canvas.width - 40) {
          pos.vx *= -0.8;
          pos.x = Math.max(40, Math.min(canvas.width - 40, pos.x));
        }
        
        if (pos.y < 40 || pos.y > canvas.height - 40) {
          pos.vy *= -0.8;
          pos.y = Math.max(40, Math.min(canvas.height - 40, pos.y));
        }
        
        // Slow down
        pos.vx *= 0.99;
        pos.vy *= 0.99;
        
        // Add slight random movement
        pos.vx += (Math.random() - 0.5) * 0.1;
        pos.vy += (Math.random() - 0.5) * 0.1;
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    // Handle mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      let hovered = null;
      let closestDist = Infinity;
      
      // Check if mouse is over any node
      nodes.forEach((node, idx) => {
        const dx = mouseX - nodePositions[idx].x;
        const dy = mouseY - nodePositions[idx].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const nodeSize = node.type === 'subcerebro' ? 30 : 20;
        
        if (dist < nodeSize && dist < closestDist) {
          hovered = node.id;
          closestDist = dist;
          
          setTooltipPos({ x: mouseX, y: mouseY });
          setTooltipNode(node);
        }
      });
      
      setHoveredNode(hovered);
      
      // Update cursor
      canvas.style.cursor = hovered !== null ? 'pointer' : 'default';
    };
    
    const handleClick = (e: MouseEvent) => {
      if (hoveredNode !== null) {
        const node = nodes.find(n => n.id === hoveredNode);
        if (node) {
          setSelectedNode(hoveredNode);
          onNodeClick(node);
        }
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, hoveredNode, selectedNode, onNodeClick]);
  
  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Node tooltip */}
      {hoveredNode !== null && tooltipNode && (
        <div 
          className="absolute text-sm bg-background/90 border border-card rounded-md shadow-md p-3 z-10 backdrop-blur-sm"
          style={{ 
            left: `${tooltipPos.x + 10}px`, 
            top: `${tooltipPos.y + 10}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: getNodeColor(tooltipNode.type) }}
            ></span>
            <span className="font-medium">{tooltipNode.label}</span>
          </div>
          <p className="text-xs text-foreground/60 mt-1">
            Tipo: {tooltipNode.type.charAt(0).toUpperCase() + tooltipNode.type.slice(1)}
          </p>
          <p className="text-xs text-foreground/60">
            Último acesso: {tooltipNode.lastAccess}
          </p>
        </div>
      )}
    </div>
  );
}
