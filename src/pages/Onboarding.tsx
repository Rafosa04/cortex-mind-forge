
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Target, Layers, LayoutList, Palette, User, Check, ChevronRight, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // User preferences state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [interactionMode, setInteractionMode] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#60B5B5");
  const [secondaryColor, setSecondaryColor] = useState<string>("#993887");
  const [typography, setTypography] = useState<string>("Moderna");
  const [theme, setTheme] = useState<string>("Escuro");
  const [userAlias, setUserAlias] = useState<string>("");

  const goals = [
    { id: "focus", label: "Melhorar foco e produtividade", icon: <Target className="h-5 w-5" /> },
    { id: "organize", label: "Organizar minha mente criativa", icon: <Brain className="h-5 w-5" /> },
    { id: "goals", label: "Alcançar metas com clareza", icon: <Target className="h-5 w-5" /> },
    { id: "reflect", label: "Refletir e entender meus pensamentos", icon: <Brain className="h-5 w-5" /> },
    { id: "habits", label: "Rastrear hábitos e crescer pessoalmente", icon: <Target className="h-5 w-5" /> },
    { id: "connect", label: "Me conectar com pessoas com propósito", icon: <Brain className="h-5 w-5" /> }
  ];

  const areas = [
    { id: "health", label: "Saúde" },
    { id: "work", label: "Trabalho" },
    { id: "studies", label: "Estudos" },
    { id: "creativity", label: "Criatividade" },
    { id: "emotions", label: "Emoções" },
    { id: "spirituality", label: "Espiritualidade" },
    { id: "finances", label: "Finanças" },
    { id: "relationships", label: "Relacionamentos" }
  ];

  const modes = [
    { id: "light", label: "Modo leve: IA me guia em tudo", description: "Deixe o CÓRTEX e Athena liderarem sua jornada" },
    { id: "advanced", label: "Modo avançado: Eu organizo, com ajuda pontual", description: "Mantenha controle total com assistência quando precisar" },
    { id: "hybrid", label: "Híbrido: Deixe que a IA me ajude, mas com espaço para explorar", description: "O equilíbrio perfeito entre orientação e liberdade" }
  ];

  const colors = [
    { id: "teal", value: "#60B5B5", name: "Teal" },
    { id: "purple", value: "#993887", name: "Roxo" },
    { id: "cyan", value: "#3ABEFF", name: "Ciano" },
    { id: "green", value: "#4CAF50", name: "Verde" },
    { id: "pink", value: "#E91E63", name: "Rosa" },
    { id: "orange", value: "#FF5722", name: "Laranja" },
  ];

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const toggleArea = (areaId: string) => {
    if (selectedAreas.includes(areaId)) {
      setSelectedAreas(selectedAreas.filter(id => id !== areaId));
    } else {
      setSelectedAreas([...selectedAreas, areaId]);
    }
  };

  const handleNextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
      setProgress(((currentScreen + 1) / (screens.length - 1)) * 100);
    } else {
      // Save data and redirect to home
      console.log({
        selectedGoals,
        selectedAreas,
        interactionMode,
        primaryColor,
        secondaryColor,
        typography,
        theme,
        userAlias
      });
      
      navigate("/home");
    }
  };

  const handlePrevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      setProgress(((currentScreen - 1) / (screens.length - 1)) * 100);
    }
  };

  const checkCanProceed = () => {
    switch (currentScreen) {
      case 0: // Welcome screen
        return true;
      case 1: // Goals
        return selectedGoals.length > 0;
      case 2: // Areas
        return selectedAreas.length > 0;
      case 3: // Interaction mode
        return interactionMode !== "";
      case 4: // Visual preferences
        return primaryColor !== "";
      case 5: // Alias (optional)
        return true;
      default:
        return true;
    }
  };
  
  const screens = [
    // Screen 1: Welcome
    {
      id: "welcome",
      title: "",
      content: (
        <motion.div 
          className="flex flex-col items-center justify-center text-center h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center mb-8"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: ["0 0 0 rgba(96, 181, 181, 0.4)", "0 0 30px rgba(96, 181, 181, 0.6)", "0 0 0 rgba(96, 181, 181, 0.4)"]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            <Brain className="h-12 w-12 text-background" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            animate={{ 
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            CÓRTEX
          </motion.h1>
          
          <motion.p 
            className="text-xl text-foreground/90 mb-10 max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Olá, sou a <span className="text-secondary font-semibold">Athena</span>. E estou aqui para ajudar você a dar forma ao seu segundo cérebro.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Button 
              onClick={handleNextScreen} 
              className="px-8 py-6 text-lg rounded-full flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Começar <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      )
    },
    
    // Screen 2: Goals
    {
      id: "goals",
      title: "O que você mais deseja com o CÓRTEX?",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <p className="text-foreground/70 mb-6">Selecione uma ou mais opções que representam seus objetivos principais.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {goals.map((goal) => (
              <motion.div 
                key={goal.id}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    selectedGoals.includes(goal.id) 
                      ? "bg-primary/20 border-primary" 
                      : "bg-card hover:bg-card/70"
                  }`}
                  onClick={() => toggleGoal(goal.id)}
                >
                  <div className="flex-shrink-0">
                    {goal.icon}
                  </div>
                  <div className="flex-grow">
                    {goal.label}
                  </div>
                  {selectedGoals.includes(goal.id) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    },
    
    // Screen 3: Life Areas
    {
      id: "areas",
      title: "Quais áreas da sua vida você quer mapear primeiro?",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <p className="text-foreground/70 mb-6">Selecione as áreas que deseja priorizar no seu CÓRTEX.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {areas.map((area) => (
              <motion.div
                key={area.id}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`flex flex-col items-center justify-center gap-2 p-4 cursor-pointer h-24 transition-colors text-center ${
                    selectedAreas.includes(area.id) 
                      ? "bg-primary/20 border-primary" 
                      : "bg-card hover:bg-card/70"
                  }`}
                  onClick={() => toggleArea(area.id)}
                >
                  <div className="flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    {area.label}
                  </div>
                  {selectedAreas.includes(area.id) && (
                    <div className="absolute bottom-2 right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    },
    
    // Screen 4: Interaction Mode
    {
      id: "interaction",
      title: "Como você prefere começar a interagir com o CÓRTEX?",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <p className="text-foreground/70 mb-6">Escolha seu estilo de interação preferido.</p>
          
          <div className="flex flex-col gap-4">
            {modes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`flex flex-col p-4 cursor-pointer transition-colors ${
                    interactionMode === mode.id 
                      ? "bg-primary/20 border-primary" 
                      : "bg-card hover:bg-card/70"
                  }`}
                  onClick={() => setInteractionMode(mode.id)}
                >
                  <div className="flex items-center gap-3">
                    <LayoutList className="h-5 w-5 flex-shrink-0" />
                    <div className="font-medium">{mode.label}</div>
                    {interactionMode === mode.id && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </div>
                  <p className="text-foreground/70 text-sm mt-2">{mode.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    },
    
    // Screen 5: Visual Preferences
    {
      id: "visual",
      title: "Escolha a energia visual do seu espaço mental",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="mb-6">
            <Label className="text-base mb-3 block">Cor Primária</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colors.map((color) => (
                <motion.div
                  key={color.id}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <button
                    type="button"
                    className={`w-12 h-12 rounded-full border-2 ${
                      primaryColor === color.value ? "border-white" : "border-transparent"
                    } transition-all hover:border-white/50 flex items-center justify-center`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setPrimaryColor(color.value)}
                    aria-label={`Cor ${color.name}`}
                  >
                    {primaryColor === color.value && <Check className="h-5 w-5 text-white" />}
                  </button>
                  <span className="text-xs mt-1">{color.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base mb-3 block">Cor Secundária</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colors.map((color) => (
                <motion.div
                  key={color.id}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <button
                    type="button"
                    className={`w-12 h-12 rounded-full border-2 ${
                      secondaryColor === color.value ? "border-white" : "border-transparent"
                    } transition-all hover:border-white/50 flex items-center justify-center`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSecondaryColor(color.value)}
                    aria-label={`Cor ${color.name}`}
                  >
                    {secondaryColor === color.value && <Check className="h-5 w-5 text-white" />}
                  </button>
                  <span className="text-xs mt-1">{color.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base mb-3 block">Tipografia</Label>
            <div className="grid grid-cols-3 gap-3">
              {["Moderna", "Neutra", "Criativa"].map((font) => (
                <motion.div
                  key={font}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer text-center transition-colors ${
                      typography === font 
                        ? "bg-primary/20 border-primary" 
                        : "bg-card hover:bg-card/70"
                    }`}
                    onClick={() => setTypography(font)}
                  >
                    <div className={`font-${font.toLowerCase()}`}>{font}</div>
                    {typography === font && (
                      <div className="absolute bottom-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base mb-3 block">Tema</Label>
            <div className="grid grid-cols-2 gap-3">
              {["Escuro", "Claro"].map((themeOption) => (
                <motion.div
                  key={themeOption}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer text-center transition-colors ${
                      theme === themeOption 
                        ? "bg-primary/20 border-primary" 
                        : "bg-card hover:bg-card/70"
                    } ${themeOption === "Claro" ? "text-sm" : ""}`}
                    onClick={() => setTheme(themeOption)}
                  >
                    <div>{themeOption}</div>
                    {themeOption === "Claro" && (
                      <div className="text-xs text-foreground/50">(não recomendado)</div>
                    )}
                    {theme === themeOption && (
                      <div className="absolute bottom-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )
    },
    
    // Screen 6: Mental Alias
    {
      id: "alias",
      title: "Como você gostaria de ser chamado internamente pelo seu CÓRTEX?",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <p className="text-foreground/70 mb-6">Este será seu apelido no sistema. (Opcional)</p>
          
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <Label htmlFor="alias" className="sr-only">Apelido</Label>
              <Input
                id="alias"
                placeholder="Seu apelido aqui..."
                value={userAlias}
                onChange={(e) => setUserAlias(e.target.value)}
                className="text-lg py-6 border-primary/50 focus:border-primary"
              />
            </div>
            
            {userAlias && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-6"
              >
                <p className="text-lg">Entendido, <span className="text-primary font-semibold">{userAlias}</span>. Sua mente digital está pronta.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )
    },
    
    // Screen 7: Confirmation
    {
      id: "confirmation",
      title: "",
      content: (
        <motion.div 
          className="flex flex-col items-center justify-center text-center h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-32 h-32 mb-8 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ 
                scale: [1, 0.8, 1],
                rotate: [0, 10, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary opacity-70 blur-md" />
            </motion.div>
            
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-16 w-16 text-primary" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Bem-vindo ao seu CÓRTEX
          </motion.h2>
          
          <motion.p 
            className="text-xl text-foreground/80 mb-10 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Sua mente acaba de expandir.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <Button 
              onClick={handleNextScreen} 
              className="px-8 py-6 text-lg rounded-full flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Acessar minha Home <Home className="ml-2" />
            </Button>
          </motion.div>
          
          <motion.p 
            className="text-sm text-foreground/50 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            "Seu cérebro humano pensa.<br />O CÓRTEX expande."
          </motion.p>
        </motion.div>
      )
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <motion.div 
        className="h-1 bg-primary/30"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="flex-1 flex flex-col p-4 md:p-8">
        {/* Screen title */}
        {screens[currentScreen].title && (
          <motion.div
            key={`title-${screens[currentScreen].id}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold">{screens[currentScreen].title}</h2>
          </motion.div>
        )}
        
        {/* Screen content */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="w-full max-w-3xl">
            {screens[currentScreen].content}
          </div>
        </div>
        
        {/* Navigation buttons */}
        {currentScreen > 0 && currentScreen < screens.length - 1 && (
          <motion.div 
            className="flex justify-between mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={handlePrevScreen}
              className="text-foreground/70 hover:text-foreground"
            >
              Voltar
            </Button>
            
            <Button
              onClick={handleNextScreen}
              disabled={!checkCanProceed()}
              className={`px-8 flex items-center gap-2 ${!checkCanProceed() ? 'opacity-50' : ''}`}
            >
              Continuar <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
