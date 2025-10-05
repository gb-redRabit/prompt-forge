import type { PromptTemplate } from "~/types/content";

export interface SavedPrompt extends PromptTemplate {
  savedId: string;
  savedAt: string;
  isCustom?: boolean;
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
    if (import.meta.client) {
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
    if (import.meta.client) {
      const data: LibraryData = {
        saved: savedPrompts.value,
        custom: customPrompts.value,
        collections: collections.value,
        history: promptHistory.value,
      };
      localStorage.setItem("prompt-library", JSON.stringify(data));
    }
  };

  // Zapisane prompty (z szablonów)
  const savePrompt = (template: PromptTemplate) => {
    const savedPrompt: SavedPrompt = {
      ...template,
      savedId: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
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

  // Własne prompty
  const createCustomPrompt = (data: {
    name: { pl: string; en: string };
    description: { pl: string; en: string };
    template: { pl: string; en: string };
  }): SavedPrompt => {
    const customPrompt: SavedPrompt = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedId: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      description: data.description,
      template: data.template,
      category: "custom",
      tags: [],
      savedAt: new Date().toISOString(),
      isCustom: true,
    };
    customPrompts.value.push(customPrompt);
    saveLibrary();
    return customPrompt;
  };

  const updateCustomPrompt = (
    savedId: string,
    data: Partial<Pick<SavedPrompt, "name" | "description" | "template">>
  ) => {
    const index = customPrompts.value.findIndex((p) => p.savedId === savedId);
    if (index !== -1) {
      customPrompts.value[index] = {
        ...customPrompts.value[index],
        ...data,
      };
      saveLibrary();
    }
  };

  const removeCustomPrompt = (savedId: string) => {
    customPrompts.value = customPrompts.value.filter(
      (p) => p.savedId !== savedId
    );
    saveLibrary();
  };

  // Historia - NAPRAWIONA FUNKCJA
  const addToHistory = (template: PromptTemplate) => {
    // Usuń duplikaty (ten sam ID promptu)
    promptHistory.value = promptHistory.value.filter(
      (p) => p.id !== template.id
    );

    // Dodaj na początek
    const historyItem: SavedPrompt = {
      ...template,
      savedId: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
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

  // Kolekcje
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

  // Import/Export
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
        // Merge - dodaj unikalne
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
  };
};
