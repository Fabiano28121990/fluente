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
      free: "Have a free conversation about any topic the user wants.",
    };

    const systemPrompt = `You are a friendly AI language tutor helping someone practice ${language}. 
Your name is Lingua.

RULES:
- Respond primarily in ${language}. ${levelMap[level] || levelMap.beginner}
- Scenario context: ${scenarioMap[scenario] || scenarioMap.free}
- After each response, if the user made grammar or vocabulary mistakes, add a section at the end marked with "📝 **Correções:**" where you:
  - Show the mistake with ~~strikethrough~~
  - Show the correction in **bold**
  - Give a brief explanation in Portuguese (Brazil)
- Keep responses concise (2-4 sentences for the conversation part)
- Ask follow-up questions to keep the conversation going
- If the user writes in Portuguese, gently encourage them to try in ${language}
- Adapt to the user's level and be encouraging
- Use emojis sparingly to be friendly`;

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
