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

    const prompt = `LIMITE CRÍTICO ABSOLUTO: 340 CARACTERES! ESTRITAMENTE PROIBIDO ULTRAPASSAR!

Veículo: ${productName}

CRIE DESCRIÇÃO DE VENDA DE MODELO 3D:

PARTE 1 (170 chars):
- Destaque características do veículo real (design, motor, tecnologias) SEM ANO
- Deixe claro que é MODELO 3D DIGITAL
- Tom informativo sobre o modelo

PARTE 2 (170 chars):
- Call-to-action para colecionadores
- Foque na qualidade e detalhamento do MODELO 3D

PROIBIDO:
- Anos/gerações
- Falar como se fosse carro real ("agende test drive", "não perca a chance de ter o seu")
- Termos: "impressão 3D", "STL", "formato", "arquivo"

EXEMPLO (320 chars):
"Modelo 3D do Audi A3 replica motor 2.0 TFSI, 150cv, design esportivo e tecnologia MMI. Geometria precisa e detalhes fiéis ao original. Perfeito para colecionadores e entusiastas! Adicione esta réplica digital premium à sua coleção. Alta qualidade e precisão dimensional garantidas."

MANTER ABAIXO DE 340 CARACTERES É OBRIGATÓRIO!`;

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
            content: "Você é um copywriter vendendo MODELOS 3D DIGITAIS de veículos, NÃO carros reais! A descrição deve ter no máximo 340 caracteres, não ultrapasse esse número. Parte 1 (170 chars): características do modelo 3D e veículo original SEM ANO. Parte 2 (170 chars): call-to-action para colecionadores do MODELO DIGITAL. PROIBIDO: falar como se fosse carro real. Use: 'modelo 3D', 'réplica digital', 'para colecionadores'."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    let description = data.choices[0]?.message?.content?.trim() || "";

    if (description.length > 340) {
      console.warn(`[${productName}] Descrição muito longa (${description.length} chars), truncando para 340`);
      description = description.substring(0, 340);
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