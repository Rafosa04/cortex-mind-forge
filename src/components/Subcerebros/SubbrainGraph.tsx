
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  relevancia: number;
  connections: any[];
  area?: string;
  fx?: number;
  fy?: number;
  x?: number;
  y?: number;
  tags?: string[];
  createdAt?: string;
  lastAccess?: string;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  impulse?: number;
}

export interface SubbrainGraphProps {
  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  onNodeClick: (node: any) => void;
  showMiniMap?: boolean;
}

export function SubbrainGraph({ graphData, onNodeClick, showMiniMap = true }: SubbrainGraphProps) {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodePositions, setNodePositions] = useState<Map<string, {x: number, y: number}>>(new Map());
  const [impulses, setImpulses] = useState<Map<string, number>>(new Map());
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Get color based on node type
  const getNodeColor = (node: GraphNode) => {
    switch (node.type) {
      case 'athena':
        return '#9b87f5';
      case 'subcerebro':
        return '#8B5CF6';
      case 'projeto':
        return '#0EA5E9';
      case 'habito':
        return '#10B981';
      case 'favorito':
        return '#F59E0B';
      case 'pensamento':
        return '#D1D5DB';
      default:
        return '#9b87f5';
    }
  };
  
  // Generate random impulses along links
  useEffect(() => {
    const interval = setInterval(() => {
      if (graphData.links.length === 0) return;
      
      // Randomly select a link to activate
      const randomIndex = Math.floor(Math.random() * graphData.links.length);
      const randomLink = graphData.links[randomIndex];
      const linkId = `${randomLink.source}-${randomLink.target}`;
      
      setImpulses(prev => {
        const newImpulses = new Map(prev);
        newImpulses.set(linkId, 1); // Start impulse at full strength
        return newImpulses;
      });
      
      // Fade out impulse over time
      setTimeout(() => {
        setImpulses(prev => {
          const newImpulses = new Map(prev);
          newImpulses.delete(linkId);
          return newImpulses;
        });
      }, 2000); // 2 seconds to complete animation
    }, 800); // Create new impulse every 800ms
    
    return () => clearInterval(interval);
  }, [graphData.links]);
  
  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: Math.max(window.innerHeight - 120, 600) // Adjust for header
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Fit the graph after it's loaded
  const handleEngineStop = useCallback(() => {
    if (fgRef.current && graphData.nodes.length) {
      fgRef.current.zoomToFit(400, 50);
    }
  }, [graphData.nodes.length]);
  
  // Handle node hover
  const handleNodeHover = (node: GraphNode | null, event: any) => {
    if (event && node) {
      // Get mouse position for tooltip
      const containerRect = event.target.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - containerRect.left + 10,
        y: event.clientY - containerRect.top + 10
      });
    }
    
    setHoveredNode(node);
  };
  
  // Custom node paint function for pulsating effect
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = hoveredNode && hoveredNode.id === node.id;
    const label = node.label;
    const fontSize = isHovered ? 14 : 12;
    const color = getNodeColor(node);
    
    // Node size based on relevance and hover state
    let nodeSize = (3 + (node.relevancia || 1) / 2) / globalScale;
    if (node.id === 'athena') nodeSize *= 1.5; // Make Athena larger
    
    // Additional size increase when hovered
    if (isHovered) nodeSize *= 1.3;
    
    // Pulsating effect
    const now = Date.now();
    const pulseFactor = node.id === 'athena' ? 
      1 + 0.15 * Math.sin(now / 400) : 
      1 + 0.1 * Math.sin(now / (800 + parseInt(node.id.substr(0, 1).charCodeAt(0) * 100)));
    
    nodeSize *= pulseFactor;
    
    // Draw glow effect
    const glowSize = nodeSize * 1.4;
    const glowOpacity = isHovered ? 0.4 : 0.2;
    
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, glowSize, 0, 2 * Math.PI);
    ctx.fillStyle = `${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Draw main node
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Edge outline for contrast
    ctx.strokeStyle = '#000810';
    ctx.lineWidth = 0.5 / globalScale;
    ctx.stroke();
    
    // Only draw labels for important nodes or when zoomed in or hovered
    if (node.id === 'athena' || globalScale > 1 || isHovered) {
      ctx.font = `${fontSize / globalScale}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      
      // Background for text
      const textWidth = ctx.measureText(label).width;
      const padding = 4 / globalScale;
      
      if (isHovered) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(
          (node.x || 0) - textWidth / 2 - padding,
          (node.y || 0) + nodeSize + padding,
          textWidth + padding * 2,
          fontSize / globalScale + padding * 2
        );
        ctx.fillStyle = 'white';
      }
      
      // Draw text
      ctx.fillText(
        label, 
        node.x || 0, 
        (node.y || 0) + nodeSize + (fontSize / globalScale) / 2 + (isHovered ? padding : 0)
      );
    }
  }, [hoveredNode]);
  
  // Custom link paint function for gradient links
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const source = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
    const target = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target);
    
    if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;
    
    // Get colors for gradient based on node types
    const sourceColor = getNodeColor(source);
    const targetColor = getNodeColor(target);
    
    // Set line width based on impulse
    const linkId = `${source.id}-${target.id}`;
    const hasImpulse = impulses.has(linkId);
    
    const lineWidth = hasImpulse ? 1.8 : 0.8;
    const sourceIsHovered = hoveredNode && hoveredNode.id === source.id;
    const targetIsHovered = hoveredNode && hoveredNode.id === target.id;
    const isRelatedToHoveredNode = sourceIsHovered || targetIsHovered;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(
      source.x, source.y, target.x, target.y
    );
    gradient.addColorStop(0, sourceColor);
    gradient.addColorStop(1, targetColor);
    
    // Set line opacity based on hover state
    const opacity = isRelatedToHoveredNode ? 0.9 : hasImpulse ? 0.7 : 0.3;
    
    // Draw link with gradient
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = gradient;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // If there's an impulse, draw animated dot
    if (hasImpulse) {
      // Calculate position along the line
      const impulseValue = impulses.get(linkId) || 0;
      const dotX = source.x + (target.x - source.x) * impulseValue;
      const dotY = source.y + (target.y - source.y) * impulseValue;
      
      // Draw the pulse dot
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  }, [graphData.nodes, hoveredNode, impulses]);
  
  return (
    <div className="relative w-full h-full bg-[#0C0C1C]">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeRelSize={8}
        nodeVal={(node) => (node as GraphNode).relevancia || 1}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        linkDirectionalParticles={0}
        nodeLabel={null} // Using custom tooltip instead
        onNodeHover={handleNodeHover}
        onNodeClick={(node) => {
          if (node) onNodeClick(node);
        }}
        backgroundColor="#0C0C1C"
        onEngineStop={handleEngineStop}
        cooldownTicks={100}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
        enableNodeDrag={true}
        enableZoomPanInteraction={true}
        width={dimensions.width}
        height={dimensions.height}
      />
      
      {/* Custom tooltip for hover */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute pointer-events-none bg-background/90 backdrop-blur-sm p-2 rounded-md border border-card shadow-lg z-10"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: getNodeColor(hoveredNode) }}
            ></span>
            <span className="font-medium">{hoveredNode.label}</span>
          </div>
          <div className="text-xs text-foreground/70 mt-1">
            <p>Tipo: {formatNodeType(hoveredNode.type)}</p>
            <p>Último acesso: {hoveredNode.lastAccess || 'N/A'}</p>
            <p>Conexões: {hoveredNode.connections?.length || 0}</p>
          </div>
        </motion.div>
      )}
      
      {/* Mini map (bottom right) */}
      {showMiniMap && (
        <div 
          className="absolute bottom-4 right-4 w-48 h-48 border border-card/50 rounded-lg overflow-hidden shadow-lg bg-[#090914]/90 backdrop-blur-sm"
          style={{ zIndex: 1000 }}
        >
          {graphData.nodes.length > 0 && fgRef.current && (
            <ForceGraph2D
              graphData={graphData}
              nodeRelSize={4}
              nodeColor={(node) => getNodeColor(node as GraphNode)}
              linkColor={() => 'rgba(155, 135, 245, 0.3)'}
              nodeLabel={null}
              linkDirectionalParticles={0}
              backgroundColor="#090914"
              width={192}
              height={192}
              onNodeClick={null}
              onLinkClick={null}
              enableZoomPanInteraction={false}
              enableNodeDrag={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatNodeType(type: string): string {
  const types: Record<string, string> = {
    athena: "Athena IA",
    subcerebro: "Subcérebro",
    projeto: "Projeto",
    habito: "Hábito",
    favorito: "Favorito",
    pensamento: "Pensamento"
  };
  
  return types[type] || "Desconhecido";
}
