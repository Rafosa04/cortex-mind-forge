
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle } from "lucide-react";

type PrivateRouteProps = {
  requiredRole?: 'user' | 'admin' | 'master';
  redirectTo?: string;
};

export function PrivateRoute({ 
  requiredRole = 'user', 
  redirectTo = '/login' 
}: PrivateRouteProps) {
  const { user, profile, loading } = useAuth();
  
  // Se ainda estiver carregando, mostrar indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Verificar permissões de role
  if (requiredRole === 'admin') {
    if (!profile || (profile.role !== 'admin' && profile.role !== 'master')) {
      return (
        <div className="flex items-center justify-center h-screen bg-background p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Acesso Negado</strong><br />
                Você não tem permissão para acessar esta área. Esta página requer privilégios de administrador.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Role atual: <span className="font-semibold">{profile?.role || 'user'}</span>
              </p>
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              >
                <Shield className="h-4 w-4" />
                Voltar
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  
  if (requiredRole === 'master') {
    if (!profile || profile.role !== 'master') {
      return (
        <div className="flex items-center justify-center h-screen bg-background p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Acesso Super Restrito</strong><br />
                Esta área é exclusiva para super administradores (masters).
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Role atual: <span className="font-semibold">{profile?.role || 'user'}</span>
              </p>
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              >
                <Shield className="h-4 w-4" />
                Voltar
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  
  // Tudo ok, renderizar as rotas filhas
  return <Outlet />;
}
