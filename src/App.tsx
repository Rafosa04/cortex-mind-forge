
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/useAuth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Landing from "./pages/Landing";
import ChatAthena from "./pages/ChatAthena";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { realtimeManager } from "./utils/optimizedSupabaseUtils";
import { ReactNode } from "react";

// Lazy-loaded pages
import {
  ProjetosPage,
  HabitosPage,
  SubcerebrosPage,
  AthenaHistoricoPage,
  AthenaContextoPage,
  MensagensPage,
  FavoritosPage,
  SalvosPage,
  DiarioPage,
  AgendaPage,
  NotificacoesPage,
  PerfilPage,
  ConfiguracoesPage,
  IntegracoesPage,
  PlanosPage,
  ConnexaPage,
  InsightsPage,
  DashboardPage,
  AdminDashboardPage,
} from "./components/LazyPages";

// Optimized Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.message?.includes('JWT') || error?.message?.includes('Row Level Security')) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

// Component to initialize Supabase realtime subscriptions
interface InitializeRealtimeProps {
  children: ReactNode;
}

function InitializeRealtime({ children }: InitializeRealtimeProps) {
  useEffect(() => {
    console.log('Initializing realtime subscriptions...');

    // Subscribe to key tables for real-time updates
    const unsubscribeProjects = realtimeManager.subscribeToTable(
      'projects',
      (payload) => {
        console.log('Projects table changed:', payload);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    );

    const unsubscribeProjectSteps = realtimeManager.subscribeToTable(
      'project_steps',
      (payload) => {
        console.log('Project steps table changed:', payload);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    );

    const unsubscribeHabits = realtimeManager.subscribeToTable(
      'habits',
      (payload) => {
        console.log('Habits table changed:', payload);
        queryClient.invalidateQueries({ queryKey: ['habits'] });
      }
    );

    const unsubscribeHabitCheckIns = realtimeManager.subscribeToTable(
      'habit_check_ins',
      (payload) => {
        console.log('Habit check-ins table changed:', payload);
        queryClient.invalidateQueries({ queryKey: ['habits'] });
      }
    );

    // Cleanup function
    return () => {
      unsubscribeProjects();
      unsubscribeProjectSteps();
      unsubscribeHabits();
      unsubscribeHabitCheckIns();
    };
  }, []);

  return <>{children}</>;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <InitializeRealtime>
                <MainLayout>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/landing" element={<Landing />} />
                    
                    {/* Protected routes */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/projetos" element={<ProjetosPage />} />
                      <Route path="/habitos" element={<HabitosPage />} />
                      <Route path="/subcerebros" element={<SubcerebrosPage />} />
                      <Route path="/mensagens" element={<MensagensPage />} />
                      <Route path="/favoritos" element={<FavoritosPage />} />
                      <Route path="/salvos" element={<SalvosPage />} />
                      <Route path="/diario" element={<DiarioPage />} />
                      <Route path="/agenda" element={<AgendaPage />} />
                      <Route path="/notificacoes" element={<NotificacoesPage />} />
                      <Route path="/perfil" element={<PerfilPage />} />
                      <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                      <Route path="/integracoes" element={<IntegracoesPage />} />
                      <Route path="/planos" element={<PlanosPage />} />
                      <Route path="/athena" element={<ChatAthena />} />
                      <Route path="/athena/historico" element={<AthenaHistoricoPage />} />
                      <Route path="/athena/contexto/:id" element={<AthenaContextoPage />} />
                      <Route path="/connecta" element={<ConnexaPage />} />
                      <Route path="/insights" element={<InsightsPage />} />
                    </Route>

                    {/* Admin protected routes */}
                    <Route element={<PrivateRoute requiredRole="admin" />}>
                      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    </Route>
                    
                    {/* 404 fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </InitializeRealtime>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
