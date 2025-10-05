export const useAI = () => {
  const config = useState<any>("ai_config", () => null);

  const loadConfig = () => {
    if (process.client && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("ai_config");
      if (saved) {
        try {
          config.value = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse AI config:", e);
        }
      }
    }
  };

  // Pobierz listę dostępnych modeli
  const getModels = async () => {
    if (!config.value?.endpoint) {
      throw new Error("AI endpoint nie jest skonfigurowany");
    }

    try {
      const baseUrl = config.value.endpoint.replace(/\/v1\/.*$/, "");
      const modelsEndpoint = `${baseUrl}/v1/models`;

      const response = await fetch(modelsEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();

      // LM Studio zwraca { data: [ { id: "model-name", ... }, ... ] }
      const models = data.data || [];

      return models.map((m: any) => m.id).filter(Boolean);
    } catch (error: any) {
      throw error;
    }
  };

  // Generuj odpowiedź od AI z opcjonalnym systemowym promptem
  const generate = async (
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ) => {
    const startTime = Date.now();

    if (!config.value) {
      loadConfig();
    }

    if (!config.value?.endpoint || !config.value?.modelId) {
      throw new Error("AI endpoint i model nie są skonfigurowane");
    }

    const messages: any[] = [];

    // Dodaj system prompt jeśli istnieje
    if (options.systemPrompt) {
      messages.push({
        role: "system",
        content: options.systemPrompt,
      });
    }

    // Dodaj user prompt
    messages.push({
      role: "user",
      content: prompt,
    });

    const requestBody = {
      model: config.value.modelId,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? -1,
      stream: false,
    };

    try {
      const response = await fetch(config.value.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer lm-studio",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `AI request failed: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      if (!content) {
        throw new Error("Pusta odpowiedź od modelu");
      }

      // Track successful query
      if (process.client) {
        const { trackEvent } = useAnalytics();
        trackEvent("ai_query", {
          model: config.value.modelId,
          responseTime: Date.now() - startTime,
          promptLength: prompt.length,
          success: true,
        });
      }

      return {
        content: content.trim(),
        raw: data,
      };
    } catch (error: any) {
      // Track failed query
      if (process.client) {
        const { trackEvent } = useAnalytics();
        trackEvent("ai_query", {
          model: config.value.modelId,
          responseTime: Date.now() - startTime,
          error: error.message,
          success: false,
        });
      }

      throw new Error(`Błąd komunikacji z AI: ${error.message}`);
    }
  };

  // Testuj połączenie z AI
  const testConnection = async () => {
    if (!config.value?.endpoint || !config.value?.modelId) {
      throw new Error("AI endpoint i model nie są skonfigurowane");
    }

    try {
      const result = await generate("Hello");
      return {
        success: true,
        message: "✓ Połączenie udane!",
        response: result.content,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `✗ Błąd połączenia: ${error.message}`,
        error: error,
      };
    }
  };

  const isConfigured = computed(() => {
    return !!(config.value?.endpoint && config.value?.modelId);
  });

  // Załaduj konfigurację przy inicjalizacji
  if (process.client) {
    onMounted(() => {
      loadConfig();
    });
  }

  return {
    config,
    loadConfig,
    generate,
    getModels,
    testConnection,
    isConfigured,
  };
};
