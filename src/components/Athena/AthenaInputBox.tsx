
import React, { useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AthenaInteractionLimitBanner from "./AthenaInteractionLimitBanner";

interface AthenaInputBoxProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  interactionCount: number;
  maxInteractions: number;
}

const AthenaInputBox: React.FC<AthenaInputBoxProps> = ({ 
  message, 
  setMessage, 
  handleSendMessage, 
  isTyping,
  interactionCount,
  maxInteractions
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 pt-2 border-t border-border bg-card/90 backdrop-blur-sm">
      <div className="flex gap-2">
        <Textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Pergunte algo à Athena…"
          className="min-h-[40px] max-h-[120px] bg-background/70"
          style={{ resize: "none" }}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!message.trim() || isTyping}
          className="h-10 px-3"
        >
          <Send size={18} />
        </Button>
      </div>

      <AthenaInteractionLimitBanner 
        interactionCount={interactionCount} 
        maxInteractions={maxInteractions}
        messageLength={message.length}
      />
    </div>
  );
};

export default AthenaInputBox;
