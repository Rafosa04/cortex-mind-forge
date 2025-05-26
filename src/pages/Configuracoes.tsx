
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Zap,
  Bell,
  Plug,
  Shield,
  Settings,
  FlaskConical,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useUserIntegrations } from "@/hooks/useUserIntegrations";
import { useToast } from "@/hooks/use-toast";

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
  const { settings, loading, saving, updateSettings, resetToDefaults, clearCache } = useUserSettings();
  const { integrations, loading: integrationsLoading, toggleConnection, updatePermissions } = useUserIntegrations();
  const { toast } = useToast();

  // Função para atualizar configuração individual
  const handleSettingChange = async (key: string, value: any) => {
    await updateSettings({ [key]: value });
  };

  // Função para baixar dados do usuário (mock)
  const handleDownloadData = () => {
    const dataToDownload = {
      settings,
      integrations,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cortex-dados-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sucesso",
      description: "Dados baixados com sucesso!"
    });
  };

  if (loading || integrationsLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Carregando configurações...</span>
        </div>
      </div>
    );
  }

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
                  value={settings.theme}
                  onValueChange={(value) => value && handleSettingChange('theme', value)}
                  className="flex flex-wrap gap-2"
                >
                  <ToggleGroupItem value="dark" className="rounded px-4 py-2">Escuro</ToggleGroupItem>
                  <ToggleGroupItem value="light" className="rounded px-4 py-2">Claro</ToggleGroupItem>
                  <ToggleGroupItem value="custom" className="rounded px-4 py-2">Personalizado</ToggleGroupItem>
                </ToggleGroup>
                
                {settings.theme === "custom" && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground/70 mb-2">Cor primária</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="color" 
                          className="w-10 h-10 p-0 border-none" 
                          value={settings.custom_primary_color || "#60B5B5"}
                          onChange={(e) => handleSettingChange('custom_primary_color', e.target.value)}
                        />
                        <span className="text-xs">{settings.custom_primary_color || "#60B5B5"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/70 mb-2">Cor secundária</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="color" 
                          className="w-10 h-10 p-0 border-none" 
                          value={settings.custom_secondary_color || "#993887"}
                          onChange={(e) => handleSettingChange('custom_secondary_color', e.target.value)}
                        />
                        <span className="text-xs">{settings.custom_secondary_color || "#993887"}</span>
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
                  value={settings.display_mode}
                  onValueChange={(value) => value && handleSettingChange('display_mode', value)}
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
                  value={settings.typography}
                  onValueChange={(value) => value && handleSettingChange('typography', value)}
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
                  value={settings.animation_speed}
                  onValueChange={(value) => value && handleSettingChange('animation_speed', value)}
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
                  value={settings.athena_avatar}
                  onValueChange={(value) => value && handleSettingChange('athena_avatar', value)}
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
                      settings.theme === "dark" ? "bg-background text-foreground" : "bg-[#E6E6F0] text-[#0C0C1C]" 
                    )}>
                      <div className="text-center">
                        <div className={cn(
                          "text-lg font-semibold mb-2",
                          settings.typography === "moderna" ? "font-sans" : 
                          settings.typography === "legivel" ? "font-mono" : 
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
                  value={settings.interaction_level}
                  onValueChange={(value) => value && handleSettingChange('interaction_level', value)}
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
                  value={settings.ai_style}
                  onValueChange={(value) => value && handleSettingChange('ai_style', value)}
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
                  value={settings.interventions}
                  onValueChange={(value) => value && handleSettingChange('interventions', value)}
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
                  value={settings.memory_access}
                  onValueChange={(value) => value && handleSettingChange('memory_access', value)}
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
                  value={settings.ai_language}
                  onChange={(e) => handleSettingChange('ai_language', e.target.value)}
                  className="rounded px-3 py-2 bg-background text-foreground border border-border"
                >
                  <option value="português">Português</option>
                  <option value="english">English</option>
                  <option value="español">Español</option>
                </select>
              </div>
              
              <div>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => {
                    // Implementar recalibração da personalidade
                    toast({
                      title: "Recalibrando",
                      description: "Personalidade da Athena está sendo recalibrada..."
                    });
                  }}
                >
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
                      checked={settings.notif_messages}
                      onCheckedChange={(checked) => handleSettingChange('notif_messages', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-suggestions" className="cursor-pointer">Sugestões da IA</label>
                    <Switch
                      id="notif-suggestions"
                      checked={settings.notif_ai_suggestions}
                      onCheckedChange={(checked) => handleSettingChange('notif_ai_suggestions', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-connections" className="cursor-pointer">Conexões novas</label>
                    <Switch
                      id="notif-connections"
                      checked={settings.notif_new_connections}
                      onCheckedChange={(checked) => handleSettingChange('notif_new_connections', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-habits" className="cursor-pointer">Progresso de hábitos</label>
                    <Switch
                      id="notif-habits"
                      checked={settings.notif_habit_progress}
                      onCheckedChange={(checked) => handleSettingChange('notif_habit_progress', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="notif-weekly" className="cursor-pointer">Resumo semanal</label>
                    <Switch
                      id="notif-weekly"
                      checked={settings.notif_weekly_report}
                      onCheckedChange={(checked) => handleSettingChange('notif_weekly_report', checked)}
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
                      checked={settings.channel_app}
                      onCheckedChange={(checked) => handleSettingChange('channel_app', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="channel-email" className="cursor-pointer">Email</label>
                    <Switch
                      id="channel-email"
                      checked={settings.channel_email}
                      onCheckedChange={(checked) => handleSettingChange('channel_email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="channel-push" className="cursor-pointer">Push</label>
                    <Switch
                      id="channel-push"
                      checked={settings.channel_push}
                      onCheckedChange={(checked) => handleSettingChange('channel_push', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Frequência</h3>
                <ToggleGroup 
                  type="single" 
                  variant="outline"
                  value={settings.notification_frequency}
                  onValueChange={(value) => value && handleSettingChange('notification_frequency', value)}
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
                  <div key={integration.id} className="flex items-center justify-between p-3 border-b border-border/20 last:border-0">
                    <div>
                      <div className="font-medium">{integration.service_name}</div>
                      <div className="text-xs text-foreground/60">
                        {integration.is_connected ? 'Conectado' : 'Desconectado'}
                      </div>
                    </div>
                    <Button 
                      variant={integration.is_connected ? "outline" : "secondary"} 
                      size="sm"
                      onClick={() => toggleConnection(integration.id, integration.is_connected)}
                    >
                      {integration.is_connected ? 'Desconectar' : 'Conectar'}
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
                  value={settings.profile_visibility}
                  onValueChange={(value) => value && handleSettingChange('profile_visibility', value)}
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
                    checked={settings.subbrain_sharing}
                    onCheckedChange={(checked) => handleSettingChange('subbrain_sharing', checked)}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Histórico e Dados</h3>
                <div className="space-y-3">
                  <Button variant="outline" onClick={() => {
                    // Implementar visualização de histórico
                    toast({
                      title: "Em desenvolvimento",
                      description: "Visualização de histórico em breve..."
                    });
                  }}>
                    Visualizar histórico de atividades
                  </Button>
                  <Button variant="outline" onClick={handleDownloadData}>
                    Baixar todos os dados
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    // Implementar exclusão de conta
                    toast({
                      title: "Atenção",
                      description: "Funcionalidade de exclusão em desenvolvimento...",
                      variant: "destructive"
                    });
                  }}>
                    Deletar conta
                  </Button>
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
                    checked={settings.economy_mode}
                    onCheckedChange={(checked) => handleSettingChange('economy_mode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Modo offline</h3>
                    <p className="text-xs text-foreground/60">Permite usar o app sem internet</p>
                  </div>
                  <Switch
                    id="offline-mode"
                    checked={settings.offline_mode}
                    onCheckedChange={(checked) => handleSettingChange('offline_mode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Auto-save de células</h3>
                    <p className="text-xs text-foreground/60">Salva conteúdo automaticamente</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.auto_save}
                    onCheckedChange={(checked) => handleSettingChange('auto_save', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Compressão visual</h3>
                    <p className="text-xs text-foreground/60">Otimiza carregamento de imagens</p>
                  </div>
                  <Switch
                    id="visual-compression"
                    checked={settings.visual_compression}
                    onCheckedChange={(checked) => handleSettingChange('visual_compression', checked)}
                  />
                </div>
              </div>
              
              <div>
                <Button variant="outline" onClick={clearCache} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Limpar cache local
                </Button>
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
                    checked={settings.lab_neuronal_feed}
                    onCheckedChange={(checked) => handleSettingChange('lab_neuronal_feed', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border-b border-border/20">
                  <div>
                    <h3 className="font-semibold">Subcérebros colaborativos</h3>
                    <p className="text-xs text-foreground/60">Compartilhe e colabore em subcérebros</p>
                  </div>
                  <Switch
                    id="collaborative-subbrains"
                    checked={settings.lab_collaborative_subbrains}
                    onCheckedChange={(checked) => handleSettingChange('lab_collaborative_subbrains', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border-b border-border/20">
                  <div>
                    <h3 className="font-semibold">Geração de projetos por voz</h3>
                    <p className="text-xs text-foreground/60">Crie projetos através de comandos de voz</p>
                  </div>
                  <Switch
                    id="voice-generation"
                    checked={settings.lab_voice_generation}
                    onCheckedChange={(checked) => handleSettingChange('lab_voice_generation', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3">
                  <div>
                    <h3 className="font-semibold">Modo imersivo</h3>
                    <p className="text-xs text-foreground/60">Visualização em tela cheia com foco total</p>
                  </div>
                  <Switch
                    id="immersive-mode"
                    checked={settings.lab_immersive_mode}
                    onCheckedChange={(checked) => handleSettingChange('lab_immersive_mode', checked)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Floating restore button */}
          <div className="fixed bottom-6 right-6">
            <Button 
              variant="outline" 
              className="bg-background/60 backdrop-blur-sm"
              onClick={resetToDefaults}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Restaurar padrões
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
