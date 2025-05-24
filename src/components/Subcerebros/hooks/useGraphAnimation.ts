import { useEffect, useRef, useCallback } from 'react';
import { GraphNode, calculateOrbitPosition, setupConstellationLayout } from '../utils/graphUtils';

export const useGraphAnimation = (
  graphData: { nodes: GraphNode[]; links: any[] },
  fgRef: React.RefObject<any>
) => {
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const isAnimatingRef = useRef<boolean>(false);
  const lastUpdateRef = useRef<number>(0);
  
  const setupConstellation = useCallback(() => {
    if (!graphData.nodes.length || !fgRef.current) return;
    
    setupConstellationLayout(graphData.nodes);
    
    // Disable all force simulation for smooth orbital movement
    if (fgRef.current) {
      const fg = fgRef.current;
      fg.d3Force('link', null);
      fg.d3Force('charge', null);
      fg.d3Force('center', null);
      fg.d3Force('collide', null);
      fg.d3Force('x', null);
      fg.d3Force('y', null);
    }
  }, [graphData.nodes, fgRef]);
  
  const animate = useCallback(() => {
    if (!fgRef.current || !graphData.nodes.length) {
      if (isAnimatingRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
      return;
    }

    const now = Date.now();
    const elapsed = (now - startTimeRef.current) * 0.001; // Convert to seconds immediately
    
    // Throttle updates to 60fps for better performance
    if (now - lastUpdateRef.current < 16) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    lastUpdateRef.current = now;
    
    // Update orbital positions for all non-Athena nodes
    let needsUpdate = false;
    graphData.nodes.forEach(node => {
      if (node.id === 'athena') {
        // Keep Athena fixed at center
        if (node.fx !== 0 || node.fy !== 0) {
          node.fx = 0;
          node.fy = 0;
          node.x = 0;
          node.y = 0;
          needsUpdate = true;
        }
        return;
      }
      
      // Calculate orbital movement for non-Athena nodes
      if (node.orbitRadius && node.orbitSpeed) {
        // Calculate current angle based on elapsed time and orbital speed
        const currentAngle = (node.orbitAngle || 0) + (elapsed * node.orbitSpeed);
        
        // Add subtle wobble for organic movement
        const wobbleFreq = 0.5 + (node.relevancia || 5) * 0.1;
        const wobbleAmplitude = 3 + (node.relevancia || 5) * 1;
        const wobbleX = Math.sin(elapsed * wobbleFreq) * wobbleAmplitude;
        const wobbleY = Math.cos(elapsed * wobbleFreq * 1.3) * wobbleAmplitude;
        
        // Calculate new orbital position
        const newX = Math.cos(currentAngle) * node.orbitRadius + wobbleX;
        const newY = Math.sin(currentAngle) * node.orbitRadius + wobbleY;
        
        // Always update position for smooth movement
        node.fx = newX;
        node.fy = newY;
        node.x = newX;
        node.y = newY;
        needsUpdate = true;
      }
    });
    
    // Force refresh if positions changed
    if (needsUpdate && fgRef.current) {
      fgRef.current.refresh();
    }
    
    // Continue animation loop
    if (isAnimatingRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [graphData.nodes, fgRef]);
  
  useEffect(() => {
    if (!graphData.nodes.length) return;
    
    // Setup constellation layout
    setupConstellation();
    
    // Start continuous animation
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      startTimeRef.current = Date.now();
      lastUpdateRef.current = 0;
      
      // Start animation immediately
      animate();
    }
  }, [graphData.nodes, setupConstellation, animate]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isAnimatingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return {
    setupConstellation
  };
};
