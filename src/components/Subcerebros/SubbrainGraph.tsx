
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { forceCollide } from 'd3-force';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  label: string;
  color: string;
  val: number;
  fx?: number;
  fy?: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface SubbrainGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeClick: (node: GraphNode) => void;
  graphData?: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
}

const SubbrainGraph: React.FC<SubbrainGraphProps> = ({ nodes, links, onNodeClick, graphData }) => {
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const animationFrameId = useRef<number | null>(null);
  const lastTime = useRef<number>(0);
  
  // Use graphData if provided, otherwise construct from nodes and links
  const data = graphData || { nodes, links };

  const handleNodeClick = useCallback((node: GraphNode) => {
    onNodeClick(node);
  }, [onNodeClick]);

  const handleNodeMouseEnter = useCallback((node: GraphNode) => {
    const newHighlightNodes = new Set<string>();
    const newHighlightLinks = new Set<string>();

    data.links.forEach(link => {
      if (link.source === node.id) {
        newHighlightNodes.add(link.target);
        newHighlightLinks.add(link.source + link.target);
      } else if (link.target === node.id) {
        newHighlightNodes.add(link.source);
        newHighlightLinks.add(link.source + link.target);
      }
    });

    newHighlightNodes.add(node.id);
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  }, [data.links]);

  const handleNodeMouseLeave = useCallback(() => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('collide', forceCollide(30)); // Added collision radius
      fgRef.current.zoomToFit(400); // Added duration parameter
    }
  }, [data.nodes, data.links]);

  // Add autonomous gentle movement to nodes
  useEffect(() => {
    const animate = (time: number) => {
      if (!fgRef.current || !data.nodes.length) return;
      
      const deltaTime = time - (lastTime.current || time);
      lastTime.current = time;
      
      // Find Athena node (central node)
      const athenaNode = data.nodes.find(node => node.id === 'athena');
      const centerX = athenaNode ? athenaNode.fx || 0 : 0;
      const centerY = athenaNode ? athenaNode.fy || 0 : 0;
      
      // Update node positions for gentle orbital movement
      const graphData = fgRef.current.graphData();
      const updatedNodes = graphData.nodes.map((node: any) => {
        // Skip Athena (central) node
        if (node.id === 'athena') return node;
        
        // Calculate distance from center
        const dx = (node.x || 0) - centerX;
        const dy = (node.y || 0) - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Skip if no position yet
        if (distance === 0) return node;
        
        // Get normalized direction vector
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Calculate orbital movement - different for each node based on ID
        const nodeId = typeof node.id === 'string' ? node.id : String(node.id);
        const idSum = nodeId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const orbitSpeed = 0.00005 * (idSum % 5 + 1); // Varied speeds
        const orbitDirection = idSum % 2 === 0 ? 1 : -1; // Some clockwise, some counter-clockwise
        
        // Apply gentle orbital force
        node.vx = (node.vx || 0) + ny * orbitDirection * orbitSpeed * deltaTime;
        node.vy = (node.vy || 0) - nx * orbitDirection * orbitSpeed * deltaTime;
        
        // Add a small random movement
        node.vx += (Math.random() - 0.5) * 0.01;
        node.vy += (Math.random() - 0.5) * 0.01;
        
        // Dampen velocity for stability
        node.vx *= 0.99;
        node.vy *= 0.99;
        
        // Gravity toward center for very distant nodes
        const maxDistance = 300;
        if (distance > maxDistance) {
          const gravityFactor = 0.001 * (distance - maxDistance) / maxDistance;
          node.vx -= nx * gravityFactor;
          node.vy -= ny * gravityFactor;
        }
        
        return node;
      });
      
      // Neural impulse animation along links
      const updatedLinks = graphData.links.map((link: any) => {
        // Set impulse progress property if not exists
        if (!link.hasOwnProperty('__impulseProgress')) {
          link.__impulseProgress = Math.random(); // Start at random positions
          link.__impulseSpeed = 0.0005 + Math.random() * 0.001; // Varied speeds
          link.__impulseActive = Math.random() < 0.3; // Only some links active initially
        }
        
        // Update neural impulses
        if (link.__impulseActive) {
          link.__impulseProgress += link.__impulseSpeed * deltaTime;
          if (link.__impulseProgress > 1) {
            link.__impulseProgress = 0;
            // Randomly deactivate some impulses temporarily
            link.__impulseActive = Math.random() < 0.7;
            // If deactivated, set timeout to reactivate
            if (!link.__impulseActive) {
              setTimeout(() => {
                link.__impulseActive = true;
              }, 1000 + Math.random() * 5000);
            }
          }
        } else if (Math.random() < 0.001) {
          // Small chance to reactivate inactive impulses on each frame
          link.__impulseActive = true;
        }
        
        return link;
      });
      
      fgRef.current.graphData({
        nodes: updatedNodes,
        links: updatedLinks
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [data.nodes]);

  const nodeColor = useCallback((node: GraphNode) => {
    return highlightNodes.has(node.id) ? node.color : '#191933';
  }, [highlightNodes]);

  const linkColor = useCallback((link: GraphLink) => {
    return highlightLinks.has(link.source + link.target) ? '#60B5B5' : '#191933';
  }, [highlightLinks]);

  const linkDirectionalParticles = useCallback((link: GraphLink) => {
    return highlightLinks.has(link.source + link.target) ? 4 : 0;
  }, [highlightLinks]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeLabel="label"
        nodeVal="val"
        nodeColor={nodeColor}
        linkSource="source"
        linkTarget="target"
        linkColor={linkColor}
        linkDirectionalParticles={linkDirectionalParticles}
        linkDirectionalParticleWidth={1.5}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeMouseEnter}
        onNodeDrag={undefined}
        onNodeDragEnd={undefined}
        onBackgroundClick={handleNodeMouseLeave}
        backgroundColor="#0C0C1C"
        width={600}
        height={400}
      />
    </motion.div>
  );
};

export default SubbrainGraph;
