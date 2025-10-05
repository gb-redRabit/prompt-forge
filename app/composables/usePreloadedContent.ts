import type { OptionItem, Prompt, TagItem } from "~/types/content";

// Global reactive state - dostępne wszędzie
const globalOptions = ref<Record<string, OptionItem[]> | null>(null);
const globalPrompts = ref<Prompt[] | null>(null);
const globalTags = ref<Record<string, TagItem> | null>(null);
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
      }
      if (tagsData?.meta?.body) {
        globalTags.value = tagsData.meta.body as Record<string, TagItem>;
      }

      isContentLoaded.value = true;

      //   console.log("✅ Content załadowany:", {
      //     optionsKeys: Object.keys(globalOptions.value || {}),
      //     promptsCount: globalPrompts.value?.length || 0,
      //     tagsCount: Object.keys(globalTags.value || {}).length,
      //   });
    } catch (error) {
      console.error("❌ Błąd ładowania content:", error);
    } finally {
      isContentLoading.value = false;
    }

    return {
      options: globalOptions.value,
      prompts: globalPrompts.value,
      tags: globalTags.value,
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
    isLoaded: readonly(isContentLoaded),
    isLoading: readonly(isContentLoading),
    loadContent,
  };
};
