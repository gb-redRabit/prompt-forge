import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import localforage from 'localforage';
import type { TagItem } from '~~/shared/types/content';

// Konfiguracja IndexedDB dla dużych kolekcji
localforage.config({
  name: 'PromptForge',
  storeName: 'editor_state'
});

export const useEditorStore = defineStore('editor', () => {
  // Navigation
  const currentStep = ref(0);
  const sidebarExpanded = ref(false);

  // Search & Filters
  const categorySearch = ref("");
  const showOnlyFavorites = ref(false);
  const showNsfw = ref(false);

  // Selection
  const selectedTags = ref<Record<string, TagItem[]>>({});
  const favorites = ref<string[]>([]);
  const customTags = ref<TagItem[]>([]);
  const currentCategory = ref("Subject");
  const allTags = ref<TagItem[]>([]);

  // Modals
  const showSaveModal = ref(false);
  const showAddTagModal = ref(false);

  // Copy state
  const copiedPositive = ref(false);
  const copiedNegative = ref(false);

  // Additional negative prompt
  const additionalNegative = ref("");

  // Custom tag form
  const customTag = ref({
    pl: "",
    en: "",
    neg_pl: "",
    neg_en: "",
    nsfw: false,
  });

  // History State
  const historyStack = ref<{
    tags: Record<string, TagItem[]>;
    additionalNegative: string;
    category?: string;
  }[]>([]);
  const historyIndex = ref(-1);

  // Snapshots State
  const snapshots = ref<{
    name: string;
    tags: Record<string, TagItem[]>;
    category: string;
    additionalNegative: string;
    createdAt: number;
    tagsCount: number;
  }[]>([]);

  // Getters
  const isFavorite = (tagEn: string) => favorites.value.includes(tagEn);

  const filteredTags = computed(() => {
    let result = allTags.value.filter(tag => tag.category === currentCategory.value);
    if (!showNsfw.value) result = result.filter(tag => !tag.nsfw);
    if (showOnlyFavorites.value) result = result.filter(tag => isFavorite(tag.en));
    const search = categorySearch.value.toLowerCase().trim();
    if (search) {
      result = result.filter(tag => (tag.pl + tag.en).toLowerCase().includes(search));
    }
    return result.sort((a, b) => {
      const aFav = isFavorite(a.en), bFav = isFavorite(b.en);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.en.localeCompare(b.en);
    });
  });

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < historyStack.value.length - 1);

  // Actions
  /** Toggles a tag in the favorites list by its English text */
  const toggleFavorite = (tagEn: string) => {
    const index = favorites.value.indexOf(tagEn);
    if (index > -1) favorites.value.splice(index, 1);
    else favorites.value.push(tagEn);
  };

  /** Toggles a tag's selected state within its category */
  const toggleTag = (tag: TagItem) => {
    const category = currentCategory.value;
    if (!category) return;
    if (!selectedTags.value[category]) selectedTags.value[category] = [];
    const idx = selectedTags.value[category].findIndex(s => s.en === tag.en && s.pl === tag.pl);
    if (idx > -1) {
      selectedTags.value[category].splice(idx, 1);
      if (selectedTags.value[category].length === 0) delete selectedTags.value[category];
    } else {
      selectedTags.value[category].push({ ...tag, weight: 1.0, emphasis: 0 });
    }
  };

  /** Removes a tag at a specific index from a category */
  const removeTag = (category: string, index: number) => {
    if (!selectedTags.value[category]) return;
    selectedTags.value[category].splice(index, 1);
    if (selectedTags.value[category].length === 0) delete selectedTags.value[category];
  };

  /** Partially updates a tag's properties (weight, emphasis) */
  const updateTag = (category: string, index: number, updated: Partial<TagItem>) => {
    if (!selectedTags.value[category]?.[index]) return;
    selectedTags.value[category][index] = { ...selectedTags.value[category][index], ...updated };
  };

  const clearCategory = (category: string) => { delete selectedTags.value[category]; };
  const clearAll = () => { selectedTags.value = {}; additionalNegative.value = ""; };

  /**
   * Generates the final positive and negative prompt strings from the selected tags.
   * Tags are ordered by the provided category order array.
   * Applies emphasis brackets and weight notation where set.
   */
  const getGeneratedPrompt = (locale: string, categories: string[]) => {
    if (Object.keys(selectedTags.value).length === 0) return { positive: "", negative: "" };
    const positiveParts: string[] = [], negativeParts: string[] = [];
    categories.forEach(category => {
      const tagObjs = selectedTags.value[category];
      if (tagObjs && tagObjs.length > 0) {
        positiveParts.push(tagObjs.map(t => {
          let text = locale === 'pl' ? (t.pl || t.en) : (t.en || t.pl);
          if (t.emphasis) text = "(".repeat(t.emphasis) + text + ")".repeat(t.emphasis);
          if (t.weight && t.weight !== 1.0) text = `(${text}:${t.weight.toFixed(1)})`;
          return text;
        }).join(", "));
        const negs = tagObjs.map(t => {
          let text = locale === 'pl' ? t.neg_pl : t.neg_en;
          if (!text) return "";
          if (t.emphasis) text = "(".repeat(t.emphasis) + text + ")".repeat(t.emphasis);
          if (t.weight && t.weight !== 1.0) text = `(${text}:${t.weight.toFixed(1)})`;
          return text;
        }).filter(Boolean);
        if (negs.length > 0) negativeParts.push(negs.join(", "));
      }
    });
    let negative = negativeParts.join(", ");
    if (additionalNegative.value) negative = negative ? negative + ", " + additionalNegative.value : additionalNegative.value;
    return { positive: positiveParts.join(", "), negative };
  };

  /**
   * Pushes a snapshot of the current state onto the history stack.
   * Automatically truncates future states on a new action (standard undo tree behaviour).
   * Capped at 50 entries to limit memory usage.
   */
  function pushToHistory() {
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
    historyStack.value.push({
      tags: JSON.parse(JSON.stringify(selectedTags.value)),
      additionalNegative: additionalNegative.value,
      category: currentCategory.value
    });
    historyIndex.value = historyStack.value.length - 1;
    if (historyStack.value.length > 50) { historyStack.value.shift(); historyIndex.value--; }
  }

  function undo() {
    if (!canUndo.value) return;
    historyIndex.value--;
    const s = historyStack.value[historyIndex.value];
    if (s) { selectedTags.value = JSON.parse(JSON.stringify(s.tags)); additionalNegative.value = s.additionalNegative; if (s.category) currentCategory.value = s.category; }
  }

  function redo() {
    if (!canRedo.value) return;
    historyIndex.value++;
    const s = historyStack.value[historyIndex.value];
    if (s) { selectedTags.value = JSON.parse(JSON.stringify(s.tags)); additionalNegative.value = s.additionalNegative; if (s.category) currentCategory.value = s.category; }
  }

  function saveSnapshot(name: string, tagsCount: number) {
    const snapshot = { name, tags: JSON.parse(JSON.stringify(selectedTags.value)), category: currentCategory.value, additionalNegative: additionalNegative.value, createdAt: Date.now(), tagsCount };
    snapshots.value.unshift(snapshot);
  }

  function restoreSnapshot(snapshot: any) {
    selectedTags.value = JSON.parse(JSON.stringify(snapshot.tags));
    additionalNegative.value = snapshot.additionalNegative || "";
    if (snapshot.category) currentCategory.value = snapshot.category;
    pushToHistory();
  }

  function deleteSnapshot(index: number) {
    snapshots.value.splice(index, 1);
  }

  function loadFromSharedData(data: any, allTagsFlat: TagItem[]) {
    if (!data.tags) return;
    const validated: Record<string, TagItem[]> = {};
    Object.entries(data.tags).forEach(([cat, objs]) => {
      const arr: TagItem[] = [];
      (objs as TagItem[]).forEach(obj => {
        const found = allTagsFlat.find(t => t.category === obj.category && t.pl === obj.pl && t.en === obj.en);
        if (found) arr.push({ ...found, weight: obj.weight ?? 1.0, emphasis: obj.emphasis ?? 0 });
      });
      if (arr.length > 0) validated[cat] = arr;
    });
    selectedTags.value = validated;
    additionalNegative.value = data.additionalNegative || "";
  }

  function saveProgress() {
    // Pinia Persist automatycznie zapisuje zmiany w selectedTags i additionalNegative
  }

  function loadProgress() {
    // Pinia Persist automatycznie przywraca stan z IndexedDB
  }

  function loadSnapshots() {
    // Pinia Persist zajmuje się automatycznym ładowaniem z IndexedDB
  }

  return {
    currentStep, sidebarExpanded, categorySearch, showOnlyFavorites, showNsfw,
    selectedTags, favorites, customTags, currentCategory, allTags,
    showSaveModal, showAddTagModal, copiedPositive, copiedNegative, additionalNegative, customTag,
    isFavorite, filteredTags, getGeneratedPrompt, canUndo, canRedo,
    toggleFavorite, toggleTag, removeTag, updateTag, clearCategory, clearAll,
    loadFromSharedData, saveProgress, loadProgress,
    historyStack, historyIndex, snapshots, pushToHistory, undo, redo,
    saveSnapshot, restoreSnapshot, deleteSnapshot, loadSnapshots
  };
}, {
  persist: {
    storage: {
      getItem: (key) => localforage.getItem(key) as any,
      setItem: (key, value) => localforage.setItem(key, value) as any,
    },
    pick: [
      'favorites', 
      'customTags', 
      'currentCategory', 
      'showOnlyFavorites', 
      'showNsfw', 
      'sidebarExpanded', 
      'selectedTags', 
      'additionalNegative', 
      'snapshots', 
      'historyStack'
    ]
  }
});
