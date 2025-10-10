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

    const prompt = `Crie uma descrição ÚNICA e ESPECÍFICA sobre este veículo:

Veículo: ${productName}

Requisitos OBRIGATÓRIOS:
- LIMITE MÁXIMO: 240 caracteres (incluindo espaços e pontuação)
- Foque em DETALHES ESPECÍFICOS deste modelo: motores, potência, tecnologias exclusivas, gerações, versões
- Mencione dados técnicos concretos: cilindradas, cavalos de potência, torque, aceleração
- Conte curiosidades e fatos únicos que diferenciam ESTE modelo dos outros
- Evite descrições genéricas que serviriam para qualquer carro
- NÃO use frases como "performance e conforto", "design sofisticado", "tecnologia Quattro" sem especificar
- NÃO mencione "impressão 3D", "STL", "formato", "modelo 3D"
- Seja ESPECÍFICO e TÉCNICO, mas acessível

Exemplos de descrições ESPECÍFICAS:
"Produzido desde 1994, o A4 chegou com motores 1.6 a 2.8 V6. A geração B5 trouxe design revolucionário e tração Quattro permanente com diferencial Torsen."
"O S3 8L (1999-2003) equipava turbo K04, 210cv a 5900rpm e 270Nm. Acelerava 0-100 em 6.6s, rivalizando com Golf R32 e Focus RS da época."`;

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
            content: "Você é um especialista técnico automotivo com conhecimento profundo de cada veículo. Forneça descrições ESPECÍFICAS e ÚNICAS com dados técnicos concretos: motores, potência, torque, aceleração, tecnologias exclusivas, gerações, curiosidades. EVITE descrições genéricas. CRÍTICO: máximo 240 caracteres. Cada carro deve ter uma descrição diferenciada baseada em suas características reais."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
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