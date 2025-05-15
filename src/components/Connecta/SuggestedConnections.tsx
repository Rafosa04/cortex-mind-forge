
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Connection {
  id: string;
  name: string;
  username: string;
  avatar: string;
  commonElements: number;
  type: "habit" | "project" | "favorite";
}

interface SuggestedConnectionsProps {
  connections: Connection[];
}

export default function SuggestedConnections({ connections }: SuggestedConnectionsProps) {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  
  const handleToggleFollow = (connectionId: string) => {
    setFollowingMap(prev => ({
      ...prev,
      [connectionId]: !prev[connectionId]
    }));
  };

  return (
    <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 mb-5">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Conexões sugeridas</h3>
      
      <div className="space-y-3">
        {connections.map((connection) => (
          <motion.div 
            key={connection.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={connection.avatar} />
                <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs font-medium">{connection.name}</div>
                <div className="text-[10px] text-foreground/60">
                  {connection.commonElements} {connection.type === "habit" ? "hábitos" : connection.type === "project" ? "projetos" : "favoritos"} em comum
                </div>
              </div>
            </div>
            
            <Button
              variant={followingMap[connection.id] ? "outline" : "secondary"}
              size="sm"
              className={`text-xs h-7 px-3 ${followingMap[connection.id] ? "" : ""}`}
              onClick={() => handleToggleFollow(connection.id)}
            >
              {followingMap[connection.id] ? "Seguindo" : "Conectar"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
