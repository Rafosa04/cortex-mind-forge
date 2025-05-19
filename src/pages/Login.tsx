import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
const \[isLogin, setIsLogin] = useState(true);
const \[showPassword, setShowPassword] = useState(false);
const \[showConfirmPassword, setShowConfirmPassword] = useState(false);
const \[athenaQuote, setAthenaQuote] = useState("A mente que busca conhecer a si mesma expande todo o universo.");
const navigate = useNavigate();

const \[email, setEmail] = useState("");
const \[password, setPassword] = useState("");
const \[name, setName] = useState("");
const \[confirmPassword, setConfirmPassword] = useState("");
const \[acceptTerms, setAcceptTerms] = useState(false);
const \[rememberMe, setRememberMe] = useState(false);

const quotes = \[
"Tudo que você pensa, sente e deseja… organizado.",
"Hoje você entra. Amanhã, sua mente se expande.",
"O caos da mente, com forma.",
"Seu cérebro pensa. O CÓRTEX conecta.",
"A mente que busca conhecer a si mesma expande todo o universo."
];

const handleSubmit = (e) => {
e.preventDefault();
if (isLogin) {
console.log("Login attempt:", { email, password, rememberMe });
navigate("/");
} else {
console.log("Registration attempt:", { name, email, password, confirmPassword, acceptTerms });
navigate("/onboarding");
}
};

const toggleView = () => {
setIsLogin(!isLogin);
setAthenaQuote(quotes\[Math.floor(Math.random() \* quotes.length)]);
};

const handleRememberMeChange = (checked) => {
setRememberMe(checked === true);
};

const handleAcceptTermsChange = (checked) => {
setAcceptTerms(checked === true);
};

return ( <div className="w-full h-screen grid md:grid-cols-2 gap-6 px-4 py-10 bg-background"> <div className="fixed inset-0 z-0 pointer-events-none"> <div className="absolute inset-0 bg-[#0C0C1C]/50"></div> <div className="animate-floating-dots"></div> </div>

```
  <motion.div 
    className="flex items-center justify-center w-full h-full p-6 z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.7 }}
  >
    <div className="w-full max-w-md">
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

      <div className="w-full bg-[#111122]/80 rounded-2xl shadow-xl p-8">
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
          {/* Seção de login e cadastro mantida igual */}
        </AnimatePresence>

        <div className="mt-10 text-center text-xs text-foreground/40">
          <p>"Conecte-se com quem você está se tornando."</p>
        </div>
      </div>
    </div>
  </motion.div>

  <motion.div 
    className="hidden md:flex items-center justify-center w-full h-full p-6 z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.7 }}
  >
    <div className="w-full max-w-md">
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
```

);
}
