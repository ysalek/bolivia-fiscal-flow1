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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabaseService();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Falta Authorization header");
    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("Usuario no autenticado o sin email");

    const stripeKey = await getStripeSecret(supabase);
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No existe un cliente de Stripe para este usuario");
    }
    const customerId = customers.data[0].id;

    const origin = req.headers.get("origin") || "https://app.example.com";
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/suscripcion`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[customer-portal]", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});