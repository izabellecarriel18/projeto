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

    const prompt = `Crie uma descrição histórica e interessante sobre o veículo:

Veículo: ${productName}

Requisitos OBRIGATÓRIOS:
- LIMITE MÁXIMO: 280 caracteres (incluindo espaços e pontuação)
- Conte a história do veículo de forma natural e fluida
- Mencione ano de criação, propósito/contexto histórico, características marcantes
- Escreva como se estivesse contando uma história sobre o carro
- Use tom informativo e envolvente, não promocional
- NÃO mencione "impressão 3D", "STL", "formato", "modelo 3D"
- NÃO fale sobre "linhas" do carro
- NÃO use frases genéricas de marketing
- Seja natural e autêntico
- A descrição deve caber em exatamente 6 linhas quando exibida, então use NO MÁXIMO 280 caracteres

Exemplos do estilo desejado (com limite de caracteres):
"Lançado em 1996, o Audi A3 foi criado para competir no segmento premium compacto. Combina tecnologia Quattro com design sofisticado e motor turbo eficiente."
"O S3 surgiu em 1999 como versão esportiva do A3, desenvolvido para entusiastas que buscavam performance sem abrir mão do conforto diário."`;

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
            content: "Você é um historiador automotivo que conta histórias fascinantes sobre veículos. Foque em contexto histórico, ano de criação, propósito original e características marcantes. Seja natural e informativo, não promocional. IMPORTANTE: Suas descrições devem ter NO MÁXIXMO 280 caracteres para caber perfeitamente em 6 linhas de texto."
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