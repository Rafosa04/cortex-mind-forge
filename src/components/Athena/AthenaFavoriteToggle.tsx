
import React from "react";
import { Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AthenaFavoriteToggleProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const AthenaFavoriteToggle: React.FC<AthenaFavoriteToggleProps> = ({ isFavorite, onToggle }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full"
      onClick={onToggle}
    >
      {isFavorite ? (
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ) : (
        <StarOff className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};

export default AthenaFavoriteToggle;
