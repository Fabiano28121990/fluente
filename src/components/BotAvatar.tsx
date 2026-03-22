import { cn } from "@/lib/utils";
import botImg from "@/assets/bot-avatar.png";

type BotState = "idle" | "thinking" | "speaking" | "listening";

export function BotAvatar({ state = "idle", size = "md" }: { state?: BotState; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const ringSize = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-24 w-24",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {(state === "thinking" || state === "speaking" || state === "listening") && (
        <div
          className={cn(
            "absolute rounded-full animate-pulse",
            ringSize[size],
            state === "thinking" && "bg-primary/20",
            state === "speaking" && "bg-accent/20",
            state === "listening" && "bg-destructive/20"
          )}
        />
      )}
      <img
        src={botImg}
        alt="Lingua bot"
        className={cn(
          "relative rounded-full object-cover transition-all duration-300",
          sizeClasses[size],
          state === "speaking" && "ring-2 ring-accent",
          state === "listening" && "ring-2 ring-destructive"
        )}
      />
    </div>
  );
}
