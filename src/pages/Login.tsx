
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [athenaQuote, setAthenaQuote] = useState("A mente que busca conhecer a si mesma expande todo o universo.");
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const quotes = [
    "Tudo que você pensa, sente e deseja… organizado.",
    "Hoje você entra. Amanhã, sua mente se expande.",
    "O caos da mente, com forma.",
    "Seu cérebro pensa. O CÓRTEX conecta.",
    "A mente que busca conhecer a si mesma expande todo o universo."
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here
      console.log("Login attempt:", { email, password, rememberMe });
      // Simulate successful login and redirect
      navigate("/");
    } else {
      // Handle registration logic here
      console.log("Registration attempt:", { name, email, password, confirmPassword, acceptTerms });
      // Simulate successful registration and redirect to onboarding
      navigate("/onboarding");
    }
  };
  
  const toggleView = () => {
    setIsLogin(!isLogin);
    // Change Athena quote when switching views
    setAthenaQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  // Handler functions for checkboxes to properly handle CheckedState
  const handleRememberMeChange = (checked) => {
    setRememberMe(checked === true);
  };

  const handleAcceptTermsChange = (checked) => {
    setAcceptTerms(checked === true);
  };
  
  return (
    <div className="w-full min-h-screen md:min-h-[85vh] grid md:grid-cols-2 gap-6 p-4 md:p-8 bg-background">
      {/* Background animated elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0C0C1C]/50"></div>
        <div className="animate-floating-dots"></div>
      </div>
      
      {/* Content container */}
      <motion.div 
        className="max-w-md mx-auto w-full z-10 flex flex-col justify-center col-span-2 md:col-span-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Cortex logo/title */}
        <motion.div 
          className="mb-10 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary to-secondary">
            CÓRTEX
          </h1>
          <p className="text-foreground/70 mt-2">Seu segundo cérebro digital</p>
        </motion.div>
        
        {/* Login/Register container */}
        <div className="w-full bg-[#111122]/80 rounded-2xl shadow-xl relative overflow-hidden p-8">
          {/* Tabs for switching between login and register */}
          <div className="w-full flex gap-6 text-center mb-8">
            <span 
              onClick={() => setIsLogin(true)} 
              className={`grow py-2 cursor-pointer transition-all ${isLogin ? 'border-b-2 border-primary font-medium text-primary' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Login
            </span>
            <span 
              onClick={() => setIsLogin(false)} 
              className={`grow py-2 cursor-pointer transition-all ${!isLogin ? 'border-b-2 border-primary font-medium text-primary' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Cadastro
            </span>
          </div>
          
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2
                  className="text-2xl font-semibold mb-3 text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="text-gradient">Bem-vindo de volta!</span>
                </motion.h2>
                
                <motion.div
                  className="text-base text-foreground/80 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  Athena diz: <span className="italic text-secondary">"{athenaQuote}"</span>
                </motion.div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="seu@email.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="Senha secreta" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-foreground/50" />
                        ) : (
                          <Eye className="h-4 w-4 text-foreground/50" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={handleRememberMeChange}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-foreground/70 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Lembrar de mim
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-secondary hover:underline">Esqueceu sua senha?</a>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-4">
                    Entrar
                  </Button>
                </form>
                
                <p className="text-center text-foreground/60 text-sm mt-8">
                  Ainda não tem conta?{" "}
                  <button 
                    onClick={toggleView}
                    className="text-primary hover:underline"
                  >
                    Criar conta
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2
                  className="text-2xl font-semibold mb-3 text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="text-gradient">Ative seu CÓRTEX</span>
                </motion.h2>
                
                <motion.div
                  className="text-base text-foreground/80 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  Athena diz: <span className="italic text-secondary">"Cada mente nova cria novas conexões. Seja bem-vindo."</span>
                </motion.div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <div className="relative">
                      <Input 
                        id="name"
                        type="text" 
                        placeholder="Seu nome" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">E-mail</Label>
                    <div className="relative">
                      <Input 
                        id="register-email"
                        type="email" 
                        placeholder="seu@email.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Input 
                        id="register-password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="Mínimo 6 caracteres" 
                        required 
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-foreground/50" />
                        ) : (
                          <Eye className="h-4 w-4 text-foreground/50" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirme sua senha</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirme sua senha" 
                        required 
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-foreground/50" />
                        ) : (
                          <Eye className="h-4 w-4 text-foreground/50" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id="terms" 
                      required
                      checked={acceptTerms}
                      onCheckedChange={handleAcceptTermsChange}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-foreground/70 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Li e aceito os termos do CÓRTEX
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full mt-4">
                    Ativar meu CÓRTEX
                  </Button>
                </form>
                
                <p className="text-center text-foreground/60 text-sm mt-8">
                  Já tem uma conta?{" "}
                  <button 
                    onClick={toggleView}
                    className="text-primary hover:underline"
                  >
                    Fazer login
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-10 text-center text-xs text-foreground/40">
            <p>"Conecte-se com quem você está se tornando."</p>
          </div>
        </div>
      </motion.div>
      
      {/* Right side decorative panel (hidden on mobile) */}
      <motion.div 
        className="hidden md:flex flex-col justify-center items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <div className="relative w-full max-w-md">
          {/* Decorative brain illustration */}
          <motion.div 
            className="w-52 h-52 mx-auto mb-8"
            animate={{ 
              scale: [1, 1.05, 1],
              filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/30 via-secondary/40 to-primary/20 blur-2xl absolute" />
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="text-6xl">🧠</div>
            </div>
          </motion.div>
          
          {/* Quotes */}
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <p className="text-xl font-light text-foreground/80 italic">
              "{quotes[Math.floor(Math.random() * quotes.length)]}"
            </p>
            
            <div className="flex flex-col gap-1.5">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-secondary/50 to-transparent mx-auto" />
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
