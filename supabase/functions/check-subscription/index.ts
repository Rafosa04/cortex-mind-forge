
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Verificar assinatura local primeiro
    const { data: localSub } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating free plan");
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        plan_type: "free",
        status: "active",
        stripe_customer_id: null,
        is_lifetime: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ 
        plan_type: "free", 
        status: "active",
        is_lifetime: false 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    let subscriptionData = {
      user_id: user.id,
      stripe_customer_id: customerId,
      plan_type: "free",
      status: "active",
      is_lifetime: false,
      current_period_start: null,
      current_period_end: null,
    };

    // Verificar se tem assinatura vitalícia (pagamento único)
    if (localSub?.is_lifetime && localSub?.status === "active") {
      logStep("Found active lifetime subscription", { planType: localSub.plan_type });
      subscriptionData = {
        ...subscriptionData,
        plan_type: localSub.plan_type,
        is_lifetime: true,
        status: "active"
      };
    } else {
      // Verificar assinaturas recorrentes
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        const priceId = subscription.items.data[0].price.id;
        
        let planType = "free";
        // Mapear IDs de preços para tipos de planos
        if (priceId === "price_1RTBBXPMM4YiFlIESs6rdUQ1") planType = "personal";
        else if (priceId === "price_1RTBC1PMM4YiFlIE3XDtWvXA") planType = "expansive";

        subscriptionData = {
          ...subscriptionData,
          plan_type: planType,
          status: "active",
          stripe_subscription_id: subscription.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          amount: subscription.items.data[0].price.unit_amount || 0
        };

        logStep("Active subscription found", { 
          subscriptionId: subscription.id, 
          planType,
          priceId
        });
      }
    }

    await supabaseClient.from("subscriptions").upsert(subscriptionData, { 
      onConflict: 'user_id' 
    });

    logStep("Updated database with subscription info", subscriptionData);
    
    return new Response(JSON.stringify({
      plan_type: subscriptionData.plan_type,
      status: subscriptionData.status,
      is_lifetime: subscriptionData.is_lifetime,
      current_period_end: subscriptionData.current_period_end
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
