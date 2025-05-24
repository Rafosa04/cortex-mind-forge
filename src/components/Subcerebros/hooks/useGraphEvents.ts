import { useState, useCallback } from 'react';
import { GraphNode } from '../utils/graphUtils';

export const useGraphEvents = (
  isFullscreen: boolean,
  containerRef: React.RefObject<HTMLDivElement>,
  fgRef: React.RefObject<any>,
  onNodeClick: (node: any) => void
) => {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleNodeHover = useCallback((node: GraphNode | null, event: any) => {
    if (event && node) {
      const canvas = fgRef.current?.canvas();
      
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const headerHeight = 80;
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
            if (y < headerHeight) {
              y = headerHeight + 10;
            }
          }
        }
        
        setTooltipPosition({ x, y });
      }
    }
    
    setHoveredNode(node);
  }, [isFullscreen, containerRef, fgRef]);

  const handleNodeExpand = useCallback((node: GraphNode) => {
    console.log('Expanding node:', node.id);
    // Future implementation for node expansion
  }, []);

  const handleEngineStop = useCallback(() => {
    console.log('Force simulation stopped');
  }, []);

  const handleNodeDragEnd = useCallback((node: any) => {
    if (node.id === 'athena') {
      // Keep Athena at center
      node.fx = 0;
      node.fy = 0;
    } else {
      // Update orbital parameters when node is dragged
      const distance = Math.sqrt((node.x || 0) ** 2 + (node.y || 0) ** 2);
      const angle = Math.atan2(node.y || 0, node.x || 0);
      node.orbitRadius = distance;
      node.orbitAngle = angle;
    }
  }, []);

  return {
    hoveredNode,
    tooltipPosition,
    handleNodeHover,
    handleNodeExpand,
    handleEngineStop,
    handleNodeDragEnd,
    handleNodeClick: onNodeClick
  };
};
