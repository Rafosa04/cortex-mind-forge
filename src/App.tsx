
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/layouts/MainLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Landing from '@/pages/Landing';
import Subcerebros from '@/pages/Subcerebros';
import NotFound from '@/pages/NotFound';
import './App.css';
import Projetos from '@/pages/Projetos';
import Insights from '@/pages/Insights';
import Habitos from '@/pages/Habitos';
import ChatAthena from '@/pages/ChatAthena';
import AthenaHistorico from '@/pages/AthenaHistorico';
import AthenaContexto from '@/pages/AthenaContexto';
import Perfil from '@/pages/Perfil';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import Mensagens from '@/pages/Mensagens';
import Configuracoes from '@/pages/Configuracoes';
import Favoritos from '@/pages/Favoritos';
import Salvos from '@/pages/Salvos';
import Agenda from '@/pages/Agenda';
import Diario from '@/pages/Diario';
import Notificacoes from '@/pages/Notificacoes';
import Connecta from '@/pages/Connecta';
import Integracoes from '@/pages/Integracoes';
import Planos from '@/pages/Planos';
import Onboarding from '@/pages/Onboarding';
import AdminDashboard from '@/pages/AdminDashboard';
import { InitializeRealtime } from '@/components/InitializeRealtime';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/projetos" element={<Projetos />} />
              <Route path="/subcerebros" element={<Subcerebros />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/habitos" element={<Habitos />} />
              <Route path="/athena" element={<ChatAthena />} />
              <Route path="/athena/historico" element={<AthenaHistorico />} />
              <Route path="/athena/contexto" element={<AthenaContexto />} />
              <Route path="/mensagens" element={<Mensagens />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/salvos" element={<Salvos />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/diario" element={<Diario />} />
              <Route path="/notificacoes" element={<Notificacoes />} />
              <Route path="/connecta" element={<Connecta />} />
              <Route path="/integracoes" element={<Integracoes />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
      <Toaster />
      <SonnerToaster />
      <InitializeRealtime />
    </ThemeProvider>
  );
}

export default App;
