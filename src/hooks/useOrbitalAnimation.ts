
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
    if (!isActive || !nodes.length) return;

    const animate = () => {
      timeRef.current += 0.008; // Slow, smooth animation speed

      const athenaNode = nodes.find(node => node.id === 'athena');
      if (!athenaNode || !athenaNode.x || !athenaNode.y) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const athenaX = athenaNode.x;
      const athenaY = athenaNode.y;

      // Update orbital positions for non-Athena nodes
      nodes.forEach((node, index) => {
        if (node.id === 'athena') return;

        // Calculate orbital parameters
        const baseRadius = 80 + (index * 40); // Different orbit radii
        const relevanceMultiplier = (node.relevancia || 5) / 10;
        const radius = baseRadius + (relevanceMultiplier * 30);
        
        // Each node has a different phase offset
        const phaseOffset = (index * Math.PI * 2) / Math.max(1, nodes.length - 1);
        const angle = timeRef.current + phaseOffset;

        // Calculate new orbital position
        const newX = athenaX + Math.cos(angle) * radius;
        const newY = athenaY + Math.sin(angle) * radius;

        // Update node position
        if (node.x !== undefined && node.y !== undefined) {
          node.x = newX;
          node.y = newY;
          // Keep nodes fixed in their orbital positions
          node.fx = newX;
          node.fy = newY;
        }
      });

      // Continue animation infinitely
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, isActive]);

  return timeRef;
}
