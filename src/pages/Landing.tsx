
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  CheckCircle, 
  Calendar, 
  Star, 
  Globe, 
  FileText, 
  BarChart, 
  CheckCheck, 
  ChevronRight, 
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pulseAnimation = {
  pulse: {
    scale: [1, 1.03, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Landing() {
  const { toast } = useToast();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [showInvestorForm, setShowInvestorForm] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentExpectation, setInvestmentExpectation] = useState("");
  const [showContactConfirmation, setShowContactConfirmation] = useState(true);

  // Athena phrases that will rotate
  const athenaQuotes = [
    "Cada segundo aqui, sua mente evolui.",
    "Seu segundo cérebro aprende enquanto você vive.",
    "Todas as suas ideias, conectadas e vivas.",
    "Pense melhor, execute mais, evolua sempre."
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Features section data
  const features = [
    { 
      icon: <Brain className="size-10 text-primary mb-4" />,
      title: "Subcérebros",
      description: "Hubs mentais interconectados para organizar seu pensamento."
    },
    { 
      icon: <CheckCircle className="size-10 text-primary mb-4" />,
      title: "Projetos com IA",
      description: "A IA cria, organiza e acompanha todos os seus projetos."
    },
    { 
      icon: <Star className="size-10 text-primary mb-4" />,
      title: "Hábitos Vivos",
      description: "Rastreie e evolua seus hábitos com sentido e propósito."
    },
    { 
      icon: <Star className="size-10 text-primary mb-4" />,
      title: "Salvos Ativos",
      description: "Conteúdo que volta quando você precisa, no momento certo."
    },
    { 
      icon: <Globe className="size-10 text-primary mb-4" />,
      title: "Connecta",
      description: "Rede social para mentes que evoluem juntas."
    },
    { 
      icon: <FileText className="size-10 text-primary mb-4" />,
      title: "Diário Mental",
      description: "Reflexão, emoção e ação guiadas por IA."
    },
    { 
      icon: <Calendar className="size-10 text-primary mb-4" />,
      title: "Agenda Mental",
      description: "Blocos de tempo guiados por intenção e propósito."
    },
    { 
      icon: <BarChart className="size-10 text-primary mb-4" />,
      title: "Insights",
      description: "Relatórios emocionais e cognitivos com IA."
    }
  ];

  // Demo carousel items
  const demoItems = [
    {
      title: "Criação com IA",
      description: "Crie projetos inteiros com ajuda da IA Athena",
      image: "https://via.placeholder.com/600x400/191933/60B5B5?text=Criação+com+IA"
    },
    {
      title: "Cérebro Digital",
      description: "Visualize seu cérebro digital em formação",
      image: "https://via.placeholder.com/600x400/191933/60B5B5?text=Cérebro+Digital"
    },
    {
      title: "Diário Emocional",
      description: "Analise suas emoções com a Athena",
      image: "https://via.placeholder.com/600x400/191933/60B5B5?text=Diário+Emocional"
    },
    {
      title: "Agenda Mental",
      description: "Organize seu tempo com blocos mentais",
      image: "https://via.placeholder.com/600x400/191933/60B5B5?text=Agenda+Mental"
    },
    {
      title: "Connecta",
      description: "Compartilhe ideias e evolua com outros",
      image: "https://via.placeholder.com/600x400/191933/60B5B5?text=Connecta"
    }
  ];

  // Comparison table data
  const comparisonItems = [
    {
      platform: "Notion",
      feature: "Organiza ideias",
      cortex: true
    },
    {
      platform: "Trello",
      feature: "Gerencia tarefas",
      cortex: true
    },
    {
      platform: "Instagram",
      feature: "Conecta pessoas",
      cortex: true
    },
    {
      platform: "CÓRTEX",
      feature: "Organiza, aprende, reflete, conecta e evolui com você.",
      cortex: true,
      highlight: true
    }
  ];

  // Pricing plans
  const plans = [
    {
      title: "Gratuito",
      symbol: "💠",
      price: "R$0",
      period: "",
      description: "Acesso limitado, ideal para explorar",
      features: ["5 subcérebros", "10 projetos", "Athena básica", "Sem Connecta"],
      ctaText: "Começar grátis",
      ctaLink: "/onboarding"
    },
    {
      title: "CÓRTEX Pessoal",
      symbol: "🔄",
      price: "R$19",
      period: "/mês",
      description: "Organização real com IA assistente",
      features: ["20 subcérebros", "Projetos ilimitados", "Athena inteligente", "Connecta básico"],
      ctaText: "Assinar agora",
      ctaLink: "#planos",
      popular: false
    },
    {
      title: "CÓRTEX Expansivo",
      symbol: "🚀",
      price: "R$49",
      period: "/mês",
      description: "Tudo ilimitado, IA Athena full, personalização completa",
      features: ["Subcérebros ilimitados", "Projetos ilimitados", "Athena avançada", "Connecta completo"],
      ctaText: "Assinar agora",
      ctaLink: "#planos",
      popular: true
    }
  ];

  // Founder tiers
  const founderTiers = [
    {
      title: "Fundador",
      symbol: "🧠",
      price: "R$297",
      oneTime: true,
      description: "Acesso vitalício ao plano Expansivo",
      features: [
        "Selo dourado exclusivo", 
        "Seu nome eternizado", 
        "Canal exclusivo de fundadores", 
        "Acesso vitalício",
        "Upgrades futuros incluídos"
      ],
      ctaText: "Contribuir como Fundador",
      highlight: true
    },
    {
      title: "Pioneiro",
      symbol: "🚀",
      price: "R$197",
      oneTime: true,
      description: "Acesso vitalício ao plano Expansivo",
      features: [
        "Selo prateado exclusivo", 
        "Acesso antecipado a funcionalidades", 
        "Acesso vitalício",
        "Upgrades futuros incluídos"
      ],
      ctaText: "Contribuir como Pioneiro"
    },
    {
      title: "Investidor",
      symbol: "💼",
      price: "R$1.000+",
      oneTime: true,
      description: "Valor livre a partir de R$1.000",
      features: [
        "Proposta personalizada", 
        "Contato direto com a equipe", 
        "Possibilidade de participação"
      ],
      ctaText: "Quero investir no CÓRTEX",
      investorOption: true
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "O CÓRTEX me ajuda a pensar melhor.",
      author: "Marina S., Empreendedora"
    },
    {
      quote: "Eu não sabia que precisava disso… até usar.",
      author: "Carlos M., Estudante"
    },
    {
      quote: "Minha mente, agora com uma forma digital.",
      author: "Julia P., Designer"
    },
    {
      quote: "Athena é como ter um mentor que sempre está disponível.",
      author: "Roberto L., Desenvolvedor"
    }
  ];

  const handleInvestorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Proposta enviada",
      description: "Entraremos em contato em breve para discutir sua proposta de investimento.",
    });
    setShowInvestorForm(false);
    setInvestmentAmount("");
    setInvestmentExpectation("");
    setShowContactConfirmation(true);
  };

  // Rotate Athena quotes every 5 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % athenaQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openInvestorDialog = () => {
    setShowInvestorForm(true);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4 relative">
        <motion.div 
          className="absolute inset-0 z-0 opacity-20"
          animate="pulse"
          variants={pulseAnimation}
        >
          <div className="w-full h-full bg-[radial-gradient(circle,#60B5B5_1px,transparent_1px)] bg-[length:30px_30px]"></div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 text-foreground z-10 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Seu segundo cérebro está pronto para <span className="text-primary">nascer</span>.
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl text-center z-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Construa, conecte e expanda sua mente com inteligência artificial viva.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 z-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Button 
            size="lg" 
            className="px-6 py-6 text-lg"
            onClick={() => scrollToElement("planos")}
          >
            Quero meu CÓRTEX agora
            <ChevronRight className="ml-2" />
          </Button>
          
          <Button 
            size="lg"
            variant="secondary" 
            className="px-6 py-6 text-lg"
            onClick={() => scrollToElement("fundadores")}
          >
            Seja um Fundador 💎
          </Button>
        </motion.div>

        <motion.div 
          className="mt-12 bg-card/70 backdrop-blur-sm p-4 rounded-lg border border-primary/20 max-w-lg mx-auto z-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p className="text-center text-primary italic">
            "{athenaQuotes[currentQuoteIndex]}"
            <span className="block mt-2 text-sm text-muted-foreground">— Athena IA</span>
          </p>
        </motion.div>
      </section>

      {/* What is CÓRTEX Section */}
      <section id="sobre" className="w-full py-20 px-4 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">O que é o <span className="text-primary">CÓRTEX</span>?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Um segundo cérebro que aprende, evolui e se adapta ao seu jeito de pensar.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(96, 181, 181, 0.3)" }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Carousel Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Veja o <span className="text-primary">CÓRTEX</span> em ação</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore como o CÓRTEX pode transformar sua organização mental e produtividade.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="w-full max-w-4xl mx-auto"
          >
            <Carousel className="w-full">
              <CarouselContent>
                {demoItems.map((item, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-none bg-transparent">
                      <CardContent className="p-0">
                        <div className="overflow-hidden rounded-xl">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-64 sm:h-80 object-cover transition-transform hover:scale-105 duration-500"
                          />
                        </div>
                        <div className="p-4 text-center">
                          <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative inset-0 translate-y-0" />
                <CarouselNext className="relative inset-0 translate-y-0" />
              </div>
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="w-full py-20 px-4 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Comparação</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Veja como o CÓRTEX se compara com outras ferramentas.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 bg-card rounded-tl-lg">Plataforma</th>
                  <th className="text-left py-4 px-6 bg-card">Faz isso?</th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${item.highlight ? 'bg-primary/10 border-l-4 border-primary' : 'bg-card/60'} ${index === comparisonItems.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    <td className="py-4 px-6 font-medium">{item.platform}</td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      {item.feature}
                      {item.cortex && <CheckCheck className="text-primary ml-2" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Planos de Evolução</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para sua jornada mental.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`bg-card p-8 rounded-xl border ${plan.popular ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'}`}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 15px 30px -15px rgba(96, 181, 181, 0.3)" }}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full inline-block mb-4">
                    Mais popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{plan.symbol}</span>
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                </div>
                <div className="my-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCheck className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to={plan.ctaLink}>{plan.ctaText}</Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="fundadores" className="w-full py-20 px-4 bg-gradient-to-br from-background to-card/80">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Seja um Fundador do <span className="text-primary">CÓRTEX</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ajude a construir a mente coletiva. Torne-se parte da história.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {founderTiers.map((tier, index) => (
              <motion.div
                key={index}
                className={`bg-card p-8 rounded-xl border relative overflow-hidden ${tier.highlight ? 'border-primary/50' : 'border-border'}`}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 15px 30px -15px rgba(96, 181, 181, 0.3)" }}
              >
                {tier.highlight && (
                  <>
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
                  </>
                )}
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <span className="text-2xl">{tier.symbol}</span>
                  <h3 className="text-xl font-semibold">{tier.title}</h3>
                </div>
                <div className="my-4 relative z-10">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.oneTime ? " (único)" : "/mês"}</span>
                </div>
                <p className="text-muted-foreground mb-6 relative z-10">{tier.description}</p>
                <ul className="space-y-3 mb-8 relative z-10">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCheck className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full relative z-10"
                  variant={tier.highlight ? "default" : "outline"}
                  onClick={tier.investorOption ? openInvestorDialog : undefined}
                >
                  {tier.ctaText}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">O que dizem do <span className="text-primary">CÓRTEX</span></h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <div className="p-6 h-full">
                      <Card className="border-border bg-card/70 h-full">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="text-4xl text-primary mb-4">"</div>
                          <p className="text-lg mb-4 flex-grow">{testimonial.quote}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.author}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative inset-0 translate-y-0" />
                <CarouselNext className="relative inset-0 translate-y-0" />
              </div>
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-4 bg-card/20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-primary">CÓRTEX</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">Beta</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Você não está comprando um app. Está construindo sua mente digital.
              </p>
            </div>
            <div className="flex flex-col md:items-end justify-end">
              <div className="flex gap-6">
                <Link to="/termos" className="text-muted-foreground hover:text-primary">Termos</Link>
                <Link to="/sobre" className="text-muted-foreground hover:text-primary">Sobre</Link>
                <Link to="/suporte" className="text-muted-foreground hover:text-primary">Suporte</Link>
                <a href="https://github.com" className="text-muted-foreground hover:text-primary" target="_blank" rel="noreferrer">Github</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} CÓRTEX. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Investor Form Dialog */}
      <Dialog open={showInvestorForm} onOpenChange={setShowInvestorForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proposta de Investimento</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para enviar sua proposta de investimento no CÓRTEX.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvestorSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome</label>
              <input 
                id="name" 
                type="text" 
                className="w-full p-2 rounded-md border border-border bg-card/70" 
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">E-mail</label>
              <input 
                id="email" 
                type="email" 
                className="w-full p-2 rounded-md border border-border bg-card/70" 
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Valor sugerido (R$)</label>
              <input 
                id="amount" 
                type="number" 
                className="w-full p-2 rounded-md border border-border bg-card/70" 
                min="1000"
                placeholder="1000" 
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expectation" className="text-sm font-medium">O que espera em troca?</label>
              <Textarea 
                id="expectation" 
                className="w-full p-2 rounded-md border border-border bg-card/70 min-h-[100px]" 
                placeholder="Descreva suas expectativas..."
                value={investmentExpectation}
                onChange={(e) => setInvestmentExpectation(e.target.value)}
                required
              />
            </div>
            <div className="flex items-start gap-2">
              <input 
                id="contact" 
                type="checkbox" 
                className="mt-0.5"
                checked={showContactConfirmation}
                onChange={(e) => setShowContactConfirmation(e.target.checked)}
                required
              />
              <label htmlFor="contact" className="text-sm">
                Aceito ser contatado pela equipe do CÓRTEX para discutir minha proposta de investimento.
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Enviar proposta</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
