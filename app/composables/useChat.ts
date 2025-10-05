import { useAI } from "./useAI";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  model?: string;
  isStreaming?: boolean;
  error?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export const useChat = () => {
  const { generate, isConfigured, config } = useAI();

  const conversations = useState<ChatConversation[]>(
    "chat_conversations",
    () => []
  );
  const activeConversationId = useState<string | null>(
    "active_conversation",
    () => null
  );
  const isGenerating = useState<boolean>("chat_is_generating", () => false);

  const activeConversation = computed(() => {
    if (!activeConversationId.value) return null;
    return (
      conversations.value.find((c) => c.id === activeConversationId.value) ||
      null
    );
  });

  const loadConversations = () => {
    if (process.client && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("chat_conversations");
      if (saved) {
        try {
          conversations.value = JSON.parse(saved);
        } catch (e) {}
      }
    }
  };

  const saveConversations = () => {
    if (process.client && typeof localStorage !== "undefined") {
      localStorage.setItem(
        "chat_conversations",
        JSON.stringify(conversations.value)
      );
    }
  };

  const createConversation = (title = "Nowa rozmowa") => {
    const newConversation: ChatConversation = {
      id: `conv_${Date.now()}`,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    conversations.value.unshift(newConversation);
    activeConversationId.value = newConversation.id;
    saveConversations();

    return newConversation;
  };

  const deleteConversation = (id: string) => {
    conversations.value = conversations.value.filter((c) => c.id !== id);
    if (activeConversationId.value === id) {
      activeConversationId.value = conversations.value[0]?.id || null;
    }
    saveConversations();
  };

  const clearConversation = (id: string) => {
    const conversation = conversations.value.find((c) => c.id === id);
    if (conversation) {
      conversation.messages = [];
      conversation.updatedAt = Date.now();
      saveConversations();
    }
  };

  const selectConversation = (id: string) => {
    activeConversationId.value = id;
  };

  const generateTitle = (firstMessage: string): string => {
    const maxLength = 50;
    const cleaned = firstMessage.trim().replace(/\s+/g, " ");
    return cleaned.length > maxLength
      ? cleaned.slice(0, maxLength) + "..."
      : cleaned;
  };

  const sendMessage = async (conversationId: string, content: string) => {
    const conversation = conversations.value.find(
      (c) => c.id === conversationId
    );
    if (!conversation || isGenerating.value) return;

    if (!isConfigured.value) {
      throw new Error("AI nie jest skonfigurowane");
    }

    isGenerating.value = true;
    const currentModel = config.value?.modelId || "unknown";

    try {
      // Dodaj wiadomość użytkownika
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };
      conversation.messages.push(userMessage);

      // Wygeneruj tytuł dla pierwszej wiadomości
      if (conversation.messages.length === 1) {
        conversation.title = generateTitle(content);
      }

      // Wywołaj AI
      const response = await generate(content);

      // Dodaj odpowiedź AI
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: response.content,
        timestamp: Date.now(),
        model: currentModel,
      };
      conversation.messages.push(assistantMessage);

      // Zaktualizuj timestamp konwersacji
      conversation.updatedAt = Date.now();

      // Zapisz konwersacje
      saveConversations();
    } catch (error: any) {
      // Dodaj wiadomość z błędem
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: "assistant",
        content: `❌ Błąd: ${error.message}`,
        timestamp: Date.now(),
        model: currentModel,
        error: error.message,
      };
      conversation.messages.push(errorMessage);
      conversation.updatedAt = Date.now();
      saveConversations();

      throw error;
    } finally {
      isGenerating.value = false;
    }
  };

  const retryMessage = async (conversationId: string, messageId: string) => {
    const conversation = conversations.value.find(
      (c) => c.id === conversationId
    );
    if (!conversation) return;

    const messageIndex = conversation.messages.findIndex(
      (m) => m.id === messageId
    );
    if (messageIndex === -1) return;

    const message = conversation.messages[messageIndex];

    // Guard clause: sprawdź czy message istnieje
    if (!message) return;
    if (message.role !== "assistant" || !message.error) return;

    // Znajdź poprzednią wiadomość użytkownika
    let userMessage = "";
    for (let i = messageIndex - 1; i >= 0; i--) {
      const msg = conversation.messages[i];
      if (msg && msg.role === "user") {
        userMessage = msg.content;
        break;
      }
    }

    if (!userMessage) return;

    // Usuń błędną wiadomość
    conversation.messages.splice(messageIndex, 1);
    saveConversations();

    // Wyślij ponownie
    await sendMessage(conversationId, userMessage);
  };

  const updateConversationTitle = (id: string, title: string) => {
    const conversation = conversations.value.find((c) => c.id === id);
    if (!conversation) return; // Guard clause

    conversation.title = title;
    conversation.updatedAt = Date.now();
    saveConversations();
  };

  // Załaduj konwersacje przy inicjalizacji
  if (import.meta.client) {
    onMounted(() => {
      loadConversations();
      if (conversations.value.length === 0) {
        createConversation();
      } else if (!activeConversationId.value && conversations.value[0]) {
        activeConversationId.value = conversations.value[0].id;
      }
    });
  }

  return {
    conversations: readonly(conversations),
    activeConversation,
    activeConversationId,
    isGenerating: readonly(isGenerating),
    isConfigured,
    createConversation,
    deleteConversation,
    clearConversation,
    selectConversation,
    sendMessage,
    retryMessage,
    updateConversationTitle,
  };
};
