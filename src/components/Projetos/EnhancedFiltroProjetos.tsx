
import React from "react";
import { Search, Filter, Calendar, Tag, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

interface EnhancedFiltroProjetosProps {
  filterText: string;
  setFilterText: (text: string) => void;
  filterTags: string[];
  setFilterTags: (tags: string[]) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  filterDeadline: string | null;
  setFilterDeadline: (deadline: string | null) => void;
  allTags: string[];
  onAthenaFilter?: (query: string) => void;
}

export function EnhancedFiltroProjetos({
  filterText,
  setFilterText,
  filterTags,
  setFilterTags,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterDeadline,
  setFilterDeadline,
  allTags,
  onAthenaFilter
}: EnhancedFiltroProjetosProps) {
  const handleTagToggle = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  const clearAllFilters = () => {
    setFilterText("");
    setFilterTags([]);
    setFilterStatus(null);
    setFilterPriority(null);
    setFilterDeadline(null);
  };

  const activeFiltersCount = [
    filterText ? 1 : 0,
    filterTags.length,
    filterStatus ? 1 : 0,
    filterPriority ? 1 : 0,
    filterDeadline ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Buscar por nome, descrição, categoria ou tags..."
          className="pl-10 h-12 bg-[#191933]/70 border-[#60B5B5]/40"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status Filter */}
        <Select value={filterStatus || ""} onValueChange={(value) => setFilterStatus(value || null)}>
          <SelectTrigger className="w-40 bg-[#191933]/70 border-[#60B5B5]/40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="pausado">Pausado</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>

        {/* AI Priority Filter */}
        <Select value={filterPriority || ""} onValueChange={(value) => setFilterPriority(value || null)}>
          <SelectTrigger className="w-48 bg-[#191933]/70 border-[#993887]/40">
            <SelectValue placeholder="Prioridade IA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as prioridades</SelectItem>
            <SelectItem value="critical">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Crítico (IA)
              </div>
            </SelectItem>
            <SelectItem value="attention">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Precisa atenção
              </div>
            </SelectItem>
            <SelectItem value="good">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-green-400" />
                Em bom andamento
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Deadline Filter */}
        <Select value={filterDeadline || ""} onValueChange={(value) => setFilterDeadline(value || null)}>
          <SelectTrigger className="w-44 bg-[#191933]/70 border-[#60B5B5]/40">
            <SelectValue placeholder="Prazo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os prazos</SelectItem>
            <SelectItem value="overdue">Atrasados</SelectItem>
            <SelectItem value="week">Próximos 7 dias</SelectItem>
            <SelectItem value="month">Próximos 30 dias</SelectItem>
            <SelectItem value="no-deadline">Sem prazo</SelectItem>
          </SelectContent>
        </Select>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-[#191933]/70 border-[#60B5B5]/40 hover:bg-[#60B5B5]/10"
              >
                <Tag className="w-4 h-4 mr-2" />
                Tags {filterTags.length > 0 && `(${filterTags.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#191933] border-[#60B5B5]/40">
              <div className="space-y-3">
                <h4 className="font-medium text-secondary">Filtrar por Tags</h4>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {allTags.map(tag => (
                    <motion.div
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant={filterTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          filterTags.includes(tag)
                            ? "bg-[#60B5B5] text-white"
                            : "border-[#60B5B5]/40 hover:bg-[#60B5B5]/10"
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* AI Insights Filter */}
        <Button
          variant="outline"
          className="bg-[#993887]/10 border-[#993887]/40 text-[#993887] hover:bg-[#993887]/20"
          onClick={() => onAthenaFilter && onAthenaFilter("projetos que precisam de atenção")}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Insights IA
        </Button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white"
          >
            Limpar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {(filterTags.length > 0 || filterStatus || filterPriority || filterDeadline) && (
        <div className="flex flex-wrap gap-2">
          {filterTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#60B5B5]/20 text-[#60B5B5] px-2 py-1"
            >
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-2 hover:text-white transition-colors"
              >
                ×
              </button>
            </Badge>
          ))}
          
          {filterStatus && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              Status: {filterStatus}
              <button
                onClick={() => setFilterStatus(null)}
                className="ml-2 hover:text-white transition-colors"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filterPriority && (
            <Badge variant="secondary" className="bg-[#993887]/20 text-[#993887]">
              Prioridade: {filterPriority}
              <button
                onClick={() => setFilterPriority(null)}
                className="ml-2 hover:text-white transition-colors"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filterDeadline && (
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
              Prazo: {filterDeadline}
              <button
                onClick={() => setFilterDeadline(null)}
                className="ml-2 hover:text-white transition-colors"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
