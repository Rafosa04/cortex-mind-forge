
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
    
    // Desabilitar forças de simulação para movimento orbital puro
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
    if (!fgRef.current || !graphData.nodes.length || !isAnimatingRef.current) {
      if (isAnimatingRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
      return;
    }

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    
    // Throttle para 60fps otimizado
    if (now - lastUpdateRef.current < 16) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    lastUpdateRef.current = now;
    
    // Atualizar posições orbitais com movimento suave
    let needsUpdate = false;
    graphData.nodes.forEach(node => {
      if (node.id === 'athena') {
        // Manter Athena fixa no centro
        if (node.fx !== 0 || node.fy !== 0) {
          node.fx = 0;
          node.fy = 0;
          needsUpdate = true;
        }
        return;
      }
      
      // Movimento orbital translacional contínuo
      if (node.orbitRadius && node.orbitSpeed) {
        const timeInSeconds = elapsed * 0.001;
        const currentAngle = (node.orbitAngle || 0) + (timeInSeconds * node.orbitSpeed);
        
        // Movimento orbital com sin/cos e variação orgânica
        const wobbleFreq = 0.3 + (node.relevancia || 5) * 0.05;
        const wobbleAmplitude = 2 + (node.relevancia || 5) * 1;
        const wobbleX = Math.sin(timeInSeconds * wobbleFreq) * wobbleAmplitude;
        const wobbleY = Math.cos(timeInSeconds * wobbleFreq * 1.2) * wobbleAmplitude;
        
        const newX = Math.cos(currentAngle) * node.orbitRadius + wobbleX;
        const newY = Math.sin(currentAngle) * node.orbitRadius + wobbleY;
        
        // Atualizar apenas se mudança significativa
        if (Math.abs((node.fx || 0) - newX) > 0.1 || Math.abs((node.fy || 0) - newY) > 0.1) {
          node.fx = newX;
          node.fy = newY;
          node.x = newX;
          node.y = newY;
          needsUpdate = true;
        }
      }
    });
    
    // Refresh apenas quando necessário
    if (needsUpdate && fgRef.current) {
      fgRef.current.refresh();
    }
    
    // Continuar loop de animação
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [graphData.nodes, fgRef]);
  
  useEffect(() => {
    if (!graphData.nodes.length) return;
    
    // Setup da constelação
    setupConstellation();
    
    // Iniciar animação contínua
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      startTimeRef.current = Date.now();
      lastUpdateRef.current = 0;
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      // Não parar animação em mudanças de dependência
    };
  }, [graphData.nodes, setupConstellation, animate]);
  
  // Cleanup no unmount
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
