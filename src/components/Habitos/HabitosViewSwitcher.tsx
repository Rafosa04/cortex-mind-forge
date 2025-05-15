
import { useState } from "react";
import { Calendar, ChartBar, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const views = [
  { id: "grid", icon: Brain, label: "Grade" },
  { id: "calendar", icon: Calendar, label: "Calendário" },
  { id: "relatorio", icon: ChartBar, label: "Relatório" },
];

export function HabitosViewSwitcher({
  active,
  setActive,
}: {
  active: string;
  setActive: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {views.map((view) => (
        <Button
          key={view.id}
          size="sm"
          variant={active === view.id ? "secondary" : "ghost"}
          className="flex gap-2 items-center"
          onClick={() => setActive(view.id)}
        >
          <view.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{view.label}</span>
        </Button>
      ))}
    </div>
  );
}
