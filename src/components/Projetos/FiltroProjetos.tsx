
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter, X, Check } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type FiltroProjetos = {
  filterText: string;
  setFilterText: (value: string) => void;
  filterTags: string[];
  setFilterTags: (tags: string[]) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  allTags?: string[];
};

export function FiltroProjetos({
  filterText,
  setFilterText,
  filterTags,
  setFilterTags,
  filterStatus,
  setFilterStatus,
  allTags = []
}: FiltroProjetos) {
  const [searchValue, setSearchValue] = useState(filterText);
  const [availableTags, setAvailableTags] = useState<string[]>(allTags);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  useEffect(() => {
    // Apply debouncing to search
    const handler = setTimeout(() => {
      setFilterText(searchValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, setFilterText]);

  useEffect(() => {
    setSearchValue(filterText);
  }, [filterText]);

  // Update available tags if allTags changes
  useEffect(() => {
    setAvailableTags(allTags);
  }, [allTags]);

  const handleToggleTag = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  const handleStatusSelect = (status: string | null) => {
    setFilterStatus(status);
    setShowStatusFilter(false);
  };

  const clearFilters = () => {
    setSearchValue('');
    setFilterText('');
    setFilterTags([]);
    setFilterStatus(null);
  };

  const hasActiveFilters = filterText !== '' || filterTags.length > 0 || filterStatus !== null;

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-6 mt-3 w-full fade-in relative">
      <div className="flex-1 w-full">
        <Input
          placeholder="Buscar por nome, tag ou área..."
          className="bg-[#191933] border-[#993887]/30 pl-10 focus:ring-2 focus:ring-[#60B5B5] text-[#E6E6F0] shadow-inner"
          style={{ minWidth: 200 }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="absolute left-3 top-2.5 text-[#993887]/60 pointer-events-none">
          <Filter className="w-4 h-4" />
        </span>
        {hasActiveFilters && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="absolute right-2 top-1.5 text-[#E6E6F0]/70 h-7 w-7 p-0"
            onClick={clearFilters}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <DropdownMenu open={showStatusFilter} onOpenChange={setShowStatusFilter}>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant={filterStatus ? "secondary" : "ghost"} 
              className={`${filterStatus ? "bg-[#993887] text-white" : "text-primary border border-[#60B5B5]/40 hover:bg-[#141429]"}`}
            >
              Status {filterStatus && <X className="w-3 h-3 ml-1" onClick={(e) => { e.stopPropagation(); handleStatusSelect(null); }} />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#191933] border-[#60B5B5]/40">
            <DropdownMenuItem onClick={() => handleStatusSelect(null)} className="cursor-pointer">
              Todos <Check className={`w-4 h-4 ml-2 ${filterStatus === null ? "opacity-100" : "opacity-0"}`} />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect("ativo")} className="cursor-pointer">
              Ativo <Check className={`w-4 h-4 ml-2 ${filterStatus === "ativo" ? "opacity-100" : "opacity-0"}`} />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect("pausado")} className="cursor-pointer">
              Pausado <Check className={`w-4 h-4 ml-2 ${filterStatus === "pausado" ? "opacity-100" : "opacity-0"}`} />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect("concluído")} className="cursor-pointer">
              Concluído <Check className={`w-4 h-4 ml-2 ${filterStatus === "concluído" ? "opacity-100" : "opacity-0"}`} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              size="sm" 
              variant={filterTags.length > 0 ? "secondary" : "ghost"} 
              className={`${filterTags.length > 0 ? "bg-[#993887] text-white" : "text-secondary border border-[#993887]/40 hover:bg-[#141429]"}`}
            >
              Tags {filterTags.length > 0 && <span className="ml-1">({filterTags.length})</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#191933] border-[#993887]/40 p-3 w-[250px] max-h-[300px] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {availableTags.length === 0 ? (
                <p className="text-sm text-[#E6E6F0]/60">Nenhuma tag disponível</p>
              ) : (
                availableTags.map((tag) => (
                  <div key={tag} className="flex items-center gap-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={filterTags.includes(tag)}
                      onCheckedChange={() => handleToggleTag(tag)}
                    />
                    <label 
                      htmlFor={`tag-${tag}`}
                      className="text-sm text-[#E6E6F0] cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                ))
              )}
              {filterTags.length > 0 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setFilterTags([])}
                  className="mt-2 text-xs border-[#993887]/40"
                >
                  Limpar tags
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button size="sm" variant="ghost" className="text-foreground border border-[#60B5B5]/40 hover:bg-[#141429]">
          <CalendarDays className="w-4 h-4 mr-1" /> Data
        </Button>
      </div>

      {filterTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 w-full">
          {filterTags.map(tag => (
            <Badge 
              key={tag} 
              className="bg-[#993887]/30 hover:bg-[#993887]/50 text-[#E6E6F0]"
              onClick={() => handleToggleTag(tag)}
            >
              {tag}
              <X className="w-3 h-3 ml-1 cursor-pointer" />
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}
