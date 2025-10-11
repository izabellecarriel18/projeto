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
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return new Response(
          JSON.stringify({ error: "Webhook signature verification failed" }),
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      event = JSON.parse(body);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.productIds) {
          const productIds = session.metadata.productIds.split(',');
          const purchases = productIds.map((productId: string) => ({
            user_id: session.metadata?.userId,
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
            console.error("Error creating purchases:", error);
          } else {
            console.log(`${purchases.length} purchases created successfully for user:`, session.metadata?.userId);
          }
        } else if (session.metadata?.productId) {
          const { error } = await supabase
            .from("user_purchases")
            .insert({
              user_id: session.metadata?.userId,
              product_id: session.metadata?.productId,
              stripe_session_id: session.id,
              stripe_payment_intent: session.payment_intent as string,
              amount_paid: (session.amount_total || 0) / 100,
              currency: session.currency || "brl",
              status: "completed",
              purchased_at: new Date().toISOString(),
            });

          if (error) {
            console.error("Error creating purchase:", error);
          } else {
            console.log("Purchase created successfully for user:", session.metadata?.userId);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await supabase
          .from("user_purchases")
          .update({ status: "failed" })
          .eq("stripe_payment_intent", paymentIntent.id);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        await supabase
          .from("user_purchases")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent", charge.payment_intent as string);
        break;
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});