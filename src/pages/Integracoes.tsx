
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Music, Youtube, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import IntegrationCard from "@/components/Integrations/IntegrationCard";
import { 
  fetchUserConnections, 
  disconnectPlatform, 
  getAuthorizationUrl,
  getIntegrationStatus,
  Platform
} from "@/utils/integrationUtils";

const Integracoes: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect URI for OAuth flow
  const redirectUri = `${window.location.origin}/integracoes/callback`;
  
  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);
  
  const loadConnections = async () => {
    setLoading(true);
    if (!user) return;
    
    try {
      const data = await fetchUserConnections(user.id);
      setConnections(data);
    } catch (error) {
      console.error("Error loading connections:", error);
      toast({
        title: "Erro ao carregar integrações",
        description: "Não foi possível carregar suas conexões existentes."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleConnect = (platform: Platform) => {
    // In a real implementation, this would redirect to the platform OAuth page
    const authUrl = getAuthorizationUrl(platform, redirectUri);
    
    // For demo purposes, simulate as if the connection was successful
    toast({
      title: `Conectando ${platform}`,
      description: "Redirecionando para página de autorização..."
    });
    
    // In a real implementation we would use:
    // window.location.href = authUrl;
    
    // For demo, simulate connected state
    setTimeout(() => {
      simulateSuccessfulConnection(platform);
    }, 1500);
  };
  
  const simulateSuccessfulConnection = (platform: Platform) => {
    if (!user) return;
    
    // Create a mock connection
    const mockConnection = {
      id: `mock-${platform}-${Date.now()}`,
      user_id: user.id,
      platform,
      token: "mock-token-xxx",
      refresh_token: "mock-refresh-xxx",
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to local state
    setConnections(prev => [...prev, mockConnection]);
    
    toast({
      title: "Conexão estabelecida",
      description: `Sua conta ${platform} foi conectada com sucesso.`
    });
  };
  
  const handleDisconnect = async (platform: Platform) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const result = await disconnectPlatform(user.id, platform);
      
      if (result.success) {
        setConnections(prev => prev.filter(conn => conn.platform !== platform));
        toast({
          title: "Conexão removida",
          description: `A integração com ${platform} foi removida.`
        });
      } else {
        throw new Error("Não foi possível desconectar");
      }
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      toast({
        title: "Erro ao desconectar",
        description: `Não foi possível remover a integração com ${platform}.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get status of each platform
  const spotifyStatus = getIntegrationStatus("spotify", connections);
  const youtubeStatus = getIntegrationStatus("youtube", connections);
  
  // Find connection object for each platform
  const spotifyConnection = connections.find(conn => conn.platform === "spotify");
  const youtubeConnection = connections.find(conn => conn.platform === "youtube");
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte suas plataformas favoritas ao CÓRTEX para uma experiência personalizada.
        </p>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Como funcionam as integrações?</AlertTitle>
        <AlertDescription>
          Ao conectar suas plataformas favoritas, o CÓRTEX poderá acessar dados como histórico de reprodução, 
          vídeos assistidos e outros dados para gerar insights personalizados e ampliar a utilidade da Athena.
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-6 md:grid-cols-2">
        <IntegrationCard
          title="Spotify"
          description="Conecte sua conta do Spotify para análise de hábitos de escuta, 
                       recomendações de músicas para foco e insights sobre sua rotina de áudio."
          logo={<Music className="h-4 w-4 text-primary" />}
          isConnected={spotifyStatus.connected}
          connectedSince={spotifyConnection?.created_at}
          onConnect={() => handleConnect("spotify")}
          onDisconnect={() => handleDisconnect("spotify")}
        />
        
        <IntegrationCard
          title="YouTube"
          description="Conecte sua conta do YouTube para análise de conteúdo consumido, 
                       sugestões de vídeos educacionais alinhados com seus objetivos e projetos."
          logo={<Youtube className="h-4 w-4 text-primary" />}
          isConnected={youtubeStatus.connected}
          connectedSince={youtubeConnection?.created_at}
          onConnect={() => handleConnect("youtube")}
          onDisconnect={() => handleDisconnect("youtube")}
        />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Mais integrações em breve. Fique ligado para atualizações!
        </p>
      </div>

      <motion.div 
        className="mt-12 p-6 border border-dashed rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-medium mb-2">Integrado com a Athena</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Após conectar suas plataformas, você pode fazer perguntas como:
        </p>
        
        <div className="grid gap-3 max-w-lg mx-auto">
          <div className="p-3 rounded bg-muted/30 text-sm text-start">
            "Mostrar minhas músicas mais ouvidas no Spotify"
          </div>
          <div className="p-3 rounded bg-muted/30 text-sm text-start">
            "Quais vídeos do YouTube eu assisti sobre produtividade?"
          </div>
          <div className="p-3 rounded bg-muted/30 text-sm text-start">
            "Crie uma playlist para foco com base nas minhas músicas favoritas"
          </div>
        </div>
        
        <Button 
          className="mt-6"
          onClick={() => window.location.href = "/athena"}
        >
          Conversar com Athena
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Integracoes;
