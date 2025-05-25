
import { useState, useEffect } from 'react';
import { MockDataNode, calculateProgressRelevance } from '../services/mockDataService';
import { GraphLink } from '../utils/graphUtils';

interface UseGraphFilteringProps {
  nodes: MockDataNode[];
  links: GraphLink[];
  searchQuery: string;
  filterType: string;
  filterArea: string;
  viewMode: 'default' | 'progress' | 'focus';
  focusNodeId?: string;
}

export const useGraphFiltering = ({
  nodes,
  links,
  searchQuery,
  filterType,
  filterArea,
  viewMode,
  focusNodeId
}: UseGraphFilteringProps) => {
  const [filteredData, setFilteredData] = useState<{nodes: MockDataNode[], links: GraphLink[]}>({ 
    nodes: [], 
    links: [] 
  });
  
  useEffect(() => {
    if (nodes.length === 0) return;
    
    let filteredNodes = [...nodes];
    
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
      const focusNode = nodes.find(node => node.id === focusNodeId);
      if (focusNode) {
        const connectedNodeIds = new Set([focusNodeId]);
        
        // Add direct connections
        links.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (sourceId === focusNodeId) connectedNodeIds.add(targetId);
          if (targetId === focusNodeId) connectedNodeIds.add(sourceId);
        });
        
        filteredNodes = nodes.filter(node => connectedNodeIds.has(node.id));
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
    const filteredLinks = links.filter(
      link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      }
    );
    
    // Always include Athena node if not already included and not in focus mode
    if (viewMode !== 'focus' && !nodeIds.has('athena')) {
      const athenaNode = nodes.find(node => node.id === 'athena');
      if (athenaNode) {
        filteredNodes.push(athenaNode);
      }
    }
    
    setFilteredData({ nodes: filteredNodes, links: filteredLinks });
  }, [nodes, links, searchQuery, filterType, filterArea, viewMode, focusNodeId]);
  
  return filteredData;
};
