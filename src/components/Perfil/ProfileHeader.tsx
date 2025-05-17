
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Edit, MapPin, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Cover Image */}
      <div className="h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30">
        <motion.div 
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1510936111840-65e151ad71bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1190&q=80')] bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Profile Content */}
      <div className="flex flex-col md:flex-row gap-5 px-6 py-5 bg-card/90 backdrop-blur-md rounded-xl mt-4 border border-primary/10">
        <div className="flex flex-col items-center md:items-start">
          <Avatar className="h-24 w-24 ring-4 ring-primary/20 -mt-16 mb-2">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl bg-secondary/20">AU</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm" className="border-primary/40 flex items-center gap-2">
              <Edit className="h-3.5 w-3.5" />
              <span>Editar Perfil</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div>
            <h2 className="text-xl font-bold">Athena User</h2>
            <p className="text-muted-foreground text-sm">@athena_user</p>
          </div>
          
          <p className="text-sm text-foreground/90 relative pl-0 md:pl-4 max-w-md">
            <span className="hidden md:inline absolute left-0 top-0 text-primary/80 font-serif text-xl font-bold">"</span>
            Designer, pesquisador e apaixonado por conectar ideias. Construindo um segundo cérebro para explorar o potencial da mente humana.
            <span className="hidden md:inline absolute text-primary/80 font-serif text-xl font-bold">"</span>
          </p>

          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>São Paulo, Brasil</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              <a href="https://cortex.ai/athena_user" className="hover:text-primary transition-colors">
                cortex.ai/athena_user
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
