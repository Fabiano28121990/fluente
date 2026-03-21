import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { BotAvatar } from "./BotAvatar";
import { Volume2 } from "lucide-react";
import { speakText } from "@/hooks/use-speech";

type Props = {
  role: "user" | "assistant";
  content: string;
  language?: string;
  isStreaming?: boolean;
};

export function ChatBubble({ role, content, language, isStreaming }: Props) {
  const isBot = role === "assistant";

  return (
    <div className={cn("flex gap-3 animate-fade-up", isBot ? "justify-start" : "justify-end")}>
      {isBot && <BotAvatar state={isStreaming ? "thinking" : "idle"} size="sm" />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isBot
            ? "bg-card text-card-foreground rounded-tl-md"
            : "bg-primary text-primary-foreground rounded-tr-md"
        )}
      >
        {isBot ? (
          <div className="prose prose-sm dark:prose-invert max-w-none [&_del]:text-destructive [&_del]:decoration-destructive [&_strong]:text-primary">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
        {isBot && !isStreaming && content && language && (
          <button
            onClick={() => speakText(content, language)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Volume2 className="h-3.5 w-3.5" /> Ouvir
          </button>
        )}
      </div>
    </div>
  );
}
