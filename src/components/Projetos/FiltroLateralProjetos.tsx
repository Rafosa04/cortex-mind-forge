
import React from "react";
import { Grid2x2, List, CalendarDays, GalleryHorizontal, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const modos = [
  { nome: "Lista", icon: List },
  { nome: "Kanban", icon: Grid2x2 },
  { nome: "Linha do tempo", icon: CalendarDays },
  { nome: "Galeria", icon: GalleryHorizontal }
];

export function FiltroLateralProjetos({ modo, setModo }: { modo: string, setModo: (m: string) => void }) {
  return (
    <aside className="hidden md:flex flex-col gap-3 bg-[#141429]/60 border-r border-[#993887] px-3 py-6 min-w-[180px] max-w-[200px] rounded-2xl mr-8 glass-morphism">
      <div className="font-bold text-primary text-lg mb-2 tracking-wide">Visão</div>
      <div className="flex flex-col gap-2">
        {modos.map((m) => (
          <Button
            key={m.nome}
            variant={modo === m.nome ? "secondary" : "ghost"}
            className="justify-start gap-2"
            onClick={() => setModo(m.nome)}
          >
            <m.icon className="w-5 h-5" /> {m.nome}
          </Button>
        ))}
      </div>
      <div className="font-bold text-primary text-lg mt-6 mb-2 tracking-wide">Filtros</div>
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="justify-start gap-2 border-[#60B5B5]/40 text-primary">
          <Tag className="w-5 h-5" /> Tags
        </Button>
        <Button variant="outline" className="justify-start gap-2 border-[#993887]/40 text-secondary">
          <CalendarDays className="w-5 h-5" /> Período
        </Button>
      </div>
    </aside>
  );
}
