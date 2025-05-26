
import React from "react";
import { motion } from "framer-motion";
import { SidebarProvider, Sidebar as UISidebar, SidebarContent, SidebarRail, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import AthenaChatBox from "@/components/AthenaChatBox";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import NotificationIndicator from "@/components/Notifications/NotificationIndicator";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-background text-foreground font-['Inter'] flex">
        <UISidebar className="border-r border-white/10">
          <SidebarContent>
            <Sidebar />
          </SidebarContent>
          <SidebarRail />
        </UISidebar>
        
        <SidebarInset className="flex-1 flex flex-col w-full">
          <header className="w-full p-3 sm:p-4 flex justify-between items-center border-b border-white/10 bg-black/30 backdrop-blur-xl shadow-sm z-30 sticky top-0">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SidebarTrigger className="mr-1 sm:mr-2" />
              <span className="text-xl sm:text-2xl font-bold text-gradient neon-anim">CÓRTEX</span>
              <span className="ml-1 sm:ml-2 px-2 py-0.5 rounded-md bg-secondary/80 backdrop-blur-sm text-secondary-foreground text-xs">Athena IA</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {user && <NotificationIndicator />}
              <ThemeToggle />
              <div className="text-sm sm:text-md text-foreground/70">
                {user ? (
                  <span>Olá, {profile?.name || 'Usuário'}</span>
                ) : (
                  <span>Seu Segundo Cérebro Digital</span>
                )}
              </div>
              {user && (
                <motion.button 
                  onClick={() => window.location.href = '/perfil'} 
                  className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30 hover:bg-primary/30 hover:border-primary/50 transition-all duration-300"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 8px rgba(96, 181, 181, 0.5)" }}
                >
                  {profile?.name?.[0]?.toUpperCase() || 'U'}
                </motion.button>
              )}
            </motion.div>
          </header>
          <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 md:px-10 py-6 sm:py-10 overflow-x-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="animate-floating-dots opacity-10"></div>
            </div>
            
            <motion.div 
              className="w-full max-w-7xl mx-auto z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </main>
        </SidebarInset>
        
        {/* Componente Athena ChatBox */}
        <AthenaChatBox />
      </div>
    </SidebarProvider>
  );
}
