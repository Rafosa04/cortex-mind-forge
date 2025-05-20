import {
  LayoutDashboard,
  Settings,
  ListChecks,
  Brain,
  Book,
  Calendar,
  Bell,
  User,
  LogOut,
  LucideIcon,
  Inbox,
  Link as LucideLink,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface NavLink {
  to: string;
  icon: LucideIcon;
  label: string;
}

export default function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const linkClasses = (path: string) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/5 focus:bg-secondary/5 ${
      location.pathname === path
        ? "bg-secondary/10 text-secondary font-semibold"
        : "text-foreground/80"
    }`;

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 px-3 py-2">
        {user ? (
          <Avatar className="w-8 h-8">
            <AvatarFallback>{profile?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-8 h-8">
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
        )}
        <span className="font-bold text-lg">{profile?.name || "CÓRTEX"}</span>
      </div>

      <nav className="flex-1 space-y-1.5">
        <Link to="/" className={linkClasses("/")}>
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link to="/projetos" className={linkClasses("/projetos")}>
          <Inbox className="h-4 w-4" />
          <span>Projetos</span>
        </Link>
        <Link to="/habitos" className={linkClasses("/habitos")}>
          <ListChecks className="h-4 w-4" />
          <span>Hábitos</span>
        </Link>
        <Link to="/subcerebros" className={linkClasses("/subcerebros")}>
          <Brain className="h-4 w-4" />
          <span>Subcérebros</span>
        </Link>
        <Link to="/mensagens" className={linkClasses("/mensagens")}>
          <LucideLink className="h-4 w-4" />
          <span>Mensagens</span>
        </Link>
        <Link to="/favoritos" className={linkClasses("/favoritos")}>
          <Book className="h-4 w-4" />
          <span>Favoritos</span>
        </Link>
        <Link to="/salvos" className={linkClasses("/salvos")}>
          <LayoutDashboard className="h-4 w-4" />
          <span>Salvos</span>
        </Link>
        <Link to="/diario" className={linkClasses("/diario")}>
          <Calendar className="h-4 w-4" />
          <span>Diário</span>
        </Link>
        <Link to="/agenda" className={linkClasses("/agenda")}>
          <LayoutDashboard className="h-4 w-4" />
          <span>Agenda</span>
        </Link>
        <Link to="/notificacoes" className={linkClasses("/notificacoes")}>
          <Bell className="h-4 w-4" />
          <span>Notificações</span>
        </Link>
        <Link to="/perfil" className={linkClasses("/perfil")}>
          <User className="h-4 w-4" />
          <span>Perfil</span>
        </Link>

        {/* Admin Dashboard - visível apenas para admin ou master */}
        {profile?.role === 'admin' || profile?.role === 'master' ? (
          <Link 
            to="/admin/dashboard" 
            className={linkClasses('/admin/dashboard')}
          >
            <Settings className="h-4 w-4" />
            <span>Admin Dashboard</span>
          </Link>
        ) : null}
      </nav>

      {/* Botão de logout */}
      {user && (
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      )}

      <div className="text-xs text-muted-foreground px-3 py-2">
        CÓRTEX &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
