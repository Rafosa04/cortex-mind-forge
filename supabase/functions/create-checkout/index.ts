
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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

    const { planType } = await req.json();
    logStep("Plan type requested", { planType });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Verificar se já existe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // IDs dos preços do Stripe
    const planPriceIds = {
      free: "price_1RTBApPMM4YiFlIELgiMqHSp",
      personal: "price_1RTBBXPMM4YiFlIESs6rdUQ1",
      expansive: "price_1RTBC1PMM4YiFlIE3XDtWvXA",
      founder: "price_1RTBD1PMM4YiFlIEnyWOo99l",
      pioneer: "price_1RTBDmPMM4YiFlIECDKovPFX"
    };

    // Configurar preços baseado no tipo de plano
    const planConfigs = {
      personal: {
        mode: "subscription",
        priceId: planPriceIds.personal,
        amount: 1900 // R$ 19,00
      },
      expansive: {
        mode: "subscription", 
        priceId: planPriceIds.expansive,
        amount: 4900 // R$ 49,00
      },
      founder: {
        mode: "payment",
        priceId: planPriceIds.founder,
        amount: 49700, // R$ 497,00
        lifetime: true
      },
      pioneer: {
        mode: "payment", 
        priceId: planPriceIds.pioneer,
        amount: 29700, // R$ 297,00
        lifetime: true
      }
    };

    const config = planConfigs[planType];
    if (!config) throw new Error("Invalid plan type");

    let sessionConfig;

    if (config.mode === "subscription") {
      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price: config.priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.get("origin")}/planos?success=true&plan=${planType}`,
        cancel_url: `${req.headers.get("origin")}/planos?canceled=true`,
        metadata: {
          user_id: user.id,
          plan_type: planType
        }
      };
    } else {
      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price: config.priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/planos?success=true&plan=${planType}&lifetime=true`,
        cancel_url: `${req.headers.get("origin")}/planos?canceled=true`,
        metadata: {
          user_id: user.id,
          plan_type: planType,
          lifetime: "true"
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Salvar session temporariamente para tracking
    await supabaseClient.from("subscriptions").upsert({
      user_id: user.id,
      plan_type: planType,
      status: "pending",
      stripe_customer_id: customerId,
      is_lifetime: config.lifetime || false,
      amount: config.amount,
      currency: "BRL"
    }, { onConflict: 'user_id' });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
