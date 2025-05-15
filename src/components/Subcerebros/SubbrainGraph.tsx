import React, { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define TypeScript interfaces for our data
interface GraphNode {
  id: string;
  label: string;
  type: "athena" | "subcerebro" | "projeto" | "habito" | "favorito" | "pensamento";
  tags?: string[];
  createdAt?: string;
  lastAccess?: string;
  relevancia?: number;
  connections?: any[];
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface SubbrainGraphProps {
  onNodeClick: (node: GraphNode) => void;
  searchQuery: string;
  filterType: string;
  filterArea?: string;
}

export function SubbrainGraph({ onNodeClick, searchQuery, filterType, filterArea = 'all' }: SubbrainGraphProps) {
  const graphRef = useRef<any>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  
  // Convert mock data to graph format
  useEffect(() => {
    // Start with Athena as central node
    const nodes: GraphNode[] = [
      { 
        id: "athena", 
        label: "Athena IA", 
        type: "athena" as const, 
        tags: ["inteligência artificial", "assistente", "central"],
        createdAt: "01/01/2025",
        lastAccess: "15/05/2025",
        relevancia: 10,
        connections: []
      }
    ];
    
    const links: GraphLink[] = [];
    
    // Add nodes from mock data
    mockNodes.forEach(node => {
      // Only add node if it passes the filters
      if ((filterType === 'all' || node.type === filterType) && 
          (!searchQuery || 
           node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
           node.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) {
        
        // Add node
        nodes.push({
          id: String(node.id),
          label: node.label,
          type: node.type,
          tags: node.tags,
          createdAt: node.createdAt,
          lastAccess: node.lastAccess,
          relevancia: node.relevancia,
          connections: node.connections
        });
        
        // If node is a subcerebro, connect it to Athena
        if (node.type === "subcerebro") {
          links.push({
            source: "athena",
            target: String(node.id),
            value: 3 // stronger connection
          });
        }
        
        // Add links based on connections
        if (node.connections) {
          node.connections.forEach(conn => {
            // Only add link if target node also passed filters
            if ((filterType === 'all' || conn.type === filterType) &&
                (!searchQuery || 
                conn.label.toLowerCase().includes(searchQuery.toLowerCase()))) {
              links.push({
                source: String(node.id),
                target: String(conn.id),
                value: 1
              });
            }
          });
        }
      }
    });
    
    setGraphData({ nodes, links });
  }, [searchQuery, filterType, filterArea]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Node canvas object for custom rendering
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y } = node;
    const label = node.label;
    const isHovered = hoveredNode && hoveredNode.id === node.id;
    const isAthena = node.type === "athena";
    
    // Node size based on type and relevance
    const NODE_R = node.type === "subcerebro" ? 15 : 
                  node.type === "athena" ? 20 : 
                  ((node.relevancia || 5) / 10) * 12 + 8;
    
    // Get node color based on type
    const color = getNodeColor(node.type);
    
    // Glow effect
    const shadowBlur = isHovered ? 15 : 10;
    const glowOpacity = isHovered ? 0.8 : node.type === "athena" ? 0.7 : 0.4;
    const glowColor = `${color}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`;
    
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = shadowBlur;
    
    // Draw main circle
    ctx.beginPath();
    ctx.arc(x, y, NODE_R, 0, 2 * Math.PI);
    ctx.fillStyle = node.type === "athena" ? 
                    `rgba(153, 56, 135, ${isHovered ? 0.9 : 0.7})` : 
                    `${color}${isHovered ? "D9" : "99"}`;
    ctx.fill();
    
    // Inner circle for visual detail
    if (node.type === "subcerebro" || node.type === "athena") {
      ctx.beginPath();
      ctx.arc(x, y, NODE_R * 0.7, 0, 2 * Math.PI);
      ctx.fillStyle = `${color}40`;
      ctx.fill();
    }
    
    // Reset shadow to avoid affecting text
    ctx.shadowBlur = 0;
    
    // Draw label if node is hovered or is Athena
    if (isHovered || isAthena || node.type === "subcerebro" || globalScale > 1.2) {
      const fontSize = isAthena ? 5 : isHovered ? 4 : 3.5;
      ctx.font = `${fontSize}px Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      
      // Background for text readability
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        x - textWidth / 2 - 2,
        y + NODE_R + 2,
        textWidth + 4,
        fontSize + 4
      );
      
      // Draw text
      ctx.fillStyle = 'white';
      ctx.fillText(label, x, y + NODE_R + fontSize / 2 + 4);
    }
  }, [hoveredNode]);

  // Link canvas object for custom rendering
  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    // Get source and target node positions
    const START = link.source;
    const END = link.target;
    
    // Skip rendering if positions are not yet available
    if (!START || !END || typeof START.x !== 'number' || typeof END.x !== 'number') return;

    // Determine if link should be highlighted
    const sourceId = typeof START === 'object' ? START.id : START;
    const targetId = typeof END === 'object' ? END.id : END;
    
    const isHighlighted = highlightLinks.has(`${sourceId}-${targetId}`) || 
                          highlightLinks.has(`${targetId}-${sourceId}`);
                          
    // Calculate link length for potential length-based styling
    const dx = END.x - START.x;
    const dy = END.y - START.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Link styling
    const sourceColor = getNodeColor(START.type);
    const targetColor = getNodeColor(END.type);
    
    // Create gradient for the link based on source and target node types
    const gradient = ctx.createLinearGradient(START.x, START.y, END.x, END.y);
    gradient.addColorStop(0, sourceColor);
    gradient.addColorStop(1, targetColor);
    
    // Get current time for animation
    const time = Date.now();
    
    // Determine line width based on link value and highlight state
    const lineWidth = isHighlighted ? 2.5 : 
                     link.source.type === "athena" || link.target.type === "athena" ? 2 : 
                     1.5;
    
    // Draw base line
    ctx.beginPath();
    ctx.moveTo(START.x, START.y);
    ctx.lineTo(END.x, END.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Add animated pulse effect along the line
    if (isHighlighted || link.source.type === "athena" || link.target.type === "athena") {
      const numPulses = Math.ceil(length / 50);
      
      for (let i = 0; i < numPulses; i++) {
        // Calculate pulse position along the line
        const offset = ((time / 1000) + i / numPulses) % 1;
        const pulseX = START.x + dx * offset;
        const pulseY = START.y + dy * offset;
        
        // Pulse size oscillates with time
        const pulseSize = 2 + Math.sin(time / 300 + i) * 1;
        
        // Draw pulse
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, pulseSize, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  }, [highlightLinks]);

  // Handle mouse hover over node
  const handleNodeHover = useCallback((node: any) => {
    if (node) {
      // Update tooltip position dynamically using DOM ref from graph
      const graphElem = graphRef.current?._d3Zoom?.owner?.__zoom?.subject();
      if (graphElem) {
        const containerRect = graphElem.getBoundingClientRect();
        const x = containerRect.left + graphElem.__zoom.x + node.x! * graphElem.__zoom.k;
        const y = containerRect.top + graphElem.__zoom.y + node.y! * graphElem.__zoom.k;
        setTooltipPos({ x, y });
      }
      
      // Highlight connected nodes and links
      const newHighlightNodes = new Set<string>([node.id]);
      const newHighlightLinks = new Set<string>();
      
      // Find connections in links data
      graphData.links.forEach(link => {
        const { source, target } = link;
        const sourceId = typeof source === 'object' ? source.id : source;
        const targetId = typeof target === 'object' ? target.id : target;
        
        if (sourceId === node.id) {
          newHighlightNodes.add(targetId);
          newHighlightLinks.add(`${sourceId}-${targetId}`);
        }
        if (targetId === node.id) {
          newHighlightNodes.add(sourceId);
          newHighlightLinks.add(`${sourceId}-${targetId}`);
        }
      });
      
      setHighlightNodes(newHighlightNodes);
      setHighlightLinks(newHighlightLinks);
    } else {
      // Clear highlights when not hovering any node
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
    }
    
    setHoveredNode(node);
  }, [graphData]);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.type === "athena") {
      toast({
        title: "Athena IA",
        description: "Ativando análise completa do seu CÓRTEX...",
        duration: 3000,
      });
      // Additional Athena-specific logic could be implemented here
    } else {
      onNodeClick(node);
    }
    
    // Center view on clicked node with animation
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2.5, 2000);
    }
  }, [onNodeClick]);

  // Calculate optimal container dimensions
  // We leave some margin for the UI elements
  const containerWidth = dimensions.width;
  const containerHeight = dimensions.height * 0.85; 

  return (
    <div className="relative w-full h-full">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={containerWidth}
        height={containerHeight}
        backgroundColor="#0C0C1C"
        nodeRelSize={6}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.005}
        nodeLabel={null} // We'll use our custom tooltip instead
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        forceEngine="d3"
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTime={2000}
        d3Force={
          // Configure the force simulation
          ("charge" as any, (node: any) => 
            node.type === "subcerebro" ? -250 : 
            node.type === "athena" ? -350 : -180
          )
        }
        linkDistance={120}
        nodeAutoColorBy="type"
        enablePointerInteraction={true}
        onEngineStop={() => {
          console.log("Force graph simulation has converged");
        }}
      />

      {/* Custom tooltip on hover */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed text-sm bg-card/90 border border-card rounded-md shadow-lg p-3 z-10 backdrop-blur-md max-w-[250px]"
          style={{ 
            left: `${tooltipPos.x + 10}px`, 
            top: `${tooltipPos.y + 10}px`,
            pointerEvents: "none" // This prevents the tooltip from blocking mouse events
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: getNodeColor(hoveredNode.type) }}
            />
            <span className="font-medium">{hoveredNode.label}</span>
          </div>
          <p className="text-xs text-foreground/70 mt-1 capitalize">
            {formatNodeType(hoveredNode.type)}
          </p>
          {hoveredNode.lastAccess && (
            <p className="text-xs text-foreground/70">
              Último acesso: {hoveredNode.lastAccess}
            </p>
          )}
          {hoveredNode.connections && (
            <p className="text-xs text-foreground/70">
              {hoveredNode.connections.length} conexões
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Helper functions
function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    athena: "#8B5CF6",     // Bright purple
    subcerebro: "#993887", // Purple (secondary)
    projeto: "#60B5B5",    // Blue (primary)
    habito: "#34D399",     // Green
    favorito: "#FBBF24",   // Yellow
    pensamento: "#D1D5DB"  // Light gray
  };
  
  return colors[type] || "#9CA3AF";
}

function formatNodeType(type: string): string {
  const types: Record<string, string> = {
    athena: "Inteligência Artificial",
    subcerebro: "Subcérebro",
    projeto: "Projeto",
    habito: "Hábito",
    favorito: "Favorito",
    pensamento: "Pensamento"
  };
  
  return types[type] || "Desconhecido";
}

// Mock data for visualization
const mockNodes = [
  { 
    id: 1, 
    label: "Cérebro Principal", 
    type: "subcerebro" as const, 
    tags: ["central", "core", "hub"], 
    createdAt: "15/05/2025", 
    lastAccess: "15/05/2025", 
    relevancia: 10,
    connections: [
      { id: 2, label: "Projeto Alpha", type: "projeto" as const },
      { id: 3, label: "Hábito de Meditação", type: "habito" as const },
      { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" as const },
      { id: 10, label: "Ideias de Negócio", type: "subcerebro" as const },
      { id: 12, label: "Criação de Conteúdo", type: "subcerebro" as const }
    ]
  },
  { 
    id: 2, 
    label: "Projeto Alpha", 
    type: "projeto" as const, 
    tags: ["trabalho", "prioridade", "inovação"], 
    createdAt: "10/05/2025", 
    lastAccess: "14/05/2025", 
    relevancia: 8,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" as const },
      { id: 4, label: "Artigo sobre IA", type: "favorito" as const },
      { id: 11, label: "Cronograma do Projeto", type: "pensamento" as const }
    ]
  },
  { 
    id: 3, 
    label: "Hábito de Meditação", 
    type: "habito" as const, 
    tags: ["saúde", "foco", "mindfulness", "diário"], 
    createdAt: "05/05/2025", 
    lastAccess: "15/05/2025",
    relevancia: 7,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" as const },
      { id: 5, label: "Insight sobre paz mental", type: "pensamento" as const },
      { id: 9, label: "Curso de Meditação", type: "favorito" as const }
    ]
  },
  { 
    id: 4, 
    label: "Artigo sobre IA", 
    type: "favorito" as const, 
    tags: ["tecnologia", "aprendizado", "pesquisa", "data science"], 
    createdAt: "12/05/2025", 
    lastAccess: "13/05/2025", 
    relevancia: 6,
    connections: [
      { id: 2, label: "Projeto Alpha", type: "projeto" as const },
      { id: 10, label: "Ideias de Negócio", type: "subcerebro" as const }
    ]
  },
  { 
    id: 5, 
    label: "Insight sobre paz mental", 
    type: "pensamento" as const, 
    tags: ["reflexão", "bem-estar", "consciência"], 
    createdAt: "14/05/2025", 
    lastAccess: "14/05/2025", 
    relevancia: 5,
    connections: [
      { id: 3, label: "Hábito de Meditação", type: "habito" as const }
    ]
  },
  { 
    id: 6, 
    label: "Desenvolvimento Pessoal", 
    type: "subcerebro" as const, 
    tags: ["crescimento", "evolução", "aprendizado", "mindset"], 
    createdAt: "01/05/2025", 
    lastAccess: "10/05/2025", 
    relevancia: 9,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" as const },
      { id: 7, label: "Livro Atomic Habits", type: "favorito" as const },
      { id: 8, label: "Hábito de Leitura", type: "habito" as const }
    ]
  },
  { 
    id: 7, 
    label: "Livro Atomic Habits", 
    type: "favorito" as const, 
    tags: ["leitura", "produtividade", "hábitos", "comportamento"], 
    createdAt: "02/05/2025", 
    lastAccess: "09/05/2025", 
    relevancia: 7,
    connections: [
      { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" as const },
      { id: 8, label: "Hábito de Leitura", type: "habito" as const }
    ]
  },
  { 
    id: 8, 
    label: "Hábito de Leitura", 
    type: "habito" as const, 
    tags: ["conhecimento", "rotina", "livros", "diário"], 
    createdAt: "03/05/2025", 
    lastAccess: "15/05/2025", 
    relevancia: 6,
    connections: [
      { id: 6, label: "Desenvolvimento Pessoal", type: "subcerebro" as const },
      { id: 7, label: "Livro Atomic Habits", type: "favorito" as const }
    ]
  },
  { 
    id: 9, 
    label: "Curso de Meditação", 
    type: "favorito" as const, 
    tags: ["mindfulness", "curso", "saúde mental"], 
    createdAt: "05/05/2025", 
    lastAccess: "12/05/2025", 
    relevancia: 5,
    connections: [
      { id: 3, label: "Hábito de Meditação", type: "habito" as const }
    ]
  },
  { 
    id: 10, 
    label: "Ideias de Negócio", 
    type: "subcerebro" as const, 
    tags: ["empreendedorismo", "inovação", "projetos"], 
    createdAt: "08/05/2025", 
    lastAccess: "11/05/2025", 
    relevancia: 8,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" as const },
      { id: 4, label: "Artigo sobre IA", type: "favorito" as const },
      { id: 11, label: "Cronograma do Projeto", type: "pensamento" as const }
    ]
  },
  { 
    id: 11, 
    label: "Cronograma do Projeto", 
    type: "pensamento" as const, 
    tags: ["organização", "tempo", "planejamento"], 
    createdAt: "09/05/2025", 
    lastAccess: "14/05/2025", 
    relevancia: 7,
    connections: [
      { id: 2, label: "Projeto Alpha", type: "projeto" as const },
      { id: 10, label: "Ideias de Negócio", type: "subcerebro" as const }
    ]
  },
  { 
    id: 12, 
    label: "Criação de Conteúdo", 
    type: "subcerebro" as const, 
    tags: ["marketing", "mídias sociais", "comunicação"], 
    createdAt: "07/05/2025", 
    lastAccess: "13/05/2025", 
    relevancia: 6,
    connections: [
      { id: 1, label: "Cérebro Principal", type: "subcerebro" as const }
    ]
  }
];
