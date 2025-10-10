import type { Prompt } from "~/types/content";

export interface SavedPrompt {
  savedId: string;
  promptId: string;
  result: string;
  placeholderValues: Record<string, string>;
  timestamp: number;
  name?: { pl: string; en: string };
  description?: { pl: string; en: string };
  template?: { pl: string; en: string };
  isCustom?: boolean;
  tags?: string[];
  categories?: string[];
  placeholder_keys?: string[];
  savedAt?: number;
}

export interface PromptCollection {
  id: string;
  name: string;
  description: string;
  promptIds: string[];
  createdAt: string;
}

interface LibraryData {
  saved: SavedPrompt[];
  custom: SavedPrompt[];
  collections: PromptCollection[];
  history: SavedPrompt[];
}

export const useLibrary = () => {
  const savedPrompts = useState<SavedPrompt[]>("library-saved", () => []);
  const customPrompts = useState<SavedPrompt[]>("library-custom", () => []);
  const collections = useState<PromptCollection[]>(
    "library-collections",
    () => []
  );
  const promptHistory = useState<SavedPrompt[]>("library-history", () => []);

  const stats = computed(() => ({
    totalSaved: savedPrompts.value.length,
    totalCustom: customPrompts.value.length,
    totalCollections: collections.value.length,
    totalHistory: promptHistory.value.length,
  }));

  const loadLibrary = () => {
    if (process.client) {
      try {
        const data = localStorage.getItem("prompt-library");
        if (data) {
          const parsed: LibraryData = JSON.parse(data);
          savedPrompts.value = parsed.saved || [];
          customPrompts.value = parsed.custom || [];
          collections.value = parsed.collections || [];
          promptHistory.value = parsed.history || [];
        }
      } catch (e) {
        console.error("Error loading library:", e);
      }
    }
  };

  const saveLibrary = () => {
    if (process.client) {
      const data: LibraryData = {
        saved: savedPrompts.value,
        custom: customPrompts.value,
        collections: collections.value,
        history: promptHistory.value,
      };

      console.log("💾 Zapisywanie biblioteki do localStorage:", {
        customPromptsCount: customPrompts.value.length,
        firstCustomPrompt: customPrompts.value[0],
      });

      localStorage.setItem("prompt-library", JSON.stringify(data));

      // Weryfikacja zapisu
      const saved = localStorage.getItem("prompt-library");
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("✅ Zweryfikowano zapis w localStorage:", {
          customPromptsCount: parsed.custom?.length,
          firstCustomPrompt: parsed.custom?.[0],
        });
      }
    }
  };

  const savePrompt = (promptData: SavedPrompt) => {
    const savedPrompt: SavedPrompt = {
      ...promptData,
      savedId:
        promptData.savedId ||
        `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: promptData.timestamp || Date.now(),
    };
    savedPrompts.value.push(savedPrompt);
    saveLibrary();
    return savedPrompt;
  };

  const removePrompt = (savedId: string) => {
    savedPrompts.value = savedPrompts.value.filter(
      (p) => p.savedId !== savedId
    );
    saveLibrary();
  };

  const createCustomPrompt = (data: {
    name: { pl: string; en: string };
    description: { pl: string; en: string };
    template: { pl: string; en: string };
  }): SavedPrompt => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const savedId = `saved-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const newPrompt: SavedPrompt = {
      savedId,
      promptId: id,
      name: data.name,
      description: data.description,
      result: data.template.pl, // lub wybierz odpowiedni język
      template: data.template,
      placeholderValues: {},
      timestamp: Date.now(),
      isCustom: true,
    };

    customPrompts.value.push(newPrompt);
    saveLibrary();

    return newPrompt;
  };

  const updateCustomPrompt = (savedId: string, data: Partial<SavedPrompt>) => {
    const index = customPrompts.value.findIndex((p) => p.savedId === savedId);
    if (index !== -1) {
      const existingPrompt = customPrompts.value[index];

      if (!existingPrompt) {
        console.error(`Prompt with savedId ${savedId} not found`);
        return;
      }

      console.log("🔄 Aktualizacja promptu:", {
        savedId,
        oldData: existingPrompt,
        newData: data,
      });

      // POPRAWKA: Merge wszystkie pola, zachowaj istniejące jeśli nie są w data
      customPrompts.value[index] = {
        ...existingPrompt,
        ...data,
        savedId: existingPrompt.savedId, // Zachowaj savedId
        promptId: existingPrompt.promptId, // Zachowaj promptId
        timestamp: existingPrompt.timestamp, // Zachowaj oryginalny timestamp
        savedAt: Date.now(), // Zaktualizuj czas modyfikacji
        isCustom: true, // Upewnij się, że to custom
      };

      console.log("✅ Zaktualizowano prompt:", customPrompts.value[index]);

      saveLibrary();
    } else {
      console.error(
        `Prompt with savedId ${savedId} not found in customPrompts`
      );
    }
  };

  const removeCustomPrompt = (savedId: string) => {
    customPrompts.value = customPrompts.value.filter(
      (p) => p.savedId !== savedId
    );
    saveLibrary();
  };

  const addToHistory = (template: Prompt) => {
    // Konwertuj template.id na string dla porównania
    const templateId = template.id?.toString();

    // Usuń duplikaty (ten sam ID promptu)
    promptHistory.value = promptHistory.value.filter(
      (p) => p.promptId !== templateId
    );

    const historyItem: SavedPrompt = {
      savedId: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      promptId: templateId || `temp-${Date.now()}`,
      result: "",
      placeholderValues: {},
      timestamp: Date.now(),
      name: template.name,
      description: template.description,
    };
    promptHistory.value.unshift(historyItem);

    // Ogranicz do 50 ostatnich
    if (promptHistory.value.length > 50) {
      promptHistory.value = promptHistory.value.slice(0, 50);
    }

    saveLibrary();
    return historyItem;
  };

  const clearHistory = () => {
    promptHistory.value = [];
    saveLibrary();
  };

  const createCollection = (name: string, description: string = "") => {
    const collection: PromptCollection = {
      id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      promptIds: [],
      createdAt: new Date().toISOString(),
    };
    collections.value.push(collection);
    saveLibrary();
    return collection;
  };

  const deleteCollection = (id: string) => {
    collections.value = collections.value.filter((c) => c.id !== id);
    saveLibrary();
  };

  const addToCollection = (collectionId: string, promptId: string) => {
    const collection = collections.value.find((c) => c.id === collectionId);
    if (collection && !collection.promptIds.includes(promptId)) {
      collection.promptIds.push(promptId);
      saveLibrary();
    }
  };

  const removeFromCollection = (collectionId: string, promptId: string) => {
    const collection = collections.value.find((c) => c.id === collectionId);
    if (collection) {
      collection.promptIds = collection.promptIds.filter(
        (id) => id !== promptId
      );
      saveLibrary();
    }
  };

  const importLibrary = (
    jsonData: string,
    mode: "merge" | "replace" = "merge"
  ) => {
    try {
      const data: LibraryData = JSON.parse(jsonData);

      if (mode === "replace") {
        savedPrompts.value = data.saved || [];
        customPrompts.value = data.custom || [];
        collections.value = data.collections || [];
        promptHistory.value = data.history || [];
      } else {
        const existingSavedIds = new Set(
          savedPrompts.value.map((p) => p.savedId)
        );
        const existingCustomIds = new Set(
          customPrompts.value.map((p) => p.savedId)
        );

        const newSaved = (data.saved || []).filter(
          (p) => !existingSavedIds.has(p.savedId)
        );
        const newCustom = (data.custom || []).filter(
          (p) => !existingCustomIds.has(p.savedId)
        );

        savedPrompts.value.push(...newSaved);
        customPrompts.value.push(...newCustom);
        collections.value.push(...(data.collections || []));
      }

      saveLibrary();
      return true;
    } catch (e) {
      console.error("Import error:", e);
      return false;
    }
  };

  const downloadLibrary = () => {
    const data: LibraryData = {
      saved: savedPrompts.value,
      custom: customPrompts.value,
      collections: collections.value,
      history: promptHistory.value,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-library-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // NOWA FUNKCJA: Konwertuj SavedPrompt na Prompt (dla custom promptów)
  const getPromptById = (promptId: string): Prompt | null => {
    // Sprawdź czy to custom prompt
    if (promptId.startsWith("custom-")) {
      const customPrompt = customPrompts.value.find(
        (p) => p.promptId === promptId || p.savedId === promptId
      );

      if (!customPrompt) return null;

      // Konwertuj SavedPrompt na Prompt
      return {
        id: customPrompt.promptId,
        name: customPrompt.name || { pl: "Bez nazwy", en: "Untitled" },
        description: customPrompt.description || { pl: "", en: "" },
        template:
          typeof customPrompt.result === "string"
            ? { pl: customPrompt.result, en: customPrompt.result }
            : (customPrompt.result as any),
        type: "custom",
        categories: customPrompt.categories || ["custom"],
        tags: customPrompt.tags || [],
        placeholder_keys: customPrompt.placeholder_keys || [],
        placeholderValues: customPrompt.placeholderValues || {}, // Dodane brakujące pole
      } as unknown as Prompt;
    }

    // Dla zapisanych promptów zwróć null (będą ładowane z głównej kolekcji)
    return null;
  };

  return {
    savedPrompts,
    customPrompts,
    collections,
    promptHistory,
    stats,
    loadLibrary,
    savePrompt,
    removePrompt,
    createCustomPrompt,
    updateCustomPrompt,
    removeCustomPrompt,
    addToHistory,
    clearHistory,
    createCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    importLibrary,
    downloadLibrary,
    getPromptById,
  };
};
