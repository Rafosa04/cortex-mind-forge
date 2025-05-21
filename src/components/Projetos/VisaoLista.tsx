
import React from "react";
import { ProjectWithSteps } from "@/services/projectsService";
import { ProjetoCard } from "./ProjetoCard";
import { Skeleton } from "@/components/ui/skeleton";

type VisaoListaProps = {
  projetos: ProjectWithSteps[];
  loading: boolean;
  onVerDetalhes: (projeto: ProjectWithSteps) => void;
};

export function VisaoLista({ projetos, loading, onVerDetalhes }: VisaoListaProps) {
  const renderLoaderCards = () => (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-[#141429]/90 border border-[#191933] shadow-xl p-6 flex flex-col gap-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-40 bg-[#191933]" />
            <Skeleton className="h-6 w-20 bg-[#191933]" />
          </div>
          <div className="flex gap-2 mt-1">
            <Skeleton className="h-4 w-20 bg-[#191933]" />
          </div>
          <Skeleton className="h-3 w-full bg-[#191933] mt-2" />
          <div className="flex justify-between mt-2">
            <Skeleton className="h-8 w-28 bg-[#191933]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-[#191933]" />
              <Skeleton className="h-8 w-8 rounded-full bg-[#191933]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7 fade-in mt-1">
      {loading ? (
        renderLoaderCards()
      ) : projetos.length === 0 ? (
        <div className="col-span-full text-center py-8 text-secondary/70">
          Nenhum projeto encontrado com os filtros atuais.
        </div>
      ) : (
        projetos.map((projeto) => (
          <ProjetoCard
            key={projeto.id}
            projeto={projeto}
            onVerDetalhes={() => onVerDetalhes(projeto)}
          />
        ))
      )}
    </div>
  );
}
