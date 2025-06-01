
import React from "react";
import { Search, Filter, Bot, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedFiltroProjetosProps {
  filterText: string;
  setFilterText: (text: string) => void;
  filterTags: string[];
  setFilterTags: (tags: string[]) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterPriority?: string | null;
  setFilterPriority?: (priority: string | null) => void;
  filterDeadline?: string | null;
  setFilterDeadline?: (deadline: string | null) => void;
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

  const aiFilters = [
    { value: "critical", label: "Críticos", icon: AlertTriangle, color: "text-red-400" },
    { value: "attention", label: "Precisam Atenção", icon: AlertTriangle, color: "text-yellow-400" },
    { value: "good", label: "Em Boa Forma", icon: TrendingUp, color: "text-green-400" }
  ];

  const deadlineFilters = [
    { value: "overdue", label: "Atrasados" },
    { value: "week", label: "Próximos 7 dias" },
    { value: "month", label: "Próximos 30 dias" },
    { value: "no-deadline", label: "Sem prazo" }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Barra de busca principal */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome, descrição, categoria ou tags..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-10 bg-[#191933]/70 border-[#60B5B5]/40"
        />
      </div>

      {/* Filtros principais */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterStatus || ""} onValueChange={(value) => setFilterStatus(value === "all" ? null : value)}>
          <SelectTrigger className="w-[140px] bg-[#191933]/70 border-[#60B5B5]/40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="pausado">Pausado</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>

        {setFilterPriority && (
          <Select value={filterPriority || ""} onValueChange={(value) => setFilterPriority(value === "all" ? null : value)}>
            <SelectTrigger className="w-[160px] bg-[#191933]/70 border-[#993887]/40">
              <SelectValue placeholder="IA Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {aiFilters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <SelectItem key={filter.value} value={filter.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${filter.color}`} />
                      {filter.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        {setFilterDeadline && (
          <Select value={filterDeadline || ""} onValueChange={(value) => setFilterDeadline(value === "all" ? null : value)}>
            <SelectTrigger className="w-[160px] bg-[#191933]/70 border-[#60B5B5]/40">
              <SelectValue placeholder="Prazo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {deadlineFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {filter.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {onAthenaFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAthenaFilter("projetos que precisam de atenção")}
            className="border-[#993887]/40 text-[#993887] hover:bg-[#993887]/10"
          >
            <Bot className="w-4 h-4 mr-2" />
            Análise IA
          </Button>
        )}
      </div>

      {/* Tags disponíveis */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Tags disponíveis:
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map((tag) => (
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
            {allTags.length > 10 && (
              <Badge variant="outline" className="border-[#60B5B5]/40">
                +{allTags.length - 10} mais
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Filtros ativos */}
      {(filterStatus || filterTags.length > 0 || filterPriority || filterDeadline) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Filtros ativos:</span>
          {filterStatus && (
            <Badge variant="secondary" className="bg-[#60B5B5]/20">
              Status: {filterStatus}
            </Badge>
          )}
          {filterPriority && (
            <Badge variant="secondary" className="bg-[#993887]/20">
              IA: {aiFilters.find(f => f.value === filterPriority)?.label}
            </Badge>
          )}
          {filterDeadline && (
            <Badge variant="secondary" className="bg-[#60B5B5]/20">
              Prazo: {deadlineFilters.find(f => f.value === filterDeadline)?.label}
            </Badge>
          )}
          {filterTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#60B5B5]/20 cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
