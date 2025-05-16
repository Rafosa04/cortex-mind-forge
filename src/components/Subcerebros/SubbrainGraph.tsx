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
  showMiniMap?: boolean; // We'll keep this prop but ignore it since we're removing the minimap
}

export function SubbrainGraph({ graphData, onNodeClick }: SubbrainGraphProps) {
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
  
  // Generate more frequent impulses along links
  useEffect(() => {
    if (graphData.links.length === 0) return;
    
    // Create impulses more frequently
    const interval = setInterval(() => {
      // Select up to 3 random links to activate simultaneously
      const numberOfImpulses = Math.min(3, graphData.links.length);
      const selectedLinks = new Set<number>();
      
      while (selectedLinks.size < numberOfImpulses) {
        const randomIndex = Math.floor(Math.random() * graphData.links.length);
        selectedLinks.add(randomIndex);
      }
      
      // Add impulses for selected links
      selectedLinks.forEach(index => {
        const randomLink = graphData.links[index];
        const source = typeof randomLink.source === 'object' ? randomLink.source.id : randomLink.source;
        const target = typeof randomLink.target === 'object' ? randomLink.target.id : randomLink.target;
        const linkId = `${source}-${target}`;
        
        setImpulses(prev => {
          const newImpulses = new Map(prev);
          newImpulses.set(linkId, 0); // Start impulse at beginning of path
          return newImpulses;
        });
      });
    }, 600); // Create new impulses every 600ms
    
    // Animation loop for impulse movement
    const animationInterval = setInterval(() => {
      setImpulses(prev => {
        const newImpulses = new Map(prev);
        
        // Update all existing impulses
        for (const [linkId, progress] of prev.entries()) {
          if (progress >= 1) {
            // Remove completed impulses
            newImpulses.delete(linkId);
          } else {
            // Move impulses along their paths
            newImpulses.set(linkId, progress + 0.04); // Speed of impulse movement
          }
        }
        
        return newImpulses;
      });
    }, 30); // Update animation frames every 30ms for smooth movement
    
    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
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
  
  // Custom node paint function for improved pulsating effect
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
    
    // Smoother pulsating effect with combination of sine waves
    const now = Date.now();
    const nodeNum = parseInt(node.id.substring(node.id.length - 1)) || 1;
    const primaryFrequency = node.id === 'athena' ? 600 : 1000 + (nodeNum * 100);
    const secondaryFrequency = primaryFrequency * 2.5;
    
    // Combine two sine waves for a more organic pulsing effect
    const primaryWave = Math.sin(now / primaryFrequency);
    const secondaryWave = Math.sin(now / secondaryFrequency) * 0.5;
    const combinedWave = (primaryWave + secondaryWave) / 1.5;
    
    // Apply a more subtle pulse (keeping node size more consistent)
    const pulseFactor = node.id === 'athena' ? 
      1 + 0.08 * combinedWave : 
      1 + 0.06 * combinedWave;
    
    nodeSize *= pulseFactor;
    
    // Enhanced glow effect
    const glowSize = nodeSize * 1.5;
    const baseGlowOpacity = isHovered ? 0.45 : 0.25;
    const glowOpacity = baseGlowOpacity + (0.05 * combinedWave);
    
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, glowSize, 0, 2 * Math.PI);
    ctx.fillStyle = `${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Draw main node with subtle shadow
    ctx.beginPath();
    ctx.shadowColor = color;
    ctx.shadowBlur = 10 * pulseFactor;
    ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow after drawing node
    
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
  
  // Custom link paint function for enhanced animated links
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const source = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
    const target = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target);
    
    if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;
    
    // Get colors for gradient based on node types
    const sourceColor = getNodeColor(source);
    const targetColor = getNodeColor(target);
    
    // Get link ID
    const linkId = `${source.id}-${target.id}`;
    const reverseLinkId = `${target.id}-${source.id}`;
    const hasImpulse = impulses.has(linkId) || impulses.has(reverseLinkId);
    const impulseValue = impulses.get(linkId) || impulses.get(reverseLinkId) || 0;
    
    // Set line width based on link state
    const sourceIsHovered = hoveredNode && hoveredNode.id === source.id;
    const targetIsHovered = hoveredNode && hoveredNode.id === target.id;
    const isRelatedToHoveredNode = sourceIsHovered || targetIsHovered;
    const lineWidth = isRelatedToHoveredNode ? 1.8 : 1.0;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(
      source.x, source.y, target.x, target.y
    );
    gradient.addColorStop(0, sourceColor);
    gradient.addColorStop(1, targetColor);
    
    // Set line opacity based on hover state
    const opacity = isRelatedToHoveredNode ? 0.9 : 0.4;
    
    // Draw link with gradient
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = gradient;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // If there's an impulse, draw animated dot
    if (hasImpulse) {
      // Calculate position along the line from source to target
      const dotX = source.x + (target.x - source.x) * impulseValue;
      const dotY = source.y + (target.y - source.y) * impulseValue;
      
      // Draw multiple pulse dots to create a comet-like effect
      const dotSizes = [2.5, 2.0, 1.6, 1.2];
      const tailPositions = [0, 0.03, 0.06, 0.09]; // Offset for tail dots
      
      for (let i = 0; i < dotSizes.length; i++) {
        const tailOffset = tailPositions[i];
        const tailPosition = Math.max(0, impulseValue - tailOffset);
        
        if (tailPosition > 0) {
          const tailX = source.x + (target.x - source.x) * tailPosition;
          const tailY = source.y + (target.y - source.y) * tailPosition;
          
          // Draw the pulse dot with glowing effect
          ctx.beginPath();
          ctx.arc(tailX, tailY, dotSizes[i], 0, Math.PI * 2);
          
          // Gradient for the dot to create glow effect
          const dotGlow = ctx.createRadialGradient(
            tailX, tailY, 0, 
            tailX, tailY, dotSizes[i] * 2
          );
          
          dotGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
          dotGlow.addColorStop(0.4, `${sourceColor}Ec`);
          dotGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = dotGlow;
          ctx.globalAlpha = 0.9 - (i * 0.2); // Fade for tail
          ctx.fill();
        }
      }
    }
    
    ctx.globalAlpha = 1; // Reset alpha
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
        enableZoomInteraction={true}
        enablePanInteraction={true}
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
      
      {/* Minimap removed as requested */}
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
