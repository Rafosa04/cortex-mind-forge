
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

  const currentAngle = (node.orbitAngle || 0) + (time * node.orbitSpeed);
  
  // Add subtle wobble based on relevance
  const wobble = (node.relevancia || 5) / 200 * Math.sin(time * 0.002 + currentAngle * 3);
  const effectiveRadius = node.orbitRadius * (1 + wobble);
  
  return {
    x: Math.cos(currentAngle) * effectiveRadius,
    y: Math.sin(currentAngle) * effectiveRadius
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
  
  // Define orbital layers with different radii and speeds
  const orbitLayers = {
    subcerebro: { radius: 180, speed: 0.0008 },
    projeto: { radius: 280, speed: 0.0006 },
    habito: { radius: 350, speed: 0.0005 },
    favorito: { radius: 420, speed: 0.0004 },
    pensamento: { radius: 490, speed: 0.0003 }
  };
  
  Object.entries(nodesByType).forEach(([type, nodes]) => {
    const layer = orbitLayers[type as keyof typeof orbitLayers];
    if (!layer) return;
    
    nodes.forEach((node, index) => {
      const angleStep = (2 * Math.PI) / nodes.length;
      const baseAngle = index * angleStep;
      const radiusVariation = (Math.random() - 0.5) * 30;
      
      node.orbitRadius = layer.radius + radiusVariation;
      node.orbitAngle = baseAngle + (Math.random() - 0.5) * 0.3;
      node.orbitSpeed = layer.speed * (0.8 + Math.random() * 0.4);
      node.pulsePhase = Math.random() * Math.PI * 2;
      
      // Set initial positions
      const pos = calculateOrbitPosition(node, 0);
      node.fx = pos.x;
      node.fy = pos.y;
    });
  });
};
