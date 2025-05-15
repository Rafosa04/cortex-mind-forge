
import React, { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3";
import { motion } from "framer-motion";

interface GraphNode {
  id: string;
  label: string;
  type: "athena" | "subcerebro" | "projeto" | "habito" | "favorito" | "pensamento";
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
  connections?: any[];
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
      // Configure physics for Obsidian-like behavior
      graphRef.current.d3Force('charge')?.strength(-180);
      graphRef.current.d3Force('link')?.distance(120).strength(0.6);
      graphRef.current.d3Force('center')?.strength(0.05);
      
      // Add collision force to prevent node overlap
      graphRef.current.d3Force('collide', d3.forceCollide().radius(40).strength(0.7));
      
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
    }
  }, [graphData]);

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
    const radius = node.type === "athena" ? 14 : 10;
    const pulseAmount = isHovered ? 1 + Math.sin(Date.now() / 200) * 0.1 : 1;
    const drawRadius = radius * pulseAmount;

    // Background glow for all nodes (Obsidian-like effect)
    const glowRadius = isHovered ? 20 : 12;
    const glowAlpha = isHovered ? 0.3 : 0.15;
    
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, glowRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(${hexToRgb(nodeColor)}, ${glowAlpha})`;
    ctx.fill();
    
    // Outer glow (stronger for hovered nodes)
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, drawRadius + 8, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(${hexToRgb(nodeColor)}, 0.2)`;
      ctx.fill();
    }
    
    // Main node
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, drawRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor;
    ctx.shadowBlur = isHovered ? 15 : 8;
    ctx.shadowColor = nodeColor;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw label if zoomed in enough or node is hovered
    const fontSize = (globalScale > 0.7 || isHovered) ? 12 / Math.max(0.5, Math.min(1, globalScale)) : 0;
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
  }, [hoveredNode]);

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
    
    // Draw link
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Add subtle animated particles along the link
    const now = Date.now();
    const numParticles = 1;
    for (let i = 0; i < numParticles; i++) {
      const t = ((now / 2000) + i / numParticles) % 1;
      const x = start.x + dx * t;
      const y = start.y + dy * t;
      
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(${hexToRgb(targetColor)}, 0.7)`;
      ctx.fill();
    }
  }, []);

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
        d3VelocityDecay={0.25}
        cooldownTicks={100}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
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
