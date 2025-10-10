import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  productName: string;
  category: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { productName, category }: RequestBody = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `LIMITE CRÍTICO: 260 CARACTERES NO MÁXIMO!

Veículo: ${productName}

CRIE UM TEXTO DE VENDA COM:

PARTE 1 (120 chars):
- Dados técnicos SEM ANO (motor, potência, aceleração)
- Tecnologias principais
- Tom informativo

PARTE 2 (120 chars):
- Frase de call-to-action curta
- Incentivo à compra

PROIBIDO:
- Anos (2021, 2020, etc)
- Gerações (8Y, Mk7, etc)
- Termos: "impressão 3D", "STL", "formato", "arquivo"

EXEMPLO (245 chars):
"O Audi A3 tem motor 2.0 TFSI com 150 cv e 250 Nm, aceleração 0-100 km/h em 8.4s. Equipado com MMI e assistência de estacionamento, é referência em tecnologia alemã. Design esportivo premium! Modelo detalhado para colecionadores."

SEJA DIRETO E CONCISO!`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um copywriter de vendas. MÁXIMO ABSOLUTO: 260 CARACTERES. Conte cada caractere! NÃO mencione anos ou gerações. Formato: Parte 1 (120 chars): dados técnicos sem ano. Parte 2 (120 chars): call-to-action curto. Elimine palavras extras. Use frases curtas. SE PASSAR DE 260 CARACTERES A DESCRIÇÃO É INVÁLIDA!"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    let description = data.choices[0]?.message?.content?.trim() || "";

    if (description.length > 260) {
      console.warn(`[${productName}] Descrição muito longa (${description.length} chars), truncando para 260`);
      description = description.substring(0, 257) + '...';
    }

    return new Response(
      JSON.stringify({ description }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating description:", error);
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