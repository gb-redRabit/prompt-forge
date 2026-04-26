<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar Component -->
      <EditorSidebar
        class="z-20"
        v-model:expanded="sidebarExpanded"
        :current-category="currentCategory || ''"
        :selected-tags="selectedTags"
        :category-groups="categoryGroupsUI"
        @select-category="handleCategorySelect"
      />

      <!-- Main Content -->
      <main
        class="flex-1 overflow-hidden flex flex-col h-screen w-full min-w-0 bg-slate-50/30 dark:bg-slate-900/10 relative z-10"
      >
        <div class="flex-1 overflow-hidden h-full">
          <div class="w-full max-w-[1700px] h-full p-2 sm:p-4 lg:p-6 lg:py-8 mx-auto flex flex-col lg:flex-row gap-0 lg:gap-6">
            
            <!-- Left Side / Center: Tags Selection -->
            <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <!-- Workspace Header -->
            <div class="flex items-center justify-between mb-2 px-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ getCategoryNameByLabel(currentCategory || '') }}
              </h1>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 px-3 py-1.5 rounded-full">
                  {{ tagsForCurrentCategory.length }} opcji
                </span>
              </div>
            </div>

            <div class="flex-1 flex flex-col w-full h-full min-h-0 mt-3 pt-1">
              <!-- Tags Selection -->
              <div class="flex flex-col space-y-4 overflow-hidden h-full w-full pb-24 lg:pb-0">
                <!-- Search & Filters Component -->
                <EditorSearchFilters
                  v-model:search="categorySearch"
                  v-model:show-favorites="showOnlyFavorites"
                  :results-count="filteredTagsForCategory.length"
                  :selected-count="selectedTagsForCurrentCategory.length"
                  @randomize="randomizeCategory"
                  @clear="clearCurrentCategory"
                />

                <EditorTagGrid
                  :tags="filteredTagsForCategory"
                  :selected-tags="selectedTags"
                  :is-favorite="isFavorite"
                  @toggle="toggleTag"
                  @toggle-favorite="toggleFavorite"
                />

              </div>
            </div>
          </div>
          
          <!-- Right Side: Desktop Sidebar -->
          <div class="hidden lg:flex w-[400px] xl:w-[460px] flex-col h-[calc(100vh-2rem)] flex-shrink-0 animate-fade-in sticky top-4">
            <EditorSelectedSummary
              :selected-tags="selectedTags"
              :positive-prompt="generatedPrompt.positive"
              :negative-prompt="generatedPrompt.negative"
              :show-nsfw="showNsfw"
              :copied-positive="copiedPositive"
              :copied-negative="copiedNegative"
              @update:show-nsfw="showNsfw = $event"
              @add-custom-tag="showAddTagModal = true"
              @show-negative-templates="showNegativeTemplatesModal = true"
              @clear-category="clearCategoryFromSummary"
              @remove-tag="removeTagFromSummary"
              @update-tag="updateTagFromSummary"
              @copy-prompt="copyPrompt"
              @save-prompt="savePrompt"
              @use-prompt="usePrompt"
              @clear-all="clearAll"
            />
          </div>

        </div>
      </div>

      <!-- Mobile Summary Button -->
      <div class="lg:hidden">
        <EditorMobileSummary
          :selected-tags="selectedTags"
          :positive-prompt="generatedPrompt.positive"
          :negative-prompt="generatedPrompt.negative"
          :show-nsfw="showNsfw"
          :copied-positive="copiedPositive"
          :copied-negative="copiedNegative"
          @update:show-nsfw="showNsfw = $event"
          @add-custom-tag="showAddTagModal = true"
          @show-negative-templates="showNegativeTemplatesModal = true"
          @clear-category="clearCategoryFromSummary"
          @remove-tag="removeTagFromSummary"
          @update-tag="updateTagFromSummary"
          @copy-prompt="copyPrompt"
          @save-prompt="savePrompt"
          @use-prompt="usePrompt"
          @clear-all="clearAll"
        />
      </div>
    </main>
    </div>

    <!-- Save Modal -->
    <SavePromptModal
      v-model:open="showSaveModal"
      :positive-prompt="generatedPrompt.positive"
      :negative-prompt="generatedPrompt.negative"
      :tags="allSelectedTagsList"
      @save="handleSavePrompt"
    />

    <!-- Add Custom Tag Modal -->
    <EditorAddTagModal
      v-model:open="showAddTagModal"
      @submit="handleCustomTagSubmit"
    />

    <!-- Negative Templates Modal -->
    <EditorNegativeTemplatesModal
      v-model:open="showNegativeTemplatesModal"
      v-model:active-templates="activeNegativeTemplates"
      :groups="negativeTemplateGroups"
    />

    <!-- History Modal -->
    <UModal
      v-model:open="showHistoryModal"
      :title="$t('prompt_creator.history_title')"
      :ui="{
        wrapper: 'z-[60]',
        overlay: 'z-[60]',
        content:
          'w-full h-full sm:h-auto sm:max-w-2xl m-0 sm:m-4 rounded-none sm:rounded-xl z-[60]',
      }"
    >
      <template #description>{{
        $t("prompt_creator.history_description")
      }}</template>
      <template #body>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(snapshot, index) in snapshots"
            :key="index"
            class="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            @click="restoreSnapshot(snapshot)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">{{ snapshot.name }}</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  {{ new Date(snapshot.createdAt).toLocaleString() }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ snapshot.tagsCount }} tagów, {{ getCategoryNameByLabel(snapshot.category || 'Subject') }}
                </p>
              </div>
              <GlassButton
                color="error"
                variant="ghost"
                size="xs"
                @click.stop="deleteSnapshot(index)"
                icon="i-heroicons-trash"
              />
            </div>
          </div>
          <div v-if="snapshots.length === 0" class="text-center py-8">
            <UIcon
              name="i-heroicons-clock"
              class="w-12 h-12 mx-auto mb-2 text-slate-300"
            />
            <p class="text-slate-500">{{ $t("prompt_creator.no_history") }}</p>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Modal alertu -->
    <UModal
      v-model:open="showAlertModal"
      :title="$t('common.error')"
      :ui="{
        wrapper: 'z-[60]',
        overlay: 'z-[60]',
        content:
          'w-full h-full sm:h-auto sm:max-w-md m-0 sm:m-4 rounded-none sm:rounded-xl z-[60]',
      }"
    >
      <template #description>{{
        $t("pages.shared.error_description")
      }}</template>
      <template #body>
        <p>{{ alertMessage }}</p>
      </template>
      <template #footer>
        <GlassButton @click="showAlertModal = false">
          <span v-once>{{ $t("common.save") }}</span>
        </GlassButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEditorStore } from '~/stores/editor';
