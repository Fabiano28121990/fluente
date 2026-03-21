import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConversations, saveConversation } from "@/lib/chat-storage";
import { streamChat } from "@/lib/stream-chat";
import { useSpeechRecognition, speakText } from "@/hooks/use-speech";
import { ChatBubble } from "@/components/ChatBubble";
import { BotAvatar } from "@/components/BotAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { ChatMessage, SavedConversation } from "@/lib/constants";
import { LANGUAGES, SCENARIOS, LEVELS } from "@/lib/constants";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [convo, setConvo] = useState<SavedConversation | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [botState, setBotState] = useState<"idle" | "thinking" | "speaking" | "listening">("idle");
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

  useEffect(() => {
    const all = getConversations();
    const found = all.find((c) => c.id === id);
    if (found) setConvo(found);
    else navigate("/");
  }, [id, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo?.messages]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (isListening) setBotState("listening");
    else if (!isLoading) setBotState("idle");
  }, [isListening, isLoading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !convo || isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      const updated = {
        ...convo,
        messages: [...convo.messages, userMsg],
        updatedAt: Date.now(),
      };
      setConvo(updated);
      saveConversation(updated);
      setInput("");
      setTranscript("");
      setIsLoading(true);
      setBotState("thinking");

      let assistantContent = "";
      const assistantId = crypto.randomUUID();

      abortRef.current = new AbortController();

      await streamChat({
        messages: updated.messages.map((m) => ({ role: m.role, content: m.content })),
        settings: convo.settings,
        signal: abortRef.current.signal,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setConvo((prev) => {
            if (!prev) return prev;
            const msgs = [...prev.messages];
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg?.id === assistantId) {
              msgs[msgs.length - 1] = { ...lastMsg, content: assistantContent };
            } else {
              msgs.push({ id: assistantId, role: "assistant", content: assistantContent, timestamp: Date.now() });
            }
            return { ...prev, messages: msgs };
          });
        },
        onDone: () => {
          setIsLoading(false);
          setBotState("idle");
          setConvo((prev) => {
            if (!prev) return prev;
            saveConversation(prev);
            if (autoSpeak && assistantContent) {
              setBotState("speaking");
              speakText(assistantContent, prev.settings.language);
              setTimeout(() => setBotState("idle"), 3000);
            }
            return prev;
          });
        },
        onError: (err) => {
          setIsLoading(false);
          setBotState("idle");
          toast({ title: "Erro", description: err, variant: "destructive" });
        },
      });
    },
    [convo, isLoading, autoSpeak, setTranscript]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) sendMessage(transcript);
    } else {
      startListening(convo?.settings.language || "English");
    }
  };

  if (!convo) return null;

  const langInfo = LANGUAGES.find((l) => l.id === convo.settings.language);
  const scenarioInfo = SCENARIOS.find((s) => s.id === convo.settings.scenario);
  const levelInfo = LEVELS.find((l) => l.id === convo.settings.level);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 h-14 px-4">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <BotAvatar state={botState} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              Lingua · {langInfo?.flag} {langInfo?.label}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {levelInfo?.icon} {levelInfo?.label} · {scenarioInfo?.icon} {scenarioInfo?.label}
            </p>
          </div>
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={cn("p-2 rounded-lg transition-colors", autoSpeak ? "text-primary" : "text-muted-foreground")}
          >
            {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="container max-w-2xl px-4 py-6 space-y-4">
          {convo.messages.length === 0 && (
            <div className="text-center py-16 space-y-4 animate-fade-up">
              <BotAvatar state="idle" size="lg" />
              <div>
                <h2 className="text-lg font-semibold">Olá! Eu sou a Lingua 👋</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Vamos praticar {langInfo?.label}! Escreva ou fale algo para começar.
                </p>
              </div>
            </div>
          )}
          {convo.messages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              language={convo.settings.language}
              isStreaming={isLoading && i === convo.messages.length - 1 && msg.role === "assistant"}
            />
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t bg-card/80 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="container max-w-2xl flex gap-2">
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleVoice}
            className="shrink-0 transition-all duration-200 active:scale-95"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Ouvindo..." : "Digite sua mensagem..."}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="shrink-0 active:scale-95">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
