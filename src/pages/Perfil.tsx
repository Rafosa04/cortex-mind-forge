
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Edit, Activity, Layers, Check, 
  Repeat, Star, Brain, MessageSquare, Share2,
  Link, MessageCircle, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { CognitiveStats } from "@/components/Perfil/CognitiveStats";
import { Highlights } from "@/components/Perfil/Highlights";
import { PersonalFeed } from "@/components/Perfil/PersonalFeed";
import { MentalMirror } from "@/components/Perfil/MentalMirror";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export default function Perfil() {
  const [activeTab, setActiveTab] = useState("highlights");
  const { user } = useAuth();
  const { profileData, loading } = useProfile(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Frase de identidade */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center text-base sm:text-lg font-light italic text-primary/80"
        >
          "Esse sou eu. Não apenas quem fui, mas o que estou me tornando."
        </motion.p>

        {/* Seção 2: Estatísticas Cognitivas */}
        <CognitiveStats />

        {/* Abas para outras seções */}
        <Tabs 
          defaultValue="highlights" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6">
            <TabsTrigger value="highlights">Destaques</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="mirror">Espelho Mental</TabsTrigger>
            <TabsTrigger value="social">Rede</TabsTrigger>
          </TabsList>

          {/* Seção 3: Destaques do CÓRTEX */}
          <TabsContent value="highlights" className="mt-0">
            <Highlights />
          </TabsContent>

          {/* Seção 4: Feed Pessoal */}
          <TabsContent value="feed" className="mt-0">
            <PersonalFeed />
          </TabsContent>

          {/* Seção 5: Espelho Mental Dinâmico */}
          <TabsContent value="mirror" className="mt-0">
            <MentalMirror />
          </TabsContent>

          {/* Seção 6: Ações sociais rápidas */}
          <TabsContent value="social" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Conexões
                  </h3>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-accent/20">MD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Maria Dias</div>
                        <div className="text-xs text-muted-foreground">UX Designer</div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">Conectar</Button>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-accent/20">JP</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">João Paulo</div>
                        <div className="text-xs text-muted-foreground">Developer</div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">Conectar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Link className="h-5 w-5 text-primary" />
                    Ações Rápidas
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Button size="sm" variant="outline" className="flex items-center gap-2 px-2 sm:px-3 py-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Mensagem</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2 px-2 sm:px-3 py-1">
                      <Brain className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Seguir</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2 px-2 sm:px-3 py-1">
                      <Layers className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Clonar</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2 px-2 sm:px-3 py-1">
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Compartilhar</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
