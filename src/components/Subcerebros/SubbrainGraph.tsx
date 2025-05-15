
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';

interface GraphNode {
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
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  impulse?: number;
}

export interface SubbrainGraphProps {
  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  onNodeClick: (node: any) => void;
}

const SubbrainGraph: React.FC<SubbrainGraphProps> = ({ graphData, onNodeClick }) => {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodePositions, setNodePositions] = useState<Map<string, {x: number, y: number}>>(new Map());
  const [impulses, setImpulses] = useState<Map<string, number>>(new Map());
  
  // Get color based on node type
  const getNodeColor = (node: GraphNode) => {
    switch (node.type) {
      case 'athena':
        return '#9b87f5';
      case 'subcerebro':
        return '#8B5CF6';
      case 'projeto':
        return '#0EA5E9';
      case 'habito':
        return '#10B981';
      case 'favorito':
        return '#F59E0B';
      case 'pensamento':
        return '#EC4899';
      default:
        return '#9b87f5';
    }
  };
  
  // Generate random impulses along links
  useEffect(() => {
    const interval = setInterval(() => {
      if (graphData.links.length === 0) return;
      
      // Randomly select a link to activate
      const randomIndex = Math.floor(Math.random() * graphData.links.length);
      const randomLink = graphData.links[randomIndex];
      const linkId = `${randomLink.source}-${randomLink.target}`;
      
      setImpulses(prev => {
        const newImpulses = new Map(prev);
        newImpulses.set(linkId, 1); // Start impulse at full strength
        return newImpulses;
      });
      
      // Fade out impulse over time
      setTimeout(() => {
        setImpulses(prev => {
          const newImpulses = new Map(prev);
          newImpulses.delete(linkId);
          return newImpulses;
        });
      }, 2000); // 2 seconds to complete animation
    }, 800); // Create new impulse every 800ms
    
    return () => clearInterval(interval);
  }, [graphData.links]);
  
  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight || 600
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Fit the graph after it's loaded
  const handleEngineStop = useCallback(() => {
    if (fgRef.current && graphData.nodes.length) {
      // Using the direct method without accessing graphData property
      fgRef.current.zoomToFit(400, 40);
    }
  }, [graphData.nodes.length]);
  
  // Animated node movement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Wait for graph to initialize
    setTimeout(() => {
      const moveNodes = () => {
        if (!fgRef.current) return;
        
        // Using forceEngine methods directly
        fgRef.current.d3Force('collide', null);
        fgRef.current.d3Force('charge').strength(-60);
        
        graphData.nodes.forEach(node => {
          if (node.id === 'athena') return; // Keep central node fixed
          
          // Create gentle random movement
          const xMove = (Math.random() - 0.5) * 0.1;
          const yMove = (Math.random() - 0.5) * 0.1;
          
          if (node.x !== undefined && node.y !== undefined) {
            node.x += xMove;
            node.y += yMove;
          }
        });
        
        fgRef.current.refresh();
      };
      
      interval = setInterval(moveNodes, 100);
    }, 2000);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [graphData.nodes]);
  
  return (
    <div id="graph-container" className="w-full h-full">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={getNodeColor}
        nodeRelSize={8}
        nodeVal={(node) => (node as GraphNode).relevancia || 1}
        linkWidth={(link) => {
          const linkId = `${link.source}-${link.target}`;
          return impulses.has(linkId) ? 2 : 1;
        }}
        linkColor={(link) => {
          const linkId = `${link.source}-${link.target}`;
          return impulses.has(linkId) ? '#9b87f5' : 'rgba(155, 135, 245, 0.3)';
        }}
        onNodeClick={onNodeClick}
        onEngineStop={handleEngineStop}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default SubbrainGraph;
