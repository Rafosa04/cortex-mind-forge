import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { NodeTooltip } from './NodeTooltip';
import { Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as d3 from 'd3-force';

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
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
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
  const [nodePositions, setNodePositions] = useState<Map<string, {x: number, y: number}>>(new Map());
  const [impulses, setImpulses] = useState<Map<string, number>>(new Map());
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animationFrameRef = useRef<number>();
  
  // Enhanced constellation color system for neurons
  const getNodeColor = (node: GraphNode) => {
    const colors = {
      athena: '#FFD700', // Central golden neuron
      subcerebro: '#8B5CF6', // Deep purple neurons
      projeto: '#0EA5E9', // Cyan blue neurons
      habito: '#10B981', // Emerald green neurons
      favorito: '#F59E0B', // Amber neurons
      pensamento: '#EC4899', // Pink neurons
      default: '#9CA3AF'
    };
    return colors[node.type as keyof typeof colors] || colors.default;
  };
  
  const setupConstellation = useCallback(() => {
    if (!graphData.nodes.length || !fgRef.current) return;
    
    const athenaNode = graphData.nodes.find(node => node.id === 'athena');
    if (!athenaNode) return;
    
    // Position Athena at the center
    athenaNode.fx = 0;
    athenaNode.fy = 0;
    
    // Setup orbital mechanics for other nodes
    const otherNodes = graphData.nodes.filter(node => node.id !== 'athena');
    const nodesByType = otherNodes.reduce((acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    }, {} as Record<string, GraphNode[]>);
    
    // Define orbital layers by type with smoother speeds
    const orbitLayers = {
      subcerebro: { radius: 180, speed: 0.0006 },
      projeto: { radius: 280, speed: 0.0004 },
      habito: { radius: 350, speed: 0.0003 },
      favorito: { radius: 420, speed: 0.0002 },
      pensamento: { radius: 490, speed: 0.0001 }
    };
    
    // Position nodes in their orbital layers
    Object.entries(nodesByType).forEach(([type, nodes]) => {
      const layer = orbitLayers[type as keyof typeof orbitLayers];
      if (!layer) return;
      
      nodes.forEach((node, index) => {
        const angleStep = (2 * Math.PI) / nodes.length;
        const baseAngle = index * angleStep;
        const radiusVariation = (Math.random() - 0.5) * 30; // Smoother variation
        
        node.orbitRadius = layer.radius + radiusVariation;
        node.orbitAngle = baseAngle + (Math.random() - 0.5) * 0.3; // Smaller random offset
        node.orbitSpeed = layer.speed * (0.9 + Math.random() * 0.2); // Less speed variation
        
        // Initial position
        node.fx = Math.cos(node.orbitAngle) * node.orbitRadius;
        node.fy = Math.sin(node.orbitAngle) * node.orbitRadius;
      });
    });
  }, [graphData.nodes]);
  
  useEffect(() => {
    if (!graphData.nodes.length) return;
    
    const animate = () => {
      const now = Date.now();
      
      graphData.nodes.forEach(node => {
        if (node.id === 'athena' || !node.orbitRadius || !node.orbitSpeed) return;
        
        // Update orbital position with smoother movement
        node.orbitAngle = (node.orbitAngle || 0) + node.orbitSpeed;
        
        // Apply gentle gravitational wobble
        const wobble = (node.relevancia || 5) / 100 * Math.sin(now * 0.001);
        const effectiveRadius = node.orbitRadius * (1 + wobble);
        
        node.fx = Math.cos(node.orbitAngle) * effectiveRadius;
        node.fy = Math.sin(node.orbitAngle) * effectiveRadius;
      });
      
      // Update graph
      if (fgRef.current) {
        fgRef.current.refresh();
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    setupConstellation();
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [graphData.nodes, setupConstellation]);
  
  useEffect(() => {
    if (graphData.links.length === 0) return;
    
    // More frequent and intelligent impulse generation
    const interval = setInterval(() => {
      // Prioritize impulses from/to Athena and high-relevance nodes
      const priorityLinks = graphData.links.filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        const sourceNode = graphData.nodes.find(n => n.id === sourceId);
        const targetNode = graphData.nodes.find(n => n.id === targetId);
        
        return sourceId === 'athena' || targetId === 'athena' || 
               (sourceNode?.relevancia || 0) > 7 || (targetNode?.relevancia || 0) > 7;
      });
      
      // Generate 2-4 impulses, prioritizing important connections
      const numberOfImpulses = Math.min(4, Math.max(2, Math.floor(graphData.links.length * 0.15)));
      const selectedLinks = new Set<number>();
      
      // First, add priority links
      while (selectedLinks.size < Math.min(numberOfImpulses, priorityLinks.length)) {
        const randomIndex = Math.floor(Math.random() * priorityLinks.length);
        const linkIndex = graphData.links.indexOf(priorityLinks[randomIndex]);
        if (linkIndex !== -1) selectedLinks.add(linkIndex);
      }
      
      // Fill remaining slots with random links
      while (selectedLinks.size < numberOfImpulses) {
        const randomIndex = Math.floor(Math.random() * graphData.links.length);
        selectedLinks.add(randomIndex);
      }
      
      selectedLinks.forEach(index => {
        const link = graphData.links[index];
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const linkId = `${sourceId}-${targetId}`;
        
        setImpulses(prev => {
          const newImpulses = new Map(prev);
          newImpulses.set(linkId, 0);
          return newImpulses;
        });
      });
    }, 800); // Slightly slower for smoother feel
    
    // Smoother impulse animation
    const animationInterval = setInterval(() => {
      setImpulses(prev => {
        const newImpulses = new Map(prev);
        
        for (const [linkId, progress] of prev.entries()) {
          if (progress >= 1) {
            newImpulses.delete(linkId);
          } else {
            newImpulses.set(linkId, progress + 0.02); // Slower, smoother movement
          }
        }
        
        return newImpulses;
      });
    }, 40); // Slightly lower frame rate for smoothness
    
    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, [graphData.links, graphData.nodes]);
  
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
  
  const handleEngineStop = useCallback(() => {
    if (fgRef.current && graphData.nodes.length) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 100);
      }, 500);
    }
  }, [graphData.nodes.length]);
  
  const handleNodeHover = (node: GraphNode | null, event: any) => {
    if (event && node) {
      // Get the container position for better tooltip positioning
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        
        setTooltipPosition({
          x: event.pageX - containerRect.left,
          y: event.pageY - containerRect.top
        });
      }
    }
    
    setHoveredNode(node);
  };

  const handleNodeExpand = (node: GraphNode) => {
    setFocusedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2.5, 1000);
    }
  };

  const resetFocus = () => {
    setFocusedNode(null);
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 100);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Enhanced neuron paint function with detailed neural structure
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label;
    const color = getNodeColor(node);
    
    // Enhanced size system for neurons
    let baseNodeSize;
    if (node.id === 'athena') {
      baseNodeSize = 30 / globalScale; // Central Athena neuron (larger)
    } else if (node.type === 'subcerebro') {
      baseNodeSize = (15 + (node.relevancia || 1) * 1.2) / globalScale; // Large neurons
    } else {
      baseNodeSize = (10 + (node.relevancia || 1) * 0.8) / globalScale; // Smaller neurons
    }
    
    // Enhanced neural pulsing
    const now = Date.now();
    const nodeHash = node.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    let pulseFactor = 1;
    if (node.id === 'athena') {
      // Central Athena intense neural activity
      const primaryPulse = Math.sin(now * 0.004) * 0.2;
      const secondaryPulse = Math.sin(now * 0.006) * 0.1;
      pulseFactor = 1 + primaryPulse + secondaryPulse;
    } else {
      // Neural activity based on relevance and position
      const distanceFromCenter = Math.sqrt((node.x || 0) ** 2 + (node.y || 0) ** 2);
      const relevanceMultiplier = (node.relevancia || 5) / 10;
      const proximityInfluence = Math.max(0.2, 1 - distanceFromCenter / 600);
      
      const neuralPulse = Math.sin(now * 0.003 + nodeHash * 0.15) * 0.15 * relevanceMultiplier * proximityInfluence;
      pulseFactor = 1 + neuralPulse;
    }
    
    // Neural glow layers (synaptic field)
    const glowLayers = node.id === 'athena' ? 5 : 4;
    for (let i = glowLayers; i > 0; i--) {
      const glowSize = baseNodeSize * (1.2 + i * 0.6) * pulseFactor;
      const glowOpacity = (0.08 / i) * pulseFactor;
      
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, glowSize, 0, 2 * Math.PI);
      
      // Neural field gradient
      const neuralGradient = ctx.createRadialGradient(
        node.x || 0, node.y || 0, 0,
        node.x || 0, node.y || 0, glowSize
      );
      
      if (node.id === 'athena') {
        neuralGradient.addColorStop(0, `${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`);
        neuralGradient.addColorStop(0.6, `#FFE55C${Math.round(glowOpacity * 0.7 * 255).toString(16).padStart(2, '0')}`);
        neuralGradient.addColorStop(1, 'rgba(255, 229, 92, 0)');
      } else {
        neuralGradient.addColorStop(0, `${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`);
        neuralGradient.addColorStop(0.7, `${color}${Math.round(glowOpacity * 0.4 * 255).toString(16).padStart(2, '0')}`);
        neuralGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      
      ctx.fillStyle = neuralGradient;
      ctx.fill();
    }
    
    // Main neuron body (soma)
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, baseNodeSize * pulseFactor, 0, 2 * Math.PI);
    
    // Neuron body gradient with depth
    const neuronGradient = ctx.createRadialGradient(
      (node.x || 0) - baseNodeSize * 0.4, (node.y || 0) - baseNodeSize * 0.4, 0,
      node.x || 0, node.y || 0, baseNodeSize * pulseFactor
    );
    
    if (node.id === 'athena') {
      neuronGradient.addColorStop(0, '#FFFFFF');
      neuronGradient.addColorStop(0.3, color);
      neuronGradient.addColorStop(0.7, '#FFA500');
      neuronGradient.addColorStop(1, '#FF6B35');
    } else {
      neuronGradient.addColorStop(0, `${color}FF`);
      neuronGradient.addColorStop(0.5, `${color}DD`);
      neuronGradient.addColorStop(0.8, `${color}AA`);
      neuronGradient.addColorStop(1, `${color}66`);
    }
    
    ctx.fillStyle = neuronGradient;
    ctx.fill();
    
    // Neuron membrane (cell boundary)
    ctx.strokeStyle = focusedNode?.id === node.id ? '#FFFFFF' : `${color}CC`;
    ctx.lineWidth = focusedNode?.id === node.id ? 2.5 / globalScale : 1.5 / globalScale;
    ctx.stroke();
    
    // Neural dendrites (small extensions for larger neurons)
    if (baseNodeSize * globalScale > 12 && node.id !== 'athena') {
      const dendriteCount = Math.floor(3 + (node.relevancia || 5) / 3);
      for (let i = 0; i < dendriteCount; i++) {
        const angle = (i / dendriteCount) * Math.PI * 2 + now * 0.0005;
        const dendriteLength = baseNodeSize * 0.6 * (0.8 + Math.random() * 0.4);
        
        const startX = (node.x || 0) + Math.cos(angle) * baseNodeSize * 0.9;
        const startY = (node.y || 0) + Math.sin(angle) * baseNodeSize * 0.9;
        const endX = startX + Math.cos(angle) * dendriteLength;
        const endY = startY + Math.sin(angle) * dendriteLength;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `${color}60`;
        ctx.lineWidth = 0.8 / globalScale;
        ctx.stroke();
      }
    }
    
    // Enhanced label rendering for neurons
    if (node.id === 'athena' || globalScale > 1.2 || focusedNode?.id === node.id) {
      const fontSize = node.id === 'athena' ? 16 : 12;
      ctx.font = `${Math.max(fontSize / globalScale, 8)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Enhanced text shadow for neural readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillStyle = node.id === 'athena' ? '#FFFFFF' : '#F1F5F9';
      
      const textY = (node.y || 0) + baseNodeSize * pulseFactor + (fontSize / globalScale) + 8;
      ctx.fillText(label, node.x || 0, textY);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }, [focusedNode]);
  
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const source = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
    const target = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target);
    
    if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;
    
    const sourceColor = getNodeColor(source);
    const targetColor = getNodeColor(target);
    
    // Enhanced synaptic connection properties
    const linkId = `${source.id}-${target.id}`;
    const reverseLinkId = `${target.id}-${source.id}`;
    const hasImpulse = impulses.has(linkId) || impulses.has(reverseLinkId);
    const impulseValue = impulses.get(linkId) || impulses.get(reverseLinkId) || 0;
    
    // Dynamic connection strength based on node importance
    const sourceImportance = source.id === 'athena' ? 2 : (source.relevancia || 5) / 10;
    const targetImportance = target.id === 'athena' ? 2 : (target.relevancia || 5) / 10;
    const connectionStrength = (sourceImportance + targetImportance) / 2;
    
    const baseWidth = 0.8 + connectionStrength * 1.2;
    const lineWidth = focusedNode && (focusedNode.id === source.id || focusedNode.id === target.id) ? 
      baseWidth * 1.8 : baseWidth;
    
    const baseOpacity = 0.3 + connectionStrength * 0.3;
    const opacity = focusedNode && (focusedNode.id === source.id || focusedNode.id === target.id) ? 
      baseOpacity * 1.5 : baseOpacity;
    
    // Enhanced synaptic gradient
    const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
    
    if (source.id === 'athena' || target.id === 'athena') {
      // Special golden connections to/from Athena
      gradient.addColorStop(0, source.id === 'athena' ? '#FFD700' : sourceColor);
      gradient.addColorStop(0.5, '#FFF8DC');
      gradient.addColorStop(1, target.id === 'athena' ? '#FFD700' : targetColor);
    } else {
      gradient.addColorStop(0, sourceColor);
      gradient.addColorStop(0.5, `${sourceColor}60`);
      gradient.addColorStop(1, targetColor);
    }
    
    // Draw the synaptic connection
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = gradient;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Enhanced synaptic impulse with realistic neural transmission
    if (hasImpulse) {
      const impulseX = source.x + (target.x - source.x) * impulseValue;
      const impulseY = source.y + (target.y - source.y) * impulseValue;
      
      // Multiple impulse particles with trailing effect
      const particleSizes = [5, 4, 3.2, 2.6, 2];
      const trailOffsets = [0, 0.04, 0.08, 0.12, 0.16];
      
      for (let i = 0; i < particleSizes.length; i++) {
        const trailProgress = Math.max(0, impulseValue - trailOffsets[i]);
        
        if (trailProgress > 0) {
          const trailX = source.x + (target.x - source.x) * trailProgress;
          const trailY = source.y + (target.y - source.y) * trailProgress;
          
          // Enhanced synaptic impulse visualization
          ctx.beginPath();
          ctx.arc(trailX, trailY, particleSizes[i], 0, Math.PI * 2);
          
          // Dynamic impulse glow based on connection importance
          const impulseGlow = ctx.createRadialGradient(
            trailX, trailY, 0,
            trailX, trailY, particleSizes[i] * 5
          );
          
          const impulseIntensity = connectionStrength;
          const coreColor = source.id === 'athena' || target.id === 'athena' ? '#FFD700' : '#FFFFFF';
          
          impulseGlow.addColorStop(0, coreColor);
          impulseGlow.addColorStop(0.3, `${sourceColor}${Math.round(impulseIntensity * 255).toString(16).padStart(2, '0')}`);
          impulseGlow.addColorStop(0.7, `${sourceColor}${Math.round(impulseIntensity * 128).toString(16).padStart(2, '0')}`);
          impulseGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = impulseGlow;
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
      className={`relative w-full h-full bg-gradient-to-br from-[#0A0A1A] via-[#0C0C1C] to-[#0F0F2A] ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Enhanced cosmic background effect */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,215,0,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(16,185,129,0.06),transparent_50%)]" />
      </div>

      {/* Fullscreen toggle button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 right-4 z-10"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90"
        >
          <Maximize size={16} className="mr-2" />
          {isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        </Button>
      </motion.div>

      {/* Focus mode controls */}
      {focusedNode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2 flex items-center gap-3 shadow-2xl">
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
        backgroundColor="transparent"
        onEngineStop={handleEngineStop}
        cooldownTicks={100}
        onNodeDragEnd={(node) => {
          // Prevent dragging of Athena and maintain orbital mechanics for others
          if (node.id === 'athena') {
            node.fx = 0;
            node.fy = 0;
          } else {
            // Recalculate orbital parameters when manually positioned
            const distance = Math.sqrt((node.x || 0) ** 2 + (node.y || 0) ** 2);
            const angle = Math.atan2(node.y || 0, node.x || 0);
            node.orbitRadius = distance;
            node.orbitAngle = angle;
          }
        }}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        width={dimensions.width}
        height={dimensions.height}
        minZoom={0.1}
        maxZoom={10}
        // Disable force simulation for orbital mechanics
        d3AlphaDecay={0}
        d3VelocityDecay={0}
        warmupTicks={0}
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
