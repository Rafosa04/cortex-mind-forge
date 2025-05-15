
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter } from "lucide-react";

export function FiltroProjetos() {
  // Por ora UI apenas, sem lógica
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-6 mt-3 w-full fade-in">
      <div className="flex-1 w-full">
        <Input
          placeholder="Buscar por nome, tag ou área..."
          className="bg-[#191933] border-[#993887]/30 pl-10 focus:ring-2 focus:ring-[#60B5B5] text-[#E6E6F0] shadow-inner"
          style={{ minWidth: 200 }}
        />
        <span className="absolute left-3 top-2.5 text-[#993887]/60 pointer-events-none">
          <Filter className="w-4 h-4" />
        </span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className="text-primary border border-[#60B5B5]/40 hover:bg-[#141429]">
          Status
        </Button>
        <Button size="sm" variant="ghost" className="text-secondary border border-[#993887]/40 hover:bg-[#141429]">
          Tags
        </Button>
        <Button size="sm" variant="ghost" className="text-foreground border border-[#60B5B5]/40 hover:bg-[#141429]">
          <CalendarDays className="w-4 h-4 mr-1" /> Data
        </Button>
      </div>
    </section>
  );
}
