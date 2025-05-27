
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionData {
  plan_type: 'free' | 'personal' | 'expansive' | 'founder' | 'pioneer';
  status: 'active' | 'canceled' | 'expired' | 'pending';
  is_lifetime: boolean;
  current_period_end?: string;
  stripe_customer_id?: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) throw error;
      
      setSubscription(data);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar sua assinatura",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (planType: string) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) throw error;

      // Abrir Stripe checkout em nova aba
      window.open(data.url, '_blank');
      return data;
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o processo de pagamento",
        variant: "destructive"
      });
      return null;
    }
  };

  const openCustomerPortal = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Erro ao abrir portal do cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de gerenciamento",
        variant: "destructive"
      });
    }
  };

  const submitInvestmentProposal = async (proposalData: {
    name: string;
    email: string;
    amount: string;
    expectations: string;
    contact: boolean;
  }) => {
    if (!user?.id) return null;

    try {
      // Usar insert direto já que a tabela pode não estar nos tipos ainda
      const { data, error } = await supabase
        .from('investment_proposals' as any)
        .insert({
          user_id: user.id,
          name: proposalData.name,
          email: proposalData.email,
          amount: proposalData.amount,
          expectations: proposalData.expectations,
          contact_consent: proposalData.contact
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua proposta de investimento foi enviada com sucesso!"
      });

      return data;
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua proposta",
        variant: "destructive"
      });
      return null;
    }
  };

  const getPlanBenefits = (planType: string) => {
    const benefits = {
      free: [
        "Acesso limitado ao CÓRTEX",
        "3 interações com IA por dia",
        "Subcérebros limitados",
        "Projetos básicos"
      ],
      personal: [
        "IA moderada",
        "Até 15 projetos",
        "10 hábitos ativos",
        "Suporte padrão"
      ],
      expansive: [
        "Acesso total ao CÓRTEX",
        "IA Athena ilimitada",
        "Personalização completa",
        "Suporte prioritário",
        "Conecta premium"
      ],
      founder: [
        "Acesso vitalício ao plano Expansivo",
        "Selo Fundador dourado",
        "Nome eternizado na plataforma",
        "Canal VIP de acesso à equipe",
        "Votação em novas funcionalidades"
      ],
      pioneer: [
        "Acesso vitalício ao plano Expansivo",
        "Selo Pioneiro prateado",
        "Acesso antecipado a funcionalidades",
        "Convites exclusivos para beta tests"
      ]
    };
    return benefits[planType] || benefits.free;
  };

  const isFeatureAvailable = (feature: string): boolean => {
    if (!subscription) return false;
    
    const { plan_type, status } = subscription;
    if (status !== 'active') return false;

    const featureMatrix = {
      unlimited_ai: ['expansive', 'founder', 'pioneer'],
      priority_support: ['expansive', 'founder', 'pioneer'],
      premium_features: ['expansive', 'founder', 'pioneer'],
      advanced_projects: ['personal', 'expansive', 'founder', 'pioneer'],
      founder_benefits: ['founder'],
      pioneer_benefits: ['pioneer']
    };

    return featureMatrix[feature]?.includes(plan_type) || false;
  };

  useEffect(() => {
    checkSubscription();
  }, [user?.id]);

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    submitInvestmentProposal,
    getPlanBenefits,
    isFeatureAvailable
  };
};
