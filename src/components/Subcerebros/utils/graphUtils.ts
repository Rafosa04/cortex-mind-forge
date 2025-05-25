import * as d3 from 'd3-force';

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  relevancia: number;
  connections: any[];
  area?: string;
  fx?: number;
  fy?: number;
  x?: number;
  y?: number;
  tags?: string[];
  createdAt?: string;
  lastAccess?: string;
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
  pulsePhase?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  impulse?: number;
  pulsePosition?: number;
  pulseSpeed?: number;
  lastPulseTime?: number;
  pulseDuration?: number;
}

export const getNodeColor = (node: GraphNode) => {
  const colors = {
    athena: '#FFD700',
    subcerebro: '#8B5CF6',
    projeto: '#0EA5E9',
    habito: '#10B981',
    favorito: '#F59E0B',
    pensamento: '#EC4899',
    default: '#9CA3AF'
  };
  return colors[node.type as keyof typeof colors] || colors.default;
};

export const calculateOrbitPosition = (node: GraphNode, time: number) => {
  if (node.id === 'athena' || !node.orbitRadius || !node.orbitSpeed) {
    return { x: node.fx || 0, y: node.fy || 0 };
  }

  // Smooth orbital movement with time-based rotation
  const timeInSeconds = time * 0.001; // Convert to seconds
  const currentAngle = (node.orbitAngle || 0) + (timeInSeconds * node.orbitSpeed);
  
  // Add subtle wobble based on relevance for organic movement
  const wobbleFreq = 0.5 + (node.relevancia || 5) * 0.1;
  const wobbleAmplitude = 5 + (node.relevancia || 5) * 2;
  const wobbleX = Math.sin(timeInSeconds * wobbleFreq) * wobbleAmplitude;
  const wobbleY = Math.cos(timeInSeconds * wobbleFreq * 1.3) * wobbleAmplitude;
  
  // Calculate orbital position with wobble
  const baseX = Math.cos(currentAngle) * node.orbitRadius;
  const baseY = Math.sin(currentAngle) * node.orbitRadius;
  
  return {
    x: baseX + wobbleX,
    y: baseY + wobbleY
  };
};

export const setupConstellationLayout = (nodes: GraphNode[]) => {
  const athenaNode = nodes.find(node => node.id === 'athena');
  if (!athenaNode) return;
  
  // Fix Athena at center
  athenaNode.fx = 0;
  athenaNode.fy = 0;
  
  const otherNodes = nodes.filter(node => node.id !== 'athena');
  const nodesByType = otherNodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = [];
    acc[node.type].push(node);
    return acc;
  }, {} as Record<string, GraphNode[]>);
  
  // Define orbital layers with different radii and speeds for variety
  const orbitLayers = {
    subcerebro: { 
      radius: 200, 
      speed: 0.3,  // Slower, more stable orbit
      radiusVariation: 40 
    },
    projeto: { 
      radius: 300, 
      speed: 0.25, 
      radiusVariation: 50 
    },
    habito: { 
      radius: 380, 
      speed: 0.2, 
      radiusVariation: 30 
    },
    favorito: { 
      radius: 450, 
      speed: 0.15, 
      radiusVariation: 40 
    },
    pensamento: { 
      radius: 520, 
      speed: 0.1, 
      radiusVariation: 60 
    }
  };
  
  Object.entries(nodesByType).forEach(([type, nodes]) => {
    const layer = orbitLayers[type as keyof typeof orbitLayers];
    if (!layer) return;
    
    nodes.forEach((node, index) => {
      const angleStep = (2 * Math.PI) / nodes.length;
      const baseAngle = index * angleStep;
      
      // Add some randomness for natural distribution
      const radiusVariation = (Math.random() - 0.5) * layer.radiusVariation;
      const angleVariation = (Math.random() - 0.5) * 0.5;
      const speedVariation = (Math.random() - 0.5) * 0.1;
      
      node.orbitRadius = layer.radius + radiusVariation;
      node.orbitAngle = baseAngle + angleVariation;
      node.orbitSpeed = layer.speed + speedVariation;
      node.pulsePhase = Math.random() * Math.PI * 2;
      
      // Set initial positions
      const pos = calculateOrbitPosition(node, 0);
      node.fx = pos.x;
      node.fy = pos.y;
    });
  });
};
