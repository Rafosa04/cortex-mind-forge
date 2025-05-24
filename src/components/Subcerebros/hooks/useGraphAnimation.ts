
import { useEffect, useRef, useCallback } from 'react';
import { GraphNode, calculateOrbitPosition, setupConstellationLayout } from '../utils/graphUtils';

export const useGraphAnimation = (
  graphData: { nodes: GraphNode[]; links: any[] },
  fgRef: React.RefObject<any>
) => {
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  
  const setupConstellation = useCallback(() => {
    if (!graphData.nodes.length || !fgRef.current) return;
    
    setupConstellationLayout(graphData.nodes);
    
    // Disable force simulation for smoother orbital movement
    if (fgRef.current) {
      const fg = fgRef.current;
      fg.d3Force('link', null);
      fg.d3Force('charge', null);
      fg.d3Force('center', null);
    }
  }, [graphData.nodes, fgRef]);
  
  const animate = useCallback(() => {
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    let hasChanges = false;
    
    graphData.nodes.forEach(node => {
      if (node.id === 'athena') return;
      
      const newPos = calculateOrbitPosition(node, elapsed);
      
      // Only update if position changed significantly
      if (Math.abs((node.fx || 0) - newPos.x) > 0.1 || Math.abs((node.fy || 0) - newPos.y) > 0.1) {
        node.fx = newPos.x;
        node.fy = newPos.y;
        hasChanges = true;
      }
    });
    
    // Only refresh if there were changes
    if (hasChanges && fgRef.current) {
      fgRef.current.refresh();
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [graphData.nodes, fgRef]);
  
  useEffect(() => {
    if (!graphData.nodes.length) return;
    
    // Setup constellation first
    setupConstellation();
    
    // Start animation after a short delay
    const timeoutId = setTimeout(() => {
      startTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [graphData.nodes, setupConstellation, animate]);
  
  return {
    setupConstellation
  };
};
