
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load pages for better performance
export const LazyProjetos = lazy(() => import('@/pages/Projetos'));
export const LazyHabitos = lazy(() => import('@/pages/Habitos'));
export const LazySubcerebros = lazy(() => import('@/pages/Subcerebros'));
export const LazyAthenaHistorico = lazy(() => import('@/pages/AthenaHistorico'));
export const LazyAthenaContexto = lazy(() => import('@/pages/AthenaContexto'));
export const LazyMensagens = lazy(() => import('@/pages/Mensagens'));
export const LazyFavoritos = lazy(() => import('@/pages/Favoritos'));
export const LazySalvos = lazy(() => import('@/pages/Salvos'));
export const LazyDiario = lazy(() => import('@/pages/Diario'));
export const LazyAgenda = lazy(() => import('@/pages/Agenda'));
export const LazyNotificacoes = lazy(() => import('@/pages/Notificacoes'));
export const LazyPerfil = lazy(() => import('@/pages/Perfil'));
export const LazyConfiguracoes = lazy(() => import('@/pages/Configuracoes'));
export const LazyIntegracoes = lazy(() => import('@/pages/Integracoes'));
export const LazyPlanos = lazy(() => import('@/pages/Planos'));
export const LazyConnexa = lazy(() => import('@/pages/Connecta'));
export const LazyInsights = lazy(() => import('@/pages/Insights'));
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyAdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

// Loading fallback component
function PageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full p-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends Record<string, any>>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
  displayName?: string
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = displayName || `LazyWrapper(${LazyComponent.name || 'Component'})`;
  
  return WrappedComponent;
}

// Pre-wrapped components ready to use
export const ProjetosPage = withLazyLoading(LazyProjetos, 'ProjetosPage');
export const HabitosPage = withLazyLoading(LazyHabitos, 'HabitosPage');
export const SubcerebrosPage = withLazyLoading(LazySubcerebros, 'SubcerebrosPage');
export const AthenaHistoricoPage = withLazyLoading(LazyAthenaHistorico, 'AthenaHistoricoPage');
export const AthenaContextoPage = withLazyLoading(LazyAthenaContexto, 'AthenaContextoPage');
export const MensagensPage = withLazyLoading(LazyMensagens, 'MensagensPage');
export const FavoritosPage = withLazyLoading(LazyFavoritos, 'FavoritosPage');
export const SalvosPage = withLazyLoading(LazySalvos, 'SalvosPage');
export const DiarioPage = withLazyLoading(LazyDiario, 'DiarioPage');
export const AgendaPage = withLazyLoading(LazyAgenda, 'AgendaPage');
export const NotificacoesPage = withLazyLoading(LazyNotificacoes, 'NotificacoesPage');
export const PerfilPage = withLazyLoading(LazyPerfil, 'PerfilPage');
export const ConfiguracoesPage = withLazyLoading(LazyConfiguracoes, 'ConfiguracoesPage');
export const IntegracoesPage = withLazyLoading(LazyIntegracoes, 'IntegracoesPage');
export const PlanosPage = withLazyLoading(LazyPlanos, 'PlanosPage');
export const ConnexaPage = withLazyLoading(LazyConnexa, 'ConnexaPage');
export const InsightsPage = withLazyLoading(LazyInsights, 'InsightsPage');
export const DashboardPage = withLazyLoading(LazyDashboard, 'DashboardPage');
export const AdminDashboardPage = withLazyLoading(LazyAdminDashboard, 'AdminDashboardPage');
