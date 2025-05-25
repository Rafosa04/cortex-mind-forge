
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { NodeTooltip } from './NodeTooltip';

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
}

export function SubbrainGraph({ graphData, onNodeClick }: SubbrainGraphProps) {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodePositions, setNodePositions] = useState<Map<string, {x: number, y: number}>>(new Map());
  const [impulses, setImpulses] = useState<Map<string, number>>(new Map());
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  
  // Get enhanced color based on node type with better gradients
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
    }, 800); // Slightly slower for better visual impact
    
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
            newImpulses.set(linkId, progress + 0.035); // Slightly slower movement
          }
        }
        
        return newImpulses;
      });
    }, 35); // Smoother animation
    
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
      fgRef.current.zoomToFit(400, 80);
    }
  }, [graphData.nodes.length]);
  
  // Enhanced node hover with tooltip positioning
  const handleNodeHover = (node: GraphNode | null, event: any) => {
    if (event && node) {
      // Get canvas container for accurate positioning
      const canvas = event.target;
      const canvasRect = canvas.getBoundingClientRect();
      
      setTooltipPosition({
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top
      });
    }
    
    setHoveredNode(node);
  };

  // Handle node expansion (focus mode)
  const handleNodeExpand = (node: GraphNode) => {
    setFocusedNode(node);
    if (fgRef.current) {
      // Center the focused node
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2, 1000);
    }
  };

  // Reset focus mode
  const resetFocus = () => {
    setFocusedNode(null);
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 80);
    }
  };
  
  // Enhanced custom node paint function
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label;
    const fontSize = 12;
    const color = getNodeColor(node);
    
    // Enhanced node size based on relevance and type
    let baseNodeSize = (4 + (node.relevancia || 1) / 1.5) / globalScale;
    if (node.id === 'athena') baseNodeSize *= 1.8; // Make Athena significantly larger
    if (node.type === 'subcerebro') baseNodeSize *= 1.4; // Make subcérebros larger
    
    // Enhanced pulsating effect with better timing
    const now = Date.now();
    const nodeNum = parseInt(node.id.substring(node.id.length - 1)) || 1;
    const primaryFrequency = node.id === 'athena' ? 800 : 1200 + (nodeNum * 150);
    const secondaryFrequency = primaryFrequency * 1.8;
    
    // More organic pulsing with triple wave combination
    const primaryWave = Math.sin(now / primaryFrequency);
    const secondaryWave = Math.sin(now / secondaryFrequency) * 0.4;
    const tertiaryWave = Math.sin(now / (primaryFrequency * 0.7)) * 0.2;
    const combinedWave = (primaryWave + secondaryWave + tertiaryWave) / 1.6;
    
    // Enhanced pulse effects based on relevance
    const relevanceMultiplier = (node.relevancia || 5) / 10;
    const pulseFactor = node.id === 'athena' ? 
      1 + (0.12 * combinedWave * relevanceMultiplier) : 
      1 + (0.08 * combinedWave * relevanceMultiplier);
    
    // Multi-layer glow effect for more impact
    const innerGlowSize = baseNodeSize * 1.2;
    const outerGlowSize = baseNodeSize * 2.2 * pulseFactor;
    
    // Outer glow (larger, more transparent)
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, outerGlowSize, 0, 2 * Math.PI);
    const outerGlowOpacity = 0.08 + (0.04 * combinedWave * relevanceMultiplier);
    ctx.fillStyle = `${color}${Math.round(outerGlowOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Inner glow (medium size, medium transparency)
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, innerGlowSize * pulseFactor, 0, 2 * Math.PI);
    const innerGlowOpacity = 0.2 + (0.1 * combinedWave * relevanceMultiplier);
    ctx.fillStyle = `${color}${Math.round(innerGlowOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Main node with enhanced shadow and gradient effect
    ctx.beginPath();
    ctx.shadowColor = color;
    ctx.shadowBlur = 15 * pulseFactor * relevanceMultiplier;
    ctx.arc(node.x || 0, node.y || 0, baseNodeSize, 0, 2 * Math.PI);
    
    // Create radial gradient for the main node
    const gradient = ctx.createRadialGradient(
      node.x || 0, node.y || 0, 0,
      node.x || 0, node.y || 0, baseNodeSize
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `${color}CC`); // Slightly transparent at edges
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
    
    // Enhanced edge outline with better contrast
    ctx.strokeStyle = focusedNode?.id === node.id ? '#ffffff' : '#000814';
    ctx.lineWidth = focusedNode?.id === node.id ? 1.5 / globalScale : 0.8 / globalScale;
    ctx.stroke();
    
    // Enhanced label rendering with better visibility
    if (node.id === 'athena' || globalScale > 1.2 || focusedNode?.id === node.id) {
      ctx.font = `${Math.max(fontSize / globalScale, 8)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = 'white';
      
      // Draw text below node with better positioning
      const textY = (node.y || 0) + baseNodeSize + (fontSize / globalScale) + 4;
      ctx.fillText(label, node.x || 0, textY);
      ctx.shadowBlur = 0; // Reset shadow
    }
  }, [focusedNode]);
  
  // Enhanced custom link paint function
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const source = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
    const target = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target);
    
    if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;
    
    // Enhanced colors for gradient based on node types
    const sourceColor = getNodeColor(source);
    const targetColor = getNodeColor(target);
    
    // Get link ID for impulse tracking
    const linkId = `${source.id}-${target.id}`;
    const reverseLinkId = `${target.id}-${source.id}`;
    const hasImpulse = impulses.has(linkId) || impulses.has(reverseLinkId);
    const impulseValue = impulses.get(linkId) || impulses.get(reverseLinkId) || 0;
    
    // Enhanced line styling
    const lineWidth = focusedNode && (focusedNode.id === source.id || focusedNode.id === target.id) ? 2.0 : 1.2;
    const opacity = focusedNode && (focusedNode.id === source.id || focusedNode.id === target.id) ? 0.8 : 0.5;
    
    // Create enhanced gradient
    const gradient = ctx.createLinearGradient(
      source.x, source.y, target.x, target.y
    );
    gradient.addColorStop(0, sourceColor);
    gradient.addColorStop(0.5, `${sourceColor}80`); // Semi-transparent middle
    gradient.addColorStop(1, targetColor);
    
    // Draw link with enhanced gradient
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = gradient;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Enhanced impulse visualization with comet effect
    if (hasImpulse) {
      const dotX = source.x + (target.x - source.x) * impulseValue;
      const dotY = source.y + (target.y - source.y) * impulseValue;
      
      // Enhanced pulse dots with more dramatic comet effect
      const dotSizes = [3.5, 2.8, 2.2, 1.8, 1.4];
      const tailPositions = [0, 0.04, 0.08, 0.12, 0.16];
      
      for (let i = 0; i < dotSizes.length; i++) {
        const tailOffset = tailPositions[i];
        const tailPosition = Math.max(0, impulseValue - tailOffset);
        
        if (tailPosition > 0) {
          const tailX = source.x + (target.x - source.x) * tailPosition;
          const tailY = source.y + (target.y - source.y) * tailPosition;
          
          // Enhanced pulse dot with better glow
          ctx.beginPath();
          ctx.arc(tailX, tailY, dotSizes[i], 0, Math.PI * 2);
          
          // Enhanced gradient for better glow effect
          const dotGlow = ctx.createRadialGradient(
            tailX, tailY, 0, 
            tailX, tailY, dotSizes[i] * 3
          );
          
          dotGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
          dotGlow.addColorStop(0.3, `${sourceColor}FF`);
          dotGlow.addColorStop(0.6, `${sourceColor}80`);
          dotGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = dotGlow;
          ctx.globalAlpha = 1.0 - (i * 0.15); // Better fade for tail
          ctx.fill();
        }
      }
    }
    
    ctx.globalAlpha = 1; // Reset alpha
  }, [graphData.nodes, impulses, focusedNode]);
  
  return (
    <div className="relative w-full h-full bg-[#0C0C1C]">
      {/* Focus mode controls */}
      {focusedNode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-background/90 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2 flex items-center gap-3">
            <span className="text-sm font-medium">
              Focado em: <span className="text-primary">{focusedNode.label}</span>
            </span>
            <button
              onClick={resetFocus}
              className="text-xs bg-secondary hover:bg-secondary/80 px-2 py-1 rounded transition-colors"
            >
              Sair do foco
            </button>
          </div>
        </motion.div>
      )}

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeRelSize={10}
        nodeVal={(node) => (node as GraphNode).relevancia || 1}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        linkDirectionalParticles={0}
        nodeLabel={null} // No default tooltip
        onNodeClick={(node) => {
          if (node) onNodeClick(node);
        }}
        onNodeHover={handleNodeHover}
        backgroundColor="#0C0C1C"
        onEngineStop={handleEngineStop}
        cooldownTicks={150}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        width={dimensions.width}
        height={dimensions.height}
        // Enhanced zoom and pan settings
        minZoom={0.1}
        maxZoom={8}
      />

      {/* Advanced Tooltip */}
      <NodeTooltip
        node={hoveredNode}
        position={tooltipPosition}
        visible={!!hoveredNode}
        onView={() => hoveredNode && onNodeClick(hoveredNode)}
        onEdit={() => hoveredNode && onNodeClick(hoveredNode)}
        onExpand={() => hoveredNode && handleNodeExpand(hoveredNode)}
      />
    </div>
  );
}
