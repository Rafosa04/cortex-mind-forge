import { useEffect, useRef, useCallback } from 'react';
import { GraphNode, calculateOrbitPosition, setupConstellationLayout } from '../utils/graphUtils';

export const useGraphAnimation = (
  graphData: { nodes: GraphNode[]; links: any[] },
  fgRef: React.RefObject<any>
) => {
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const isAnimatingRef = useRef<boolean>(false);
  
  const setupConstellation = useCallback(() => {
    if (!graphData.nodes.length || !fgRef.current) return;
    
    setupConstellationLayout(graphData.nodes);
    
    // Disable force simulation for smoother orbital movement
    if (fgRef.current) {
      const fg = fgRef.current;
      fg.d3Force('link', null);
      fg.d3Force('charge', null);
      fg.d3Force('center', null);
      fg.d3Force('collide', null);
    }
  }, [graphData.nodes, fgRef]);
  
  const animate = useCallback(() => {
    if (!fgRef.current || !graphData.nodes.length) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    
    // Update orbital positions for all non-Athena nodes
    graphData.nodes.forEach(node => {
      if (node.id === 'athena') {
        // Keep Athena fixed at center
        node.fx = 0;
        node.fy = 0;
        return;
      }
      
      // Calculate new orbital position
      const newPos = calculateOrbitPosition(node, elapsed);
      node.fx = newPos.x;
      node.fy = newPos.y;
    });
    
    // Force refresh to show smooth movement
    if (fgRef.current) {
      fgRef.current.refresh();
    }
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [graphData.nodes, fgRef]);
  
  useEffect(() => {
    if (!graphData.nodes.length || isAnimatingRef.current) return;
    
    // Setup constellation layout
    setupConstellation();
    
    // Start continuous animation
    isAnimatingRef.current = true;
    startTimeRef.current = Date.now();
    
    // Small delay to allow initial setup
    const timeoutId = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);
    
    return () => {
      isAnimatingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [graphData.nodes, setupConstellation, animate]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, []);
  
  return {
    setupConstellation
  };
};
