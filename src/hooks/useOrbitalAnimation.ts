
import { useEffect, useRef } from 'react';

interface GraphNode {
  id: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
  relevancia?: number;
}

export function useOrbitalAnimation(
  nodes: GraphNode[],
  fgRef: React.RefObject<any>,
  isActive: boolean = true
) {
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    if (!isActive || !nodes.length) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      timeRef.current += 0.01; // Velocidade constante e suave

      const athenaNode = nodes.find(node => node.id === 'athena');
      if (!athenaNode) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Garantir que Athena sempre fique no centro
      if (athenaNode.x !== 0 || athenaNode.y !== 0) {
        athenaNode.x = 0;
        athenaNode.y = 0;
        athenaNode.fx = 0;
        athenaNode.fy = 0;
      }

      const athenaX = 0;
      const athenaY = 0;

      // Update orbital positions for non-Athena nodes
      nodes.forEach((node, index) => {
        if (node.id === 'athena') return;

        // Calculate orbital parameters
        const baseRadius = 100 + (index * 50); // Different orbit radii
        const relevanceMultiplier = (node.relevancia || 5) / 10;
        const radius = baseRadius + (relevanceMultiplier * 40);
        
        // Each node has a different phase offset for varied orbital speeds
        const phaseOffset = (index * Math.PI * 2) / Math.max(1, nodes.length - 1);
        const orbitalSpeed = 1 + (relevanceMultiplier * 0.3); // Varying speeds based on relevance
        const angle = (timeRef.current * orbitalSpeed) + phaseOffset;

        // Calculate new orbital position
        const newX = athenaX + Math.cos(angle) * radius;
        const newY = athenaY + Math.sin(angle) * radius;

        // Update node position smoothly
        node.x = newX;
        node.y = newY;
        node.fx = newX;
        node.fy = newY;
      });

      // Force continue animation infinitely
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup on unmount or dependency change
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return timeRef;
}
