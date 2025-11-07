import type { Ref } from "vue";
import type { TagItem } from "~/types/content";

export interface EditorState {
  // Navigation
  currentStep: Ref<number>;
  sidebarExpanded: Ref<boolean>;

  // Search & Filters
  categorySearch: Ref<string>;
  showOnlyFavorites: Ref<boolean>;
  showNsfw: Ref<boolean>;

  // Selection
  selectedTags: Ref<Record<string, TagItem[]>>;
  favorites: Ref<Set<string>>;
  customTags: Ref<TagItem[]>;

  // Modals
  showSaveModal: Ref<boolean>;
  showAddTagModal: Ref<boolean>;

  // Copy state
  copiedPositive: Ref<boolean>;
  copiedNegative: Ref<boolean>;

  // Additional negative prompt
  additionalNegative: Ref<string>;

  // Custom tag form
  customTag: Ref<{
    pl: string;
    en: string;
    neg_pl: string;
    neg_en: string;
    nsfw: boolean;
  }>;
}

// Shared state instance
let editorStateInstance: EditorState | null = null;

/**
 * Editor state management composable
 * Provides centralized state for the prompt editor
 */
export const useEditorState = () => {
  // Return existing instance if available (singleton pattern)
  if (editorStateInstance) {
    return editorStateInstance;
  }

  // Initialize state
  const currentStep = ref(0);
  const sidebarExpanded = ref(false);
  const categorySearch = ref("");
  const showOnlyFavorites = ref(false);
  const showNsfw = ref(false);
  const selectedTags = ref<Record<string, TagItem[]>>({});
  const favorites = ref<Set<string>>(new Set());
  const customTags = ref<TagItem[]>([]);
  const showSaveModal = ref(false);
  const showAddTagModal = ref(false);
  const copiedPositive = ref(false);
  const copiedNegative = ref(false);
  const additionalNegative = ref("");

  const customTag = ref({
    pl: "",
    en: "",
    neg_pl: "",
    neg_en: "",
    nsfw: false,
  });

  // Load state from localStorage
  onMounted(() => {
    const savedFavorites = localStorage.getItem("tag_favorites");
    if (savedFavorites) {
      favorites.value = new Set(JSON.parse(savedFavorites));
    }

    const savedCustomTags = localStorage.getItem("custom_tags");
    if (savedCustomTags) {
      customTags.value = JSON.parse(savedCustomTags);
    }
  });

  // Watch and save favorites to localStorage
  watch(
    favorites,
    (newFavorites) => {
      localStorage.setItem(
        "tag_favorites",
        JSON.stringify(Array.from(newFavorites))
      );
    },
    { deep: true }
  );

  // Watch and save custom tags to localStorage
  watch(
    customTags,
    (newCustomTags) => {
      localStorage.setItem("custom_tags", JSON.stringify(newCustomTags));
    },
    { deep: true }
  );

  // Create state object
  editorStateInstance = {
    currentStep,
    sidebarExpanded,
    categorySearch,
    showOnlyFavorites,
    showNsfw,
    selectedTags,
    favorites,
    customTags,
    showSaveModal,
    showAddTagModal,
    copiedPositive,
    copiedNegative,
    additionalNegative,
    customTag,
  };

  return editorStateInstance;
};

/**
 * Reset editor state (useful for testing or cleanup)
 */
export const resetEditorState = () => {
  editorStateInstance = null;
};
