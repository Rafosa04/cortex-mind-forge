
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Check, Rocket, Diamond, CircleDot } from "lucide-react";

// Plan data structure
const monthlyPlans = [
  { 
    id: "free", 
    nome: "Camada Inicial", 
    icon: <CircleDot className="h-6 w-6" />,
    preco: "R$0", 
    destaque: false,
    color: "border-blue-400/20",
    features: [
      "Acesso limitado ao CÓRTEX",
      "3 interações com IA por dia",
      "Subcérebros limitados",
      "Projetos básicos"
    ]
  },
  { 
    id: "personal", 
    nome: "CÓRTEX Pessoal", 
    icon: <CircleDot className="h-6 w-6" />,
    preco: "R$19/mês", 
    destaque: false,
    color: "border-purple-400/40",
    features: [
      "IA moderada",
      "Até 15 projetos",
      "10 hábitos ativos",
      "Suporte padrão"
    ]
  },
  { 
    id: "expansive", 
    nome: "CÓRTEX Expansivo", 
    icon: <Rocket className="h-6 w-6" />,
    preco: "R$49/mês", 
    destaque: true,
    color: "border-primary/60",
    features: [
      "Acesso total ao CÓRTEX",
      "IA Athena ilimitada",
      "Personalização completa",
      "Suporte prioritário",
      "Conecta premium"
    ]
  }
];

const lifetimePlans = [
  { 
    id: "founder", 
    nome: "Fundador", 
    icon: <Diamond className="h-6 w-6" />,
    preco: "R$297 vitalício", 
    destaque: true,
    color: "border-secondary/80",
    selo: "dourado",
    features: [
      "Acesso vitalício ao plano Expansivo",
      "Selo Fundador dourado",
      "Nome eternizado na plataforma",
      "Canal VIP de acesso à equipe",
      "Votação em novas funcionalidades"
    ]
  },
  { 
    id: "pioneer", 
    nome: "Pioneiro", 
    icon: <Rocket className="h-6 w-6" />,
    preco: "R$197 vitalício", 
    destaque: false,
    color: "border-blue-400/60",
    selo: "prateado",
    features: [
      "Acesso vitalício ao plano Expansivo",
      "Selo Pioneiro prateado",
      "Acesso antecipado a funcionalidades",
      "Convites exclusivos para beta tests"
    ]
  }
];

const faqItems = [
  {
    question: "Fundadores e Pioneiros pagam mensalidade depois?",
    answer: "Não, os planos Fundador e Pioneiro são vitalícios. Você paga apenas uma vez e tem acesso para sempre ao plano Expansivo."
  },
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano quando desejar. A mudança é aplicada imediatamente."
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Para planos mensais, utilizamos cobrança recorrente via cartão de crédito. Para planos vitalícios (Fundador e Pioneiro), aceitamos cartão de crédito, Pix e transferência bancária."
  },
  {
    question: "Qual a diferença entre Fundador e Pioneiro?",
    answer: "Ambos dão acesso vitalício ao plano Expansivo. Fundadores recebem um selo dourado exclusivo, têm seus nomes eternizados na plataforma e acesso a um canal VIP direto com a equipe. Pioneiros recebem um selo prateado e acesso antecipado a novas funcionalidades."
  }
];

export default function Planos() {
  const [showInvestForm, setShowInvestForm] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 pb-16">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-blue-400 bg-clip-text text-transparent">
          Escolha como sua mente vai evoluir
        </h1>
        <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
          Cada plano é uma nova camada de consciência. Ative o CÓRTEX no seu ritmo — ou torne-se parte da história.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button variant="default" size="lg">
            Ativar plano mensal
          </Button>
          <Button variant="secondary" size="lg">
            Quero ser Fundador 💎
          </Button>
        </div>
      </motion.section>

      {/* Monthly Plans Section */}
      <section className="space-y-8">
        <motion.h2 
          className="text-2xl font-bold text-center text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Planos Mensais
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {monthlyPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 + 0.4 }}
              className="h-full"
            >
              <Card className={`overflow-hidden h-full border-2 hover:border-opacity-100 transition-all duration-300 ${plan.color} ${plan.destaque ? "border-opacity-100 shadow-lg shadow-primary/20" : "border-opacity-50"} ${plan.destaque ? "bg-card/80 backdrop-blur-sm" : "bg-card/40"}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plan.icon}
                      <CardTitle>{plan.nome}</CardTitle>
                    </div>
                    {plan.destaque && (
                      <Badge variant="secondary" className="ml-auto">Recomendado</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">{plan.preco}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.destaque ? "secondary" : "outline"}>
                    Assinar agora
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lifetime Plans Section */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-2xl font-bold text-center text-secondary">
          Seja parte da história do CÓRTEX
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lifetimePlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 + 1 }}
              className="relative group"
            >
              <div className={`absolute -inset-0.5 rounded-xl opacity-60 blur-sm ${plan.destaque ? "bg-gradient-to-br from-secondary via-primary to-secondary/50 group-hover:opacity-80" : "bg-gradient-to-br from-blue-400/70 to-primary/50 group-hover:opacity-75"} transition-all duration-500`}></div>
              <Card className="relative h-full bg-card/95 backdrop-blur-sm border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plan.icon}
                      <CardTitle className="flex items-center gap-2">
                        {plan.nome}
                        <Badge variant={plan.destaque ? "secondary" : "default"} className="ml-2">
                          Selo {plan.selo}
                        </Badge>
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">{plan.preco}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.destaque ? "secondary" : "default"}>
                    Contribuir como {plan.nome}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" onClick={() => setShowInvestForm(true)}>
                Quero investir no CÓRTEX 💼
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Proposta de Investimento</DialogTitle>
                <DialogDescription>
                  Preencha o formulário abaixo para iniciar uma conversa sobre investimento no CÓRTEX.
                </DialogDescription>
              </DialogHeader>
              <Form>
                <div className="grid gap-4 py-4">
                  <FormField name="name">
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  
                  <FormField name="email">
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  
                  <FormField name="amount">
                    <FormItem>
                      <FormLabel>Valor pretendido (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" min="1000" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  
                  <FormField name="expectations">
                    <FormItem>
                      <FormLabel>O que espera em retorno?</FormLabel>
                      <FormControl>
                        <Input placeholder="Suas expectativas como investidor" />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  
                  <FormField name="contact">
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input type="checkbox" id="contact" defaultChecked className="rounded border-gray-300" />
                      </FormControl>
                      <FormLabel htmlFor="contact" className="text-sm">Aceito ser contatado pela equipe</FormLabel>
                    </FormItem>
                  </FormField>
                </div>
                
                <Button type="submit" className="w-full">Enviar proposta</Button>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <section className="pt-10 space-y-6">
        <h2 className="text-2xl font-bold text-center text-secondary">
          Perguntas Frequentes
        </h2>
        
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqItems.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer quote */}
      <motion.p 
        className="text-xl font-medium text-center text-foreground/80 italic mt-12 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        "Escolha ser usuário. Ou escolha fazer história."
      </motion.p>
    </div>
  );
}
