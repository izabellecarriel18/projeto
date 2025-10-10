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
      solid_cars: "carro esportivo de luxo",
      complete_cars: "veículo premium com acabamento sofisticado",
      wheels: "roda de alta performance",
      bus_truck: "veículo comercial robusto",
    };

    const prompt = `Crie uma descrição atrativa e convincente em DUAS LINHAS CURTAS (máximo 120 caracteres) sobre o veículo:

Veículo: ${productName}
Categoria: ${categoryContext[category as keyof typeof categoryContext] || "veículo"}

Requisitos OBRIGATÓRIOS:
- Máximo 2 linhas curtas (120 caracteres total)
- Fale APENAS sobre as características do CARRO/VEÍCULO
- Destaque design, performance, elegância, estilo, tecnologia
- NÃO mencione "impressão 3D", "STL", "formato", "modelo 3D"
- NÃO use "modelo 3D detalhado do"
- NÃO fale sobre "linhas" do carro (linhas esportivas, linhas aerodinâmicas, etc)
- Seja específico sobre estética e atributos do veículo
- Use linguagem persuasiva focada no automóvel

Exemplo: "Design aerodinâmico com acabamento sofisticado. Veículo premium que une elegância e potência."`;

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
            content: "Você é um especialista automotivo que cria descrições sobre veículos focando em suas características, design e performance. Nunca mencione impressão 3D ou formatos de arquivo."
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