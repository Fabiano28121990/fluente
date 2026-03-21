import { cn } from "@/lib/utils";

type BotState = "idle" | "thinking" | "speaking" | "listening";

export function BotAvatar({ state = "idle", size = "md" }: { state?: BotState; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8 text-lg",
    md: "h-12 w-12 text-2xl",
    lg: "h-20 w-20 text-4xl",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {(state === "thinking" || state === "speaking" || state === "listening") && (
        <div
          className={cn(
            "absolute inset-0 rounded-full animate-pulse-ring",
            state === "thinking" && "bg-primary/30",
            state === "speaking" && "bg-accent/30",
            state === "listening" && "bg-destructive/30"
          )}
          style={{ transform: "scale(1.3)" }}
        />
      )}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300",
          sizeClasses[size],
          state === "speaking" && "bg-accent text-accent-foreground",
          state === "listening" && "bg-destructive"
        )}
      >
        🤖
      </div>
    </div>
  );
}
