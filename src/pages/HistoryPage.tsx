import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversations, deleteConversation } from "@/lib/chat-storage";
import { LANGUAGES, SCENARIOS, LEVELS } from "@/lib/constants";
import { ArrowLeft, Trash2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(getConversations);
  const [filter, setFilter] = useState("");

  const filtered = filter
    ? conversations.filter((c) => c.settings.language === filter)
    : conversations;

  const handleDelete = (id: string) => {
    deleteConversation(id);
    setConversations(getConversations());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl flex items-center gap-3 h-14 px-4">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold">Histórico de Conversas</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-2xl px-4 py-6 space-y-4">
        {/* Language filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              !filter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Todos
          </button>
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => setFilter(l.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                filter === l.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3 animate-fade-up">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-primary hover:underline"
            >
              Iniciar uma nova conversa
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => {
              const lang = LANGUAGES.find((l) => l.id === c.settings.language);
              const scenario = SCENARIOS.find((s) => s.id === c.settings.scenario);
              const level = LEVELS.find((l) => l.id === c.settings.level);
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] animate-fade-up"
                  onClick={() => navigate(`/chat/${c.id}`)}
                >
                  <span className="text-2xl">{lang?.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {lang?.label} · {scenario?.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {level?.label} · {c.messages.length} msgs · {new Date(c.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
