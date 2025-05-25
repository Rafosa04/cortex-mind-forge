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

interface OrbitalData {
  radius: number;
  angle: number;
  speed: number;
  eccentricity: number;
  phaseOffset: number;
}

export function useOrbitalAnimation(
  nodes: GraphNode[],
  fgRef: React.RefObject<any>,
  isActive: boolean = true
) {
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const orbitalDataRef = useRef<Map<string, OrbitalData>>(new Map());

  useEffect(() => {
    if (!isActive || !nodes.length) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Initialize orbital data for each node (only once)
    const initializeOrbitalData = () => {
      nodes.forEach((node, index) => {
        if (node.id === 'athena' || orbitalDataRef.current.has(node.id)) return;

        const relevanceMultiplier = (node.relevancia || 5) / 10;
        
        // More varied orbital parameters
        const baseRadius = 120 + (index * 60) + (Math.random() * 40 - 20); // Add randomness
        const radius = baseRadius + (relevanceMultiplier * 50);
        
        // Elliptical orbits with varying eccentricity
        const eccentricity = 0.1 + (Math.random() * 0.3); // 0.1 to 0.4 eccentricity
        
        // Varied orbital speeds (slower for outer orbits, faster for higher relevance)
        const distanceFactor = 1 / Math.sqrt(radius / 100); // Kepler's law approximation
        const relevanceFactor = 0.5 + (relevanceMultiplier * 0.5);
        const speed = (0.3 + (Math.random() * 0.4)) * distanceFactor * relevanceFactor; // Much slower base speed
        
        // Random phase offset for natural distribution
        const phaseOffset = Math.random() * Math.PI * 2;
        
        // Random starting angle
        const angle = Math.random() * Math.PI * 2;

        orbitalDataRef.current.set(node.id, {
          radius,
          angle,
          speed,
          eccentricity,
          phaseOffset
        });
      });
    };

    initializeOrbitalData();

    const animate = () => {
      timeRef.current += 0.016; // ~60fps timing

      const athenaNode = nodes.find(node => node.id === 'athena');
      if (!athenaNode) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Keep Athena fixed at center with slight pulsing motion
      const athenaPulse = Math.sin(timeRef.current * 2) * 2; // Very subtle movement
      athenaNode.x = athenaPulse * 0.5;
      athenaNode.y = athenaPulse * 0.3;
      athenaNode.fx = athenaNode.x;
      athenaNode.fy = athenaNode.y;

      const athenaX = athenaNode.x || 0;
      const athenaY = athenaNode.y || 0;

      // Update orbital positions with realistic physics
      nodes.forEach((node) => {
        if (node.id === 'athena') return;

        const orbitalData = orbitalDataRef.current.get(node.id);
        if (!orbitalData) return;

        // Update angle based on orbital speed
        orbitalData.angle += orbitalData.speed * 0.016; // Consistent with timing

        // Apply elliptical orbit mathematics
        const trueAnomaly = orbitalData.angle + orbitalData.phaseOffset;
        const radiusAtAngle = orbitalData.radius * (1 - orbitalData.eccentricity * orbitalData.eccentricity) / 
                             (1 + orbitalData.eccentricity * Math.cos(trueAnomaly));

        // Calculate orbital position with elliptical motion
        const newX = athenaX + Math.cos(trueAnomaly) * radiusAtAngle;
        const newY = athenaY + Math.sin(trueAnomaly) * radiusAtAngle * (1 - orbitalData.eccentricity * 0.3); // Slightly flattened

        // Add subtle gravitational perturbations for more realistic movement
        const perturbationX = Math.sin(timeRef.current * 0.7 + orbitalData.phaseOffset) * 3;
        const perturbationY = Math.cos(timeRef.current * 0.5 + orbitalData.phaseOffset) * 2;

        // Smooth interpolation for fluid movement
        const smoothingFactor = 0.1;
        const currentX = node.x || newX;
        const currentY = node.y || newY;
        
        const interpolatedX = currentX + (newX + perturbationX - currentX) * smoothingFactor;
        const interpolatedY = currentY + (newY + perturbationY - currentY) * smoothingFactor;

        // Update node position
        node.x = interpolatedX;
        node.y = interpolatedY;
        node.fx = interpolatedX;
        node.fy = interpolatedY;

        // Store updated orbital data
        orbitalDataRef.current.set(node.id, orbitalData);
      });

      // Continue animation
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
