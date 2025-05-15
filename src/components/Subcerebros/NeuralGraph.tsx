
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Mock data for visualization
const mockNodes = [
  { 
    id: 1, 
    label: "Cérebro Principal", 
    type: "subcerebro", 
    tags: ["central", "core", "hub"], 
    createdAt: "15/05/2025", 
    lastAccess: "15/05/2025", 
    relevancia: 10,
    connections: [
      { id: 2, label: "Projeto Alpha", type: "projeto" },
      { id: 3, label: "Hábito de Meditação", type: "habito" },
      { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" },
      { id: 10, label: "Ideias de Negócio", type: "subcerebro" },
      { id: 12, label: "Criação de Conteúdo", type: "subcerebro" }
    ]
  },
  { 
    id: 2, 
    label: "Projeto Alpha", 
    type: "projeto", 
    tags: ["trabalho", "prioridade", "inovação"], 
    createdAt: "10/05/2025", 
    lastAccess: "14/05/2025", 
    relevancia: 8,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" },
      { id: 4, label: "Artigo sobre IA", type: "favorito" },
      { id: 11, label: "Cronograma do Projeto", type: "pensamento" }
    ]
  },
  { 
    id: 3, 
    label: "Hábito de Meditação", 
    type: "habito", 
    tags: ["saúde", "foco", "mindfulness", "diário"], 
    createdAt: "05/05/2025", 
    lastAccess: "15/05/2025",
    relevancia: 7,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" },
      { id: 5, label: "Insight sobre paz mental", type: "pensamento" },
      { id: 9, label: "Curso de Meditação", type: "favorito" }
    ]
  },
  { 
    id: 4, 
    label: "Artigo sobre IA", 
    type: "favorito", 
    tags: ["tecnologia", "aprendizado", "pesquisa", "data science"], 
    createdAt: "12/05/2025", 
    lastAccess: "13/05/2025", 
    relevancia: 6,
    connections: [
      { id: 2, label: "Projeto Alpha", type: "projeto" },
      { id: 10, label: "Ideias de Negócio", type: "subcerebro" }
    ]
  },
  { 
    id: 5, 
    label: "Insight sobre paz mental", 
    type: "pensamento", 
    tags: ["reflexão", "bem-estar", "consciência"], 
    createdAt: "14/05/2025", 
    lastAccess: "14/05/2025", 
    relevancia: 5,
    connections: [
      { id: 3, label: "Hábito de Meditação", type: "habito" }
    ]
  },
  { 
    id: 6, 
    label: "Desenvolvimento Pessoal", 
    type: "subcerebro", 
    tags: ["crescimento", "evolução", "aprendizado", "mindset"], 
    createdAt: "01/05/2025", 
    lastAccess: "10/05/2025", 
    relevancia: 9,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" },
      { id: 7, label: "Livro Atomic Habits", type: "favorito" },
      { id: 8, label: "Hábito de Leitura", type: "habito" }
    ]
  },
  { 
    id: 7, 
    label: "Livro Atomic Habits", 
    type: "favorito", 
    tags: ["leitura", "produtividade", "hábitos", "comportamento"], 
    createdAt: "02/05/2025", 
    lastAccess: "09/05/2025", 
    relevancia: 7,
    connections: [
      { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" },
      { id: 8, label: "Hábito de Leitura", type: "habito" }
    ]
  },
  { 
    id: 8, 
    label: "Hábito de Leitura", 
    type: "habito", 
    tags: ["conhecimento", "rotina", "livros", "diário"], 
    createdAt: "03/05/2025", 
    lastAccess: "15/05/2025", 
    relevancia: 6,
    connections: [
      { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" },
      { id: 7, label: "Livro Atomic Habits", type: "favorito" }
    ]
  },
  { 
    id: 9, 
    label: "Curso de Meditação", 
    type: "favorito", 
    tags: ["mindfulness", "curso", "saúde mental"], 
    createdAt: "05/05/2025", 
    lastAccess: "12/05/2025", 
    relevancia: 5,
    connections: [
      { id: 3, label: "Hábito de Meditação", type: "habito" }
    ]
  },
  { 
    id: 10, 
    label: "Ideias de Negócio", 
    type: "subcerebro", 
    tags: ["empreendedorismo", "inovação", "projetos"], 
    createdAt: "08/05/2025", 
    lastAccess: "11/05/2025", 
    relevancia: 8,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" },
      { id: 4, label: "Artigo sobre IA", type: "favorito" },
      { id: 11, label: "Cronograma do Projeto", type: "pensamento" }
    ]
  },
  { 
    id: 11, 
    label: "Cronograma do Projeto", 
    type: "pensamento", 
    tags: ["organização", "tempo", "planejamento"], 
    createdAt: "09/05/2025", 
    lastAccess: "14/05/2025", 
    relevancia: 7,
    connections: [
      { id: 2, label: "Projeto Alpha", type: "projeto" },
      { id: 10, label: "Ideias de Negócio", type: "subcerebro" }
    ]
  },
  { 
    id: 12, 
    label: "Criação de Conteúdo", 
    type: "subcerebro", 
    tags: ["marketing", "mídias sociais", "comunicação"], 
    createdAt: "07/05/2025", 
    lastAccess: "13/05/2025", 
    relevancia: 6,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" }
    ]
  }
];

