
// neuralgraph_refatorado.tsx
// Substitua apenas a função applyForces no useEffect original por esta versão aprimorada:
const applyForces = (positions: any[], deltaTime: number) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[j].x - positions[i].x;
      const dy = positions[j].y - positions[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 1) continue;

      const sourceNode = nodes[i];
      const targetNode = nodes[j];
      const isConnected = sourceNode.connections?.some((conn: any) => conn.id === targetNode.id) || 
                          targetNode.connections?.some((conn: any) => conn.id === sourceNode.id);

      const minDistance = positions[i].radius + positions[j].radius;

      let force = 0;
      if (isConnected) {
        const optimalDistance = 200;
        force = 0.02 * (distance - optimalDistance);
      } else {
        force = 2000 / (distance * distance);
      }

      const forceX = (dx / distance) * force * deltaTime;
      const forceY = (dy / distance) * force * deltaTime;

      positions[i].vx += forceX / positions[i].mass;
      positions[i].vy += forceY / positions[i].mass;
      positions[j].vx -= forceX / positions[j].mass;
      positions[j].vy -= forceY / positions[j].mass;
    }

    const pos = positions[i];
    const centerForce = 0.01;
    pos.vx += (centerX - pos.x) * centerForce * deltaTime;
    pos.vy += (centerY - pos.y) * centerForce * deltaTime;

    pos.x += pos.vx;
    pos.y += pos.vy;

    if (pos.x < pos.radius || pos.x > canvas.width - pos.radius) {
      pos.vx *= -0.8;
      pos.x = Math.max(pos.radius, Math.min(canvas.width - pos.radius, pos.x));
    }

    if (pos.y < pos.radius || pos.y > canvas.height - pos.radius) {
      pos.vy *= -0.8;
      pos.y = Math.max(pos.radius, Math.min(canvas.height - pos.radius, pos.y));
    }

    pos.vx *= 0.95;
    pos.vy *= 0.95;

    pos.vx += (Math.random() - 0.5) * 0.02;
    pos.vy += (Math.random() - 0.5) * 0.02;
  }
};
