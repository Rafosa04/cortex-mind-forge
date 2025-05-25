
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
    athena: '#9b87f5',
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

  // Movimento orbital suave baseado em deltaTime
  const timeInSeconds = time * 0.001;
  const currentAngle = (node.orbitAngle || 0) + (timeInSeconds * node.orbitSpeed);
  
  // Movimento translacional suave com sin/cos
  const baseX = Math.cos(currentAngle) * node.orbitRadius;
  const baseY = Math.sin(currentAngle) * node.orbitRadius;
  
  // Sutil variação orgânica baseada na relevância
  const wobbleFreq = 0.3 + (node.relevancia || 5) * 0.05;
  const wobbleAmplitude = 2 + (node.relevancia || 5) * 1;
  const wobbleX = Math.sin(timeInSeconds * wobbleFreq) * wobbleAmplitude;
  const wobbleY = Math.cos(timeInSeconds * wobbleFreq * 1.2) * wobbleAmplitude;
  
  return {
    x: baseX + wobbleX,
    y: baseY + wobbleY
  };
};

export const setupConstellationLayout = (nodes: GraphNode[]) => {
  const athenaNode = nodes.find(node => node.id === 'athena');
  if (!athenaNode) return;
  
  // Fixar Athena no centro
  athenaNode.fx = 0;
  athenaNode.fy = 0;
  
  const otherNodes = nodes.filter(node => node.id !== 'athena');
  const nodesByType = otherNodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = [];
    acc[node.type].push(node);
    return acc;
  }, {} as Record<string, GraphNode[]>);
  
  // Órbitas dinâmicas com velocidades diferenciadas
  const orbitLayers = {
    subcerebro: { 
      radius: 180, 
      speed: 0.2,
      radiusVariation: 30 
    },
    projeto: { 
      radius: 280, 
      speed: 0.15, 
      radiusVariation: 40 
    },
    habito: { 
      radius: 360, 
      speed: 0.12, 
      radiusVariation: 25 
    },
    favorito: { 
      radius: 430, 
      speed: 0.1, 
      radiusVariation: 35 
    },
    pensamento: { 
      radius: 500, 
      speed: 0.08, 
      radiusVariation: 50 
    }
  };
  
  Object.entries(nodesByType).forEach(([type, nodes]) => {
    const layer = orbitLayers[type as keyof typeof orbitLayers];
    if (!layer) return;
    
    nodes.forEach((node, index) => {
      const angleStep = (2 * Math.PI) / nodes.length;
      const baseAngle = index * angleStep;
      
      // Distribuição orgânica nas órbitas
      const radiusVariation = (Math.random() - 0.5) * layer.radiusVariation;
      const angleVariation = (Math.random() - 0.5) * 0.3;
      const speedVariation = (Math.random() - 0.5) * 0.05;
      
      node.orbitRadius = layer.radius + radiusVariation;
      node.orbitAngle = baseAngle + angleVariation;
      node.orbitSpeed = layer.speed + speedVariation;
      node.pulsePhase = Math.random() * Math.PI * 2;
      
      // Posição inicial
      const pos = calculateOrbitPosition(node, 0);
      node.fx = pos.x;
      node.fy = pos.y;
    });
  });
};
