
import React from "react";
import { ExternalLink, Link } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IntegrationCardProps {
  title: string;
  description: string;
  logo: React.ReactNode;
  isConnected: boolean;
  connectedSince?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  logo,
  isConnected,
  connectedSince,
  onConnect,
  onDisconnect,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };
  
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {logo}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {isConnected && (
              <Badge variant="outline" className="mt-1 text-xs">
                Conectado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
        
        {isConnected && connectedSince && (
          <p className="text-xs text-muted-foreground mt-2">
            Conectado desde {formatDate(connectedSince)}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end pt-2 bg-muted/20">
        {isConnected ? (
          <Button 
            variant="outline"
            size="sm"
            onClick={onDisconnect}
            className="text-xs"
          >
            <Link className="h-3.5 w-3.5 mr-1" />
            Desconectar
          </Button>
        ) : (
          <Button 
            variant="default"
            size="sm"
            onClick={onConnect}
            className="text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Conectar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default IntegrationCard;
