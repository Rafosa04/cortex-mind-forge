
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
  const [graphViewMode, setGraphViewMode] = useState<'orbital' | 'radial' | 'focus'>('orbital');
  
  // Gerar dados mock aprimorados
  useEffect(() => {
    const generateMockData = () => {
      // Nó central Athena
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
      
      // Subcérebros
      const subcerebroNodes = [
        {
          id: 'sub1', label: 'Subcérebro Pessoal', type: 'subcerebro',
          tags: ['pessoal', 'desenvolvimento', 'rotina', 'bem-estar'],
          area: 'pessoal', createdAt: '2024-01-05', lastAccess: '2024-05-14',
          relevancia: 9, connections: []
        },
        {
          id: 'sub2', label: 'Subcérebro Trabalho', type: 'subcerebro',
          tags: ['trabalho', 'projetos', 'reuniões', 'produtividade'],
          area: 'profissional', createdAt: '2024-01-10', lastAccess: '2024-05-15',
          relevancia: 10, connections: []
        },
        {
          id: 'sub3', label: 'Subcérebro Saúde', type: 'subcerebro',
          tags: ['saúde', 'exercícios', 'nutrição', 'mindfulness'],
          area: 'saude', createdAt: '2024-02-15', lastAccess: '2024-05-12',
          relevancia: 8, connections: []
        }
      ];
      
      // Projetos
      const projectNodes = [
        {
          id: 'proj1', label: 'Projeto Alpha - IA Pessoal', type: 'projeto',
          tags: ['desenvolvimento', 'software', 'inovação', 'ia'],
          area: 'profissional', createdAt: '2024-02-20', lastAccess: '2024-05-14',
          relevancia: 10, connections: []
        },
        {
          id: 'proj2', label: 'Estratégia Marketing 2024', type: 'projeto',
          tags: ['marketing', 'estratégia', 'análise', 'crescimento'],
          area: 'profissional', createdAt: '2024-03-15', lastAccess: '2024-05-13',
          relevancia: 8, connections: []
        }
      ];
      
      // Hábitos
      const habitNodes = [
        {
          id: 'hab1', label: 'Meditação Matinal', type: 'habito',
          tags: ['mindfulness', 'foco', 'manhã', 'bem-estar'],
          area: 'saude', createdAt: '2024-01-15', lastAccess: '2024-05-15',
          relevancia: 9, connections: []
        },
        {
          id: 'hab2', label: 'Leitura Técnica', type: 'habito',
          tags: ['conhecimento', 'tecnologia', 'aprendizado', 'noite'],
          area: 'educacao', createdAt: '2024-02-01', lastAccess: '2024-05-14',
          relevancia: 8, connections: []
        }
      ];
      
      // Favoritos
      const favoriteNodes = [
        {
          id: 'fav1', label: 'Paper: Neural Networks 2024', type: 'favorito',
          tags: ['tecnologia', 'inovação', 'futuro', 'research'],
          area: 'educacao', createdAt: '2024-03-10', lastAccess: '2024-05-08',
          relevancia: 8, connections: []
        }
      ];
      
      // Pensamentos
      const thoughtNodes = [
        {
          id: 'pens1', label: 'Ideia: App Mindfulness + IA', type: 'pensamento',
          tags: ['criatividade', 'inovação', 'solução', 'mindfulness'],
          area: 'criatividade', createdAt: '2024-04-20', lastAccess: '2024-05-11',
          relevancia: 8, connections: []
        }
      ];
      
      const allNodes = [
        athenaNode,
        ...subcerebroNodes,
        ...projectNodes,
        ...habitNodes,
        ...favoriteNodes,
        ...thoughtNodes
      ];
      
      // Todos os nós conectam diretamente com Athena
      const links = allNodes
        .filter(node => node.id !== 'athena')
        .map(node => ({
          source: 'athena',
          target: node.id
        }));
      
      // Algumas conexões cruzadas
      links.push(
        { source: 'sub1', target: 'hab1' },
        { source: 'sub2', target: 'proj1' },
        { source: 'hab1', target: 'pens1' },
        { source: 'proj1', target: 'fav1' }
      );
      
      // Atualizar conexões nos nós
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
  
  // Filtragem aprimorada
  useEffect(() => {
    if (mockNodes.length === 0) return;
    
    let filteredNodes = [...mockNodes];
    
    // Aplicar filtros de busca
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.label.toLowerCase().includes(lowerCaseQuery) || 
        node.tags?.some((tag: string) => tag.toLowerCase().includes(lowerCaseQuery)) ||
        node.type.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filtros de tipo e área
    if (filterType && filterType !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.type === filterType);
    }
    
    if (filterArea && filterArea !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.area === filterArea);
    }
    
    // Modo foco
    if (viewMode === 'focus' && focusNodeId) {
      const focusNode = mockNodes.find(node => node.id === focusNodeId);
      if (focusNode) {
        const connectedNodeIds = new Set([focusNodeId]);
        
        mockLinks.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (sourceId === focusNodeId) connectedNodeIds.add(targetId);
          if (targetId === focusNodeId) connectedNodeIds.add(sourceId);
        });
        
        filteredNodes = mockNodes.filter(node => connectedNodeIds.has(node.id));
      }
    }
    
    // Filtrar links
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = mockLinks.filter(
      link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      }
    );
    
    // Sempre incluir Athena se não estiver incluída
    if (!nodeIds.has('athena')) {
      const athenaNode = mockNodes.find(node => node.id === 'athena');
      if (athenaNode) {
        filteredNodes.push(athenaNode);
      }
    }
    
    setFilteredData({ nodes: filteredNodes, links: filteredLinks });
  }, [mockNodes, mockLinks, searchQuery, filterType, filterArea, viewMode, focusNodeId]);
  
  const graphData = {
    nodes: filteredData.nodes,
    links: filteredData.links
  };
  
  // Estado vazio aprimorado
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
            <div className="text-xs text-primary/60 italic">
              "Visualizando a inteligência conectada da sua mente digital."
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
        viewMode={graphViewMode}
        onViewModeChange={setGraphViewMode}
      />
    </div>
  );
}
