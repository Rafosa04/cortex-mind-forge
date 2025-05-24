
import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { NodeTooltip } from './NodeTooltip';
import { Maximize, Minimize } from 'lucide-react';
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
}

export function SubbrainGraph({ graphData, onNodeClick }: SubbrainGraphProps) {
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
  
  // Continuous animation functions with real-time updates
  const paintNodeWithTime = useCallback((node: any, ctx: any) => {
    animationTimeRef.current = Date.now();
    paintNode(node, ctx, animationTimeRef.current);
  }, []);

  const paintLinkWithTime = useCallback((link: any, ctx: any) => {
    paintLink(link, ctx, animationTimeRef.current);
  }, []);
  
  // Force continuous re-rendering for smooth animations
  useEffect(() => {
    if (!fgRef.current) return;
    
    const interval = setInterval(() => {
      if (fgRef.current) {
        fgRef.current.refresh();
      }
    }, 32); // ~30fps refresh rate for smooth animations
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-[#0A0A1A] via-[#0C0C1C] to-[#0F0F2A] ${
        isFullscreen ? 'fixed inset-0 z-[9999] cursor-none' : ''
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,215,0,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(16,185,129,0.06),transparent_50%)]" />
      </div>

      {/* Fullscreen Toggle Button */}
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

      {/* Node Tooltip */}
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

      {/* Force Graph */}
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
        minZoom={0.1}
        maxZoom={10}
        d3AlphaDecay={0}
        d3VelocityDecay={0}
        warmupTicks={0}
        autoPauseRedraw={false}
      />
    </div>
  );
}
