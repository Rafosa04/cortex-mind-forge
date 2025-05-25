
import React, { useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { NodeTooltip } from './NodeTooltip';
import { Maximize, Minimize, Eye, Focus, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GraphNode, GraphLink } from './utils/graphUtils';
import { paintNode, paintLink } from './utils/graphPainter';
import { useGraphAnimation } from './hooks/useGraphAnimation';
import { useGraphEvents } from './hooks/useGraphEvents';
import { useFullscreen } from './hooks/useFullscreen';
import { useDimensions } from './hooks/useDimensions';

export interface SubbrainGraphProps {
  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  onNodeClick: (node: any) => void;
  viewMode?: 'orbital' | 'radial' | 'focus';
  onViewModeChange?: (mode: 'orbital' | 'radial' | 'focus') => void;
}

export function SubbrainGraph({ 
  graphData, 
  onNodeClick, 
  viewMode = 'orbital',
  onViewModeChange 
}: SubbrainGraphProps) {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeRef = useRef<number>(0);
  
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const dimensions = useDimensions(isFullscreen);
  
  const {
    hoveredNode,
    tooltipPosition,
    handleNodeHover,
    handleNodeExpand,
    handleEngineStop,
    handleNodeDragEnd,
    handleNodeClick
  } = useGraphEvents(isFullscreen, containerRef, fgRef, onNodeClick);
  
  useGraphAnimation(graphData, fgRef);
  
  // Pintura dos nós com timestamp em tempo real
  const paintNodeWithTime = useCallback((node: any, ctx: any) => {
    animationTimeRef.current = Date.now();
    paintNode(node, ctx, animationTimeRef.current);
  }, []);

  const paintLinkWithTime = useCallback((link: any, ctx: any) => {
    paintLink(link, ctx, animationTimeRef.current);
  }, []);
  
  // Refresh contínuo para animações fluidas
  useEffect(() => {
    if (!fgRef.current) return;
    
    const interval = setInterval(() => {
      if (fgRef.current) {
        fgRef.current.refresh();
      }
    }, 33); // ~30fps para suavidade otimizada
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-[#0A0A1A] via-[#0C0C1C] to-[#0F0F2A] ${
        isFullscreen ? 'fixed inset-0 z-[9999] cursor-none' : ''
      }`}
    >
      {/* Fundo galáctico sutil */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(155,135,245,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(96,181,181,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(16,185,129,0.04),transparent_50%)]" />
      </div>

      {/* Controles de visualização */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`absolute z-[10000] ${
          isFullscreen ? 'top-4 left-4' : 'top-4 left-4'
        }`}
      >
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'orbital' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange?.('orbital')}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-md"
          >
            <Eye size={16} />
            Orbital
          </Button>
          <Button
            variant={viewMode === 'radial' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange?.('radial')}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-md"
          >
            <Grid3X3 size={16} />
            Radial
          </Button>
          <Button
            variant={viewMode === 'focus' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange?.('focus')}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-md"
          >
            <Focus size={16} />
            Foco
          </Button>
        </div>
      </motion.div>

      {/* Botão fullscreen */}
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
          className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90"
        >
          {isFullscreen ? <Minimize size={16} className="mr-2" /> : <Maximize size={16} className="mr-2" />}
          {isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        </Button>
      </motion.div>

      {/* Frase de identidade */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`absolute z-[10000] ${
          isFullscreen ? 'bottom-8 left-1/2 transform -translate-x-1/2' : 'bottom-4 left-1/2 transform -translate-x-1/2'
        }`}
      >
        <div className="text-center">
          <p className="text-sm text-primary/80 font-medium italic bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20">
            "Visualizando a inteligência conectada da sua mente digital."
          </p>
        </div>
      </motion.div>

      {/* Tooltip do nó */}
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
            onView={() => hoveredNode && handleNodeClick(hoveredNode)}
            onEdit={() => hoveredNode && handleNodeClick(hoveredNode)}
            onExpand={() => hoveredNode && handleNodeExpand(hoveredNode)}
          />
        </div>
      )}

      {/* Grafo Force */}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeRelSize={10}
        nodeVal={(node) => (node as GraphNode).relevancia || 1}
        nodeCanvasObject={paintNodeWithTime}
        linkCanvasObject={paintLinkWithTime}
        linkDirectionalParticles={0}
        nodeLabel={null}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        backgroundColor="transparent"
        onEngineStop={handleEngineStop}
        cooldownTicks={0}
        onNodeDragEnd={handleNodeDragEnd}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        width={dimensions.width}
        height={dimensions.height}
        minZoom={0.2}
        maxZoom={8}
        d3AlphaDecay={0}
        d3VelocityDecay={0}
        warmupTicks={0}
        autoPauseRedraw={false}
      />
    </div>
  );
}
