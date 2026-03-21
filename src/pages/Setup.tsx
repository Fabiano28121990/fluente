import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LANGUAGES, LEVELS, SCENARIOS } from "@/lib/constants";
import { createConversation, saveConversation } from "@/lib/chat-storage";
import { cn } from "@/lib/utils";
import { MessageSquare, History } from "lucide-react";

export default function Setup() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [scenario, setScenario] = useState("");
  const step = !language ? 1 : !level ? 2 : !scenario ? 3 : 4;

  const start = () => {
    const convo = createConversation({ language, level, scenario });
    saveConversation(convo);
    navigate(`/chat/${convo.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <span className="text-2xl">🌍</span> Lingua
          </div>
          <button
            onClick={() => navigate("/history")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="h-4 w-4" /> Histórico
          </button>
        </div>
      </header>

      <main className="flex-1 container max-w-2xl px-4 py-8 space-y-8">
        {/* Step 1: Language */}
        <section className="animate-fade-up space-y-4">
          <h1 className="text-2xl font-bold tracking-tight" style={{ lineHeight: "1.2" }}>
            Qual idioma você quer praticar?
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md active:scale-[0.97]",
                  language === l.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="text-3xl">{l.flag}</span>
                <span className="text-sm font-medium">{l.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Level */}
        {step >= 2 && (
          <section className="animate-fade-up space-y-4">
            <h2 className="text-xl font-semibold">Seu nível</h2>
            <div className="grid gap-3">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md active:scale-[0.98]",
                    level === l.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="text-2xl">{l.icon}</span>
                  <div>
                    <p className="font-medium">{l.label}</p>
                    <p className="text-sm text-muted-foreground">{l.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 3: Scenario */}
        {step >= 3 && (
          <section className="animate-fade-up space-y-4">
            <h2 className="text-xl font-semibold">Escolha um cenário</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md active:scale-[0.97]",
                    scenario === s.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-xs text-muted-foreground text-center">{s.desc}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Start button */}
        {step === 4 && (
          <div className="animate-fade-up">
            <button
              onClick={start}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              <MessageSquare className="h-5 w-5" /> Iniciar Conversa
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
