import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getSupabaseService = () =>
  createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

const getStripeSecret = async (supabase: ReturnType<typeof createClient>) => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "stripe_secret_key")
    .single();
  if (error) throw new Error(`No se pudo leer stripe_secret_key: ${error.message}`);
  if (!data?.value) throw new Error("stripe_secret_key no está configurada");
  return data.value as string;
};

const logStep = (step: string, details?: any) => {
  console.log(`[check-subscription] ${step}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabaseService();

  try {
    logStep("start");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Falta Authorization header");
    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("Usuario no autenticado o sin email");
    logStep("user", { id: user.id, email: user.email });

    const stripeKey = await getStripeSecret(supabase);
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      logStep("no customer");
      await supabase.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    const active = subscriptions.data.length > 0;

    let tier: string | null = null;
    let endIso: string | null = null;

    if (active) {
      const sub = subscriptions.data[0];
      endIso = new Date(sub.current_period_end * 1000).toISOString();
      const priceId = sub.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      tier = amount <= 999 ? 'Basic' : amount <= 1999 ? 'Premium' : 'Enterprise';
    }

    await supabase.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: active,
      subscription_tier: tier,
      subscription_end: endIso,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    return new Response(JSON.stringify({ subscribed: active, subscription_tier: tier, subscription_end: endIso }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[check-subscription]", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});