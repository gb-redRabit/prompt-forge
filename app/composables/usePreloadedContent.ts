import type { OptionItem, Prompt, TagItem } from "~/types/content";

// Global reactive state - dostępne wszędzie
const globalOptions = ref<Record<string, OptionItem[]> | null>(null);
const globalPrompts = ref<Prompt[] | null>(null);
const globalTags = ref<Record<string, TagItem> | null>(null);
const globalAvailableTags = ref<string[]>([]);
const globalAvailableCategories = ref<string[]>([]);
const isContentLoaded = ref(false);
const isContentLoading = ref(false);

export const usePreloadedContent = () => {
  const loadContent = async () => {
    // Zapobiegaj duplikacji ładowania
    if (isContentLoaded.value || isContentLoading.value) {
      return {
        options: globalOptions.value,
        prompts: globalPrompts.value,
        tags: globalTags.value,
        availableTags: globalAvailableTags.value,
        availableCategories: globalAvailableCategories.value,
      };
    }

    isContentLoading.value = true;

    try {
      // Użyj queryCollection dla Nuxt Content
      const [optionsData, promptsData, tagsData] = await Promise.all([
        queryCollection("options")
          .first()
          .catch(() => null),
        queryCollection("prompts")
          .first()
          .catch(() => null),
        queryCollection("tags")
          .first()
          .catch(() => null),
      ]);

      if (optionsData?.meta) {
        globalOptions.value = optionsData.meta as Record<string, OptionItem[]>;
      }

      if (promptsData?.meta?.body) {
        globalPrompts.value = promptsData.meta.body as Prompt[];

        // Ekstrahuj wszystkie unikalne tagi
        const tagsSet = new Set<string>();
        const categoriesSet = new Set<string>();

        globalPrompts.value.forEach((prompt) => {
          // Zbierz tagi
          if (Array.isArray(prompt.tags)) {
            prompt.tags.forEach((tag) => {
              if (tag && typeof tag === "string") {
                tagsSet.add(tag.trim());
              }
            });
          }

          // Zbierz kategorie
          if (Array.isArray(prompt.categories)) {
            prompt.categories.forEach((cat) => {
              if (cat && typeof cat === "string") {
                categoriesSet.add(cat.trim());
              }
            });
          }
        });

        // Konwertuj na posortowane tablice
        globalAvailableTags.value = Array.from(tagsSet).sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        );
        globalAvailableCategories.value = Array.from(categoriesSet).sort(
          (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
        );
      }

      if (tagsData?.meta?.body) {
        globalTags.value = tagsData.meta.body as Record<string, TagItem>;
      }

      isContentLoaded.value = true;
    } catch (error) {
      console.error("❌ Błąd ładowania content:", error);
    } finally {
      isContentLoading.value = false;
    }

    return {
      options: globalOptions.value,
      prompts: globalPrompts.value,
      tags: globalTags.value,
      availableTags: globalAvailableTags.value,
      availableCategories: globalAvailableCategories.value,
    };
  };

  // Auto-load gdy composable jest używany po stronie klienta
  if (process.client && !isContentLoaded.value && !isContentLoading.value) {
    loadContent();
  }

  return {
    options: readonly(globalOptions),
    prompts: readonly(globalPrompts),
    tags: readonly(globalTags),
    availableTags: readonly(globalAvailableTags),
    availableCategories: readonly(globalAvailableCategories),
    isLoaded: readonly(isContentLoaded),
    isLoading: readonly(isContentLoading),
    loadContent,
  };
};
