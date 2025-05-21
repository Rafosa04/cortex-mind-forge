
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter, Search, Tag, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export type ProjetoFiltros = {
  search: string;
  status: string | null;
  tag: string | null;
  dateRange: DateRange | null;
};

type Props = {
  onFilterChange: (filtros: ProjetoFiltros) => void;
  categorias: string[];
  isLoading?: boolean;
};

export function FiltroProjetos({ onFilterChange, categorias, isLoading = false }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  
  const debouncedSearch = useDebouncedValue(searchValue, 300);
  
  // Update filters when any value changes
  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      status: statusFilter,
      tag: tagFilter,
      dateRange: dateRange,
    });
  }, [debouncedSearch, statusFilter, tagFilter, dateRange, onFilterChange]);

  const handleClearFilters = () => {
    setSearchValue("");
    setStatusFilter(null);
    setTagFilter(null);
    setDateRange(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (debouncedSearch) count++;
    if (statusFilter) count++;
    if (tagFilter) count++;
    if (dateRange?.from) count++;
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <section className="flex flex-col gap-3 mb-6 mt-3 w-full fade-in">
      <div className="relative w-full">
        <Input
          placeholder="Buscar por nome, tag ou área..."
          className="bg-[#191933]/80 border-[#993887]/30 pl-10 focus:ring-2 focus:ring-[#60B5B5] text-[#E6E6F0] shadow-inner"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={isLoading}
        />
        <span className="absolute left-3 top-2.5 text-[#993887]/60 pointer-events-none">
          <Search className="w-4 h-4" />
        </span>
        {searchValue && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="absolute right-2 top-1.5 h-7 w-7 p-0" 
            onClick={() => setSearchValue("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="sm" 
                variant={statusFilter ? "secondary" : "outline"}
                className={cn(
                  "text-sm flex gap-2",
                  !statusFilter && "text-primary border-[#60B5B5]/40 hover:bg-[#141429]"
                )}
                disabled={isLoading}
              >
                <Filter className="w-4 h-4" /> Status
                {statusFilter && <Badge variant="outline" className="ml-1 py-0">{statusFilter}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#191933] border-white/10 shadow-xl">
              <div className="p-2 flex flex-col gap-2">
                {["ativo", "pausado", "concluído"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                  >
                    {status}
                  </Button>
                ))}
                {statusFilter && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-1" 
                    onClick={() => setStatusFilter(null)}
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Tags/Categories Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="sm" 
                variant={tagFilter ? "secondary" : "outline"}
                className={cn(
                  "text-sm flex gap-2",
                  !tagFilter && "text-secondary border-[#993887]/40 hover:bg-[#141429]"
                )}
                disabled={isLoading || categorias.length === 0}
              >
                <Tag className="w-4 h-4" /> Categoria
                {tagFilter && <Badge variant="outline" className="ml-1 py-0">{tagFilter}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#191933] border-white/10 shadow-xl">
              <div className="p-2 flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                {categorias.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-2 px-3">Nenhuma categoria encontrada</div>
                ) : (
                  <>
                    {categorias.map((categoria) => (
                      <Button
                        key={categoria}
                        size="sm"
                        variant={tagFilter === categoria ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => setTagFilter(tagFilter === categoria ? null : categoria)}
                      >
                        {categoria}
                      </Button>
                    ))}
                    {tagFilter && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-1" 
                        onClick={() => setTagFilter(null)}
                      >
                        Limpar
                      </Button>
                    )}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="sm" 
                variant={dateRange?.from ? "secondary" : "outline"}
                className={cn(
                  "text-sm flex gap-2",
                  !dateRange?.from && "text-foreground border-[#60B5B5]/40 hover:bg-[#141429]"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="w-4 h-4" /> 
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "d/M/y", { locale: ptBR })} - {format(dateRange.to, "d/M/y", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "PP", { locale: ptBR })
                  )
                ) : (
                  "Data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#191933] border-white/10 shadow-xl">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                locale={ptBR}
                className="bg-[#191933]"
              />
              {dateRange?.from && (
                <div className="p-2 border-t border-white/10">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setDateRange(null)}
                  >
                    Limpar
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        
        {activeFiltersCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearFilters}
            className="text-muted-foreground"
            disabled={isLoading}
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Limpar {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro' : 'filtros'}
          </Button>
        )}
      </div>
    </section>
  );
}
