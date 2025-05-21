
import React from "react";

interface AthenaTypingIndicatorProps {
  isTyping: boolean;
}

const AthenaTypingIndicator: React.FC<AthenaTypingIndicatorProps> = ({ isTyping }) => {
  if (!isTyping) return null;

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[85%] p-3 rounded-lg bg-card/50 border border-border/50">
        <p className="text-sm text-foreground/70 animate-pulse">
          Athena está digitando...
        </p>
      </div>
    </div>
  );
};

export default AthenaTypingIndicator;
