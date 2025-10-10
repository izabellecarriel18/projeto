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

    const prompt = `Crie uma descrição em DUAS PARTES sobre este veículo:

Veículo: ${productName}

ESTRUTURA OBRIGATÓRIA:
- LIMITE ABSOLUTO: MÁXIMO 280 caracteres (incluindo espaços e pontuação)
- CRÍTICO: Se passar de 280 caracteres, a descrição será REJEITADA

PARTE 1 (primeiras 3-4 linhas - ±140 caracteres):
- História do veículo com dados técnicos específicos
- Ano, motores, potência, aceleração
- Tecnologias principais
- Tom informativo e direto

PARTE 2 (últimas 2-3 linhas - ±140 caracteres):
- Call-to-action direto para compra
- Frases curtas como: "Modelo detalhado para sua coleção", "Adicione à sua coleção", "Perfeito para colecionadores"
- Tom persuasivo e conciso

NÃO mencione: "impressão 3D", "STL", "formato", "arquivo"

Exemplo (280 chars):
"O Audi A3 (2021) traz motor 2.0 TFSI, 150 cv e 250 Nm, aceleração de 0-100 km/h em 8.4s. Com sistema MMI e assistência de estacionamento, é exemplo de inovação. Design esportivo irresistível! Modelo detalhado para sua coleção. Não perca esta chance!`;

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
            content: "Você é um vendedor especialista. LIMITE ABSOLUTO: 280 caracteres TOTAL. Escreva em DUAS PARTES: 1) História técnica concisa (ano, motor, potência, aceleração) - 140 chars. 2) Call-to-action curto para compra como 'perfeito para sua coleção', 'adicione à sua coleção' - 140 chars. Seja direto, elimine palavras desnecessárias. NUNCA passe de 280 caracteres!"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    let description = data.choices[0]?.message?.content?.trim() || "";

    if (description.length > 280) {
      console.warn(`[${productName}] Descrição muito longa (${description.length} chars), truncando para 280`);
      description = description.substring(0, 277) + '...';
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