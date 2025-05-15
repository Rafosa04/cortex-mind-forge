
import React from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
};

export function FloatingAthenaButton({ onClick }: Props) {
  return (
    <Button
      size="lg"
      className="fixed bottom-8 right-8 z-50 rounded-full shadow-xl bg-[#993887] text-[#E6E6F0] animate-fade-in hover:scale-105 hover:bg-[#60B5B5] transition"
      style={{ minHeight: 56, minWidth: 56 }}
      onClick={onClick}
      title="Falar com a Athena"
    >
      <Bot className="w-7 h-7" />
      <span className="sr-only">Falar com a Athena</span>
    </Button>
  );
}
