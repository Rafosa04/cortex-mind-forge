import React, { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { NodeTooltip } from './NodeTooltip';
import { Maximize, Minimize } from 'lucide-react';
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
  
  const getNodeColor = (node: GraphNode) => {
    const colors = {
      athena: '#FFD700',
      subcerebro: '#8B5CF6',
      projeto: '#0EA5E9',
      habito: '#10B981',
      favorito: '#F59E0B',
      pensamento: '#EC4899',
      default: '#9CA3AF'
    };
    return colors[node.type as keyof typeof colors] || colors.default;
  };
  
  const setupConstellation = useCallback(() => {
    if (!graphData.nodes.length || !fgRef.current) return;
    
    const athenaNode = graphData.nodes.find(node => node.id === 'athena');
    if (!athenaNode) return;
    
    athenaNode.fx = 0;
    athenaNode.fy = 0;
    
    const otherNodes = graphData.nodes.filter(node => node.id !== 'athena');
    const nodesByType = otherNodes.reduce((acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    }, {} as Record<string, GraphNode[]>);
    
    const orbitLayers = {
      subcerebro: { radius: 180, speed: 0.0006 },
      projeto: { radius: 280, speed: 0.0004 },
      habito: { radius: 350, speed: 0.0003 },
      favorito: { radius: 420, speed: 0.0002 },
      pensamento: { radius: 490, speed: 0.0001 }
    };
    
    Object.entries(nodesByType).forEach(([type, nodes]) => {
      const layer = orbitLayers[type as keyof typeof orbitLayers];
      if (!layer) return;
      
      nodes.forEach((node, index) => {
        const angleStep = (2 * Math.PI) / nodes.length;
        const baseAngle = index * angleStep;
        const radiusVariation = (Math.random() - 0.5) * 30;
        
        node.orbitRadius = layer.radius + radiusVariation;
        node.orbitAngle = baseAngle + (Math.random() - 0.5) * 0.3;
        node.orbitSpeed = layer.speed * (0.9 + Math.random() * 0.2);
        
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
        
        node.orbitAngle = (node.orbitAngle || 0) + node.orbitSpeed;
        
        const wobble = (node.relevancia || 5) / 100 * Math.sin(now * 0.001);
        const effectiveRadius = node.orbitRadius * (1 + wobble);
        
        node.fx = Math.cos(node.orbitAngle) * effectiveRadius;
        node.fy = Math.sin(node.orbitAngle) * effectiveRadius;
      });
      
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
  
  const handleNodeHover = (node: GraphNode | null, event: any) => {
    if (event && node) {
      const canvas = fgRef.current?.canvas();
      
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const headerHeight = 60; // Height of the fixed header
        const tooltipWidth = 320;
        const tooltipHeight = 200;
        
        let x = event.clientX - canvasRect.left;
        let y = event.clientY - canvasRect.top;
        
        if (isFullscreen) {
          x = event.clientX;
          y = event.clientY;
          
          if (x + tooltipWidth > window.innerWidth) {
            x = window.innerWidth - tooltipWidth - 10;
          }
          if (y + tooltipHeight > window.innerHeight) {
            y = window.innerHeight - tooltipHeight - 10;
          }
          if (y < headerHeight + 10) {
            y = headerHeight + 10;
          }
        } else {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            if (x + tooltipWidth > containerRect.width) {
              x = containerRect.width - tooltipWidth - 10;
            }
            if (y + tooltipHeight > containerRect.height) {
              y = containerRect.height - tooltipHeight - 10;
            }
            if (y < 10) {
              y = 10;
            }
          }
        }
        
        setTooltipPosition({ x, y });
      }
    }
    
    setHoveredNode(node);
  };

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    
    if (newFullscreenState) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any)?.webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any)?.msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
      document.body.style.overflow = 'hidden';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      document.body.style.overflow = 'unset';
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).msFullscreenElement);
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        setIsFullscreen(false);
        document.body.style.overflow = 'unset';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-[#0A0A1A] via-[#0C0C1C] to-[#0F0F2A] ${
        isFullscreen ? 'fixed inset-0 z-[9999] cursor-none' : ''
      }`}
    >
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,215,0,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(16,185,129,0.06),transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`absolute z-[10000] ${
          isFullscreen ? 'top-4 right-4' : 'top-4 right-4'
        }`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 transition-all duration-200"
        >
          {isFullscreen ? <Minimize size={16} className="mr-2" /> : <Maximize size={16} className="mr-2" />}
          {isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        </Button>
      </motion.div>

      {hoveredNode && (
        <div
          className={`${isFullscreen ? 'fixed' : 'absolute'} z-[10001] pointer-events-none`}
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
            maxWidth: '320px'
          }}
        >
          <NodeTooltip
            node={hoveredNode}
            position={tooltipPosition}
            visible={!!hoveredNode}
            onView={() => hoveredNode && onNodeClick(hoveredNode)}
            onEdit={() => hoveredNode && onNodeClick(hoveredNode)}
            onExpand={() => hoveredNode && handleNodeExpand(hoveredNode)}
          />
        </div>
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
          if (node.id === 'athena') {
            node.fx = 0;
            node.fy = 0;
          } else {
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
        d3AlphaDecay={0}
        d3VelocityDecay={0}
        warmupTicks={0}
      />
    </div>
  );
}