const getNodeColor = (type: string) => {
  const colors: Record<string, string> = {
    subcerebro: "#993887", // roxo (secondary)
    projeto: "#60B5B5", // azul (primary)
    habito: "#34D399", // verde
    favorito: "#FBBF24", // amarelo
    pensamento: "#D1D5DB" // cinza claro
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
  const [nodes, setNodes] = useState<any[]>([]);
  const [showMiniMap, setShowMiniMap] = useState(false);
  
  // Filter nodes based on search and filter type
  useEffect(() => {
    let filteredNodes = [...mockNodes];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(node => {
        return (
          node.label.toLowerCase().includes(query) ||
          node.tags.some((tag: string) => tag.toLowerCase().includes(query))
        );
      });
    }
    
    // Filter by type
    if (filterType && filterType !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.type === filterType);
    }
    
    setNodes(filteredNodes);
  }, [searchQuery, filterType]);
  
  // Canvas animation and drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    
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
    
    // Node positions with physics properties
    const nodePositions = nodes.map((node) => {
      // Place subcérebros more centrally
      const isCentral = node.type === 'subcerebro';
      const centerBias = isCentral ? 0.3 : 0.7;
      
      return {
        x: (0.2 + 0.6 * Math.random()) * canvas.width,
        y: (0.2 + 0.6 * Math.random()) * canvas.height,
        vx: (Math.random() - 0.5) * (isCentral ? 0.3 : 0.7),
        vy: (Math.random() - 0.5) * (isCentral ? 0.3 : 0.7),
        // Add force field properties
        charge: node.type === 'subcerebro' ? -80 : -40,
        mass: node.type === 'subcerebro' ? 3 : 1,
        radius: getNodeRadius(node)
      };
    });
    
    // Function to calculate node radius based on type and relevance
    function getNodeRadius(node: any) {
      const baseSize = node.type === 'subcerebro' ? 30 : 20;
      const relevanceBonus = (node.relevancia || 5) / 2;
      return baseSize + relevanceBonus;
    }
    
    // Animation variables
    let lastTime = 0;
    let pulsePhase = 0;
    
    // Animation loop
    let animationFrameId: number;
    
    const render = (time: number) => {
      // Calculate delta time for smooth animations regardless of frame rate
      const deltaTime = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;
      
      // Update pulse phase (for animated effects)
      pulsePhase = (pulsePhase + deltaTime * 2) % (Math.PI * 2);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply physics between nodes (attraction/repulsion)
      applyForces(nodePositions, deltaTime);
      
      // Draw connections first (so they appear behind nodes)
      drawConnections(ctx, nodes, nodePositions, pulsePhase);
      
      // Draw nodes
      drawNodes(ctx, nodes, nodePositions, pulsePhase);
      
      animationFrameId = requestAnimationFrame(render);
    };
    
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
        const radius = getNodeRadius(node);
        
        if (dist < radius && dist < closestDist) {
          hovered = node.id;
          closestDist = dist;
          
          // Update tooltip position and content
          setTooltipPos({ x: e.clientX, y: e.clientY });
          setTooltipNode(node);
          
          // Add repulsion from cursor for interactive feel
          nodePositions[idx].vx += dx * 0.02;
          nodePositions[idx].vy += dy * 0.02;
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
          
          // Create ripple effect on click
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          createRipple(ctx, mouseX, mouseY, getNodeColor(node.type));
        }
      }
    };
    
    // Create ripple effect
    const createRipple = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
      let size = 0;
      let opacity = 1;
      
      const drawRipple = () => {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        size += 3;
        opacity -= 0.02;
        
        if (opacity > 0) {
          requestAnimationFrame(drawRipple);
        }
      };
      
      drawRipple();
    };
    
    // Physics simulation
    const applyForces = (positions: any[], deltaTime: number) => {
      // Apply forces between nodes
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          // Calculate distance between nodes
          const dx = positions[j].x - positions[i].x;
          const dy = positions[j].y - positions[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if these nodes are connected
          const sourceNode = nodes[i];
          const targetNode = nodes[j];
          const isConnected = sourceNode.connections?.some((conn: any) => conn.id === targetNode.id) || 
                              targetNode.connections?.some((conn: any) => conn.id === sourceNode.id);
          
          // Minimal distance to avoid division by zero
          const minDistance = positions[i].radius + positions[j].radius;
          
          if (distance < 1) continue;
          
          // Calculate force
          let force = 0;
          
          // Connected nodes attract each other
          if (isConnected) {
            // Spring force for connected nodes
            const optimalDistance = 150;
            force = 0.01 * (distance - optimalDistance);
          } else {
            // Repulsion force based on charge
            force = (positions[i].charge * positions[j].charge) / (distance * distance);
          }
          
          // Normalize direction
          const forceX = (dx / distance) * force * deltaTime * 10;
          const forceY = (dy / distance) * force * deltaTime * 10;
          
          // Apply force (consider mass)
          positions[i].vx += forceX / positions[i].mass;
          positions[i].vy += forceY / positions[i].mass;
          positions[j].vx -= forceX / positions[j].mass;
          positions[j].vy -= forceY / positions[j].mass;
        }
      }
      
      // Apply velocity and boundary constraints
      positions.forEach((pos, idx) => {
        // Apply velocity
        pos.x += pos.vx;
        pos.y += pos.vy;
        
        // Bounce off edges with damping
        if (pos.x < pos.radius || pos.x > canvas.width - pos.radius) {
          pos.vx *= -0.8;
          pos.x = Math.max(pos.radius, Math.min(canvas.width - pos.radius, pos.x));
        }
        
        if (pos.y < pos.radius || pos.y > canvas.height - pos.radius) {
          pos.vy *= -0.8;
          pos.y = Math.max(pos.radius, Math.min(canvas.height - pos.radius, pos.y));
        }
        
        // Damping (friction)
        pos.vx *= 0.95;
        pos.vy *= 0.95;
        
        // Add slight random movement for more organic feel
        pos.vx += (Math.random() - 0.5) * 0.05;
        pos.vy += (Math.random() - 0.5) * 0.05;
      });
    };
    
    const drawConnections = (
      ctx: CanvasRenderingContext2D, 
      nodes: any[], 
      positions: any[],
      pulsePhase: number
    ) => {
      nodes.forEach((node, idx) => {
        if (node.connections) {
          node.connections.forEach((conn: any) => {
            const targetIdx = nodes.findIndex(n => n.id === conn.id);
            if (targetIdx >= 0) {
              const sourceX = positions[idx].x;
              const sourceY = positions[idx].y;
              const targetX = positions[targetIdx].x;
              const targetY = positions[targetIdx].y;
              
              // Draw connection line with pulse animation
              const isSelected = selectedNode === node.id || selectedNode === nodes[targetIdx].id;
              const isHovered = hoveredNode === node.id || hoveredNode === nodes[targetIdx].id;
              
              // Calculate length for animated dash effect
              const dx = targetX - sourceX;
              const dy = targetY - sourceY;
              const length = Math.sqrt(dx * dx + dy * dy);
              
              // Create gradient with pulse effect
              const gradient = ctx.createLinearGradient(sourceX, sourceY, targetX, targetY);
              
              const sourceColor = getNodeColor(node.type);
              const targetColor = getNodeColor(nodes[targetIdx].type);
              
              // Make pulse move along the line
              const pulsePos = (Math.sin(pulsePhase + idx * 0.2) * 0.5 + 0.5);
              
              // Enhanced visibility if selected or hovered
              const baseOpacity = isSelected || isHovered ? 0.7 : 0.25;
              
              gradient.addColorStop(0, `${sourceColor}${Math.floor(baseOpacity * 255).toString(16).padStart(2, '0')}`);
              gradient.addColorStop(pulsePos, `${targetColor}FF`); // 100% opacity at pulse position
              gradient.addColorStop(1, `${targetColor}${Math.floor(baseOpacity * 255).toString(16).padStart(2, '0')}`);
              
              // Draw main connecting line
              ctx.beginPath();
              ctx.moveTo(sourceX, sourceY);
              ctx.lineTo(targetX, targetY);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = isSelected || isHovered ? 2.5 : 1.5;
              ctx.stroke();
              
              // Draw animated pulse dots along the line
              if (isSelected || isHovered) {
                const numDots = Math.floor(length / 15);
                const dotPhase = (Date.now() / 1000) % 1;
                
                for (let i = 0; i < numDots; i++) {
                  const pos = (i / numDots + dotPhase) % 1;
                  const dotX = sourceX + dx * pos;
                  const dotY = sourceY + dy * pos;
                  
                  const dotSize = 1.5 * Math.sin(pos * Math.PI);
                  
                  ctx.beginPath();
                  ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
                  ctx.fillStyle = pos < 0.5 ? sourceColor : targetColor;
                  ctx.fill();
                }
              }
            }
          });
        }
      });
    };
    
    const drawNodes = (
      ctx: CanvasRenderingContext2D, 
      nodes: any[], 
      positions: any[],
      pulsePhase: number
    ) => {
      nodes.forEach((node, idx) => {
        const { x, y } = positions[idx];
        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNode === node.id;
        
        const radius = getNodeRadius(node);
        const color = getNodeColor(node.type);
        
        // Create glow effect
        const glowRadius = radius * (1 + 0.2 * Math.sin(pulsePhase + idx * 0.5));
        const glowGradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, glowRadius + 10);
        
        // Adjust glow intensity based on node state
        const glowIntensity = isSelected ? 0.7 : isHovered ? 0.5 : 0.2;
        glowGradient.addColorStop(0, `${color}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}`);
        glowGradient.addColorStop(0.5, `${color}20`); // 12% opacity
        glowGradient.addColorStop(1, `${color}00`); // 0% opacity
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(x, y, glowRadius + 10, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        // Draw node main body with pulsating effect
        const pulseScale = 1 + 0.05 * Math.sin(pulsePhase + idx);
        const adjustedRadius = radius * pulseScale;
        
        // Create gradient fill for the node
        const nodeGradient = ctx.createRadialGradient(
          x - adjustedRadius * 0.3, // Light source slightly offset
          y - adjustedRadius * 0.3,
          0,
          x,
          y,
          adjustedRadius
        );
        
        // Base opacity determined by node state
        const baseOpacity = isSelected ? 1 : isHovered ? 0.9 : 0.7;
        
        nodeGradient.addColorStop(0, `${color}FF`); // Full opacity at center
        nodeGradient.addColorStop(0.8, `${color}${Math.floor(baseOpacity * 255).toString(16).padStart(2, '0')}`);
        nodeGradient.addColorStop(1, `${color}${Math.floor((baseOpacity * 0.7) * 255).toString(16).padStart(2, '0')}`);
        
        // Draw main circle
        ctx.beginPath();
        ctx.arc(x, y, adjustedRadius, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();
        
        // Draw border with subtle glow
        ctx.beginPath();
        ctx.arc(x, y, adjustedRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${color}${Math.floor((isHovered ? 0.9 : 0.6) * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;
        ctx.stroke();
        
        // For subcérebros, add inner details
        if (node.type === 'subcerebro') {
          // Inner circle
          ctx.beginPath();
          ctx.arc(x, y, adjustedRadius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `${color}40`;
          ctx.fill();
          
          // "Neurons" - radiating lines
          const numLines = 8;
          for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * Math.PI * 2;
            const innerLen = adjustedRadius * 0.4;
            const outerLen = adjustedRadius * 0.8;
            
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * innerLen, y + Math.sin(angle) * innerLen);
            ctx.lineTo(x + Math.cos(angle) * outerLen, y + Math.sin(angle) * outerLen);
            ctx.strokeStyle = `${color}80`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        
        // Special effects for hovered/selected nodes
        if (isHovered || isSelected) {
          // Ripple effect
          const ripplePhase = (Date.now() / 1000) % 3;
          const rippleRadius = radius * (1 + ripplePhase * 0.7);
          const rippleOpacity = 1 - ripplePhase / 3;
          
          ctx.beginPath();
          ctx.arc(x, y, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `${color}${Math.floor(rippleOpacity * 50).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Draw smaller "satellite" nodes for nodes with many connections
        if (node.connections && node.connections.length > 3) {
          const numSatellites = Math.min(node.connections.length, 5);
          
          for (let i = 0; i < numSatellites; i++) {
            const satellitePhase = (Date.now() / 2000 + i * 0.2) % 1;
            const satelliteAngle = satellitePhase * Math.PI * 2;
            const orbitRadius = radius * 1.5;
            
            const satX = x + Math.cos(satelliteAngle) * orbitRadius;
            const satY = y + Math.sin(satelliteAngle) * orbitRadius;
            
            ctx.beginPath();
            ctx.arc(satX, satY, 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            // Draw orbit trace
            ctx.beginPath();
            ctx.arc(x, y, orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `${color}20`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    // Start animation
    requestAnimationFrame(render);
    
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
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setShowMiniMap(!showMiniMap)}
          className="p-2 rounded-full bg-card/70 hover:bg-card backdrop-blur-sm border border-card text-foreground/70 hover:text-foreground transition-all"
          title="Toggle Mini Map"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
            <circle cx="16" cy="16" r="2" fill="currentColor" />
            <path d="M8 8L16 16" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1" />
          </svg>
        </button>
      </div>
      
      {/* Mini Map */}
      {showMiniMap && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-16 right-4 w-48 h-48 border border-card rounded-md overflow-hidden bg-background/80 backdrop-blur-md"
        >
          <div className="w-full h-full relative p-2">
            <h4 className="text-xs text-foreground/60 mb-1 font-medium">Mapa Global</h4>
            {/* Simplified mini version of the graph */}
            <div className="w-full h-36 bg-card/30 rounded relative">
              {nodes.map((node, i) => (
                <div
                  key={`mini-${node.id}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: getNodeColor(node.type),
                    left: `${30 + Math.random() * 70}%`,
                    top: `${30 + Math.random() * 50}%`,
                    opacity: node.type === 'subcerebro' ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Node tooltip */}
      {hoveredNode !== null && tooltipNode && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed text-sm bg-card/90 border border-card rounded-md shadow-lg p-3 z-10 backdrop-blur-md max-w-[250px]"
          style={{ 
            left: `${tooltipPos.x + 10}px`, 
            top: `${tooltipPos.y + 10}px`
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: getNodeColor(tooltipNode.type) }}
            />
            <span className="font-medium">{tooltipNode.label}</span>
          </div>
          <p className="text-xs text-foreground/70 mt-1 capitalize">
            {formatNodeType(tooltipNode.type)}
          </p>
          <p className="text-xs text-foreground/70">
            Último acesso: {tooltipNode.lastAccess}
          </p>
          {tooltipNode.connections && (
            <p className="text-xs text-foreground/70">
              {tooltipNode.connections.length} conexões
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

function formatNodeType(type: string): string {
  const types: Record<string, string> = {
    subcerebro: "Subcérebro",
    projeto: "Projeto",
    habito: "Hábito",
    favorito: "Favorito",
    pensamento: "Pensamento"
  };
  
  return types[type] || "Desconhecido";
}
