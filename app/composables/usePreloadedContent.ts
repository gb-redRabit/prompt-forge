import type { OptionItem, Prompt, TagItem } from "~~/shared/types/content";

// Global reactive state - dostępne wszędzie
const globalOptions = shallowRef<Record<string, OptionItem[]> | null>(null);
const globalPrompts = shallowRef<Prompt[] | null>(null);
const globalTags = shallowRef<Record<string, TagItem> | null>(null);
const globalAvailableTags = shallowRef<string[]>([]);
const globalAvailableCategories = shallowRef<string[]>([]);
const isContentLoaded = ref(false);
const isContentLoading = ref(false);

/** Safely parse `meta` whether it arrives as a plain object or a JSON string. */
function parseMeta(meta: unknown): Record<string, unknown> | null {
  if (!meta) return null;
  if (typeof meta === "string") {
    try {
      return JSON.parse(meta);
    } catch {
      return null;
    }
  }
  if (typeof meta === "object") return meta as Record<string, unknown>;
  return null;
}

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

      // --- Options ---
      const optionsMeta = parseMeta((optionsData as any)?.meta);
      if (optionsMeta) {
        // Options JSON is a record directly (no body wrapper)
        globalOptions.value = optionsMeta as Record<string, OptionItem[]>;
      }

      // --- Prompts ---
      const promptsMeta = parseMeta((promptsData as any)?.meta);
      const rawPrompts: unknown = promptsMeta?.body ?? promptsMeta;
      if (Array.isArray(rawPrompts) && rawPrompts.length > 0) {
        globalPrompts.value = rawPrompts as Prompt[];

        // Ekstrahuj wszystkie unikalne tagi i kategorie
        const tagsSet = new Set<string>();
        const categoriesSet = new Set<string>();

        globalPrompts.value.forEach((prompt) => {
          if (Array.isArray(prompt.tags)) {
            prompt.tags.forEach((tag) => {
              if (tag && typeof tag === "string") tagsSet.add(tag.trim());
            });
          }
          if (Array.isArray(prompt.categories)) {
            prompt.categories.forEach((cat) => {
              if (cat && typeof cat === "string") categoriesSet.add(cat.trim());
            });
          }
        });

        globalAvailableTags.value = Array.from(tagsSet).sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        );
        globalAvailableCategories.value = Array.from(categoriesSet).sort(
          (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
        );
      } else {
        console.warn("⚠️ usePreloadedContent: prompts body not found", {
          promptsData,
          promptsMeta,
          rawPrompts,
        });
      }

      // --- Tags ---
      const tagsMeta = parseMeta((tagsData as any)?.meta);
      const rawTags: unknown = tagsMeta?.body ?? tagsMeta;
      if (rawTags && typeof rawTags === "object" && !Array.isArray(rawTags)) {
        globalTags.value = rawTags as Record<string, TagItem>;
      } else if (Array.isArray(rawTags)) {
        // tagi.json is an array — convert to Record keyed by some identifier if needed
        globalTags.value = rawTags as unknown as Record<string, TagItem>;
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
    nextTick(() => {
      loadContent();
    });
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
