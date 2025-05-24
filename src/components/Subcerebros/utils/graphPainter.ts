
import { GraphNode, GraphLink, getNodeColor } from './graphUtils';

export const paintNode = (node: GraphNode, ctx: CanvasRenderingContext2D, time: number) => {
  const label = node.label;
  const fontSize = 12;
  const baseRadius = Math.sqrt(node.relevancia || 1) * 8;
  
  // Pulsating effect based on relevance
  const pulseIntensity = (node.relevancia || 5) / 10;
  const pulseFreq = 0.002 + (pulseIntensity * 0.001);
  const pulse = Math.sin(time * pulseFreq + (node.pulsePhase || 0)) * 0.3 + 1;
  const nodeRadius = baseRadius * pulse;
  
  // Outer glow effect
  const gradient = ctx.createRadialGradient(
    node.x || 0, node.y || 0, 0,
    node.x || 0, node.y || 0, nodeRadius * 2
  );
  
  const nodeColor = getNodeColor(node);
  gradient.addColorStop(0, nodeColor);
  gradient.addColorStop(0.7, nodeColor + '80');
  gradient.addColorStop(1, nodeColor + '00');
  
  // Draw glow
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, nodeRadius * 2, 0, 2 * Math.PI, false);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw main node
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, nodeRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = nodeColor;
  ctx.fill();
  
  // Special styling for Athena
  if (node.id === 'athena') {
    // Athena's corona effect
    const coronaGradient = ctx.createRadialGradient(
      node.x || 0, node.y || 0, nodeRadius,
      node.x || 0, node.y || 0, nodeRadius * 3
    );
    coronaGradient.addColorStop(0, '#FFD70080');
    coronaGradient.addColorStop(0.5, '#FFD70030');
    coronaGradient.addColorStop(1, '#FFD70000');
    
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeRadius * 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = coronaGradient;
    ctx.fill();
    
    // Athena's border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeRadius, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  
  // Draw label
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText(label, node.x || 0, (node.y || 0) + nodeRadius + 15);
  ctx.shadowBlur = 0;
};

export const paintLink = (link: GraphLink, ctx: CanvasRenderingContext2D, time: number) => {
  const source = typeof link.source === 'object' ? link.source : null;
  const target = typeof link.target === 'object' ? link.target : null;
  
  if (!source || !target) return;

  const dx = (target.x || 0) - (source.x || 0);
  const dy = (target.y || 0) - (source.y || 0);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Base connection line
  ctx.beginPath();
  ctx.moveTo(source.x || 0, source.y || 0);
  ctx.lineTo(target.x || 0, target.y || 0);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Synapse pulse effect
  if (!link.pulsePosition) link.pulsePosition = 0;
  if (!link.pulseSpeed) link.pulseSpeed = 0.002 + Math.random() * 0.003;
  
  link.pulsePosition += link.pulseSpeed;
  if (link.pulsePosition > 1) link.pulsePosition = 0;
  
  // Draw multiple pulses along the line
  const numPulses = 3;
  for (let i = 0; i < numPulses; i++) {
    const pulsePos = (link.pulsePosition + (i / numPulses)) % 1;
    const pulseX = (source.x || 0) + dx * pulsePos;
    const pulseY = (source.y || 0) + dy * pulsePos;
    
    // Pulse intensity based on position
    const intensity = Math.sin(pulsePos * Math.PI) * 0.8 + 0.2;
    
    // Gradient for pulse
    const pulseGradient = ctx.createRadialGradient(
      pulseX, pulseY, 0,
      pulseX, pulseY, 8
    );
    pulseGradient.addColorStop(0, `rgba(96, 181, 181, ${intensity})`);
    pulseGradient.addColorStop(0.5, `rgba(96, 181, 181, ${intensity * 0.5})`);
    pulseGradient.addColorStop(1, 'rgba(96, 181, 181, 0)');
    
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 8 * intensity, 0, 2 * Math.PI, false);
    ctx.fillStyle = pulseGradient;
    ctx.fill();
  }
};
