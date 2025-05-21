
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/useAuth";
import MainLayout from "./layouts/MainLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Projetos from "./pages/Projetos";
import Habitos from "./pages/Habitos";
import Subcerebros from "./pages/Subcerebros";
import Mensagens from "./pages/Mensagens";
import Favoritos from "./pages/Favoritos";
import Salvos from "./pages/Salvos";
import Diario from "./pages/Diario";
import Agenda from "./pages/Agenda";
import Notificacoes from "./pages/Notificacoes";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Planos from "./pages/Planos";
import Landing from "./pages/Landing";
import ChatAthena from "./pages/ChatAthena";
import AthenaHistorico from "./pages/AthenaHistorico";
import Connecta from "./pages/Connecta";
import Insights from "./pages/Insights";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/landing" element={<Landing />} />
                
                {/* Rota protegida padrão (requer autenticação) */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/projetos" element={<Projetos />} />
                  <Route path="/habitos" element={<Habitos />} />
                  <Route path="/subcerebros" element={<Subcerebros />} />
                  <Route path="/mensagens" element={<Mensagens />} />
                  <Route path="/favoritos" element={<Favoritos />} />
                  <Route path="/salvos" element={<Salvos />} />
                  <Route path="/diario" element={<Diario />} />
                  <Route path="/agenda" element={<Agenda />} />
                  <Route path="/notificacoes" element={<Notificacoes />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                  <Route path="/planos" element={<Planos />} />
                  <Route path="/athena" element={<ChatAthena />} />
                  <Route path="/athena/historico" element={<AthenaHistorico />} />
                  <Route path="/connecta" element={<Connecta />} />
                  <Route path="/insights" element={<Insights />} />
                </Route>

                {/* Rota protegida de admin */}
                <Route element={<PrivateRoute requiredRole="admin" />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>
                
                {/* Rota de captura para URLs não encontradas */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