import { useI18n, useRouter, useHead, definePageMeta } from '#imports';
import { useToast } from '#ui/composables/useToast';
import { getTagText, getTagId, getNegativeTagText } from '~/utils/tags';
import type { TagItem } from '~~/shared/types/content';

import EditorSidebar from "~/components/editor/EditorSidebar.vue";
import EditorSearchFilters from "~/components/editor/EditorSearchFilters.vue";
import EditorTagGrid from "~/components/editor/EditorTagGrid.vue";
import EditorSelectedSummary from "~/components/editor/EditorSelectedSummary.vue";
import EditorMobileSummary from "~/components/editor/EditorMobileSummary.vue";
import SavePromptModal from "~/components/editor/SavePromptModal.vue";
import EditorAddTagModal from "~/components/editor/EditorAddTagModal.vue";
import EditorNegativeTemplatesModal from "~/components/editor/EditorNegativeTemplatesModal.vue";
import GlassButton from "~/components/ui/GlassButton.vue";

import { 
  CATEGORY_KEY_MAP, 
  LABEL_TO_KEY_MAP, 
  CATEGORY_ORDER, 
  CATEGORY_ICONS, 
  CATEGORY_GROUPS 
} from "~~/shared/constants/categories";

// Extend Window type for custom properties
declare global {
  interface Window {
    mouseX?: number;
    mouseY?: number;
  }
}

// Initialize editor store
const editorStore = useEditorStore();

// TagObject was just a local name for TagItem
type TagObject = TagItem;
const toast = useToast();
const { 
  categorySearch, 
  selectedTags, 
  showSaveModal, 
  showAddTagModal, 
  copiedPositive, 
  copiedNegative, 
  sidebarExpanded, 
  showOnlyFavorites, 
  favorites, 
  customTags, 
  showNsfw, 
  additionalNegative,
  currentCategory,
  canUndo,
  canRedo,
  snapshots
} = storeToRefs(editorStore);

const showNegativeTemplatesModal = ref(false);
const showAlertModal = ref(false);
const alertMessage = ref("");
const activeNegativeTemplates = ref<string[]>([]);
const showHistoryModal = ref(false);

