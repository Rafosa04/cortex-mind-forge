
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  CheckCircle, 
  MessageSquare, 
  Bookmark, 
  Heart, 
  Bell, 
  Settings, 
  User, 
  CreditCard, 
  Home, 
  Brain, 
  MessagesSquare, 
  LineChart, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const menuItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Projetos', icon: FileText, path: '/projetos' },
  { name: 'Habitos', icon: CheckCircle, path: '/habitos' },
  { name: 'Subcerebros', icon: Brain, path: '/subcerebros' },
  { name: 'Mensagens', icon: MessageSquare, path: '/mensagens' },
  { name: 'Favoritos', icon: Heart, path: '/favoritos' },
  { name: 'Salvos', icon: Bookmark, path: '/salvos' },
  { name: 'Diario', icon: FileText, path: '/diario' },
  { name: 'Agenda', icon: Calendar, path: '/agenda' },
  { name: 'Notificacoes', icon: Bell, path: '/notificacoes' },
  { name: 'Athena IA', icon: MessagesSquare, path: '/athena' },
  { name: 'Connecta', icon: Users, path: '/connecta' },
  { name: 'Insights', icon: LineChart, path: '/insights' },
  { name: 'Perfil', icon: User, path: '/perfil' },
  { name: 'Configuracoes', icon: Settings, path: '/configuracoes' },
  { name: 'Planos', icon: CreditCard, path: '/planos' },
  { name: 'Admin', icon: LayoutDashboard, path: '/admin/dashboard' }
];

export default function Sidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed";
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && (
        <AnimatePresence>
          {state === "expanded" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>
      )}
      
      <div className={cn(
        "flex flex-col h-full",
        isCollapsed ? "items-center" : "items-stretch",
      )}>
        {/* Logo and Collapse Button */}
        <div className={cn(
          "flex items-center p-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">CÓRTEX</span>
              <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">IA</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-7 h-7 p-0"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                    isCollapsed ? "justify-center" : "",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Footer with theme toggle */}
        <div className={cn(
          "mt-auto border-t border-border p-4",
          isCollapsed ? "flex justify-center" : ""
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <span className="text-sm text-muted-foreground">
                {isDark ? 'Modo Escuro' : 'Modo Claro'}
              </span>
            )}
            <div className="flex items-center gap-2">
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              <Switch 
                checked={!isDark}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
                aria-label="Toggle theme"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
