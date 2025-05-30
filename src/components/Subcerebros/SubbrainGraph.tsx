import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { Maximize, Minimize } from 'lucide-react';
import { NodeTooltip } from './NodeTooltip';
import { useOrbitalAnimation } from '@/hooks/useOrbitalAnimation';
import { Button } from '@/components/ui/button';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [impulses, setImpulses] = useState<Map<string, number>>(new Map());
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const [isGraphReady, setIsGraphReady] = useState(false);
  const [showInitialLabels, setShowInitialLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Enable orbital animation
  useOrbitalAnimation(graphData.nodes, fgRef, isGraphReady);
  
  // Hide initial labels after a few seconds
  useEffect(() => {
    if (isGraphReady) {
      const timer = setTimeout(() => {
        setShowInitialLabels(false);
      }, 3000); // Show labels for 3 seconds after graph is ready
      
      return () => clearTimeout(timer);
    }
  }, [isGraphReady]);
  
  // Get enhanced color based on node type
  const getNodeColor = (node: GraphNode) => {
    // Athena is always golden/yellow like the sun
    if (node.id === 'athena') {
      return '#FFD700'; // Golden yellow
    }
    
    switch (node.type) {
      case 'athena':
        return '#FFD700';
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
  
  // Generate impulses along links - keep existing functionality
  useEffect(() => {
    if (graphData.links.length === 0) return;
    
    const interval = setInterval(() => {
      const numberOfImpulses = Math.min(3, graphData.links.length);
      const selectedLinks = new Set<number>();
      
      while (selectedLinks.size < numberOfImpulses) {
        const randomIndex = Math.floor(Math.random() * graphData.links.length);
        selectedLinks.add(randomIndex);
      }
      
      selectedLinks.forEach(index => {
        const randomLink = graphData.links[index];
        const source = typeof randomLink.source === 'object' ? randomLink.source.id : randomLink.source;
        const target = typeof randomLink.target === 'object' ? randomLink.target.id : randomLink.target;
        const linkId = `${source}-${target}`;
        
        setImpulses(prev => {
          const newImpulses = new Map(prev);
          newImpulses.set(linkId, 0);
          return newImpulses;
        });
      });
    }, 800);
    
    const animationInterval = setInterval(() => {
      setImpulses(prev => {
        const newImpulses = new Map(prev);
        
        for (const [linkId, progress] of prev.entries()) {
          if (progress >= 1) {
            newImpulses.delete(linkId);
          } else {
            newImpulses.set(linkId, progress + 0.035);
          }
        }
        
        return newImpulses;
      });
    }, 35);
    
    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, [graphData.links]);
  
  // Initialize dimensions with real fullscreen support
  useEffect(() => {
    const updateDimensions = () => {
      if (isFullscreen) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      } else {
        setDimensions({
          width: window.innerWidth,
          height: Math.max(window.innerHeight - 120, 600)
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);
  
  // Handle engine stop and initial positioning
  const handleEngineStop = useCallback(() => {
    if (fgRef.current && graphData.nodes.length) {
      // Position Athena at the center
      const athenaNode = graphData.nodes.find(node => node.id === 'athena');
      if (athenaNode) {
        athenaNode.fx = 0;
        athenaNode.fy = 0;
        athenaNode.x = 0;
        athenaNode.y = 0;
      }
      
      fgRef.current.zoomToFit(400, 80);
      setIsGraphReady(true);
    }
  }, [graphData.nodes]);
  
  // Fixed node hover with proper global positioning using document coordinates
  const handleNodeHover = useCallback((node: GraphNode | null, event: any) => {
    if (node && event) {
      // Get the exact mouse position from the event
      const mouseX = event.pageX || event.clientX + window.scrollX;
      const mouseY = event.pageY || event.clientY + window.scrollY;
      
      // Calculate tooltip position with offsets
      let tooltipX = mouseX + 15; // Small offset from cursor
      let tooltipY = mouseY - 10; // Small offset from cursor
      
      // Tooltip dimensions for boundary checking
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      
      // Get current viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Prevent tooltip from going off-screen horizontally
      if (tooltipX + tooltipWidth > viewportWidth) {
        tooltipX = mouseX - tooltipWidth - 15; // Show on left side of cursor
      }
      
      // Prevent tooltip from going off-screen vertically
      if (tooltipY + tooltipHeight > viewportHeight) {
        tooltipY = mouseY - tooltipHeight + 10; // Show above cursor
      }
      
      // Ensure minimum margins from screen edges
      tooltipX = Math.max(10, Math.min(tooltipX, viewportWidth - tooltipWidth - 10));
      tooltipY = Math.max(10, Math.min(tooltipY, viewportHeight - tooltipHeight - 10));
      
      setTooltipPosition({ x: tooltipX, y: tooltipY });
    }
    
    setHoveredNode(node);
  }, []);

  // Handle node expansion (focus mode)
  const handleNodeExpand = useCallback((node: GraphNode) => {
    setFocusedNode(node);
    if (fgRef.current && node.x && node.y) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2, 1000);
    }
  }, []);

  // Reset focus mode
  const resetFocus = useCallback(() => {
    setFocusedNode(null);
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 80);
    }
  }, []);
  
  // Enter real fullscreen mode using Fullscreen API
  const enterFullscreen = useCallback(async () => {
    if (containerRef.current) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.warn('Fullscreen API not supported, falling back to CSS fullscreen');
        setIsFullscreen(true);
      }
    }
  }, []);
  
  // Exit fullscreen mode
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen API exit failed');
    }
    setIsFullscreen(false);
  }, []);
  
  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle escape key for fullscreen exit
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isFullscreen, exitFullscreen]);
  
  // Enhanced custom node paint function
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label;
    const fontSize = 12;
    const color = getNodeColor(node);
    
    // Enhanced node size based on relevance and special handling for Athena
    let baseNodeSize;
    if (node.id === 'athena') {
      // Athena is always large and bright like the sun
      baseNodeSize = 12 / globalScale;
    } else {
      // Other nodes size based on relevance
      const relevanceMultiplier = (node.relevancia || 5) / 10;
      baseNodeSize = (3 + relevanceMultiplier * 5) / globalScale;
    }
    
    // Enhanced pulsating effect
    const now = Date.now();
    const nodeNum = parseInt(node.id.substring(node.id.length - 1)) || 1;
    
    let pulseFactor;
    if (node.id === 'athena') {
      // Athena has a strong, solar-like pulsing
      const solarPulse = Math.sin(now / 600) * 0.3 + 1;
      pulseFactor = solarPulse;
    } else {
      // Other nodes pulse based on relevance
      const primaryFrequency = 1200 + (nodeNum * 150);
      const relevanceMultiplier = (node.relevancia || 5) / 10;
      const primaryWave = Math.sin(now / primaryFrequency);
      pulseFactor = 1 + (0.15 * primaryWave * relevanceMultiplier);
    }
    
    // Enhanced brightness based on relevance (except Athena)
    let opacity = 1;
    if (node.id !== 'athena') {
      const relevanceMultiplier = (node.relevancia || 5) / 10;
      opacity = 0.4 + (0.6 * relevanceMultiplier); // Min 40%, max 100% brightness
    }
    
    // Multi-layer glow effect
    const innerGlowSize = baseNodeSize * 1.2;
    const outerGlowSize = baseNodeSize * 2.2 * pulseFactor;
    
    // Outer glow
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, outerGlowSize, 0, 2 * Math.PI);
    const outerGlowOpacity = node.id === 'athena' ? 0.3 : 0.08 * opacity;
    ctx.fillStyle = `${color}${Math.round(outerGlowOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Inner glow
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, innerGlowSize * pulseFactor, 0, 2 * Math.PI);
    const innerGlowOpacity = node.id === 'athena' ? 0.5 : 0.2 * opacity;
    ctx.fillStyle = `${color}${Math.round(innerGlowOpacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Main node with enhanced shadow and gradient effect
    ctx.beginPath();
    ctx.shadowColor = color;
    ctx.shadowBlur = node.id === 'athena' ? 25 * pulseFactor : 15 * pulseFactor * opacity;
    ctx.arc(node.x || 0, node.y || 0, baseNodeSize, 0, 2 * Math.PI);
    
    // Create radial gradient for the main node
    const gradient = ctx.createRadialGradient(
      node.x || 0, node.y || 0, 0,
      node.x || 0, node.y || 0, baseNodeSize
    );
    
    if (node.id === 'athena') {
      // Athena gets a special golden gradient
      gradient.addColorStop(0, '#FFFF99'); // Bright yellow center
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(1, '#FFB700'); // Darker gold edge
    } else {
      // Apply opacity to other nodes
      const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
      gradient.addColorStop(0, `${color}${alphaHex}`);
      gradient.addColorStop(1, `${color}${Math.round(opacity * 0.8 * 255).toString(16).padStart(2, '0')}`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Enhanced edge outline
    ctx.strokeStyle = focusedNode?.id === node.id ? '#ffffff' : '#000814';
    ctx.lineWidth = focusedNode?.id === node.id ? 1.5 / globalScale : 0.8 / globalScale;
    ctx.stroke();
    
    // Enhanced label rendering - only show during initial period or on hover
    const shouldShowLabel = showInitialLabels || hoveredNode?.id === node.id || focusedNode?.id === node.id;
    
    if (shouldShowLabel && (node.id === 'athena' || globalScale > 1.2 || hoveredNode?.id === node.id || focusedNode?.id === node.id)) {
      ctx.font = `${Math.max(fontSize / globalScale, 8)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = 'white';
      
      const textY = (node.y || 0) + baseNodeSize + (fontSize / globalScale) + 4;
      ctx.fillText(label, node.x || 0, textY);
      ctx.shadowBlur = 0;
    }
  }, [focusedNode, hoveredNode, showInitialLabels]);
  
  // Keep existing link paint function - no changes needed as requested
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const source = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
    const target = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target);
    
    if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;
    
    const sourceColor = getNodeColor(source);
    const targetColor = getNodeColor(target);
    
    const linkId = `${source.id}-${target.id}`;
    const reverseLinkId = `${target.id}-${source.id}`;
    const hasImpulse = impulses.has(linkId) || impulses.has(reverseLinkId);
    const impulseValue = impulses.get(linkId) || impulses.get(reverseLinkId) || 0;
    
    const lineWidth = focusedNode && (focusedNode.id === source.id || focusedNode.id === target.id) ? 2.0 : 1.2;
    const opacity = focusedNode && (focusedNode.id === source.id || focusedNode.id === target.id) ? 0.8 : 0.5;
    
    const gradient = ctx.createLinearGradient(
      source.x, source.y, target.x, target.y
    );
    gradient.addColorStop(0, sourceColor);
    gradient.addColorStop(0.5, `${sourceColor}80`);
    gradient.addColorStop(1, targetColor);
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = gradient;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Keep existing impulse visualization
    if (hasImpulse) {
      const dotX = source.x + (target.x - source.x) * impulseValue;
      const dotY = source.y + (target.y - source.y) * impulseValue;
      
      const dotSizes = [3.5, 2.8, 2.2, 1.8, 1.4];
      const tailPositions = [0, 0.04, 0.08, 0.12, 0.16];
      
      for (let i = 0; i < dotSizes.length; i++) {
        const tailOffset = tailPositions[i];
        const tailPosition = Math.max(0, impulseValue - tailOffset);
        
        if (tailPosition > 0) {
          const tailX = source.x + (target.x - source.x) * tailPosition;
          const tailY = source.y + (target.y - source.y) * tailPosition;
          
          ctx.beginPath();
          ctx.arc(tailX, tailY, dotSizes[i], 0, Math.PI * 2);
          
          const dotGlow = ctx.createRadialGradient(
            tailX, tailY, 0, 
            tailX, tailY, dotSizes[i] * 3
          );
          
          dotGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
          dotGlow.addColorStop(0.3, `${sourceColor}FF`);
          dotGlow.addColorStop(0.6, `${sourceColor}80`);
          dotGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = dotGlow;
          ctx.globalAlpha = 1.0 - (i * 0.15);
          ctx.fill();
        }
      }
    }
    
    ctx.globalAlpha = 1;
  }, [graphData.nodes, impulses, focusedNode]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-[#0C0C1C] ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}
      style={isFullscreen ? { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: 9999 
      } : {}}
    >
      {/* Fullscreen Toggle Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90"
        >
          {isFullscreen ? (
            <>
              <Minimize size={16} className="mr-2" />
              Sair do Fullscreen
            </>
          ) : (
            <>
              <Maximize size={16} className="mr-2" />
              Fullscreen
            </>
          )}
        </Button>
      </div>

      {/* Focus mode controls */}
      {focusedNode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute ${isFullscreen ? 'top-20' : 'top-16'} left-1/2 transform -translate-x-1/2 z-10`}
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
        nodeLabel={null}
        onNodeClick={(node) => {
          if (node) onNodeClick(node);
        }}
        onNodeHover={handleNodeHover}
        backgroundColor="#0C0C1C"
        onEngineStop={handleEngineStop}
        cooldownTicks={150}
        onNodeDragEnd={(node) => {
          // Prevent dragging for non-Athena nodes to maintain orbital motion
          if (node.id !== 'athena') return;
          node.fx = node.x;
          node.fy = node.y;
        }}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        width={dimensions.width}
        height={dimensions.height}
        minZoom={0.1}
        maxZoom={8}
        // Force simulation settings to allow smooth orbital motion
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />

      {/* Advanced Tooltip with fixed positioning using pageX/pageY coordinates */}
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
