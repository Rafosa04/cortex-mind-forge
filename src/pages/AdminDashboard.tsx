
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Brain, 
  Database, 
  FileText, 
  Shield,
  Bell,
  Inbox,
  ListChecks,
  MessageSquare,
  Book,
  RefreshCw
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { metrics, userStats, activityData, loading, refetch, updateUserRole } = useAdminData();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  // Verificar se o usuário tem permissão de admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (profile && profile.role !== 'admin' && profile.role !== 'master') {
      navigate("/");
      return;
    }
  }, [user, profile, navigate]);

  // Função para tornar o usuário específico um super usuário
  const makeUserSuperAdmin = async () => {
    try {
      // Buscar o usuário pelo email na tabela profiles
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (userError) {
        console.error('Erro ao buscar usuário:', userError);
        return;
      }

      // Verificar se é o usuário específico que deve ser promovido
      if (user?.email === 'brunowayne8@gmail.com') {
        // Atualizar o perfil para master
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'master' })
          .eq('id', user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
          toast({
            title: "Erro ao atualizar usuário",
            description: "Não foi possível atualizar o usuário para super admin",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Usuário atualizado",
          description: "O usuário brunowayne8@gmail.com agora é um super admin",
        });

        // Recarregar dados
        refetch();
      }
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o usuário",
        variant: "destructive"
      });
    }
  };

  // Executar a função para tornar o usuário super admin na primeira vez
  useEffect(() => {
    if (profile?.role === 'admin' || profile?.role === 'master') {
      makeUserSuperAdmin();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Carregando dashboard...</h2>
          <p className="text-muted-foreground mt-2">Por favor, aguarde.</p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch(activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Top metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Usuários cadastrados" 
                value={metrics?.totalUsers || 0} 
                icon={<Users className="h-6 w-6 text-primary" />} 
              />
              <MetricCard 
                title="Usuários ativos" 
                value={metrics?.activeUsers || 0} 
                icon={<Users className="h-6 w-6 text-green-500" />} 
              />
              <MetricCard 
                title="Total de Projetos" 
                value={metrics?.totalProjects || 0}
                icon={<Inbox className="h-6 w-6 text-blue-500" />} 
              />
              <MetricCard 
                title="Total de Hábitos" 
                value={metrics?.totalHabits || 0} 
                icon={<ListChecks className="h-6 w-6 text-yellow-500" />} 
              />
              <MetricCard 
                title="Total de Subcérebros" 
                value={metrics?.totalSubcerebros || 0} 
                icon={<Brain className="h-6 w-6 text-purple-500" />} 
              />
              <MetricCard 
                title="Posts no Connecta" 
                value={metrics?.totalPosts || 0} 
                icon={<MessageSquare className="h-6 w-6 text-cyan-500" />} 
              />
              <MetricCard 
                title="Entradas de Diário" 
                value={metrics?.totalDiaryEntries || 0} 
                icon={<Book className="h-6 w-6 text-emerald-500" />} 
              />
              <MetricCard 
                title="Consultas à Athena" 
                value={metrics?.totalAthenaLogs || 0} 
                icon={<Brain className="h-6 w-6 text-amber-500" />} 
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Atividade dos Últimos 30 Dias</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={activityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a2e', 
                            borderColor: '#333',
                            color: '#fff'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorUsers)" 
                          name="Novos Usuários"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Content Creation Chart */}
              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Criação de Conteúdo</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activityData.slice(-7)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a2e', 
                            borderColor: '#333',
                            color: '#fff'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="projects" name="Projetos" fill="#82ca9d" />
                        <Bar dataKey="habits" name="Hábitos" fill="#8884d8" />
                        <Bar dataKey="athena_calls" name="Consultas Athena" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest users table */}
            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Usuários Recentes</h3>
                  <Button variant="outline" size="sm" onClick={refetch}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Hábitos</TableHead>
                      <TableHead>Subcérebros</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userStats.slice(0, 10).map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'master' ? 'bg-red-500/20 text-red-500' :
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{user.total_projects}</TableCell>
                        <TableCell>{user.total_habits}</TableCell>
                        <TableCell>{user.total_subcerebros}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                          >
                            Toggle Admin
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("users")}>
                    Ver todos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "users":
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Usuários</h2>
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
            
            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Hábitos</TableHead>
                      <TableHead>Subcérebros</TableHead>
                      <TableHead>Último acesso</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userStats.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'master' ? 'bg-red-500/20 text-red-500' :
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{user.total_projects}</TableCell>
                        <TableCell>{user.total_habits}</TableCell>
                        <TableCell>{user.total_subcerebros}</TableCell>
                        <TableCell>{new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                          >
                            Toggle Admin
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      
      case "content":
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Conteúdo do Sistema</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total de Projetos" 
                value={metrics?.totalProjects || 0} 
                icon={<Inbox className="h-6 w-6 text-blue-500" />} 
              />
              <MetricCard 
                title="Total de Hábitos" 
                value={metrics?.totalHabits || 0} 
                icon={<ListChecks className="h-6 w-6 text-green-500" />} 
              />
              <MetricCard 
                title="Total de Subcérebros" 
                value={metrics?.totalSubcerebros || 0} 
                icon={<Brain className="h-6 w-6 text-purple-500" />} 
              />
              <MetricCard 
                title="Consultas à Athena" 
                value={metrics?.totalAthenaLogs || 0} 
                icon={<MessageSquare className="h-6 w-6 text-cyan-500" />} 
              />
            </div>

            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Distribuição de Conteúdo por Usuário</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Hábitos</TableHead>
                      <TableHead>Subcérebros</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userStats
                      .sort((a, b) => (b.total_projects + b.total_habits + b.total_subcerebros) - (a.total_projects + a.total_habits + a.total_subcerebros))
                      .slice(0, 20)
                      .map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.total_projects}</TableCell>
                          <TableCell>{user.total_habits}</TableCell>
                          <TableCell>{user.total_subcerebros}</TableCell>
                          <TableCell className="font-semibold">
                            {user.total_projects + user.total_habits + user.total_subcerebros}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <div>Selecione uma seção</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex w-64 flex-col bg-[#0C0C1C] border-r border-border/50 p-4"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary to-secondary">
              CÓRTEX ADMIN
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Painel de Controle</p>
          </div>
          
          <nav className="space-y-1">
            <div
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
                activeTab === "overview"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-accent/10"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Visão Geral</span>
            </div>
            <div
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
                activeTab === "users"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-accent/10"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Usuários</span>
            </div>
            <div
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
                activeTab === "content"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-accent/10"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Conteúdo</span>
            </div>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-border/30">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/")}>
              <Shield className="h-4 w-4" />
              <span>Voltar ao App</span>
            </Button>
          </div>
        </motion.div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <header className="bg-[#141429]/80 backdrop-blur-sm border-b border-border/50 p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Dashboard Administrativo - CÓRTEX</h2>
              <p className="text-sm text-muted-foreground">Dados em tempo real do sistema</p>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </motion.div>
  );
}

// Metric card component
function MetricCard({ title, value, icon }) {
  return (
    <Card className="bg-[#141429]/80 border-border/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
