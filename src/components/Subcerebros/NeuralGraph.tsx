
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SubbrainGraph } from './SubbrainGraph';

interface NeuralGraphProps {
  onNodeClick: (node: any) => void;
  searchQuery?: string;
  filterType?: string;
  filterArea?: string;
  viewMode?: 'default' | 'progress' | 'focus';
  focusNodeId?: string;
}

export function NeuralGraph({ 
  onNodeClick, 
  searchQuery = '', 
  filterType = 'all',
  filterArea = 'all',
  viewMode = 'default',
  focusNodeId
}: NeuralGraphProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const [mockNodes, setMockNodes] = useState<any[]>([]);
  const [mockLinks, setMockLinks] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<{nodes: any[], links: any[]}>({ nodes: [], links: [] });
  
  // Generate enhanced mock data with better relevance and connections
  useEffect(() => {
    const generateMockData = () => {
      // Create Athena node (central hub)
      const athenaNode = {
        id: 'athena',
        label: 'Athena IA',
        type: 'athena',
        tags: ['assistente', 'ia', 'central', 'análise'],
        createdAt: '2023-12-10',
        lastAccess: '2024-05-15',
        relevancia: 10,
        connections: [],
        fx: 0,
        fy: 0
      };
      
      // Create enhanced subcérebro nodes with better data
      const subcerebroNodes = [
        {
          id: 'sub1',
          label: 'Subcérebro Pessoal',
          type: 'subcerebro',
          tags: ['pessoal', 'desenvolvimento', 'rotina', 'bem-estar'],
          area: 'pessoal',
          createdAt: '2024-01-05',
          lastAccess: '2024-05-14',
          relevancia: 9,
          connections: []
        },
        {
          id: 'sub2',
          label: 'Subcérebro Trabalho',
          type: 'subcerebro',
          tags: ['trabalho', 'projetos', 'reuniões', 'produtividade'],
          area: 'profissional',
          createdAt: '2024-01-10',
          lastAccess: '2024-05-15',
          relevancia: 10,
          connections: []
        },
        {
          id: 'sub3',
          label: 'Subcérebro Saúde',
          type: 'subcerebro',
          tags: ['saúde', 'exercícios', 'nutrição', 'mindfulness'],
          area: 'saude',
          createdAt: '2024-02-15',
          lastAccess: '2024-05-12',
          relevancia: 8,
          connections: []
        },
        {
          id: 'sub4',
          label: 'Subcérebro Criativo',
          type: 'subcerebro',
          tags: ['arte', 'escrita', 'ideias', 'inovação'],
          area: 'criatividade',
          createdAt: '2024-03-01',
          lastAccess: '2024-05-10',
          relevancia: 7,
          connections: []
        },
        {
          id: 'sub5',
          label: 'Subcérebro Finanças',
          type: 'subcerebro',
          tags: ['finanças', 'investimentos', 'orçamento', 'economia'],
          area: 'financas',
          createdAt: '2024-03-15',
          lastAccess: '2024-05-13',
          relevancia: 8,
          connections: []
        }
      ];
      
      // Create enhanced project nodes
      const projectNodes = [
        {
          id: 'proj1',
          label: 'Projeto Alpha - IA Pessoal',
          type: 'projeto',
          tags: ['desenvolvimento', 'software', 'inovação', 'ia'],
          area: 'profissional',
          createdAt: '2024-02-20',
          lastAccess: '2024-05-14',
          relevancia: 10,
          connections: []
        },
        {
          id: 'proj2',
          label: 'Estratégia Marketing 2024',
          type: 'projeto',
          tags: ['marketing', 'estratégia', 'análise', 'crescimento'],
          area: 'profissional',
          createdAt: '2024-03-15',
          lastAccess: '2024-05-13',
          relevancia: 8,
          connections: []
        },
        {
          id: 'proj3',
          label: 'Renovação Casa Inteligente',
          type: 'projeto',
          tags: ['decoração', 'tecnologia', 'design', 'automação'],
          area: 'pessoal',
          createdAt: '2024-04-01',
          lastAccess: '2024-05-10',
          relevancia: 6,
          connections: []
        },
        {
          id: 'proj4',
          label: 'Portfólio Investimentos',
          type: 'projeto',
          tags: ['finanças', 'investimentos', 'diversificação', 'renda'],
          area: 'financas',
          createdAt: '2024-04-10',
          lastAccess: '2024-05-12',
          relevancia: 9,
          connections: []
        }
      ];
      
      // Create enhanced habit nodes
      const habitNodes = [
        {
          id: 'hab1',
          label: 'Meditação Matinal',
          type: 'habito',
          tags: ['mindfulness', 'foco', 'manhã', 'bem-estar'],
          area: 'saude',
          createdAt: '2024-01-15',
          lastAccess: '2024-05-15',
          relevancia: 9,
          connections: []
        },
        {
          id: 'hab2',
          label: 'Leitura Técnica',
          type: 'habito',
          tags: ['conhecimento', 'tecnologia', 'aprendizado', 'noite'],
          area: 'educacao',
          createdAt: '2024-02-01',
          lastAccess: '2024-05-14',
          relevancia: 8,
          connections: []
        },
        {
          id: 'hab3',
          label: 'Treino Funcional',
          type: 'habito',
          tags: ['saúde', 'força', 'disciplina', 'energia'],
          area: 'saude',
          createdAt: '2024-02-10',
          lastAccess: '2024-05-13',
          relevancia: 9,
          connections: []
        },
        {
          id: 'hab4',
          label: 'Revisão Financeira',
          type: 'habito',
          tags: ['finanças', 'controle', 'análise', 'meta'],
          area: 'financas',
          createdAt: '2024-03-01',
          lastAccess: '2024-05-11',
          relevancia: 7,
          connections: []
        }
      ];
      
      // Create enhanced favorite nodes
      const favoriteNodes = [
        {
          id: 'fav1',
          label: 'Paper: Neural Networks 2024',
          type: 'favorito',
          tags: ['tecnologia', 'inovação', 'futuro', 'research'],
          area: 'educacao',
          createdAt: '2024-03-10',
          lastAccess: '2024-05-08',
          relevancia: 8,
          connections: []
        },
        {
          id: 'fav2',
          label: 'Podcast: Future of Work',
          type: 'favorito',
          tags: ['conhecimento', 'reflexão', 'tendências', 'carreira'],
          area: 'educacao',
          createdAt: '2024-04-05',
          lastAccess: '2024-05-12',
          relevancia: 6,
          connections: []
        },
        {
          id: 'fav3',
          label: 'Curso: Investment Strategy',
          type: 'favorito',
          tags: ['finanças', 'educação', 'investimentos', 'estratégia'],
          area: 'financas',
          createdAt: '2024-04-15',
          lastAccess: '2024-05-09',
          relevancia: 7,
          connections: []
        }
      ];
      
      // Create enhanced thought nodes
      const thoughtNodes = [
        {
          id: 'pens1',
          label: 'Ideia: App Mindfulness + IA',
          type: 'pensamento',
          tags: ['criatividade', 'inovação', 'solução', 'mindfulness'],
          area: 'criatividade',
          createdAt: '2024-04-20',
          lastAccess: '2024-05-11',
          relevancia: 8,
          connections: []
        },
        {
          id: 'pens2',
          label: 'Reflexão: Work-Life Balance',
          type: 'pensamento',
          tags: ['eficiência', 'tempo', 'equilíbrio', 'bem-estar'],
          area: 'pessoal',
          createdAt: '2024-05-01',
          lastAccess: '2024-05-14',
          relevancia: 7,
          connections: []
        },
        {
          id: 'pens3',
          label: 'Insight: Diversificação de Renda',
          type: 'pensamento',
          tags: ['finanças', 'estratégia', 'oportunidade', 'renda'],
          area: 'financas',
          createdAt: '2024-05-05',
          lastAccess: '2024-05-13',
          relevancia: 9,
          connections: []
        }
      ];
      
      // Combine all nodes
      const allNodes = [
        athenaNode,
        ...subcerebroNodes,
        ...projectNodes,
        ...habitNodes,
        ...favoriteNodes,
        ...thoughtNodes
      ];
      
      // Create enhanced links with better connectivity patterns
      const links = [
        // All nodes to Athena (central hub)
        ...allNodes.filter(node => node.id !== 'athena').map(node => ({
          source: 'athena',
          target: node.id
        })),
        
        // Subcérebro to projects (logical connections)
        { source: 'sub1', target: 'proj3' }, // Pessoal -> Casa
        { source: 'sub2', target: 'proj1' }, // Trabalho -> IA
        { source: 'sub2', target: 'proj2' }, // Trabalho -> Marketing
        { source: 'sub5', target: 'proj4' }, // Finanças -> Investimentos
        
        // Subcérebro to habits (area-based connections)
        { source: 'sub1', target: 'hab2' }, // Pessoal -> Leitura
        { source: 'sub3', target: 'hab1' }, // Saúde -> Meditação
        { source: 'sub3', target: 'hab3' }, // Saúde -> Treino
        { source: 'sub5', target: 'hab4' }, // Finanças -> Revisão
        
        // Subcérebro to favorites
        { source: 'sub4', target: 'fav1' }, // Criativo -> Paper IA
        { source: 'sub2', target: 'fav2' }, // Trabalho -> Podcast
        { source: 'sub5', target: 'fav3' }, // Finanças -> Curso
        
        // Projects to thoughts (innovation connections)
        { source: 'proj1', target: 'pens1' }, // IA -> Mindfulness App
        { source: 'proj3', target: 'pens2' }, // Casa -> Work-Life
        { source: 'proj4', target: 'pens3' }, // Investimentos -> Diversificação
        
        // Cross-connections (interesting relationships)
        { source: 'hab1', target: 'pens1' }, // Meditação -> App Mindfulness
        { source: 'hab1', target: 'pens2' }, // Meditação -> Work-Life
        { source: 'fav1', target: 'proj1' }, // Paper IA -> Projeto IA
        { source: 'hab3', target: 'proj3' }, // Treino -> Casa (gym setup)
        { source: 'fav3', target: 'hab4' }, // Curso -> Revisão Financeira
        { source: 'hab2', target: 'fav1' }, // Leitura -> Paper IA
        
        // Subcérebro interconnections
        { source: 'sub1', target: 'sub3' }, // Pessoal <-> Saúde
        { source: 'sub2', target: 'sub4' }, // Trabalho <-> Criativo
        { source: 'sub3', target: 'sub4' }, // Saúde <-> Criativo (mindfulness)
        { source: 'sub1', target: 'sub5' }, // Pessoal <-> Finanças
      ];
      
      // Update connections property for each node
      allNodes.forEach(node => {
        const nodeConnections = links
          .filter(link => link.source === node.id || link.target === node.id)
          .map(link => {
            const connectedId = link.source === node.id ? link.target : link.source;
            const connectedNode = allNodes.find(n => n.id === connectedId);
            return connectedNode ? {
              id: connectedNode.id,
              label: connectedNode.label,
              type: connectedNode.type
            } : null;
          })
          .filter(conn => conn !== null);
        
        node.connections = nodeConnections;
      });
      
      return { nodes: allNodes, links };
    };
    
    const mockData = generateMockData();
    setMockNodes(mockData.nodes);
    setMockLinks(mockData.links);
  }, []);
  
  // Enhanced filtering with better logic
  useEffect(() => {
    if (mockNodes.length === 0) return;
    
    let filteredNodes = [...mockNodes];
    
    // Apply search filter with better matching
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.label.toLowerCase().includes(lowerCaseQuery) || 
        node.tags?.some((tag: string) => tag.toLowerCase().includes(lowerCaseQuery)) ||
        node.type.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply type filter
    if (filterType && filterType !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.type === filterType);
    }
    
    // Apply area filter
    if (filterArea && filterArea !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.area === filterArea);
    }
    
    // Focus mode: if focusing on specific node, include it and its connections
    if (viewMode === 'focus' && focusNodeId) {
      const focusNode = mockNodes.find(node => node.id === focusNodeId);
      if (focusNode) {
        const connectedNodeIds = new Set([focusNodeId]);
        
        // Add direct connections
        mockLinks.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (sourceId === focusNodeId) connectedNodeIds.add(targetId);
          if (targetId === focusNodeId) connectedNodeIds.add(sourceId);
        });
        
        filteredNodes = mockNodes.filter(node => connectedNodeIds.has(node.id));
      }
    }
    
    // Progress mode: enhance relevance based on recent activity
    if (viewMode === 'progress') {
      filteredNodes = filteredNodes.map(node => ({
        ...node,
        relevancia: calculateProgressRelevance(node)
      }));
    }
    
    // Filter links to only include connections between visible nodes
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = mockLinks.filter(
      link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      }
    );
    
    // Always include Athena node if not already included and not in focus mode
    if (viewMode !== 'focus' && !nodeIds.has('athena')) {
      const athenaNode = mockNodes.find(node => node.id === 'athena');
      if (athenaNode) {
        filteredNodes.push(athenaNode);
      }
    }
    
    setFilteredData({ nodes: filteredNodes, links: filteredLinks });
  }, [mockNodes, mockLinks, searchQuery, filterType, filterArea, viewMode, focusNodeId]);
  
  // Calculate progress-based relevance
  const calculateProgressRelevance = (node: any) => {
    const baseRelevance = node.relevancia || 5;
    const lastAccessDate = new Date(node.lastAccess || '2024-01-01');
    const daysSinceAccess = Math.floor((Date.now() - lastAccessDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Recent activity boosts relevance
    if (daysSinceAccess <= 1) return Math.min(10, baseRelevance + 2);
    if (daysSinceAccess <= 7) return Math.min(10, baseRelevance + 1);
    if (daysSinceAccess > 30) return Math.max(1, baseRelevance - 1);
    
    return baseRelevance;
  };
  
  // Prepare the graph data
  const graphData = {
    nodes: filteredData.nodes,
    links: filteredData.links
  };
  
  // Enhanced no data view
  if (filteredData.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="bg-card/30 p-8 rounded-lg border border-card/50 backdrop-blur-sm">
            <div className="text-primary text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum nó encontrado</h3>
            <p className="text-foreground/70 mb-4">
              Não encontramos nenhum subcérebro ou entidade que corresponda aos seus filtros atuais.
            </p>
            <p className="text-xs text-foreground/50 mb-4">
              Tente ajustar os filtros ou criar um novo subcérebro para começar a mapear sua consciência digital.
            </p>
            <div className="text-xs text-primary/60 italic">
              "Cada subcérebro é uma constelação da sua consciência digital."
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={graphRef} className="w-full h-full">
      <SubbrainGraph 
        graphData={graphData}
        onNodeClick={onNodeClick}
      />
    </div>
  );
}
