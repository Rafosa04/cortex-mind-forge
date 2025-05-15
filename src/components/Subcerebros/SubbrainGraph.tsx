import React, { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { forceCollide } from "d3-force"; // More specific import
import { motion } from "framer-motion";

interface GraphNode {
  id: string;
  label: string;
  type: "athena" | "subcerebro" | "projeto" | "habito" | "favorito" | "pensamento";
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  connections?: any[];
  // Add missing properties to fix the type errors
  lastAccess?: string;
  tags?: string[];
  createdAt?: string;
  relevancia?: number;
  // Add properties for neural animation
  pulseSpeed?: number;
  pulsePhase?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface SubbrainGraphProps {
  graphData: GraphData;
  onNodeClick: (node: any) => void;
}

export default function SubbrainGraph({ graphData, onNodeClick }: SubbrainGraphProps) {
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink>>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, show: false });
  const [animationTick, setAnimationTick] = useState(0);
  const [draggedNode, setDraggedNode] = useState<GraphNode | null>(null);

  // Animation frame for continuous updates
  useEffect(() => {
    // Set up animation frame for continuous pulse effect
    let animationFrameId: number;
    
    const animate = () => {
      setAnimationTick(prev => prev + 1);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Initialize random pulse phases and speeds for each node
  useEffect(() => {
    if (graphData?.nodes) {
      const enhancedNodes = graphData.nodes.map(node => ({
        ...node,
        pulsePhase: Math.random() * Math.PI * 2, // Random starting phase
        pulseSpeed: 0.5 + Math.random() * 1.5    // Random speed modifier
      }));

      // This doesn't modify the original graphData, just adds the properties if they don't exist
      graphData.nodes = enhancedNodes;
    }
  }, [graphData]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 0.85,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize physics simulation and forces
  useEffect(() => {
    if (graphRef.current) {
      // Configure physics for Obsidian-like behavior with smoother movement
      graphRef.current.d3Force('charge')?.strength(-120);  // Reduced strength for smoother motion
      graphRef.current.d3Force('link')?.distance(150).strength(0.4);  // More room between nodes
      graphRef.current.d3Force('center')?.strength(0.03);  // Gentler centering force
      
      // Add collision force to prevent node overlap
      // Fixed: Pass the required radius parameter to forceCollide
      graphRef.current.d3Force('collide', forceCollide(40).strength(0.7));
      
      // Add a small random force to create gentle movement
      const simulation = graphRef.current.d3Force();
      if (simulation) {
        simulation.alpha(1).restart();
      }

      // Initial zoom after 1 second to ensure graph is settled
      setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(400, 50);
        }
      }, 1000);

      // Add gentle orbital movement - nodes will slightly orbit around Athena
      const orbitNodes = setInterval(() => {
        if (graphData && graphData.nodes) {
          const athenaNode = graphData.nodes.find(node => node.id === 'athena');
          
          if (athenaNode && athenaNode.x && athenaNode.y) {
            graphData.nodes.forEach(node => {
              // Skip Athena and dragged nodes
              if (node.id === 'athena' || (node === draggedNode)) return;
              
              // Only apply gentle forces, don't set positions directly
              if (node.x !== undefined && node.y !== undefined && !node.fx && !node.fy) {
                // Calculate vector from node to Athena
                const dx = athenaNode.x - node.x;
                const dy = athenaNode.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Apply a very subtle orbital motion - perpendicular to the radius
                const orbitFactor = 0.0003; // Very small to keep motion subtle
                const orbit_dx = -dy * orbitFactor;
                const orbit_dy = dx * orbitFactor;
                
                // Apply a tiny attraction to maintain reasonable distances
                const attractFactor = 0.0001;
                const attract_dx = dx * attractFactor;
                const attract_dy = dy * attractFactor;
                
                // Add some subtle randomness for natural motion
                const randomFactor = 0.0002;
                const random_dx = (Math.random() - 0.5) * randomFactor;
                const random_dy = (Math.random() - 0.5) * randomFactor;
                
                // Apply the combined forces
                if (node.vx !== undefined && node.vy !== undefined) {
                  node.vx += orbit_dx + attract_dx + random_dx;
                  node.vy += orbit_dy + attract_dy + random_dy;
                }
              }
            });
            
            // Restart the simulation with a tiny alpha to keep movement gentle
            if (graphRef.current) {
              const simulation = graphRef.current.d3Force();
              if (simulation) {
                simulation.alpha(0.05).restart();
              }
            }
          }
        }
      }, 100);

      return () => clearInterval(orbitNodes);
    }
  }, [graphData, draggedNode]);

  const getNodeColor = (type: string): string => {
    const colors: Record<string, string> = {
      athena: "#9f7aea", // lilás
      subcerebro: "#993887", // roxo
      projeto: "#60B5B5", // azul
      habito: "#34D399", // verde
      favorito: "#FBBF24", // amarelo
      pensamento: "#cbd5e0", // cinza claro
    };
    return colors[type] || "#cbd5e0";
  };

  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const nodeColor = getNodeColor(node.type);
    const isHovered = node === hoveredNode;
    const isDragged = node === draggedNode;
    
    // Base radius depends on node type
    const baseRadius = node.type === "athena" ? 14 : 10;
    
    // Calculate pulsing effect - more pronounced for hovered nodes
    // Use the node's unique phase and speed to create varied pulsing
    const time = Date.now() / 1000;
    const pulsePhase = node.pulsePhase || 0;
    const pulseSpeed = node.pulseSpeed || 1;
    const pulseFactor = Math.sin((time * pulseSpeed) + pulsePhase);
    
    // Different pulse amounts based on node type and hover/drag state
    let pulseAmount;
    if (isHovered || isDragged) {
      pulseAmount = 1 + pulseFactor * 0.2;  // 20% size variation when hovered/dragged
    } else {
      // Different pulse intensities based on node type
      const typePulseIntensity = {
        athena: 0.15,
        subcerebro: 0.12,
        projeto: 0.1,
        habito: 0.08,
        favorito: 0.07,
        pensamento: 0.05
      };
      const intensity = typePulseIntensity[node.type] || 0.08;
      pulseAmount = 1 + pulseFactor * intensity;
    }
    
    const drawRadius = baseRadius * pulseAmount;

    // Neural connection glow effect
    const glowRadius = isHovered || isDragged ? 25 : 15 + pulseFactor * 3;
    const glowAlpha = isHovered || isDragged ? 0.35 : 0.15 + Math.abs(pulseFactor) * 0.08;
    
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, glowRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(${hexToRgb(nodeColor)}, ${glowAlpha})`;
    ctx.fill();
    
    // Secondary outer glow (stronger for hovered/dragged nodes)
    if (isHovered || isDragged) {
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, drawRadius + 10, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(${hexToRgb(nodeColor)}, 0.2)`;
      ctx.fill();
    }
    
    // Main node with more vibrant appearance
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, drawRadius, 0, 2 * Math.PI, false);
    
    // Gradient fill for more dimension
    const gradient = ctx.createRadialGradient(
      (node.x || 0), (node.y || 0), 0,
      (node.x || 0), (node.y || 0), drawRadius
    );
    gradient.addColorStop(0, lightenColor(nodeColor, 20));
    gradient.addColorStop(1, nodeColor);
    
    ctx.fillStyle = gradient;
    ctx.shadowBlur = isHovered || isDragged ? 15 : 8 + Math.abs(pulseFactor) * 3;
    ctx.shadowColor = nodeColor;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw label if zoomed in enough or node is hovered/dragged
    const fontSize = (globalScale > 0.7 || isHovered || isDragged) ? 12 / Math.max(0.5, Math.min(1, globalScale)) : 0;
    if (fontSize > 0) {
      const label = node.label || "";
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      
      // Background for text (improved readability)
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = "rgba(12, 12, 28, 0.75)";
      ctx.fillRect(
        (node.x || 0) - textWidth / 2 - 2,
        (node.y || 0) + drawRadius + 2,
        textWidth + 4,
        fontSize + 2
      );
      
      // Draw text
      ctx.fillStyle = "#fff";
      ctx.fillText(label, node.x || 0, (node.y || 0) + drawRadius + 2);
    }
    
    // Update tooltip position if this is the hovered node
    if (isHovered) {
      setTooltipPos({ 
        x: (node.x || 0) + 20, 
        y: (node.y || 0) - 100, 
        show: true 
      });
    }
  }, [hoveredNode, animationTick, draggedNode]);

  const linkCanvasObject = useCallback((link: GraphLink, ctx: CanvasRenderingContext2D) => {
    const source = typeof link.source === 'object' ? link.source : { x: 0, y: 0 };
    const target = typeof link.target === 'object' ? link.target : { x: 0, y: 0 };
    
    // Create smooth gradient for links
    const sourceType = typeof link.source === 'object' ? link.source.type : 'unknown';
    const targetType = typeof link.target === 'object' ? link.target.type : 'unknown';
    
    const sourceColor = getNodeColor(sourceType);
    const targetColor = getNodeColor(targetType);
    
    const start = { x: source.x || 0, y: source.y || 0 };
    const end = { x: target.x || 0, y: target.y || 0 };
    
    // Calculate link vector
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Create gradient
    const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    gradient.addColorStop(0, `rgba(${hexToRgb(sourceColor)}, 0.3)`);
    gradient.addColorStop(1, `rgba(${hexToRgb(targetColor)}, 0.3)`);
    
    // Draw link with slight curve for more organic look
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const offset = 5 * Math.sin(Date.now() / 5000); // Subtle movement
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(midX + offset, midY + offset, end.x, end.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Add animated particles along the link - neural impulse effect
    const now = Date.now();
    const numParticles = 2;
    for (let i = 0; i < numParticles; i++) {
      const t = ((now / 3000) + i / numParticles) % 1;
      
      // Calculate position along the quadratic curve
      const invT = 1 - t;
      const x = invT * invT * start.x + 2 * invT * t * (midX + offset) + t * t * end.x;
      const y = invT * invT * start.y + 2 * invT * t * (midY + offset) + t * t * end.y;
      
      // Draw with tail effect
      const tailLength = 5;
      for (let j = 0; j < tailLength; j++) {
        const tailT = Math.max(0, t - 0.01 * j);
        const invTailT = 1 - tailT;
        const tailX = invTailT * invTailT * start.x + 2 * invTailT * tailT * (midX + offset) + tailT * tailT * end.x;
        const tailY = invTailT * invTailT * start.y + 2 * invTailT * tailT * (midY + offset) + tailT * tailT * end.y;
        
        ctx.beginPath();
        ctx.arc(tailX, tailY, 1.5 - (j * 0.2), 0, 2 * Math.PI, false);
        ctx.fillStyle = `rgba(${hexToRgb(targetColor)}, ${0.7 - (j * 0.1)})`;
        ctx.fill();
      }
    }
  }, [animationTick]);

  const handleNodeHover = (node: GraphNode | null) => {
    setHoveredNode(node);
    if (!node) {
      setTooltipPos(prev => ({ ...prev, show: false }));
    }
    document.body.style.cursor = node ? "pointer" : "default";
  };

  const handleNodeClick = (node: GraphNode) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
    
    // Visual feedback (zoom to node)
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(1.5, 1000);
    }
  };

  // Node drag handlers
  const handleNodeDrag = (node: GraphNode, translate: { x: number, y: number }) => {
    // Only update position if it's not Athena
    if (node.id !== 'athena') {
      node.fx = translate.x;
      node.fy = translate.y;
      setDraggedNode(node);
      
      // Make sure connections follow
      if (graphRef.current) {
        const simulation = graphRef.current.d3Force();
        if (simulation) {
          simulation.alpha(0.1).restart();
        }
      }
    }
  };

  const handleNodeDragEnd = (node: GraphNode) => {
    setDraggedNode(null);
    // Keep the node at its new position but allow it to move with forces again
    if (node.id !== 'athena') {
      node.fx = null;
      node.fy = null;
    }
  };

  // Helper function to convert hex to rgb for glow effects
  const hexToRgb = (hex: string): string => {
    // Remove # if present
    hex = hex.replace("#", "");
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };
  
  // Helper function to lighten a color
  const lightenColor = (hex: string, percent: number): string => {
    // Remove # if present
    hex = hex.replace("#", "");
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten
    const lightenR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    const lightenG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    const lightenB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    // Convert back to hex
    return `#${lightenR.toString(16).padStart(2, '0')}${lightenG.toString(16).padStart(2, '0')}${lightenB.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-[#0c0c1c] relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        nodeRelSize={6}
        backgroundColor="#0c0c1c"
        d3VelocityDecay={0.15}  // Lower for more fluid movement
        cooldownTicks={100}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={handleNodeDragEnd}
        enableNodeDrag={true}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400, 50);
          }
        }}
      />
      
      {/* Tooltip */}
      {tooltipPos.show && hoveredNode && (
        <motion.div 
          className="absolute px-3 py-2 rounded-md bg-background/90 border border-card shadow-lg backdrop-blur-sm z-10"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-medium mb-1 text-sm">{hoveredNode.label}</p>
          <div className="text-xs text-foreground/70 space-y-1">
            <p>Tipo: {formatNodeType(hoveredNode.type)}</p>
            {hoveredNode.lastAccess && (
              <p>Último acesso: {hoveredNode.lastAccess}</p>
            )}
            <p>Conexões: {hoveredNode.connections?.length || 0}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper function to format node type
function formatNodeType(type: string): string {
  const types: Record<string, string> = {
    subcerebro: "Subcérebro",
    projeto: "Projeto",
    habito: "Hábito",
    favorito: "Favorito",
    pensamento: "Pensamento",
    athena: "Athena IA"
  };
  
  return types[type] || "Desconhecido";
}
