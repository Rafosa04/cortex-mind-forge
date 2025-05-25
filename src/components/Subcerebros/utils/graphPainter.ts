
import { GraphNode, GraphLink, getNodeColor } from './graphUtils';

export const paintNode = (node: GraphNode, ctx: CanvasRenderingContext2D, time: number) => {
  const label = node.label;
  const fontSize = 12;
  const baseRadius = Math.sqrt(node.relevancia || 1) * 8;
  
  // Efeito pulsante contínuo baseado na relevância
  const relevanceIntensity = (node.relevancia || 5) / 10;
  const pulseFreq = 0.0015 + (relevanceIntensity * 0.001);
  const pulseAmplitude = 0.2 + (relevanceIntensity * 0.15);
  const pulse = Math.sin(time * pulseFreq + (node.pulsePhase || 0)) * pulseAmplitude + 1;
  const nodeRadius = baseRadius * pulse;
  
  // Aura neural brilhante
  const glowIntensity = 0.3 + (relevanceIntensity * 0.3);
  const glowPulse = Math.sin(time * pulseFreq * 1.8 + (node.pulsePhase || 0)) * 0.4 + 1;
  const glowRadius = nodeRadius * (2.2 + glowPulse * 0.3);
  
  const gradient = ctx.createRadialGradient(
    node.x || 0, node.y || 0, 0,
    node.x || 0, node.y || 0, glowRadius
  );
  
  const nodeColor = getNodeColor(node);
  gradient.addColorStop(0, nodeColor);
  gradient.addColorStop(0.3, nodeColor + Math.floor(255 * glowIntensity * glowPulse).toString(16).padStart(2, '0'));
  gradient.addColorStop(0.7, nodeColor + '30');
  gradient.addColorStop(1, nodeColor + '00');
  
  // Desenhar aura neural
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, glowRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Núcleo do nó com gradiente interno
  const innerGradient = ctx.createRadialGradient(
    node.x || 0, node.y || 0, 0,
    node.x || 0, node.y || 0, nodeRadius
  );
  innerGradient.addColorStop(0, nodeColor + 'FF');
  innerGradient.addColorStop(0.6, nodeColor + 'E0');
  innerGradient.addColorStop(1, nodeColor + 'B0');
  
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, nodeRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = innerGradient;
  ctx.fill();
  
  // Athena: efeitos especiais do nó central
  if (node.id === 'athena') {
    // Corona solar multi-camada
    for (let i = 1; i <= 3; i++) {
      const coronaRadius = nodeRadius * (1.5 + i * 0.3);
      const coronaIntensity = 0.6 / i;
      const coronaPulse = Math.sin(time * 0.0005 * i + (i * Math.PI / 3)) * 0.4 + 1;
      
      const coronaGradient = ctx.createRadialGradient(
        node.x || 0, node.y || 0, nodeRadius,
        node.x || 0, node.y || 0, coronaRadius * coronaPulse
      );
      coronaGradient.addColorStop(0, `#9b87f5${Math.floor(255 * coronaIntensity * coronaPulse).toString(16).padStart(2, '0')}`);
      coronaGradient.addColorStop(0.5, `#9b87f5${Math.floor(255 * coronaIntensity * coronaPulse * 0.4).toString(16).padStart(2, '0')}`);
      coronaGradient.addColorStop(1, '#9b87f500');
      
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, coronaRadius * coronaPulse, 0, 2 * Math.PI, false);
      ctx.fillStyle = coronaGradient;
      ctx.fill();
    }
    
    // Borda pulsante de Athena
    const borderPulse = Math.sin(time * 0.002) * 0.5 + 1.5;
    ctx.strokeStyle = '#9b87f5';
    ctx.lineWidth = 2 * borderPulse;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeRadius, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  
  // Label com sombra para legibilidade
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, node.x || 0, (node.y || 0) + nodeRadius + 18);
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

export const paintLink = (link: GraphLink, ctx: CanvasRenderingContext2D, time: number) => {
  const source = typeof link.source === 'object' ? link.source : null;
  const target = typeof link.target === 'object' ? link.target : null;
  
  if (!source || !target) return;

  const dx = (target.x || 0) - (source.x || 0);
  const dy = (target.y || 0) - (source.y || 0);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Sinapse neural com gradiente animado
  const gradient = ctx.createLinearGradient(
    source.x || 0, source.y || 0,
    target.x || 0, target.y || 0
  );
  
  // Gradiente dinâmico baseado no tempo
  const colorIntensity = Math.sin(time * 0.003) * 0.3 + 0.5;
  const sourceColor = getNodeColor(source);
  const targetColor = '#9b87f5'; // Cor de Athena
  
  gradient.addColorStop(0, `rgba(155, 135, 245, ${colorIntensity * 0.9})`);
  gradient.addColorStop(0.5, `rgba(96, 181, 181, ${colorIntensity})`);
  gradient.addColorStop(1, `rgba(155, 135, 245, ${colorIntensity * 0.9})`);
  
  // Linha principal da sinapse
  ctx.beginPath();
  ctx.moveTo(source.x || 0, source.y || 0);
  ctx.lineTo(target.x || 0, target.y || 0);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  
  // Movimento de partícula neural (faíscas de dados)
  if (!link.pulsePosition) link.pulsePosition = Math.random();
  if (!link.pulseSpeed) link.pulseSpeed = 0.0001 + Math.random() * 0.0002;
  
  // Atualizar posição da partícula
  const pulseIncrement = link.pulseSpeed * 16;
  link.pulsePosition += pulseIncrement;
  if (link.pulsePosition > 1) link.pulsePosition = 0;
  
  // Desenhar partícula neural única
  const pulsePos = link.pulsePosition;
  const pulseX = (source.x || 0) + dx * pulsePos;
  const pulseY = (source.y || 0) + dy * pulsePos;
  
  // Intensidade da partícula com easing suave
  const intensity = Math.sin(pulsePos * Math.PI) * 0.9 + 0.3;
  const pulseSize = 3 + intensity * 4;
  
  // Gradiente da partícula neural
  const pulseGradient = ctx.createRadialGradient(
    pulseX, pulseY, 0,
    pulseX, pulseY, pulseSize
  );
  pulseGradient.addColorStop(0, `rgba(155, 135, 245, ${intensity})`);
  pulseGradient.addColorStop(0.4, `rgba(96, 181, 181, ${intensity * 0.8})`);
  pulseGradient.addColorStop(1, 'rgba(155, 135, 245, 0)');
  
  ctx.beginPath();
  ctx.arc(pulseX, pulseY, pulseSize, 0, 2 * Math.PI, false);
  ctx.fillStyle = pulseGradient;
  ctx.fill();
  
  // Núcleo brilhante da partícula
  const coreIntensity = intensity * Math.sin(time * 0.01 + pulsePos * Math.PI * 2) * 0.6 + 0.8;
  ctx.beginPath();
  ctx.arc(pulseX, pulseY, pulseSize * 0.25, 0, 2 * Math.PI, false);
  ctx.fillStyle = `rgba(255, 255, 255, ${coreIntensity})`;
  ctx.fill();
};
