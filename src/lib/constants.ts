export const LANGUAGES = [
  { id: "English", label: "Inglês", flag: "🇺🇸" },
  { id: "Spanish", label: "Espanhol", flag: "🇪🇸" },
  { id: "French", label: "Francês", flag: "🇫🇷" },
  { id: "German", label: "Alemão", flag: "🇩🇪" },
  { id: "Italian", label: "Italiano", flag: "🇮🇹" },
  { id: "Japanese", label: "Japonês", flag: "🇯🇵" },
  { id: "Korean", label: "Coreano", flag: "🇰🇷" },
  { id: "Mandarin Chinese", label: "Mandarim", flag: "🇨🇳" },
] as const;

export const LEVELS = [
  { id: "beginner", label: "Iniciante", icon: "🌱", desc: "Vocabulário básico e frases simples" },
  { id: "intermediate", label: "Intermediário", icon: "📚", desc: "Conversas do dia a dia com gramática moderada" },
  { id: "advanced", label: "Avançado", icon: "🎓", desc: "Expressões idiomáticas e gramática complexa" },
] as const;

export const SCENARIOS = [
  { id: "restaurant", label: "Restaurante", icon: "🍽️", desc: "Pedir comida e bebidas" },
  { id: "airport", label: "Aeroporto", icon: "✈️", desc: "Check-in, embarque e alfândega" },
  { id: "interview", label: "Entrevista", icon: "💼", desc: "Entrevista de emprego" },
  { id: "travel", label: "Viagem", icon: "🗺️", desc: "Direções, hotéis e turismo" },
  { id: "daily", label: "Dia a dia", icon: "☀️", desc: "Conversas casuais" },
  { id: "free", label: "Conversa livre", icon: "💬", desc: "Qualquer assunto" },
] as const;

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type ConversationSettings = {
  language: string;
  level: string;
  scenario: string;
};

export type SavedConversation = {
  id: string;
  settings: ConversationSettings;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  title: string;
};
