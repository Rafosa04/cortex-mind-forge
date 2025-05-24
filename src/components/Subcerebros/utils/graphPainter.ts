
import { GraphNode, GraphLink, getNodeColor } from './graphUtils';

export const paintNode = (node: GraphNode, ctx: CanvasRenderingContext2D, time: number) => {
  const label = node.label;
  const fontSize = 12;
  const baseRadius = Math.sqrt(node.relevancia || 1) * 8;
  
  // Continuous pulsating effect based on relevance with smooth timing
  const relevanceIntensity = (node.relevancia || 5) / 10;
  const pulseFreq = 0.001 + (relevanceIntensity * 0.002); // Slower, more visible pulse
  const pulseAmplitude = 0.15 + (relevanceIntensity * 0.25); // Varied amplitude based on relevance
  const pulse = Math.sin(time * pulseFreq + (node.pulsePhase || 0)) * pulseAmplitude + 1;
  const nodeRadius = baseRadius * pulse;
  
  // Enhanced glow effect that pulses with the node
  const glowIntensity = 0.2 + (relevanceIntensity * 0.4);
  const glowPulse = Math.sin(time * pulseFreq * 1.5 + (node.pulsePhase || 0)) * 0.3 + 1;
  const glowRadius = nodeRadius * (2 + glowPulse * 0.5);
  
  const gradient = ctx.createRadialGradient(
    node.x || 0, node.y || 0, 0,
    node.x || 0, node.y || 0, glowRadius
  );
  
  const nodeColor = getNodeColor(node);
  gradient.addColorStop(0, nodeColor);
  gradient.addColorStop(0.4, nodeColor + Math.floor(255 * glowIntensity * glowPulse).toString(16).padStart(2, '0'));
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
    // Athena's enhanced corona effect with multiple animated layers
    for (let i = 1; i <= 3; i++) {
      const coronaRadius = nodeRadius * (1.8 + i * 0.4);
      const coronaIntensity = 0.5 / i;
      const coronaPulse = Math.sin(time * 0.0008 * i + (i * Math.PI / 3)) * 0.3 + 1;
      
      const coronaGradient = ctx.createRadialGradient(
        node.x || 0, node.y || 0, nodeRadius,
        node.x || 0, node.y || 0, coronaRadius * coronaPulse
      );
      coronaGradient.addColorStop(0, `#FFD700${Math.floor(255 * coronaIntensity * coronaPulse).toString(16).padStart(2, '0')}`);
      coronaGradient.addColorStop(0.5, `#FFD700${Math.floor(255 * coronaIntensity * coronaPulse * 0.5).toString(16).padStart(2, '0')}`);
      coronaGradient.addColorStop(1, '#FFD70000');
      
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, coronaRadius * coronaPulse, 0, 2 * Math.PI, false);
      ctx.fillStyle = coronaGradient;
      ctx.fill();
    }
    
    // Athena's continuously pulsating border
    const borderPulse = Math.sin(time * 0.002) * 0.8 + 1.2;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2 * borderPulse;
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
  
  // Enhanced base connection line with animated gradient
  const gradient = ctx.createLinearGradient(
    source.x || 0, source.y || 0,
    target.x || 0, target.y || 0
  );
  
  // Animated gradient colors
  const colorIntensity = Math.sin(time * 0.002) * 0.2 + 0.4;
  gradient.addColorStop(0, `rgba(255, 255, 255, ${colorIntensity * 0.8})`);
  gradient.addColorStop(0.5, `rgba(96, 181, 181, ${colorIntensity})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, ${colorIntensity * 0.8})`);
  
  ctx.beginPath();
  ctx.moveTo(source.x || 0, source.y || 0);
  ctx.lineTo(target.x || 0, target.y || 0);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  // Single synapse pulse effect - muito mais lenta
  if (!link.pulsePosition) link.pulsePosition = 0;
  if (!link.pulseSpeed) link.pulseSpeed = 0.0008; // Velocidade muito mais lenta
  if (!link.lastPulseTime) link.lastPulseTime = 0;
  if (!link.pulseDuration) link.pulseDuration = 8000; // 8 segundos para completar
  
  // Controla quando a próxima sinapse deve aparecer
  const currentTime = Date.now();
  if (currentTime - link.lastPulseTime > link.pulseDuration) {
    link.pulsePosition = 0;
    link.lastPulseTime = currentTime;
  }
  
  // Update pulse position continuously based on real time
  const timeElapsed = currentTime - link.lastPulseTime;
  link.pulsePosition = Math.min(timeElapsed / link.pulseDuration, 1);
  
  // Draw single traveling pulse only if active
  if (link.pulsePosition < 1) {
    const pulseX = (source.x || 0) + dx * link.pulsePosition;
    const pulseY = (source.y || 0) + dy * link.pulsePosition;
    
    // Enhanced pulse intensity with smooth easing
    const intensity = Math.sin(link.pulsePosition * Math.PI) * 0.9 + 0.5;
    const pulseSize = 6 + intensity * 8;
    
    // Animated pulse gradient
    const pulseGradient = ctx.createRadialGradient(
      pulseX, pulseY, 0,
      pulseX, pulseY, pulseSize
    );
    pulseGradient.addColorStop(0, `rgba(96, 181, 181, ${intensity})`);
    pulseGradient.addColorStop(0.3, `rgba(96, 181, 181, ${intensity * 0.9})`);
    pulseGradient.addColorStop(0.7, `rgba(96, 181, 181, ${intensity * 0.5})`);
    pulseGradient.addColorStop(1, 'rgba(96, 181, 181, 0)');
    
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, pulseSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = pulseGradient;
    ctx.fill();
    
    // Add a bright animated core to the pulse
    const coreIntensity = intensity * Math.sin(time * 0.01 + link.pulsePosition * Math.PI * 2) * 0.5 + 0.7;
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, pulseSize * 0.3, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(255, 255, 255, ${coreIntensity})`;
    ctx.fill();
  }
};
