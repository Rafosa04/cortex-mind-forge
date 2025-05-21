
import React from "react";

interface AthenaInteractionLimitBannerProps {
  interactionCount: number;
  maxInteractions: number;
  messageLength: number;
}

const AthenaInteractionLimitBanner: React.FC<AthenaInteractionLimitBannerProps> = ({ 
  interactionCount, 
  maxInteractions,
  messageLength
}) => {
  return (
    <div className="mt-1 text-xs text-foreground/50 flex justify-between">
      <span>Interações: {interactionCount}/{maxInteractions}</span>
      {messageLength > 0 && (
        <span>{messageLength} caracteres</span>
      )}
    </div>
  );
};

export default AthenaInteractionLimitBanner;
