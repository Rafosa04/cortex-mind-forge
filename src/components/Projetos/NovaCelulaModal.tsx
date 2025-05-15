
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import React from "react";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
};

export function NovaCelulaModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-background border border-[#60B5B5]/60 neon-anim">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-primary drop-shadow">
            <Bot className="text-primary w-5 h-5" /> Nova Célula com Athena
          </DialogTitle>
          <DialogDescription className="text-secondary pb-2">
            Em breve: Criação inteligente de projetos via IA Athena.
          </DialogDescription>
        </DialogHeader>
        <div className="p-3 text-foreground/80 opacity-70">
          O sistema IA ajudará a criar e organizar novas células de projeto para você!
        </div>
        <DialogClose asChild>
          <Button variant="secondary" className="mt-2 w-full">Fechar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
