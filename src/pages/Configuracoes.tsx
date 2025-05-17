
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Zap,
  Bell,
  Plug,
  Shield,
  Settings,
  FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  { id: "visual", label: "Visual", icon: LayoutDashboard },
  { id: "athena", label: "IA Athena", icon: Zap },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "integrations", label: "Integrações", icon: Plug },
  { id: "privacy", label: "Privacidade", icon: Shield },
  { id: "performance", label: "Desempenho", icon: Settings },
  { id: "lab", label: "Laboratório", icon: FlaskConical }
];

export default function Configuracoes() {
  const [activeSection, setActiveSection] = useState("visual");
  const [theme, setTheme] = useState("dark");
  const [displayMode, setDisplayMode] = useState("minimalista");
  const [typography, setTypography] = useState("moderna");
  const [animationSpeed, setAnimationSpeed] = useState("fluida");
  const [athenaAvatar, setAthenaAvatar] = useState("ativado");
  
  // IA Athena settings
  const [interactionLevel, setInteractionLevel] = useState("media");
  const [aiStyle, setAiStyle] = useState("neutra");
  const [interventions, setInterventions] = useState("somente-contexto");
  const [memoryAccess, setMemoryAccess] = useState("permitir");
  const [aiLanguage, setAiLanguage] = useState("português");
  
  // Notifications settings
  const [notificationPreferences, setNotificationPreferences] = useState({
    messages: true,
    aiSuggestions: true,
    newConnections: true,
    habitProgress: true,
    weeklyReport: true
  });
  
  const [notificationChannels, setNotificationChannels] = useState({
    app: true,
    email: false,
    push: true
  });
  
  const [notificationFrequency, setNotificationFrequency] = useState("imediato");
  
  // Integrations mock data
  const integrations = [
    { name: "Spotify", connected: true },
    { name: "YouTube", connected: false },
    { name: "Google Agenda", connected: true },
    { name: "Alexa", connected: false },
    { name: "RSS/Podcasts", connected: false }
  ];
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("privado");
  const [subbrainSharing, setSubbrainSharing] = useState(false);
  
  // Performance settings
  const [economyMode, setEconomyMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [visualCompression, setVisualCompression] = useState(false);
  
  // Lab features
  const [labFeatures, setLabFeatures] = useState({
    neuronalFeed: false,
    collaborativeSubbrains: false,
    voiceGeneration: false,
    immersiveMode: false
  });

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full md:w-64 flex-shrink-0"
      >
        <Card className="bg-card/60 backdrop-blur-sm shadow-lg border-primary/10 h-full">
          <CardContent className="p-4">
            <div className="text-lg font-bold text-secondary mb-6 mt-2">Configurações</div>
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className={`justify-start ${activeSection === item.id ? "bg-secondary text-secondary-foreground" : "text-foreground/80"}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Area */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-card/60 backdrop-blur-sm shadow-lg border-primary/10 p-6">
          <div className="text-xs text-foreground/50 mb-2">Configurações • {menuItems.find(item => item.id === activeSection)?.label}</div>
          <div className="text-xl font-semibold text-secondary mb-6">
            {activeSection === "visual" && "Visual e Tema"}
            {activeSection === "athena" && "IA Athena"}
            {activeSection === "notifications" && "Notificações"}
            {activeSection === "integrations" && "Integrações"}
            {activeSection === "privacy" && "Privacidade e Conta"}
            {activeSection === "performance" && "Desempenho e Acessibilidade"}
            {activeSection === "lab" && "Laboratório de Funcionalidades (Beta)"}
          </div>
          
          <div className="text-sm text-foreground/60 italic mb-8">
            "Seu CÓRTEX. Seu jeito. Seu ritmo."
          </div>

          {/* Visual Section */}
          {activeSection === "visual" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold mb-4">Tema</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={theme}
                  onValueChange={(value) => value && setTheme(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="dark" className="rounded px-4 py-2">Escuro</ToggleGroupItem>
                  <ToggleGroupItem value="light" className="rounded px-4 py-2">Claro</ToggleGroupItem>
                  <ToggleGroupItem value="custom" className="rounded px-4 py-2">Personalizado</ToggleGroupItem>
                </ToggleGroup>
                
                {theme === "custom" && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground/70 mb-2">Cor primária</label>
                      <div className="flex items-center gap-2">
                        <Input type="color" className="w-10 h-10 p-0 border-none" defaultValue="#60B5B5" />
                        <span className="text-xs">#60B5B5</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/70 mb-2">Cor secundária</label>
                      <div className="flex items-center gap-2">
                        <Input type="color" className="w-10 h-10 p-0 border-none" defaultValue="#993887" />
                        <span className="text-xs">#993887</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Estilo de exibição</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={displayMode}
                  onValueChange={(value) => value && setDisplayMode(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="minimalista" className="rounded px-4 py-2">Minimalista</ToggleGroupItem>
                  <ToggleGroupItem value="neuronal" className="rounded px-4 py-2">Neuronal</ToggleGroupItem>
                  <ToggleGroupItem value="expandido" className="rounded px-4 py-2">Expandido</ToggleGroupItem>
                  <ToggleGroupItem value="zen" className="rounded px-4 py-2">Zen</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Tipografia</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={typography}
                  onValueChange={(value) => value && setTypography(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="moderna" className="rounded px-4 py-2">Moderna</ToggleGroupItem>
                  <ToggleGroupItem value="legivel" className="rounded px-4 py-2">Alta legibilidade</ToggleGroupItem>
                  <ToggleGroupItem value="criativa" className="rounded px-4 py-2">Criativa</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Velocidade de animações</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={animationSpeed}
                  onValueChange={(value) => value && setAnimationSpeed(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="fluida" className="rounded px-4 py-2">Fluida</ToggleGroupItem>
                  <ToggleGroupItem value="rapida" className="rounded px-4 py-2">Rápida</ToggleGroupItem>
                  <ToggleGroupItem value="desligada" className="rounded px-4 py-2">Desligada</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Avatar de Athena</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={athenaAvatar}
                  onValueChange={(value) => value && setAthenaAvatar(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="ativado" className="rounded px-4 py-2">Ativado</ToggleGroupItem>
                  <ToggleGroupItem value="mini" className="rounded px-4 py-2">Mini</ToggleGroupItem>
                  <ToggleGroupItem value="oculto" className="rounded px-4 py-2">Oculto</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="pt-4 border-t border-border/40">
                <Card className="bg-card/40 border-primary/10">
                  <CardContent className="p-6">
                    <div className="text-sm mb-2 text-primary/80">Pré-visualização</div>
                    <div className={cn(
                      "h-32 flex items-center justify-center rounded-lg",
                      theme === "dark" ? "bg-background text-foreground" : "bg-[#E6E6F0] text-[#0C0C1C]" 
                    )}>
                      <div className="text-center">
                        <div className={cn(
                          "text-lg font-semibold mb-2",
                          typography === "moderna" ? "font-sans" : 
                          typography === "legivel" ? "font-mono" : 
                          "font-serif"
                        )}>
                          Pré-visualização do tema
                        </div>
                        <div className="text-sm opacity-80">Este é o estilo visual escolhido.</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* IA Athena Section */}
          {activeSection === "athena" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold mb-4">Nível de interação</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={interactionLevel}
                  onValueChange={(value) => value && setInteractionLevel(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="alta" className="rounded px-4 py-2">Alta</ToggleGroupItem>
                  <ToggleGroupItem value="media" className="rounded px-4 py-2">Média</ToggleGroupItem>
                  <ToggleGroupItem value="baixa" className="rounded px-4 py-2">Baixa</ToggleGroupItem>
                  <ToggleGroupItem value="manual" className="rounded px-4 py-2">Manual</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Estilo da IA</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={aiStyle}
                  onValueChange={(value) => value && setAiStyle(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="neutra" className="rounded px-4 py-2">Neutra</ToggleGroupItem>
                  <ToggleGroupItem value="reflexiva" className="rounded px-4 py-2">Reflexiva</ToggleGroupItem>
                  <ToggleGroupItem value="estimulante" className="rounded px-4 py-2">Estimulante</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Intervenções</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={interventions}
                  onValueChange={(value) => value && setInterventions(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="ativadas" className="rounded px-4 py-2">Ativadas</ToggleGroupItem>
                  <ToggleGroupItem value="somente-contexto" className="rounded px-4 py-2">Somente em contexto</ToggleGroupItem>
                  <ToggleGroupItem value="desligadas" className="rounded px-4 py-2">Desligadas</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Acesso à memória</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={memoryAccess}
                  onValueChange={(value) => value && setMemoryAccess(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="permitir" className="rounded px-4 py-2">Permitir</ToggleGroupItem>
                  <ToggleGroupItem value="restringir" className="rounded px-4 py-2">Restringir</ToggleGroupItem>
                  <ToggleGroupItem value="apagar" className="rounded px-4 py-2">Apagar dados</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Idioma da IA</h3>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="rounded px-3 py-2 bg-background text-foreground border border-border"
                >
                  <option value="português">Português</option>
                  <option value="english">English</option>
                  <option value="español">Español</option>
                </select>
              </div>
              
              <div>
                <Button variant="secondary" className="mt-4">
                  Recalibrar personalidade da Athena
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold mb-4">Tipos de notificação</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-messages" className="cursor-pointer">Mensagens</label>
                    <Switch
                      id="notif-messages"
                      checked={notificationPreferences.messages}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences({...notificationPreferences, messages: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-suggestions" className="cursor-pointer">Sugestões da IA</label>
                    <Switch
                      id="notif-suggestions"
                      checked={notificationPreferences.aiSuggestions}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences({...notificationPreferences, aiSuggestions: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-connections" className="cursor-pointer">Conexões novas</label>
                    <Switch
                      id="notif-connections"
                      checked={notificationPreferences.newConnections}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences({...notificationPreferences, newConnections: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-habits" className="cursor-pointer">Progresso de hábitos</label>
                    <Switch
                      id="notif-habits"
                      checked={notificationPreferences.habitProgress}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences({...notificationPreferences, habitProgress: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-weekly" className="cursor-pointer">Resumo semanal</label>
                    <Switch
                      id="notif-weekly"
                      checked={notificationPreferences.weeklyReport}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences({...notificationPreferences, weeklyReport: checked})
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Canais</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="channel-app" className="cursor-pointer">App</label>
                    <Switch
                      id="channel-app"
                      checked={notificationChannels.app}
                      onCheckedChange={(checked) => 
                        setNotificationChannels({...notificationChannels, app: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="channel-email" className="cursor-pointer">Email</label>
                    <Switch
                      id="channel-email"
                      checked={notificationChannels.email}
                      onCheckedChange={(checked) => 
                        setNotificationChannels({...notificationChannels, email: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="channel-push" className="cursor-pointer">Push</label>
                    <Switch
                      id="channel-push"
                      checked={notificationChannels.push}
                      onCheckedChange={(checked) => 
                        setNotificationChannels({...notificationChannels, push: checked})
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Frequência</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={notificationFrequency}
                  onValueChange={(value) => value && setNotificationFrequency(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="imediato" className="rounded px-4 py-2">Imediato</ToggleGroupItem>
                  <ToggleGroupItem value="diario" className="rounded px-4 py-2">Diário</ToggleGroupItem>
                  <ToggleGroupItem value="silencioso" className="rounded px-4 py-2">Silencioso</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          )}

          {/* Integrations Section */}
          {activeSection === "integrations" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Serviços conectáveis</h3>
                {integrations.map(integration => (
                  <div key={integration.name} className="flex items-center justify-between p-3 border-b border-border/20 last:border-0">
                    <div>
                      <div className="font-medium">{integration.name}</div>
                      <div className="text-xs text-foreground/60">
                        {integration.connected ? 'Conectado' : 'Desconectado'}
                      </div>
                    </div>
                    <Button variant={integration.connected ? "outline" : "secondary"} size="sm">
                      {integration.connected ? 'Desconectar' : 'Conectar'}
                    </Button>
                  </div>
                ))}
              </div>
              
              <div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">Personalizar permissões</Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3 p-3 rounded-md bg-background/20">
                    <div className="flex items-center gap-2">
                      <Checkbox id="perm-read" />
                      <label htmlFor="perm-read" className="text-sm">Permissão de leitura</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="perm-write" />
                      <label htmlFor="perm-write" className="text-sm">Permissão de escrita</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="perm-profile" />
                      <label htmlFor="perm-profile" className="text-sm">Acesso ao perfil</label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          )}
          
          {/* Privacy Section */}
          {activeSection === "privacy" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold mb-4">Visibilidade do perfil</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={profileVisibility}
                  onValueChange={(value) => value && setProfileVisibility(value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="publico" className="rounded px-4 py-2">Público</ToggleGroupItem>
                  <ToggleGroupItem value="privado" className="rounded px-4 py-2">Privado</ToggleGroupItem>
                  <ToggleGroupItem value="conexoes" className="rounded px-4 py-2">Apenas conexões</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="subbrain-sharing" className="cursor-pointer">Compartilhamento de subcérebros</label>
                  <Switch
                    id="subbrain-sharing"
                    checked={subbrainSharing}
                    onCheckedChange={setSubbrainSharing}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Histórico e Dados</h3>
                <div className="space-y-3">
                  <Button variant="outline">Visualizar histórico de atividades</Button>
                  <Button variant="outline">Baixar todos os dados</Button>
                  <Button variant="destructive">Deletar conta</Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Performance Section */}
          {activeSection === "performance" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Modo econômico</h3>
                    <p className="text-xs text-foreground/60">Reduz animações e processamento</p>
                  </div>
                  <Switch
                    id="economy-mode"
                    checked={economyMode}
                    onCheckedChange={setEconomyMode}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Modo offline</h3>
                    <p className="text-xs text-foreground/60">Permite usar o app sem internet</p>
                  </div>
                  <Switch
                    id="offline-mode"
                    checked={offlineMode}
                    onCheckedChange={setOfflineMode}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Auto-save de células</h3>
                    <p className="text-xs text-foreground/60">Salva conteúdo automaticamente</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Compressão visual</h3>
                    <p className="text-xs text-foreground/60">Otimiza carregamento de imagens</p>
                  </div>
                  <Switch
                    id="visual-compression"
                    checked={visualCompression}
                    onCheckedChange={setVisualCompression}
                  />
                </div>
              </div>
              
              <div>
                <Button variant="outline">Limpar cache local</Button>
              </div>
            </div>
          )}
          
          {/* Lab Section */}
          {activeSection === "lab" && (
            <div className="space-y-6">
              <p className="text-sm bg-primary/10 text-primary p-3 rounded-md border border-primary/30">
                ⚠️ Aviso: Funcionalidades experimentais em fase beta. Podem conter instabilidades.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-b border-border/20">
                  <div>
                    <h3 className="font-semibold">Feed neuronal experimental</h3>
                    <p className="text-xs text-foreground/60">Visualização alternativa do feed de conteúdos</p>
                  </div>
                  <Switch
                    id="neuronal-feed"
                    checked={labFeatures.neuronalFeed}
                    onCheckedChange={(checked) => 
                      setLabFeatures({...labFeatures, neuronalFeed: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border-b border-border/20">
                  <div>
                    <h3 className="font-semibold">Subcérebros colaborativos</h3>
                    <p className="text-xs text-foreground/60">Compartilhe e colabore em subcérebros</p>
                  </div>
                  <Switch
                    id="collaborative-subbrains"
                    checked={labFeatures.collaborativeSubbrains}
                    onCheckedChange={(checked) => 
                      setLabFeatures({...labFeatures, collaborativeSubbrains: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border-b border-border/20">
                  <div>
                    <h3 className="font-semibold">Geração de projetos por voz</h3>
                    <p className="text-xs text-foreground/60">Crie projetos através de comandos de voz</p>
                  </div>
                  <Switch
                    id="voice-generation"
                    checked={labFeatures.voiceGeneration}
                    onCheckedChange={(checked) => 
                      setLabFeatures({...labFeatures, voiceGeneration: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3">
                  <div>
                    <h3 className="font-semibold">Modo imersivo</h3>
                    <p className="text-xs text-foreground/60">Visualização em tela cheia com foco total</p>
                  </div>
                  <Switch
                    id="immersive-mode"
                    checked={labFeatures.immersiveMode}
                    onCheckedChange={(checked) => 
                      setLabFeatures({...labFeatures, immersiveMode: checked})
                    }
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Floating restore button */}
          <div className="fixed bottom-6 right-6">
            <Button variant="outline" className="bg-background/60 backdrop-blur-sm">
              Restaurar padrões
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
