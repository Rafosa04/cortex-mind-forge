
import { GraphNode, GraphLink } from '../utils/graphUtils';

export interface MockDataNode extends GraphNode {
  area?: string;
  createdAt?: string;
  lastAccess?: string;
  connections: any[];
}

export const generateMockData = () => {
  // Create Athena node (central hub)
  const athenaNode: MockDataNode = {
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
  const subcerebroNodes: MockDataNode[] = [
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
  const projectNodes: MockDataNode[] = [
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
  const habitNodes: MockDataNode[] = [
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
  const favoriteNodes: MockDataNode[] = [
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
  const thoughtNodes: MockDataNode[] = [
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
  const links: GraphLink[] = [
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

// Calculate progress-based relevance
export const calculateProgressRelevance = (node: MockDataNode) => {
  const baseRelevance = node.relevancia || 5;
  const lastAccessDate = new Date(node.lastAccess || '2024-01-01');
  const daysSinceAccess = Math.floor((Date.now() - lastAccessDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Recent activity boosts relevance
  if (daysSinceAccess <= 1) return Math.min(10, baseRelevance + 2);
  if (daysSinceAccess <= 7) return Math.min(10, baseRelevance + 1);
  if (daysSinceAccess > 30) return Math.max(1, baseRelevance - 1);
  
  return baseRelevance;
};
