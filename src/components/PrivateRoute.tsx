
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type PrivateRouteProps = {
  requiredRole?: 'user' | 'admin' | 'master';
  redirectTo?: string;
};

export function PrivateRoute({ 
  requiredRole = 'user', 
  redirectTo = '/login' 
}: PrivateRouteProps) {
  const { user, profile, loading } = useAuth();
  
  // Se ainda estiver carregando, podemos mostrar um indicador de carregamento
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Se requerer role específica, verificar
  if (requiredRole === 'admin' || requiredRole === 'master') {
    if (!profile || (profile.role !== 'admin' && profile.role !== 'master')) {
      // Não tem permissão, redirecionar para a página principal
      return <Navigate to="/" replace />;
    }
  }
  
  // Tudo ok, renderizar as rotas filhas
  return <Outlet />;
}
