
import React from "react";
import { SidebarProvider, Sidebar as UISidebar, SidebarContent, SidebarRail, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background dark:bg-background light:bg-background-light text-foreground dark:text-foreground light:text-foreground-light font-poppins flex">
        <UISidebar>
          <SidebarContent>
            <Sidebar />
          </SidebarContent>
          <SidebarRail />
        </UISidebar>
        
        <SidebarInset>
          <div className="w-full flex flex-col">
            <header className="w-full p-4 flex justify-between items-center border-b border-border dark:border-border light:border-border-light bg-card/80 dark:bg-[#141429]/80 light:bg-card-light/80 backdrop-blur-sm shadow-sm z-30">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="mr-2" />
                <span className="text-2xl font-bold text-primary drop-shadow neon-anim">CÓRTEX</span>
                <span className="ml-2 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">Athena IA</span>
              </div>
              <div className="text-md text-foreground/70 dark:text-foreground/70 light:text-foreground-light/70">Seu Segundo Cérebro Digital</div>
            </header>
            <main className="flex-1 w-full flex flex-col items-center px-2 md:px-8 py-8">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
