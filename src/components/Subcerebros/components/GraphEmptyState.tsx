
import React from 'react';
import { motion } from 'framer-motion';

export function GraphEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="bg-card/30 p-8 rounded-lg border border-card/50 backdrop-blur-sm">
          <div className="text-primary text-6xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum nó encontrado</h3>
          <p className="text-foreground/70 mb-4">
            Não encontramos nenhum subcérebro ou entidade que corresponda aos seus filtros atuais.
          </p>
          <p className="text-xs text-foreground/50 mb-4">
            Tente ajustar os filtros ou criar um novo subcérebro para começar a mapear sua consciência digital.
          </p>
          <div className="text-xs text-primary/60 italic">
            "Cada subcérebro é uma constelação da sua consciência digital."
          </div>
        </div>
      </motion.div>
    </div>
  );
}
