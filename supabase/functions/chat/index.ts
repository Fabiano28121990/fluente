import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language, level, scenario } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const levelMap: Record<string, string> = {
      beginner: "Use very simple vocabulary and short sentences. Speak slowly and clearly.",
      intermediate: "Use moderate vocabulary. Mix simple and complex sentences.",
      advanced: "Use rich vocabulary, idioms, and complex grammar naturally.",
    };

    const scenarioMap: Record<string, string> = {
      restaurant: "You are at a restaurant. Talk about ordering food, asking for the menu, making reservations.",
      airport: "You are at an airport. Talk about checking in, boarding, finding gates, customs.",
      interview: "You are in a job interview. Ask and answer professional questions.",
      travel: "You are traveling. Talk about directions, hotels, sightseeing, transportation.",
      daily: "Have a casual everyday conversation about life, hobbies, weather, plans.",
      shopping: "You are shopping. Talk about prices, sizes, colors, bargaining, and paying.",
      doctor: "You are at a doctor's appointment. Talk about symptoms, health, and medical advice.",
      school: "You are at school or university. Talk about classes, exams, teachers, and study topics.",
      phone: "You are on a phone call. Practice phone etiquette, leaving messages, and customer service.",
      party: "You are at a social event or party. Practice introductions, small talk, and socializing.",
      bank: "You are at a bank. Talk about accounts, transfers, exchange rates, and financial services.",
      free: "Have a free conversation about any topic the user wants.",
    };

    const systemPrompt = `Você é a Lingua, uma tutora de idiomas amigável e divertida que ajuda pessoas a praticar ${language}.

REGRAS IMPORTANTES:
- Você SEMPRE fala e responde em Português do Brasil como idioma base
- Quando o idioma de prática for diferente de Português, inclua frases no idioma de prática e explique em português
- ${levelMap[level] || levelMap.beginner}
- Contexto do cenário: ${scenarioMap[scenario] || scenarioMap.free}
- Após cada resposta, se o usuário cometeu erros de gramática ou vocabulário, adicione uma seção no final marcada com "📝 **Correções:**" onde você:
  - Mostra o erro com ~~tachado~~
  - Mostra a correção em **negrito**
  - Dá uma explicação breve em Português do Brasil
- Mantenha respostas concisas (2-4 frases para a parte de conversação)
- Faça perguntas de acompanhamento para manter a conversa fluindo
- Se o usuário escrever em Português e o idioma de prática não for Português, incentive gentilmente a tentar em ${language}
- Adapte-se ao nível do usuário e seja encorajadora
- Use emojis com moderação para ser amigável`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos esgotados. Adicione créditos na sua conta Lovable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
