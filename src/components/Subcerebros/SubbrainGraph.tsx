import React, { useCallback, useEffect, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { forceCollide } from 'd3-force';
import { motion } from 'framer-motion';

// Aqui vamos corrigir os erros TS2554 adicionando argumentos corretos nas chamadas de função

interface GraphNode {
  id: string;
  label: string;
  color: string;
  val: number;
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
}

const SubbrainGraph: React.FC<SubbrainGraphProps> = ({ nodes, links, onNodeClick }) => {
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());

  const handleNodeClick = useCallback((node: GraphNode) => {
    onNodeClick(node);
  }, [onNodeClick]);

  const handleNodeMouseEnter = useCallback((node: GraphNode) => {
    const newHighlightNodes = new Set<string>();
    const newHighlightLinks = new Set<string>();

    links.forEach(link => {
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
  }, [links]);

  const handleNodeMouseLeave = useCallback(() => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('collide', forceCollide(30)); // Adicionar o valor do raio como argumento
      fgRef.current.zoomToFit(400); // Adicionar o valor da duração como argumento
    }
  }, [nodes, links]);

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
        graphData={{ nodes, links }}
        nodeLabel="label"
        nodeVal="val"
        nodeColor={nodeColor}
        linkSourceProp="source"
        linkTargetProp="target"
        linkColor={linkColor}
        linkDirectionalParticles={linkDirectionalParticles}
        linkDirectionalParticleWidth={1.5}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        backgroundColor="#0C0C1C"
        width={600}
        height={400}
      />
    </motion.div>
  );
};

export default SubbrainGraph;
