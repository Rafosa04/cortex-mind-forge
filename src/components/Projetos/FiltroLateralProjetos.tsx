
import React from "react";
import { Grid2x2, List, CalendarDays, GalleryHorizontal, Filter, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ProjetoFiltros } from "./FiltroProjetos";

// Import ModoVisao from parent types
export type ModoVisao = "Lista" | "Kanban" | "Linha do tempo" | "Galeria";

const modos = [
  { nome: "Lista", icon: List },
  { nome: "Kanban", icon: Grid2x2 },
  { nome: "Linha do tempo", icon: CalendarDays },
  { nome: "Galeria", icon: GalleryHorizontal }
];

type Props = {
  modo: ModoVisao;
  setModo: (m: ModoVisao) => void;
  filtros: ProjetoFiltros;
  onLimparFiltro: (filtroKey: keyof ProjetoFiltros) => void;
  categorias: string[];
  isLoading?: boolean;
};

export function FiltroLateralProjetos({ 
  modo, 
  setModo, 
  filtros,
  onLimparFiltro,
  categorias,
  isLoading = false
}: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col gap-3 bg-[#141429]/60 border-r border-[#993887]/30 px-3 py-6 min-w-[180px] max-w-[200px] rounded-l-2xl mr-4 lg:mr-8 glass-morphism"
      >
        <div className="font-bold text-primary text-lg mb-2 tracking-wide">Visão</div>
        <div className="flex flex-col gap-2">
          {modos.map((m) => (
            <Button
              key={m.nome}
              variant={modo === m.nome ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => setModo(m.nome as ModoVisao)}
              disabled={isLoading}
            >
              <m.icon className="w-5 h-5" /> {m.nome}
            </Button>
          ))}
        </div>
        
        <div className="font-bold text-primary text-lg mt-6 mb-2 tracking-wide">Filtros</div>
        
        {filtros.status && (
          <div className="flex items-center justify-between bg-[#191933]/80 rounded-lg px-2 py-1.5 text-sm">
            <div className="flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-[#60B5B5]" />
              <span className="text-[#E6E6F0]/90 capitalize">{filtros.status}</span>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onLimparFiltro("status")} 
              className="h-5 w-5" 
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {filtros.tag && (
          <div className="flex items-center justify-between bg-[#191933]/80 rounded-lg px-2 py-1.5 text-sm">
            <div className="flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-[#993887]" />
              <span className="text-[#E6E6F0]/90 truncate max-w-[120px]">{filtros.tag}</span>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onLimparFiltro("tag")} 
              className="h-5 w-5" 
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {filtros.dateRange?.from && (
          <div className="flex items-center justify-between bg-[#191933]/80 rounded-lg px-2 py-1.5 text-sm">
            <div className="flex items-center">
              <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-[#60B5B5]" />
              <span className="text-[#E6E6F0]/90 truncate max-w-[120px]">
                {filtros.dateRange.from.toLocaleDateString()}
                {filtros.dateRange.to && ` - ${filtros.dateRange.to.toLocaleDateString()}`}
              </span>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onLimparFiltro("dateRange")} 
              className="h-5 w-5" 
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-1">Categorias</div>
          <div className="flex flex-col gap-1">
            {categorias.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">Nenhuma categoria</div>
            ) : (
              categorias.slice(0, 5).map((categoria) => (
                <Button 
                  key={categoria} 
                  variant="ghost" 
                  size="sm" 
                  className={`justify-start text-xs h-7 px-2 ${filtros.tag === categoria ? 'bg-secondary/20 text-secondary' : ''}`}
                  onClick={() => {
                    if (filtros.tag === categoria) {
                      onLimparFiltro("tag");
                    } else {
                      // This will be handled by the parent component setting tag filter
                    }
                  }}
                  disabled={isLoading}
                >
                  <div className="w-2 h-2 rounded-full bg-secondary mr-2"></div>
                  <span className="truncate">{categoria}</span>
                </Button>
              ))
            )}
            {categorias.length > 5 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start text-xs text-muted-foreground h-7"
                disabled={isLoading}
              >
                + {categorias.length - 5} mais...
              </Button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile view selector */}
      <div className="md:hidden w-full mb-4">
        <div className="flex justify-center gap-1 bg-[#141429]/60 p-1.5 rounded-lg">
          {modos.map((m) => (
            <Button
              key={m.nome}
              size="sm"
              variant={modo === m.nome ? "secondary" : "ghost"}
              className="px-2 py-1"
              onClick={() => setModo(m.nome as ModoVisao)}
              title={m.nome}
              disabled={isLoading}
            >
              <m.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
