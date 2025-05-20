
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type NovoHabitoModalProps = {
  open: boolean;
  onOpenChange: (flag: boolean) => void;
  onSubmit?: (nome: string, proposito: string, frequencia: string) => void;
};

export function NovoHabitoModal({ open, onOpenChange, onSubmit }: NovoHabitoModalProps) {
  const [nome, setNome] = useState("");
  const [proposito, setProposito] = useState("");
  const [frequencia, setFrequencia] = useState("Diário");
  const [ia, setIa] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(nome, proposito, frequencia);
    }
    // Limpar o formulário
    setNome("");
    setProposito("");
    setFrequencia("Diário");
    // Fechar o modal
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Hábito</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <Input 
            placeholder="Nome do hábito" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
          />
          <Input 
            placeholder="Propósito (ex: mais foco)" 
            value={proposito} 
            onChange={e => setProposito(e.target.value)} 
            required 
          />
          <select 
            value={frequencia} 
            onChange={e => setFrequencia(e.target.value)} 
            className="rounded px-2 py-2 bg-background border border-border text-foreground"
          >
            <option>Diário</option>
            <option>3x semana</option>
            <option>Semanal</option>
          </select>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={ia} 
              onChange={e => setIa(e.target.checked)} 
              id="ia" 
            />
            <label htmlFor="ia" className="text-xs">Deseja receber sugestões da Athena?</label>
          </div>
          <Input placeholder="Associar a projeto (mock)" disabled />
          <DialogFooter>
            <Button type="submit" className="w-full mt-2">Salvar hábito</Button>
          </DialogFooter>
        </form>
        <DialogClose asChild>
          <Button variant="ghost" className="absolute right-2 top-2">Fechar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
