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
      console.error("STRIPE_SECRET_KEY not configured in environment variables");
      return new Response(
        JSON.stringify({
          error: "Pagamentos não configurados. Entre em contato com o administrador.",
          code: "STRIPE_NOT_CONFIGURED"
        }),
        {
          status: 503,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("User auth error:", userError);
      throw new Error("Unauthorized");
    }

    console.log("User authenticated:", user.id, user.email);

    const body = await req.json();
    console.log("Request body:", body);

    const { productId, productName, price } = body;

    if (!productId || !productName || price === undefined || price === null) {
      console.error("Missing required fields:", { productId, productName, price });
      throw new Error("Missing required fields: productId, productName, or price");
    }

    const priceInCents = Math.round(Number(price) * 100);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      console.error("Invalid price:", price, "converted to:", priceInCents);
      throw new Error("Invalid price value");
    }

    console.log("Creating checkout session with:", {
      productId,
      productName,
      price,
      priceInCents,
      userEmail: user.email,
    });

    const isTestMode = stripeSecretKey.startsWith('sk_test_');

    const sessionConfig: any = {
      customer_email: user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: productName,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin")}/produtos?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/produtos?canceled=true`,
      metadata: {
        productId,
        userId: user.id,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("Checkout session created successfully:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);

    let errorMessage = "Erro ao processar pagamento";
    let errorDetails: any = null;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      if ('type' in error) {
        errorDetails.type = (error as any).type;
      }
      if ('raw' in error) {
        errorDetails.raw = (error as any).raw;
      }
    }

    console.error("Full error details:", JSON.stringify(errorDetails, null, 2));

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails
      }),
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