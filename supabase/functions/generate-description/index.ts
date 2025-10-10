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

ESTRUTURA OBRIGATÓRIA (máximo 240 caracteres total):

PARTE 1 (primeiras 3 linhas - ±120 caracteres):
- História do veículo com dados técnicos específicos
- Ano, motores, potência, torque, aceleração
- Tecnologias exclusivas e curiosidades técnicas
- Tom informativo e apaixonado

PARTE 2 (últimas 3 linhas - ±120 caracteres):
- Call-to-action direto para compra
- Frases como: "Modelo rico em detalhes pronto para sua coleção", "Adicione este ícone à sua coleção hoje", "Perfeito para entusiastas e colecionadores"
- Crie urgência e desejo de posse
- Tom persuasivo e vendedor

NÃO mencione: "impressão 3D", "STL", "formato", "arquivo"

Exemplo da estrutura ideal:
"O Audi A3 (8Y, 2020-presente) vem com motor 2.0 TFSI, 190 cv a 4200 rpm e 320 Nm, acelerando 0-100 km/h em 6.8s. Possui MMI Touch e tração Quattro Ultra. Modelo rico em detalhes, perfeito para sua coleção de miniaturas premium!`;

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
            content: "Você é um vendedor especialista em carros de luxo. Escreva em DUAS PARTES: 1) História técnica com dados reais (ano, motor, potência, aceleração) - 120 chars. 2) Call-to-action persuasivo para compra com frases como 'perfeito para sua coleção', 'adicione este ícone hoje' - 120 chars. Total: 240 caracteres. Cada descrição deve ser única e fazer o leitor querer comprar AGORA!"
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