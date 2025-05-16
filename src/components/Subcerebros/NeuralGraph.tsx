
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SubbrainGraph } from './SubbrainGraph';

interface NeuralGraphProps {
  onNodeClick: (node: any) => void;
  searchQuery?: string;
  filterType?: string;
  filterArea?: string;
  showMiniMap?: boolean;
}

export function NeuralGraph({ 
  onNodeClick, 
  searchQuery = '', 
  filterType = 'all',
  filterArea = 'all',
  showMiniMap = true
}: NeuralGraphProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const [mockNodes, setMockNodes] = useState<any[]>([]);
  const [mockLinks, setMockLinks] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<{nodes: any[], links: any[]}>({ nodes: [], links: [] });
  
  // Generate mock data on component mount
  useEffect(() => {
    const generateMockData = () => {
      // Create Athena node (central)
      const athenaNode = {
        id: 'athena',
        label: 'Athena IA',
        type: 'athena',
        tags: ['assistente', 'ia', 'central'],
        createdAt: '2023-12-10',
        lastAccess: '2024-05-15',
        relevancia: 10,
        connections: [],
        fx: 0,
        fy: 0
      };
      
      // Create subcerebrp nodes
      const subcerebroNodes = [
        {
          id: 'sub1',
          label: 'Subcérebro Pessoal',
          type: 'subcerebro',
          tags: ['pessoal', 'desenvolvimento', 'rotina'],
          area: 'pessoal',
          createdAt: '2024-01-05',
          lastAccess: '2024-05-14',
          relevancia: 8,
          connections: []
        },
        {
          id: 'sub2',
          label: 'Subcérebro Trabalho',
          type: 'subcerebro',
          tags: ['trabalho', 'projetos', 'reuniões'],
          area: 'profissional',
          createdAt: '2024-01-10',
          lastAccess: '2024-05-15',
          relevancia: 9,
          connections: []
        },
        {
          id: 'sub3',
          label: 'Subcérebro Saúde',
          type: 'subcerebro',
          tags: ['saúde', 'exercícios', 'nutrição'],
          area: 'saude',
          createdAt: '2024-02-15',
          lastAccess: '2024-05-12',
          relevancia: 7,
          connections: []
        },
        {
          id: 'sub4',
          label: 'Subcérebro Criativo',
          type: 'subcerebro',
          tags: ['arte', 'escrita', 'ideias'],
          area: 'criatividade',
          createdAt: '2024-03-01',
          lastAccess: '2024-05-10',
          relevancia: 6,
          connections: []
        }
      ];
      
      // Create project nodes
      const projectNodes = [
        {
          id: 'proj1',
          label: 'Projeto Alpha',
          type: 'projeto',
          tags: ['desenvolvimento', 'software', 'inovação'],
          area: 'profissional',
          createdAt: '2024-02-20',
          lastAccess: '2024-05-14',
          relevancia: 9,
          connections: []
        },
        {
          id: 'proj2',
          label: 'Projeto Beta',
          type: 'projeto',
          tags: ['marketing', 'estratégia', 'análise'],
          area: 'profissional',
          createdAt: '2024-03-15',
          lastAccess: '2024-05-13',
          relevancia: 7,
          connections: []
        },
        {
          id: 'proj3',
          label: 'Remodelação Casa',
          type: 'projeto',
          tags: ['decoração', 'obras', 'design'],
          area: 'pessoal',
          createdAt: '2024-04-01',
          lastAccess: '2024-05-10',
          relevancia: 5,
          connections: []
        }
      ];
      
      // Create habit nodes
      const habitNodes = [
        {
          id: 'hab1',
          label: 'Meditação Diária',
          type: 'habito',
          tags: ['mindfulness', 'foco', 'manhã'],
          area: 'saude',
          createdAt: '2024-01-15',
          lastAccess: '2024-05-15',
          relevancia: 8,
          connections: []
        },
        {
          id: 'hab2',
          label: 'Leitura Noturna',
          type: 'habito',
          tags: ['conhecimento', 'relaxamento', 'noite'],
          area: 'pessoal',
          createdAt: '2024-02-01',
          lastAccess: '2024-05-14',
          relevancia: 7,
          connections: []
        },
        {
          id: 'hab3',
          label: 'Exercícios',
          type: 'habito',
          tags: ['saúde', 'força', 'disciplina'],
          area: 'saude',
          createdAt: '2024-02-10',
          lastAccess: '2024-05-13',
          relevancia: 9,
          connections: []
        }
      ];
      
      // Create favorite nodes
      const favoriteNodes = [
        {
          id: 'fav1',
          label: 'Artigo sobre IA',
          type: 'favorito',
          tags: ['tecnologia', 'inovação', 'futuro'],
          area: 'educacao',
          createdAt: '2024-03-10',
          lastAccess: '2024-05-08',
          relevancia: 6,
          connections: []
        },
        {
          id: 'fav2',
          label: 'Podcast Filosofia',
          type: 'favorito',
          tags: ['conhecimento', 'reflexão', 'ideias'],
          area: 'educacao',
          createdAt: '2024-04-05',
          lastAccess: '2024-05-12',
          relevancia: 5,
          connections: []
        }
      ];
      
      // Create thought nodes
      const thoughtNodes = [
        {
          id: 'pens1',
          label: 'Ideia para novo projeto',
          type: 'pensamento',
          tags: ['criatividade', 'inovação', 'solução'],
          area: 'profissional',
          createdAt: '2024-04-20',
          lastAccess: '2024-05-11',
          relevancia: 7,
          connections: []
        },
        {
          id: 'pens2',
          label: 'Reflexão sobre produtividade',
          type: 'pensamento',
          tags: ['eficiência', 'tempo', 'foco'],
          area: 'pessoal',
          createdAt: '2024-05-01',
          lastAccess: '2024-05-14',
          relevancia: 6,
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
      
      // Create links between nodes
      const links = [
        // Athena to subcerebroa
        { source: 'athena', target: 'sub1' },
        { source: 'athena', target: 'sub2' },
        { source: 'athena', target: 'sub3' },
        { source: 'athena', target: 'sub4' },
        
        // Subcerebroa to projects
        { source: 'sub1', target: 'proj3' },
        { source: 'sub2', target: 'proj1' },
        { source: 'sub2', target: 'proj2' },
        
        // Subcerebroa to habits
        { source: 'sub1', target: 'hab2' },
        { source: 'sub3', target: 'hab1' },
        { source: 'sub3', target: 'hab3' },
        
        // Subcerebroa to favorites
        { source: 'sub4', target: 'fav1' },
        { source: 'sub4', target: 'fav2' },
        
        // Projects to thoughts
        { source: 'proj1', target: 'pens1' },
        { source: 'proj3', target: 'pens2' },
        
        // Some cross-connections
        { source: 'hab1', target: 'pens2' },
        { source: 'fav1', target: 'proj1' },
        { source: 'hab3', target: 'proj3' }
      ];
      
      // Update connections property for each node
      allNodes.forEach(node => {
        const nodeConnections = links
          .filter(link => link.source === node.id || link.target === node.id)
          .map(link => {
            const connectedId = link.source === node.id ? link.target : link.source;
            const connectedNode = allNodes.find(n => n.id === connectedId);
            return {
              id: connectedNode.id,
              label: connectedNode.label,
              type: connectedNode.type
            };
          });
        
        node.connections = nodeConnections;
      });
      
      return { nodes: allNodes, links };
    };
    
    const mockData = generateMockData();
    setMockNodes(mockData.nodes);
    setMockLinks(mockData.links);
  }, []);
  
  // Filter nodes based on search and filters
  useEffect(() => {
    if (mockNodes.length === 0) return;
    
    let filteredNodes = [...mockNodes];
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.label.toLowerCase().includes(lowerCaseQuery) || 
        node.tags?.some((tag: string) => tag.toLowerCase().includes(lowerCaseQuery))
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
    
    // Filter links to only include connections between visible nodes
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = mockLinks.filter(
      link => nodeIds.has(link.source.id || link.source) && nodeIds.has(link.target.id || link.target)
    );
    
    // Always include Athena node if it's not already included and if not specifically filtering by area
    if (!nodeIds.has('athena') && filterArea === 'all') {
      filteredNodes.push(mockNodes.find(node => node.id === 'athena'));
    }
    
    setFilteredData({ nodes: filteredNodes, links: filteredLinks });
  }, [mockNodes, mockLinks, searchQuery, filterType, filterArea]);
  
  // Prepare the graph data
  const graphData = {
    nodes: filteredData.nodes,
    links: filteredData.links
  };
  
  // No data view
  if (filteredData.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="bg-card/30 p-8 rounded-lg border border-card/50">
            <div className="text-primary text-5xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum nó encontrado</h3>
            <p className="text-foreground/70 mb-4">
              Não encontramos nenhum subcérebro ou entidade que corresponda aos seus filtros.
            </p>
            <p className="text-xs text-foreground/50">
              Tente remover algum filtro ou criar um novo subcérebro.
            </p>
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
        showMiniMap={showMiniMap}
      />
    </div>
  );
}