// Synchronizuj tekst negative prompt z wybranymi szablonami
watch(activeNegativeTemplates, (newTemplates, oldTemplates) => {
  const currentParts = new Set((additionalNegative.value || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean));

  // Znajdź co zostało dodane
  const added = newTemplates.filter(t => !oldTemplates.includes(t));
  // Znajdź co zostało usunięte
  const removed = oldTemplates.filter(t => !newTemplates.includes(t));

  added.forEach(templateText => {
    templateText.split(",").map((s: string) => s.trim()).filter(Boolean).forEach(part => {
      currentParts.add(part);
    });
  });

  removed.forEach(templateText => {
    templateText.split(",").map((s: string) => s.trim()).filter(Boolean).forEach(part => {
      currentParts.delete(part);
    });
  });

  additionalNegative.value = Array.from(currentParts).join(", ");
}, { deep: true });

definePageMeta({
  layout: "dashboard",
});

const { t, locale } = useI18n();
const router = useRouter();

// Preloaded content
const { tags, isLoaded: isContentLoaded } = usePreloadedContent();
let autoSaveInterval: any = null;

// Handler for category selection from sidebar
const handleCategorySelect = (categoryLabel: string) => {
  if (categories.includes(categoryLabel)) {
    currentCategory.value = categoryLabel;
    
    // Opcjonalnie zresetuj scroll/content
    const scrollContainer = document.querySelector('.custom-scrollbar');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }
};

// HELPERY UI: tłumaczenie nazwy kategorii po etykiecie
const getI18nKeyFromLabel = (label: string) => LABEL_TO_KEY_MAP[label] || null;
const getCategoryNameByLabel = (label: string) => {
  const key = getI18nKeyFromLabel(label);
  return key ? t(`prompt_creator.categories.${key}`) : label;
};

const getCategoryIcon = (category: string) => {
  const key = LABEL_TO_KEY_MAP[category];
  return (key && CATEGORY_ICONS[key]) || "i-heroicons-tag";
};

// Wszystkie kategorie (etykiety angielskie z content/tags)
const categories = CATEGORY_ORDER
  .map((key) => CATEGORY_KEY_MAP[key])
  .filter((label): label is string => !!label);

// UI: grupy zamienione na etykiety
const categoryGroupsUI = computed(() =>
  CATEGORY_GROUPS.map((g) => ({
    key: g.key,
    title: t(`prompt_creator.groups.${g.key}`),
    items: g.items
      .map((k) => CATEGORY_KEY_MAP[k])
      .filter((label): label is string => !!label),
  }))
);



// Computed properties used in template
const tagsForCurrentCategory = computed(() => {
  const category = currentCategory.value;
  if (!category) return [];
  return editorStore.allTags.filter(t => t.category === category);
});

const filteredTagsForCategory = computed(() => editorStore.filteredTags);

const selectedTagsForCurrentCategory = computed(() => {
  const category = currentCategory.value;
  if (!category) return [];
  return selectedTags.value[category] || [];
});

const totalSelectedTags = computed<number>(() => {
  return Object.values(selectedTags.value).reduce(
    (sum: number, tagObjs: TagItem[]) => sum + tagObjs.length,
    0
  );
});

const generatedPrompt = computed(() => 
  editorStore.getGeneratedPrompt(locale.value, categories)
);

const allSelectedTagsList = computed<string[]>(() => {
  const allTags: string[] = [];
  Object.values(selectedTags.value).forEach((tagObjs: TagItem[]) => {
    tagObjs.forEach((tagObj: TagItem) => {
      allTags.push(getTagText(tagObj, locale.value));
    });
  });
  return allTags;
});

// Negative templates grouped
const negativeTemplateGroups = [
  {
    label: "Common Issues",
    templates: [
      { label: "Blurry", text: "blurry, low quality, deformed, ugly" },
      { label: "Anatomy", text: "extra limbs, malformed hands, bad anatomy" },
      { label: "Artifacts", text: "artifacts, watermark, signature, text" },
    ],
  },
  {
    label: "Art Style",
    templates: [
      { label: "Realistic", text: "cartoon, anime, illustration, painting" },
      { label: "Anime", text: "realistic, photograph, 3d render" },
      { label: "Painting", text: "photograph, realistic, 3d render" },
    ],
  },
  {
    label: "Composition",
    templates: [
      { label: "Centered", text: "asymmetric, off-center, cropped" },
      { label: "Multiple", text: "solo, single subject" },
      { label: "Background", text: "busy background, cluttered" },
    ],
  },
];

