import type { Prompt } from "~/types/content";

export const useTemplates = () => {
  const { prompts } = usePreloadedContent();
  const { locale } = useI18n();

  const ITEMS_PER_PAGE = 12;
  const currentPage = ref(1);
  const searchQuery = ref("");
  const selectedCategories = ref<string[]>([]);
  const selectedTags = ref<string[]>([]);
  const selectedType = ref<string | null>(null);
  const sortBy = ref<"id" | "name">("id");
  const sortOrder = ref<"asc" | "desc">("asc");

  const translationCache = new Map<string, string>();

  const getTranslated = (
    data: { en: string; pl: string } | undefined,
    fallback: string = ""
  ): string => {
    if (!data) return fallback;

    const cacheKey = `${locale.value}-${data.en}-${data.pl}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    const result = locale.value === "pl" ? data.pl : data.en;
    translationCache.set(cacheKey, result);
    return result;
  };

  // Filtruj i sortuj
  const filteredPrompts = computed(() => {
    // Kopiujemy do mutowalnej tablicy
    let result = [...(prompts.value || [])];

    // Filtruj po wyszukiwaniu - TYLKO NAME
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((p) => {
        return getTranslated(p.name).toLowerCase().indexOf(query) !== -1;
      });
    }

    // Filtruj po typie
    if (selectedType.value) {
      result = result.filter((p) => p.type === selectedType.value);
    }

    // Filtruj po kategoriach
    if (selectedCategories.value.length > 0) {
      const catSet = new Set(selectedCategories.value);
      result = result.filter((p) =>
        p.categories?.some((cat) => catSet.has(cat))
      );
    }

    // Filtruj po tagach
    if (selectedTags.value.length > 0) {
      const tagSet = new Set(selectedTags.value);
      result = result.filter((p) => p.tags?.some((tag) => tagSet.has(tag)));
    }

    // Sortuj
    // Convert readonly arrays to mutable arrays for type compatibility
    const mutableResult = result.map((p) => ({
      ...p,
      placeholder_keys: p.placeholder_keys
        ? [...p.placeholder_keys]
        : undefined,
      categories: p.categories ? [...p.categories] : undefined,
      tags: p.tags ? [...p.tags] : undefined,
    }));
    return sortPrompts(mutableResult);
  });

  const sortPrompts = (items: Prompt[]) => {
    return [...items].sort((a, b) => {
      let compareA: any;
      let compareB: any;

      if (sortBy.value === "id") {
        compareA = a.id || 0;
        compareB = b.id || 0;
      } else if (sortBy.value === "name") {
        compareA = getTranslated(a.name).toLowerCase();
        compareB = getTranslated(b.name).toLowerCase();
      }

      if (sortOrder.value === "asc") {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });
  };

  const displayedPrompts = computed(() => {
    return filteredPrompts.value.slice(0, currentPage.value * ITEMS_PER_PAGE);
  });

  const hasMore = computed(() => {
    return displayedPrompts.value.length < filteredPrompts.value.length;
  });

  const loadMore = () => {
    if (hasMore.value) {
      currentPage.value++;
    }
  };

  // Dostępne typy z licznikami
  const availableTypes = computed(() => {
    const typeCounts = new Map<string, number>();

    let basePrompts = [...(prompts.value || [])];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      basePrompts = basePrompts.filter((p) => {
        return (
          getTranslated(p.name).toLowerCase().indexOf(query) !== -1 ||
          getTranslated(p.description).toLowerCase().indexOf(query) !== -1 ||
          (p.type && p.type.toLowerCase().indexOf(query) !== -1) ||
          (p.tags &&
            p.tags.some((tag) => tag.toLowerCase().indexOf(query) !== -1)) ||
          (p.categories &&
            p.categories.some((cat) => cat.toLowerCase().indexOf(query) !== -1))
        );
      });
    }

    if (selectedCategories.value.length > 0) {
      const catSet = new Set(selectedCategories.value);
      basePrompts = basePrompts.filter((p) =>
        p.categories?.some((cat) => catSet.has(cat))
      );
    }

    if (selectedTags.value.length > 0) {
      const tagSet = new Set(selectedTags.value);
      basePrompts = basePrompts.filter((p) =>
        p.tags?.some((tag) => tagSet.has(tag))
      );
    }

    basePrompts.forEach((p) => {
      if (p.type) {
        typeCounts.set(p.type, (typeCounts.get(p.type) || 0) + 1);
      }
    });

    return Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => a.type.localeCompare(b.type));
  });

  // Dostępne kategorie z licznikami
  const availableCategories = computed(() => {
    const categoryCounts = new Map<string, number>();

    let basePrompts = [...(prompts.value || [])];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      basePrompts = basePrompts.filter((p) => {
        return (
          getTranslated(p.name).toLowerCase().indexOf(query) !== -1 ||
          getTranslated(p.description).toLowerCase().indexOf(query) !== -1 ||
          (p.type && p.type.toLowerCase().indexOf(query) !== -1) ||
          (p.tags &&
            p.tags.some((tag) => tag.toLowerCase().indexOf(query) !== -1)) ||
          (p.categories &&
            p.categories.some((cat) => cat.toLowerCase().indexOf(query) !== -1))
        );
      });
    }

    if (selectedType.value) {
      basePrompts = basePrompts.filter((p) => p.type === selectedType.value);
    }

    if (selectedTags.value.length > 0) {
      const tagSet = new Set(selectedTags.value);
      basePrompts = basePrompts.filter((p) =>
        p.tags?.some((tag) => tagSet.has(tag))
      );
    }

    basePrompts.forEach((p) => {
      p.categories?.forEach((cat) => {
        if (!selectedCategories.value.includes(cat)) {
          categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
        }
      });
    });

    selectedCategories.value.forEach((selectedCat) => {
      const count = filteredPrompts.value.filter((p) =>
        p.categories?.includes(selectedCat)
      ).length;

      if (count > 0) {
        categoryCounts.set(selectedCat, count);
      }
    });

    const selected = selectedCategories.value
      .filter((cat) => categoryCounts.has(cat))
      .map((cat) => ({ category: cat, count: categoryCounts.get(cat)! }));

    const unselected = Array.from(categoryCounts.entries())
      .filter(([cat]) => !selectedCategories.value.includes(cat))
      .map(([category, count]) => ({ category, count }));

    return [...selected, ...unselected];
  });

  // Dostępne tagi z licznikami
  const availableTags = computed(() => {
    const tagCounts = new Map<string, number>();

    let basePrompts = [...(prompts.value || [])];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      basePrompts = basePrompts.filter((p) => {
        return (
          getTranslated(p.name).toLowerCase().indexOf(query) !== -1 ||
          getTranslated(p.description).toLowerCase().indexOf(query) !== -1 ||
          (p.type && p.type.toLowerCase().indexOf(query) !== -1) ||
          (p.tags &&
            p.tags.some((tag) => tag.toLowerCase().indexOf(query) !== -1)) ||
          (p.categories &&
            p.categories.some((cat) => cat.toLowerCase().indexOf(query) !== -1))
        );
      });
    }

    if (selectedType.value) {
      basePrompts = basePrompts.filter((p) => p.type === selectedType.value);
    }

    if (selectedCategories.value.length > 0) {
      const catSet = new Set(selectedCategories.value);
      basePrompts = basePrompts.filter((p) =>
        p.categories?.some((cat) => catSet.has(cat))
      );
    }

    basePrompts.forEach((p) => {
      p.tags?.forEach((tag) => {
        if (!selectedTags.value.includes(tag)) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      });
    });

    selectedTags.value.forEach((selectedTag) => {
      const count = filteredPrompts.value.filter((p) =>
        p.tags?.includes(selectedTag)
      ).length;

      if (count > 0) {
        tagCounts.set(selectedTag, count);
      }
    });

    const selected = selectedTags.value
      .filter((tag) => tagCounts.has(tag))
      .map((tag) => ({ tag, count: tagCounts.get(tag)! }));

    const unselected = Array.from(tagCounts.entries())
      .filter(([tag]) => !selectedTags.value.includes(tag))
      .map(([tag, count]) => ({ tag, count }));

    return [...selected, ...unselected];
  });

  let resetTimeout: NodeJS.Timeout;
  watch(
    [
      searchQuery,
      selectedCategories,
      selectedTags,
      selectedType,
      sortBy,
      sortOrder,
    ],
    () => {
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        currentPage.value = 1;
        if (translationCache.size > 1000) {
          translationCache.clear();
        }
      }, 150);
    }
  );

  watch(locale, () => {
    translationCache.clear();
  });

  return {
    displayedPrompts,
    filteredPrompts,
    searchQuery,
    selectedCategories,
    selectedTags,
    selectedType,
    sortBy,
    sortOrder,
    availableCategories,
    availableTags,
    availableTypes,
    hasMore,
    loadMore,
    totalCount: computed(() => filteredPrompts.value.length),
    getTranslated,
  };
};
