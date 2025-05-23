
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit, Expand, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { timeAgo } from '@/lib/utils';

interface NodeTooltipProps {
  node: any;
  position: { x: number; y: number };
  visible: boolean;
  onView: () => void;
  onEdit: () => void;
  onExpand: () => void;
}

export function NodeTooltip({ node, position, visible, onView, onEdit, onExpand }: NodeTooltipProps) {
  if (!node || !visible) return null;

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'athena': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'subcerebro': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'projeto': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'habito': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'favorito': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pensamento': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed z-50 pointer-events-auto"
        style={{
          left: position.x + 10,
          top: position.y - 10,
          maxWidth: '320px'
        }}
      >
        <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-lg p-4 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground line-clamp-2 text-sm">
                {node.label}
              </h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border mt-1 ${getNodeTypeColor(node.type)}`}>
                {formatNodeType(node.type)}
              </div>
            </div>
          </div>

          {/* Tags */}
          {node.tags && node.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {node.tags.slice(0, 3).map((tag: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs bg-card/30">
                  <Tag size={10} className="mr-1" />
                  {tag}
                </Badge>
              ))}
              {node.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-card/30">
                  +{node.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Last Activity */}
          {node.lastAccess && (
            <div className="flex items-center gap-2 text-xs text-foreground/60 mb-3">
              <Clock size={12} />
              <span>Último acesso: {timeAgo(node.lastAccess)}</span>
            </div>
          )}

          {/* Relevance */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-foreground/60 mb-1">
              <span>Relevância</span>
              <span>{node.relevancia || 5}/10</span>
            </div>
            <div className="h-1.5 bg-card/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((node.relevancia || 5) / 10) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={onView}
            >
              <Eye size={12} className="mr-1" />
              Ver
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={onEdit}
            >
              <Edit size={12} className="mr-1" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={onExpand}
            >
              <Expand size={12} className="mr-1" />
              Expandir
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatNodeType(type: string): string {
  const types: Record<string, string> = {
    athena: "Athena IA",
    subcerebro: "Subcérebro",
    projeto: "Projeto",
    habito: "Hábito",
    favorito: "Favorito",
    pensamento: "Pensamento"
  };
  
  return types[type] || "Desconhecido";
}