// Synchronize all tags (from content + custom tags) into the store
watch([tags, customTags], ([newTags, newCustomTags]) => {
  if (!newTags) return;

  const allTags: TagItem[] = [];
  
  const extractTags = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (item && typeof item === "object") {
          if (item.category && (item.pl || item.en)) {
            allTags.push(item as TagItem);
          } else {
            extractTags(item);
          }
        }
      });
    } else if (obj && typeof obj === "object") {
      Object.values(obj).forEach((value) => extractTags(value));
    }
  };

  extractTags(newTags);
  if (newCustomTags) {
    newCustomTags.forEach((tag: TagItem) => {
      allTags.push(tag);
    });
  }

  editorStore.allTags = allTags;
}, { immediate: true });

// Actions
const isTagSelected = (tagObj: TagObject) => {
  const category = currentCategory.value;
  if (!category || !selectedTags.value[category]) return false;
  return selectedTags.value[category].some(
    (selected: TagObject) => getTagId(selected) === getTagId(tagObj)
  );
};

const isFavorite = (tagObj: TagObject): boolean => {
  return editorStore.isFavorite(getTagText(tagObj, locale.value));
};

const toggleFavorite = (tagObj: TagObject) => {
  editorStore.toggleFavorite(getTagText(tagObj, locale.value));
};

const toggleTag = (tagObj: TagObject) => {
  editorStore.toggleTag(tagObj);
  pushToHistory();
};

const removeTagFromSummary = (category: string, tagIndex: number) => {
  editorStore.removeTag(category, tagIndex);
  pushToHistory();
};

const updateTagFromSummary = (
  category: string,
  tagIndex: number,
  updatedTag: TagObject
) => {
  editorStore.updateTag(category, tagIndex, updatedTag);
  pushToHistory();
};

const clearCategoryFromSummary = (category: string) => {
  editorStore.clearCategory(category);
  pushToHistory();
};

const handleCustomTagSubmit = (data: any) => {
  if (!currentCategory.value) return;

  const newTag: TagObject = {
    ...data,
    category: currentCategory.value,
    custom: true,
  };

  customTags.value.push(newTag);
  toast.add({ title: t("prompt_creator.tag_added"), color: "success" });
};


const clearCurrentCategory = () => {
  const category = currentCategory.value;
  if (category && selectedTags.value[category]) {
    delete selectedTags.value[category];
  }
  pushToHistory();
};

const clearAll = () => {
  if (confirm(t("prompt_creator.confirm_clear_all"))) {
    selectedTags.value = {};
    additionalNegative.value = "";
    currentCategory.value = "Subject";
  }
  pushToHistory();
};

