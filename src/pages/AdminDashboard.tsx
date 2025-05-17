
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
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
  Bell
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from "recharts";

// Mock data for demonstration
const mockMetrics = {
  registeredUsers: 7814,
  activeUsersToday: 1064,
  projectsLastDay: 1209,
  activeHabits: 5324,
  diaryEntries: 2798,
  athenaCallsWeek: 12408,
  mrrRevenue: 42750,
  oneTimeContributions: 88312
};

const mockUserGrowth = [
  { month: 'Jan', users: 2100 },
  { month: 'Feb', users: 3200 },
  { month: 'Mar', users: 4500 },
  { month: 'Apr', users: 5100 },
  { month: 'May', users: 6300 },
  { month: 'Jun', users: 7814 }
];

const mockRevenueData = [
  { month: 'Jan', recorrente: 15200, unica: 24000 },
  { month: 'Feb', recorrente: 22800, unica: 18000 },
  { month: 'Mar', recorrente: 28500, unica: 35000 },
  { month: 'Apr', recorrente: 32100, unica: 22000 },
  { month: 'May', recorrente: 38400, unica: 30000 },
  { month: 'Jun', recorrente: 42750, unica: 88312 }
];

const mockModuleUsage = [
  { name: 'Projetos', value: 42 },
  { name: 'Hábitos', value: 28 },
  { name: 'Subcérebros', value: 18 },
  { name: 'Diário', value: 12 }
];

const mockUsersTable = [
  { id: 1, name: 'Ana Silva', email: 'ana@exemplo.com', plan: 'Premium', status: 'Ativo', lastAccess: '2 horas atrás' },
  { id: 2, name: 'Carlos Mendes', email: 'carlos@exemplo.com', plan: 'Fundador', status: 'Vitalício', lastAccess: '15 min atrás' },
  { id: 3, name: 'Mariana Costa', email: 'mari@exemplo.com', plan: 'Básico', status: 'Ativo', lastAccess: '1 dia atrás' },
  { id: 4, name: 'Pedro Santos', email: 'pedro@exemplo.com', plan: 'Premium', status: 'Inadimplente', lastAccess: '7 dias atrás' },
  { id: 5, name: 'Júlia Rocha', email: 'julia@exemplo.com', plan: 'Pioneiro', status: 'Vitalício', lastAccess: '5 horas atrás' }
];

const mockSubscriptions = [
  { id: 1, name: 'Ana Silva', plan: 'Premium (R$49)', email: 'ana@exemplo.com', date: '12/03/2023', status: 'Ativo', gateway: 'Stripe' },
  { id: 2, name: 'Mariana Costa', email: 'mari@exemplo.com', plan: 'Básico (R$19)', date: '05/01/2023', status: 'Ativo', gateway: 'Pix' },
  { id: 3, name: 'Pedro Santos', email: 'pedro@exemplo.com', plan: 'Premium (R$49)', date: '22/04/2023', status: 'Inadimplente', gateway: 'Stripe' },
  { id: 4, name: 'Roberto Almeida', email: 'roberto@exemplo.com', plan: 'Básico (R$19)', date: '17/05/2023', status: 'Ativo', gateway: 'Pix' },
  { id: 5, name: 'Teresa Martins', email: 'teresa@exemplo.com', plan: 'Premium (R$49)', date: '30/05/2023', status: 'Ativo', gateway: 'Stripe' }
];

const mockContributions = [
  { id: 1, name: 'Carlos Mendes', email: 'carlos@exemplo.com', value: 'R$297', type: 'Fundador', timestamp: '12/05/2023' },
  { id: 2, name: 'Júlia Rocha', email: 'julia@exemplo.com', value: 'R$197', type: 'Pioneiro', timestamp: '15/05/2023' },
  { id: 3, name: 'Fernando Lima', email: 'fernando@exemplo.com', value: 'R$297', type: 'Fundador', timestamp: '01/06/2023' },
  { id: 4, name: 'Amanda Souza', email: 'amanda@exemplo.com', value: 'R$197', type: 'Pioneiro', timestamp: '10/06/2023' },
  { id: 5, name: 'Rodrigo Pereira', email: 'rodrigo@exemplo.com', value: 'R$297', type: 'Fundador', timestamp: '17/06/2023' }
];

