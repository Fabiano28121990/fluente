import type { SavedConversation, ChatMessage, ConversationSettings } from "./constants";

const STORAGE_KEY = "lingua-conversations";

export function getConversations(): SavedConversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveConversation(conversation: SavedConversation) {
  const convos = getConversations();
  const idx = convos.findIndex((c) => c.id === conversation.id);
  if (idx >= 0) {
    convos[idx] = conversation;
  } else {
    convos.unshift(conversation);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function deleteConversation(id: string) {
  const convos = getConversations().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function createConversation(settings: ConversationSettings): SavedConversation {
  return {
    id: crypto.randomUUID(),
    settings,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    title: `${settings.language} - ${settings.scenario}`,
  };
}