const copyPrompt = async (type: "positive" | "negative") => {
  const text =
    type === "positive"
      ? generatedPrompt.value.positive
      : generatedPrompt.value.negative;

  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    if (type === "positive") {
      copiedPositive.value = true;
      setTimeout(() => {
        copiedPositive.value = false;
      }, 2000);
    } else {
      copiedNegative.value = true;
      setTimeout(() => {
        copiedNegative.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};

const savePrompt = () => {
  showSaveModal.value = true;
};

const handleSavePrompt = (data: { name: string; description: string }) => {
  const customPrompt = {
    id: `custom_${Date.now()}`,
    name: data.name,
    description: data.description,
    positivePrompt: generatedPrompt.value.positive,
    negativePrompt: generatedPrompt.value.negative,
    tags: allSelectedTagsList.value,
    link: generateSharedUrl({
      prompt: generatedPrompt.value,
      tags: selectedTags.value,
      step: 0,
      additionalNegative: additionalNegative.value,
    }),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const saved = localStorage.getItem("custom_prompts");
  const prompts = saved ? JSON.parse(saved) : [];
  prompts.unshift(customPrompt);
  localStorage.setItem("custom_prompts", JSON.stringify(prompts));

  showSaveModal.value = false;

  // Zastąp alert toastem
  toast.add({
    title: t("prompt_creator.saved_successfully"),
    color: "success",
  });
};

const usePrompt = () => {
  router.push({
    path: "/chat",
    query: {
      prompt: generatedPrompt.value.positive,
      negativePrompt: generatedPrompt.value.negative,
    },
  });
};
const randomizeCategory = () => {
  const category = currentCategory.value;
  if (!category) return;

  // Pobierz dostępne tagi (filtrowane, bez już wybranych)
  const availableTags = filteredTagsForCategory.value.filter(
    (tag) => !isTagSelected(tag)
  );
  if (availableTags.length === 0) return;

  // Wybierz losowo 1-3 tagi
  const numToSelect = Math.min(3, availableTags.length);
  const selectedIndices = new Set<number>();
  while (selectedIndices.size < numToSelect) {
    selectedIndices.add(Math.floor(Math.random() * availableTags.length));
  }

  // Dodaj wybrane tagi
  selectedIndices.forEach((index) => {
    const tag = availableTags[index];
    if (tag) {
      toggleTag(tag);
    }
  });
};
// Weight and Emphasis management
const updateWeight = (tagObj: TagObject, value: number | number[]) => {
  const category = currentCategory.value;
  if (!category || !selectedTags.value[category]) return;

  // Handle array (for multiple thumbs) or single value
  const weightValue = Array.isArray(value) ? value[0] : value;

  const index = selectedTags.value[category].findIndex(
    (selected: TagObject) => getTagText(selected, locale.value) === getTagText(tagObj, locale.value)
  );

  if (index > -1 && selectedTags.value[category]?.[index]) {
    selectedTags.value[category][index].weight = weightValue;
  }
  pushToHistory();
};

const updateEmphasis = (tagObj: TagObject, emphasis: number) => {
  const category = currentCategory.value;
  if (!category || !selectedTags.value[category]) return;

  const index = selectedTags.value[category].findIndex(
    (selected: TagObject) => getTagText(selected, locale.value) === getTagText(tagObj, locale.value)
  );

  if (index > -1 && selectedTags.value[category]?.[index]) {
    selectedTags.value[category][index].emphasis = emphasis;
  }
  pushToHistory();
};

// Update tagClasses computed
const tagClasses = computed(() => {
  return (tagObj: TagObject) => [
    "px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
    "border-2 hover:shadow-lg hover:brightness-110",
    tagObj.nsfw
      ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300"
      : "bg-white dark:bg-slate-800 border-primary-500 text-slate-900 dark:text-white",
  ];
});

// SEO
useHead({
  title: t("prompt_creator.page_title"),
  meta: [
    {
      name: "description",
      content: t("prompt_creator.page_description"),
    },
  ],
});

// Helper: generate shared URL for a given payload
const generateSharedUrl = (data: any) => {
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    return `${window.location.origin}/editor?shared=${encodeURIComponent(encoded)}`;
  } catch (e) {
    console.error("Error generating shared URL:", e);
    return "";
  }
};

// W funkcji sharePrompt
const sharePrompt = () => {
  const data = {
    prompt: generatedPrompt.value,
    tags: selectedTags.value,
    step: 0,
    additionalNegative: additionalNegative.value,
  };
  const url = generateSharedUrl(data);
  if (url) {
    navigator.clipboard.writeText(url);

    // Zastąp komentarz toastem
    toast.add({
      title: t("prompt_creator.link_copied"),
      color: "success",
    });
  } else {
    toast.add({
      title: t("common.error"),
      color: "error",
    });
  }
};

// Ładowanie z query
// Initialize and handle shared links
onMounted(() => {
  const query = new URLSearchParams(window.location.search);
  const shared = query.get("shared");

  if (shared) {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(shared))));
      
      // Wait for content and sync with store
      const stop = watch(isContentLoaded, (loaded) => {
        if (loaded && editorStore.allTags.length > 0) {
          editorStore.loadFromSharedData(data, editorStore.allTags);
          router.replace({ path: "/editor" });
          stop();
        }
      }, { immediate: true });
      
      return;
    } catch (error) {
      console.error("❌ Shared link error:", error);
    }
  }

  // Normal progress loading
  editorStore.loadProgress();

  // Auto-save
  autoSaveInterval = setInterval(() => {
    editorStore.saveProgress();
  }, 30000);
});

onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});

// History & Snapshots logic handled in Pinia store
const pushToHistory = () => editorStore.pushToHistory();
const undo = () => editorStore.undo();
const redo = () => editorStore.redo();

const saveSnapshot = () => {
  const name = prompt(t("prompt_creator.snapshot_name_prompt"));
  if (!name) return;
  editorStore.saveSnapshot(name, totalSelectedTags.value);
};

const restoreSnapshot = (snapshot: any) => {
  editorStore.restoreSnapshot(snapshot);
  showHistoryModal.value = false;
};

const deleteSnapshot = (index: number) => {
  editorStore.deleteSnapshot(index);
};

// Initialization
onMounted(() => {
  editorStore.loadSnapshots();
  editorStore.pushToHistory(); // Initial state
});

const isLg = ref(false);

onMounted(() => {
  isLg.value = window.innerWidth >= 1024;
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  isLg.value = window.innerWidth >= 1024;
};

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 1px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom range slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--color-primary-600));
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--color-primary-600));
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}
</style>
