import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@19.1.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe não configurado" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID não fornecido" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Pagamento não confirmado" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: existingPurchase } = await supabase
      .from("user_purchases")
      .select("id")
      .eq("stripe_session_id", session.id)
      .single();

    if (existingPurchase) {
      return new Response(
        JSON.stringify({ success: true, message: "Compra já registrada" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (session.metadata?.productIds) {
      const productIds = session.metadata.productIds.split(',');
      const purchases = productIds.map((productId: string) => ({
        user_id: user.id,
        product_id: productId,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        amount_paid: (session.amount_total || 0) / 100 / productIds.length,
        currency: session.currency || "brl",
        status: "completed",
        purchased_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("user_purchases")
        .insert(purchases);

      if (error) {
        throw error;
      }
    } else if (session.metadata?.productId) {
      const { error } = await supabase
        .from("user_purchases")
        .insert({
          user_id: user.id,
          product_id: session.metadata?.productId,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          amount_paid: (session.amount_total || 0) / 100,
          currency: session.currency || "brl",
          status: "completed",
          purchased_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Compra registrada com sucesso" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});