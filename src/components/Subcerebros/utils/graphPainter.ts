
import { GraphNode, GraphLink, getNodeColor } from './graphUtils';

export const paintNode = (node: GraphNode, ctx: CanvasRenderingContext2D, time: number) => {
  const label = node.label;
  const fontSize = 12;
  const baseRadius = Math.sqrt(node.relevancia || 1) * 8;
  
  // Enhanced pulsating effect based on relevance - more dramatic for higher relevance
  const relevanceIntensity = (node.relevancia || 5) / 10;
  const pulseFreq = 0.003 + (relevanceIntensity * 0.002); // Faster pulse for more relevant nodes
  const pulseAmplitude = 0.2 + (relevanceIntensity * 0.3); // Bigger pulse for more relevant nodes
  const pulse = Math.sin(time * pulseFreq + (node.pulsePhase || 0)) * pulseAmplitude + 1;
  const nodeRadius = baseRadius * pulse;
  
  // Enhanced glow effect that also pulses
  const glowIntensity = 0.3 + (relevanceIntensity * 0.5);
  const glowRadius = nodeRadius * (2 + pulse * 0.5);
  
  const gradient = ctx.createRadialGradient(
    node.x || 0, node.y || 0, 0,
    node.x || 0, node.y || 0, glowRadius
  );
  
  const nodeColor = getNodeColor(node);
  gradient.addColorStop(0, nodeColor);
  gradient.addColorStop(0.4, nodeColor + Math.floor(255 * glowIntensity).toString(16).padStart(2, '0'));
  gradient.addColorStop(0.8, nodeColor + '40');
  gradient.addColorStop(1, nodeColor + '00');
  
  // Draw enhanced glow
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, glowRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw main node with inner glow
  const innerGradient = ctx.createRadialGradient(
    node.x || 0, node.y || 0, 0,
    node.x || 0, node.y || 0, nodeRadius
  );
  innerGradient.addColorStop(0, nodeColor + 'FF');
  innerGradient.addColorStop(0.7, nodeColor + 'DD');
  innerGradient.addColorStop(1, nodeColor + 'AA');
  
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, nodeRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = innerGradient;
  ctx.fill();
  
  // Special enhanced styling for Athena (the sun)
  if (node.id === 'athena') {
    // Athena's enhanced corona effect with multiple layers
    for (let i = 1; i <= 3; i++) {
      const coronaRadius = nodeRadius * (2 + i);
      const coronaIntensity = 0.6 / i;
      const coronaPulse = Math.sin(time * 0.002 * i) * 0.2 + 1;
      
      const coronaGradient = ctx.createRadialGradient(
        node.x || 0, node.y || 0, nodeRadius,
        node.x || 0, node.y || 0, coronaRadius * coronaPulse
      );
      coronaGradient.addColorStop(0, `#FFD700${Math.floor(255 * coronaIntensity).toString(16).padStart(2, '0')}`);
      coronaGradient.addColorStop(0.5, `#FFD700${Math.floor(255 * coronaIntensity * 0.5).toString(16).padStart(2, '0')}`);
      coronaGradient.addColorStop(1, '#FFD70000');
      
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, coronaRadius * coronaPulse, 0, 2 * Math.PI, false);
      ctx.fillStyle = coronaGradient;
      ctx.fill();
    }
    
    // Athena's pulsating border
    const borderPulse = Math.sin(time * 0.004) * 0.5 + 1;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2 + borderPulse;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeRadius, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  
  // Draw label with enhanced visibility
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Text shadow for better readability
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, node.x || 0, (node.y || 0) + nodeRadius + 20);
  
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
  
  // Enhanced base connection line with gradient
  const gradient = ctx.createLinearGradient(
    source.x || 0, source.y || 0,
    target.x || 0, target.y || 0
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(0.5, 'rgba(96, 181, 181, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
  
  ctx.beginPath();
  ctx.moveTo(source.x || 0, source.y || 0);
  ctx.lineTo(target.x || 0, target.y || 0);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  // Enhanced synapse pulse effect with multiple pulses
  if (!link.pulsePosition) link.pulsePosition = Math.random();
  if (!link.pulseSpeed) link.pulseSpeed = 0.002 + Math.random() * 0.004;
  
  // Update pulse position continuously
  link.pulsePosition += link.pulseSpeed;
  if (link.pulsePosition > 1) link.pulsePosition = 0;
  
  // Draw multiple pulses along the line for synapse effect
  const numPulses = 2;
  for (let i = 0; i < numPulses; i++) {
    const pulseOffset = i / numPulses;
    const pulsePos = (link.pulsePosition + pulseOffset) % 1;
    const pulseX = (source.x || 0) + dx * pulsePos;
    const pulseY = (source.y || 0) + dy * pulsePos;
    
    // Enhanced pulse intensity with easing
    const intensity = Math.sin(pulsePos * Math.PI) * 0.9 + 0.3;
    const pulseSize = 6 + intensity * 4;
    
    // Gradient for enhanced pulse
    const pulseGradient = ctx.createRadialGradient(
      pulseX, pulseY, 0,
      pulseX, pulseY, pulseSize
    );
    pulseGradient.addColorStop(0, `rgba(96, 181, 181, ${intensity})`);
    pulseGradient.addColorStop(0.3, `rgba(96, 181, 181, ${intensity * 0.8})`);
    pulseGradient.addColorStop(0.7, `rgba(96, 181, 181, ${intensity * 0.4})`);
    pulseGradient.addColorStop(1, 'rgba(96, 181, 181, 0)');
    
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, pulseSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = pulseGradient;
    ctx.fill();
    
    // Add a bright core to the pulse
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, pulseSize * 0.3, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
    ctx.fill();
  }
};
