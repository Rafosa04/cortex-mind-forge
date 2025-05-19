
import React from "react";
import { SidebarProvider, Sidebar as UISidebar, SidebarContent, SidebarRail, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-background dark:bg-background light:bg-background-light text-foreground dark:text-foreground light:text-foreground-light font-poppins flex">
        <UISidebar>
          <SidebarContent>
            <Sidebar />
          </SidebarContent>
          <SidebarRail />
        </UISidebar>
        
        <SidebarInset className="flex-1 flex flex-col w-full">
          <header className="w-full p-3 sm:p-4 flex justify-between items-center border-b border-border dark:border-border light:border-border-light bg-card/80 dark:bg-[#141429]/80 light:bg-card-light/80 backdrop-blur-sm shadow-sm z-30">
            <div className="flex items-center gap-1 sm:gap-2">
              <SidebarTrigger className="mr-1 sm:mr-2" />
              <span className="text-xl sm:text-2xl font-bold text-primary drop-shadow neon-anim">CÓRTEX</span>
              <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-secondary text-secondary-foreground text-xs">Athena IA</span>
            </div>
            <div className="text-sm sm:text-md text-foreground/70 dark:text-foreground/70 light:text-foreground-light/70">Seu Segundo Cérebro Digital</div>
          </header>
          <main className="flex-1 w-full flex flex-col items-center px-2 sm:px-4 md:px-8 py-4 sm:py-8 overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
