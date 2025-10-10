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

    const categoryContext = {
      solid_cars: "modelo sólido para impressão 3D",
      complete_cars: "modelo completo com interior detalhado para impressão 3D",
      wheels: "roda detalhada para impressão 3D",
      bus_truck: "modelo de veículo pesado para impressão 3D",
    };

    const prompt = `Crie uma descrição atrativa e convincente em DUAS LINHAS CURTAS (máximo 120 caracteres) para o seguinte produto:

Produto: ${productName}
Tipo: ${categoryContext[category as keyof typeof categoryContext] || "modelo 3D para impressão"}

Requisitos:
- Máximo 2 linhas curtas
- Destaque características únicas do modelo
- Use linguagem persuasiva e profissional
- Mencione "impressão 3D" ou "modelo STL"
- Foque em design, detalhes e qualidade
- Seja específico sobre o veículo
- NÃO repita frases genéricas
- NÃO use "modelo 3D detalhado do"

Exemplo: "Modelo sólido do Audi A3 para impressão 3D. Design esportivo com detalhes precisos."`;

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
            content: "Você é um especialista em criar descrições de produtos para e-commerce de modelos 3D automotivos. Suas descrições são concisas, atrativas e específicas."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const description = data.choices[0]?.message?.content?.trim() || "";

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