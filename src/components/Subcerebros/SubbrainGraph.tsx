
import React, { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3";
import { motion } from "framer-motion";

interface GraphNode {
  id: string;
  label: string;
  type: "athena" | "subcerebro" | "projeto" | "habito" | "favorito" | "pensamento";
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function SubbrainGraph() {
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink>>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 0.85,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize data
  useEffect(() => {
    const nodes: GraphNode[] = [
      { id: "athena", label: "Athena IA", type: "athena", fx: 0, fy: 0 },
      { id: "sub1", label: "Subcérebro Pessoal", type: "subcerebro" },
      { id: "sub2", label: "Subcérebro Trabalho", type: "subcerebro" },
      { id: "proj1", label: "Projeto Alpha", type: "projeto" },
      { id: "proj2", label: "Projeto Beta", type: "projeto" },
      { id: "hab1", label: "Meditação", type: "habito" },
      { id: "hab2", label: "Leitura", type: "habito" },
      { id: "fav1", label: "Podcast X", type: "favorito" },
      { id: "fav2", label: "Artigo Y", type: "favorito" },
      { id: "pens1", label: "Insight A", type: "pensamento" },
      { id: "pens2", label: "Insight B", type: "pensamento" },
    ];
    
    const links: GraphLink[] = [
      { source: "athena", target: "sub1" },
      { source: "athena", target: "sub2" },
      { source: "sub1", target: "proj1" },
      { source: "sub1", target: "hab1" },
      { source: "sub2", target: "proj2" },
      { source: "sub2", target: "hab2" },
      { source: "proj1", target: "fav1" },
      { source: "proj2", target: "fav2" },
      { source: "hab1", target: "pens1" },
      { source: "hab2", target: "pens2" },
    ];
    
    setGraphData({ nodes, links });
  }, []);

  // Configure physics after graph initialization
  useEffect(() => {
    if (graphRef.current) {
      // Adjust forces for Obsidian-like behavior
      graphRef.current.d3Force('charge')?.strength(-180);
      graphRef.current.d3Force('link')?.distance(120).strength(0.8);
      graphRef.current.d3Force('center')?.strength(0.08);
      
      // Add collision force to prevent node overlap
      graphRef.current.d3Force('collide', d3.forceCollide().radius(30));

      // Initial zoom after 1 second to ensure graph is settled
      setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(400, 50);
        }
      }, 1000);
    }
  }, [graphData]);

  const getNodeColor = (type: string): string => {
    const colors: Record<string, string> = {
      athena: "#9f7aea",
      subcerebro: "#ed64a6",
      projeto: "#63b3ed",
      habito: "#68d391",
      favorito: "#f6e05e",
      pensamento: "#cbd5e0",
    };
    return colors[type] || "#cbd5e0";
  };

  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const nodeColor = getNodeColor(node.type);
    const radius = node.type === "athena" ? 12 : 8;
    
    // Draw node background glow (Obsidian-like effect)
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, radius + 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(${hexToRgb(nodeColor)}, 0.2)`;
    ctx.fill();
    
    // Draw main node
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor;
    ctx.shadowBlur = 10;
    ctx.shadowColor = nodeColor;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw label with a scale-dependent font size
    const fontSize = 10 / (globalScale * 1.2);
    if (globalScale > 0.5 || node === hoveredNode) {
      ctx.font = `${fontSize}px Inter`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      
      // Background for text (improved readability)
      const textWidth = ctx.measureText(node.label).width;
      ctx.fillStyle = "rgba(12, 12, 28, 0.7)";
      ctx.fillRect(
        (node.x || 0) - textWidth / 2 - 2,
        (node.y || 0) + radius + 2,
        textWidth + 4,
        fontSize + 2
      );
      
      // Draw text
      ctx.fillStyle = "#fff";
      ctx.fillText(node.label, node.x || 0, (node.y || 0) + radius + 2);
    }
  }, [hoveredNode]);

  const handleNodeHover = (node: GraphNode | null) => {
    setHoveredNode(node);
    document.body.style.cursor = node ? "pointer" : "default";
  };

  const handleNodeClick = (node: GraphNode) => {
    console.log("Node clicked:", node);
    
    // Visual feedback (zoom to node)
    if (graphRef.current) {
      const distance = 200;
      const distRatio = 1 + distance/Math.hypot(node.x || 0, node.y || 0);
      
      graphRef.current.centerAt(
        node.x, 
        node.y, 
        1000
      );
      graphRef.current.zoom(2.5, 1000);
    }
  };

  // Helper function to convert hex to rgb for glow effects
  const hexToRgb = (hex: string): string => {
    // Remove # if present
    hex = hex.replace("#", "");
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };

  return (
    <div className="w-full h-full bg-[#0c0c1c]">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        nodeRelSize={6}
        backgroundColor="#0c0c1c"
        linkColor={() => "rgba(255,255,255,0.2)"}
        linkWidth={1.5}
        linkDirectionalParticles={3}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.003}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400, 50);
          }
        }}
      />
    </div>
  );
}
