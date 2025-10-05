export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  model?: string; // Opcjonalne pole z nazwą modelu
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
