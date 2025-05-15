
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-poppins flex flex-col">
      <header className="w-full p-4 flex justify-between items-center border-b border-border bg-[#141429]/80 backdrop-blur-sm shadow-sm z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary drop-shadow neon-anim">CÓRTEX</span>
          <span className="ml-2 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">Athena IA</span>
        </div>
        <div className="text-md text-foreground/70">Seu Segundo Cérebro Digital</div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center px-2 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