const mockInvestors = [
  { id: 1, name: 'João Macedo', value: 'R$5.000', expectation: 'Quota futura', status: 'Pendente' },
  { id: 2, name: 'Luciana Martins', value: 'R$10.000', expectation: 'Consultoria', status: 'Em análise' },
  { id: 3, name: 'Victor Gonçalves', value: 'R$25.000', expectation: 'Quota futura', status: 'Aprovado' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Admin authentication check - This would typically connect to your backend
  useEffect(() => {
    // Mock authentication check - Replace with your actual auth logic
    const checkAdminAuth = async () => {
      // This would be a call to your authentication service
      // For now, we'll just simulate a successful auth
      const mockIsAdmin = true;
      
      if (mockIsAdmin) {
        setIsAuthorized(true);
      } else {
        // Redirect non-admins
        navigate("/");
      }
    };
    
    checkAdminAuth();
  }, [navigate]);
  
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Verificando credenciais...</h2>
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
                value={mockMetrics.registeredUsers} 
                icon={<Users className="h-6 w-6 text-primary" />} 
              />
              <MetricCard 
                title="Usuários ativos hoje" 
                value={mockMetrics.activeUsersToday} 
                icon={<Users className="h-6 w-6 text-green-500" />} 
              />
              <MetricCard 
                title="Projetos (24h)" 
                value={mockMetrics.projectsLastDay}
                icon={<Calendar className="h-6 w-6 text-blue-500" />} 
              />
              <MetricCard 
                title="Hábitos ativos" 
                value={mockMetrics.activeHabits} 
                icon={<TrendingUp className="h-6 w-6 text-yellow-500" />} 
              />
              <MetricCard 
                title="Entradas de diário" 
                value={mockMetrics.diaryEntries} 
                icon={<FileText className="h-6 w-6 text-purple-500" />} 
              />
              <MetricCard 
                title="Chamadas à Athena (7 dias)" 
                value={mockMetrics.athenaCallsWeek} 
                icon={<Brain className="h-6 w-6 text-cyan-500" />} 
              />
              <MetricCard 
                title="Receita MRR (R$)" 
                value={mockMetrics.mrrRevenue} 
                icon={<CreditCard className="h-6 w-6 text-emerald-500" />} 
              />
              <MetricCard 
                title="Contribuições únicas (R$)" 
                value={mockMetrics.oneTimeContributions} 
                icon={<CreditCard className="h-6 w-6 text-amber-500" />} 
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Evolução de Usuários</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={mockUserGrowth}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
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
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Receita por Tipo</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockRevenueData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a2e', 
                            borderColor: '#333',
                            color: '#fff'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="recorrente" name="Assinatura" fill="#82ca9d" />
                        <Bar dataKey="unica" name="Contribuição" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System status and quick links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-[#141429]/80 border-border/50 col-span-2">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Estado do Sistema</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>API Athena</span>
                      <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Banco de Dados (Supabase)</span>
                      <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Gateway de Pagamento</span>
                      <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Última sincronização</span>
                      <span className="text-xs text-muted-foreground">Hoje às 15:42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Último backup</span>
                      <span className="text-xs text-muted-foreground">Hoje às 04:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Ações Rápidas</h3>
                  <div className="space-y-2">
                    <Button className="w-full flex justify-between items-center">
                      <span>Enviar broadcast</span>
                      <Bell size={16} />
                    </Button>
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>Ativar função beta</span>
                      <Database size={16} />
                    </Button>
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>Backup manual</span>
                      <Shield size={16} />
                    </Button>
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>Exportar relatório</span>
                      <FileText size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest users table */}
            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Últimos Usuários</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsersTable.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.plan}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Ativo' ? 'bg-green-500/20 text-green-500' :
                            user.status === 'Vitalício' ? 'bg-purple-500/20 text-purple-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.lastAccess}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Ver</Button>
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
            <h2 className="text-2xl font-bold">Usuários</h2>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Todos</Button>
                <Button variant="outline" size="sm">Ativos</Button>
                <Button variant="outline" size="sm">Fundadores</Button>
                <Button variant="outline" size="sm">Pioneiros</Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Exportar CSV</Button>
                <Button variant="outline" size="sm">Filtrar</Button>
              </div>
            </div>
            
            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsersTable.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.plan}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Ativo' ? 'bg-green-500/20 text-green-500' :
                            user.status === 'Vitalício' ? 'bg-purple-500/20 text-purple-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.lastAccess}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="ghost" size="sm">Ver</Button>
                          <Button variant="ghost" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      
      case "financial":
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Financeiro</h2>
            
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total de assinantes" 
                value={1487} 
                icon={<Users className="h-6 w-6 text-primary" />} 
              />
              <MetricCard 
                title="Plano R$19/mês" 
                value={982} 
                icon={<CreditCard className="h-6 w-6 text-green-500" />} 
              />
              <MetricCard 
                title="Plano R$49/mês" 
                value={505} 
                icon={<CreditCard className="h-6 w-6 text-blue-500" />} 
              />
              <MetricCard 
                title="Receita mensal (MRR)" 
                value={"R$ " + mockMetrics.mrrRevenue} 
                icon={<TrendingUp className="h-6 w-6 text-emerald-500" />} 
              />
            </div>
            
            {/* Subscriptions Tab */}
            <div>
              <h3 className="text-xl font-medium mb-4">Assinaturas Recorrentes</h3>
              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Gateway</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSubscriptions.map(sub => (
                        <TableRow key={sub.id}>
                          <TableCell>{sub.name}</TableCell>
                          <TableCell>{sub.plan}</TableCell>
                          <TableCell>{sub.email}</TableCell>
                          <TableCell>{sub.date}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              sub.status === 'Ativo' ? 'bg-green-500/20 text-green-500' :
                              'bg-red-500/20 text-red-500'
                            }`}>
                              {sub.status}
                            </span>
                          </TableCell>
                          <TableCell>{sub.gateway}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Ver transações</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* One-time contributions */}
            <div>
              <h3 className="text-xl font-medium mb-4">Contribuições Únicas</h3>
              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockContributions.map(contrib => (
                        <TableRow key={contrib.id}>
                          <TableCell>{contrib.name}</TableCell>
                          <TableCell>{contrib.email}</TableCell>
                          <TableCell>{contrib.value}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              contrib.type === 'Fundador' ? 'bg-purple-500/20 text-purple-500' :
                              'bg-blue-500/20 text-blue-500'
                            }`}>
                              {contrib.type}
                            </span>
                          </TableCell>
                          <TableCell>{contrib.timestamp}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Ver comprovante</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* Investment proposals */}
            <div>
              <h3 className="text-xl font-medium mb-4">Propostas de Investimento</h3>
              <Card className="bg-[#141429]/80 border-border/50">
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Valor proposto</TableHead>
                        <TableHead>Expectativa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInvestors.map(investor => (
                        <TableRow key={investor.id}>
                          <TableCell>{investor.name}</TableCell>
                          <TableCell>{investor.value}</TableCell>
                          <TableCell>{investor.expectation}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              investor.status === 'Aprovado' ? 'bg-green-500/20 text-green-500' :
                              investor.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-500' :
                              'bg-blue-500/20 text-blue-500'
                            }`}>
                              {investor.status}
                            </span>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="ghost" size="sm">Responder</Button>
                            <Button variant="ghost" size="sm">Marcar</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case "operations":
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Operações</h2>
            
            {/* System Status */}
            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Estado do Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Athena</span>
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Banco de Dados (Supabase)</span>
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gateway de Pagamento</span>
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Integração com Email</span>
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sistema de Notificações</span>
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-md text-xs">Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Critical Error Logs */}
            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Logs de Erro Críticos</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium text-red-400">Falha na sincronização</span>
                      <span className="text-xs text-muted-foreground">Hoje às 14:22</span>
                    </div>
                    <p className="text-sm mt-1">Tentativa de sincronização com serviço externo falhou após 3 tentativas</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium text-yellow-400">Acesso não autorizado</span>
                      <span className="text-xs text-muted-foreground">Ontem às 23:15</span>
                    </div>
                    <p className="text-sm mt-1">Múltiplas tentativas de acesso não autorizado detectadas</p>
                  </div>
                </div>
                <Button className="mt-4" variant="outline" size="sm">Ver todos os logs</Button>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card className="bg-[#141429]/80 border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Ações Operacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full flex justify-between items-center">
                    <span>Enviar broadcast</span>
                    <Bell size={16} />
                  </Button>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>Ativar função beta</span>
                    <Database size={16} />
                  </Button>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>Backup manual</span>
                    <Shield size={16} />
                  </Button>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>Exportar relatório</span>
                    <FileText size={16} />
                  </Button>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>Agendar manutenção</span>
                    <Calendar size={16} />
                  </Button>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>Limpar cache</span>
                    <Database size={16} />
                  </Button>
                </div>
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
              onClick={() => setActiveTab("financial")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
                activeTab === "financial"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-accent/10"
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Financeiro</span>
            </div>
            <div
              onClick={() => setActiveTab("operations")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
                activeTab === "operations"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-accent/10"
              }`}
            >
              <Database className="h-5 w-5" />
              <span>Operações</span>
            </div>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-border/30">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/")}>
              <Shield className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </motion.div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <header className="bg-[#141429]/80 backdrop-blur-sm border-b border-border/50 p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Painel Administrativo</h2>
              <p className="text-sm text-muted-foreground">Aqui nasce o controle da mente coletiva.</p>
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
            <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

