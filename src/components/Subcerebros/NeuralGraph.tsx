
import React, { useEffect, useRef, useState } from 'react';
import { SubbrainGraph } from './SubbrainGraph';
import { generateMockData } from './services/mockDataService';
import { useGraphFiltering } from './hooks/useGraphFiltering';
import { GraphEmptyState } from './components/GraphEmptyState';

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
  
  // Generate mock data on component mount
  useEffect(() => {
    const mockData = generateMockData();
    setMockNodes(mockData.nodes);
    setMockLinks(mockData.links);
  }, []);
  
  // Use the filtering hook
  const filteredData = useGraphFiltering({
    nodes: mockNodes,
    links: mockLinks,
    searchQuery,
    filterType,
    filterArea,
    viewMode,
    focusNodeId
  });
  
  // Prepare the graph data
  const graphData = {
    nodes: filteredData.nodes,
    links: filteredData.links
  };
  
  // Show empty state if no nodes
  if (filteredData.nodes.length === 0) {
    return <GraphEmptyState />;
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
