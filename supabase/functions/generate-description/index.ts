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

function smartTruncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastPeriod > maxLength - 50) {
    return truncated.substring(0, lastPeriod + 1);
  }

  if (lastSpace > maxLength - 20) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

async function generateWithRetry(
  openaiApiKey: string,
  productName: string,
  maxAttempts: number = 2
): Promise<string> {
  const basePrompt = `LIMITE CRÍTICO: MÁXIMO 340 CARACTERES!

Veículo: ${productName}

DESCRIÇÃO VENDA MODELO 3D (340 chars máx):

PARTE 1 (150-170 chars):
- Características do veículo (design exterior, motor, tecnologias) SEM ANO
- Deixar claro que é MODELO 3D DIGITAL
- Tom informativo

PARTE 2 (150-170 chars):
- Call-to-action para colecionadores
- Qualidade do MODELO 3D

PROIBIDO:
- Anos/gerações
- Falar como carro real
- Termos técnicos: "STL", "impressão 3D"
- Mencionar interior do veículo

EXEMPLO (320 chars):
"Modelo 3D do Audi A3 replica motor 2.0 TFSI, 150cv, design esportivo e tecnologia MMI. Geometria precisa e detalhes fiéis ao original. Perfeito para colecionadores e entusiastas! Adicione esta réplica digital premium à sua coleção. Alta qualidade e precisão dimensional garantidas."

NÃO ULTRAPASSE 340 CARACTERES!`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const temperature = attempt === 1 ? 0.7 : 0.5;
    const maxTokens = attempt === 1 ? 90 : 80;

    const prompt = attempt === 1
      ? basePrompt
      : `${basePrompt}\n\nATENÇÃO: Tentativa ${attempt}. SEJA MAIS CONCISO! Máximo 320 caracteres para segurança.`;

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
            content: `Você é copywriter especializado em MODELOS 3D DIGITAIS de veículos. REGRA CRÍTICA: descrição com MÁXIMO 340 caracteres (não ultrapasse!). Estrutura: Parte 1 (150-170 chars): características do modelo 3D e veículo SEM ANO. Parte 2 (150-170 chars): call-to-action para colecionadores. Use: 'modelo 3D', 'réplica digital'. NUNCA fale como se fosse carro real. PROIBIDO mencionar interior do veículo.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const description = data.choices[0]?.message?.content?.trim() || "";

    console.log(`[${productName}] Tentativa ${attempt}: ${description.length} caracteres`);

    if (description.length <= 340) {
      return description;
    }

    if (attempt === maxAttempts) {
      console.warn(`[${productName}] Após ${maxAttempts} tentativas, ainda com ${description.length} chars. Truncando.`);
      return smartTruncate(description, 340);
    }
  }

  throw new Error("Falha ao gerar descrição");
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

    const description = await generateWithRetry(openaiApiKey, productName);

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