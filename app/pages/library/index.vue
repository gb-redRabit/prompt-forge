<template>
  <div class="space-y-6 p-4 sm:p-6 lg:p-8 relative">
    <!-- Decorative gradient orbs in background -->
    <div
      class="hidden lg:block gradient-orb gradient-orb-primary animate-pulse-slow fixed pointer-events-none"
      style="
        width: 450px;
        height: 450px;
        top: 5%;
        right: -8%;
        opacity: 0.1;
        z-index: 0;
      "
    />
    <div
      class="hidden md:block gradient-orb gradient-orb-secondary animate-float fixed pointer-events-none"
      style="
        width: 350px;
        height: 350px;
        bottom: 10%;
        left: -5%;
        opacity: 0.08;
        z-index: 0;
        animation-delay: 4s;
      "
    />
    <div
      class="hidden lg:block gradient-orb gradient-orb-accent animate-gradient-shift fixed pointer-events-none"
      style="
        width: 400px;
        height: 400px;
        top: 50%;
        left: 10%;
        opacity: 0.06;
        z-index: 0;
        animation-delay: 8s;
      "
    />

    <!-- Content with higher z-index -->
    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between animate-fade-in">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold gradient-text-multi mb-2">
            {{ $t("library.title") }}
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {{ $t("library.subtitle") }}
          </p>
        </div>

        <!-- Actions -->
        <div
          class="flex items-center gap-2 animate-fade-in animation-delay-100"
        >
          <UButton
            color="success"
            variant="outline"
            @click="showImportModal = true"
            class="hover-scale transition-all-smooth hover-glow text-xs sm:text-sm"
          >
            <UIcon name="i-heroicons-arrow-up-tray" class="mr-1 sm:mr-2" />
            <span class="hidden sm:inline">{{ $t("library.import") }}</span>
          </UButton>
          <UButton
            color="primary"
            variant="outline"
            @click="handleExport"
            class="hover-scale transition-all-smooth hover-glow text-xs sm:text-sm"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="mr-1 sm:mr-2" />
            <span class="hidden sm:inline">{{ $t("library.export") }}</span>
          </UButton>
        </div>
      </div>

      <!-- Stats -->
      <div class="animate-fade-in animation-delay-200">
        <LibraryStats :stats="stats" />
      </div>

      <!-- Tabs -->
      <div class="animate-fade-in animation-delay-300">
        <UTabs v-model="activeTab" :items="tabs">
          <template #saved>
            <LibrarySavedTab
              :prompts="savedPrompts"
              @use="usePrompt"
              @delete="handleDeletePrompt"
            />
          </template>

          <template #custom>
            <LibraryCustomTab
              :prompts="customPrompts"
              @use="usePrompt"
              @edit="handleEditPrompt"
              @delete="handleDeleteCustomPrompt"
              @create="createNewPrompt"
            />
          </template>

          <template #promptsTags>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <UCard
                v-for="prompt in filteredEditorPrompts"
                :key="prompt.savedId"
                class="card-interactive group animate-fade-in-up"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                      {{
                        prompt.name
                          ? locale === "pl"
                            ? prompt.name.pl
                            : prompt.name.en
                          : prompt.result || "Prompt"
                      }}
                    </h3>
                  </div>

                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3"
                  >
                    {{
                      prompt.description
                        ? locale === "pl"
                          ? prompt.description.pl
                          : prompt.description.en
                        : prompt.result || ""
                    }}
                  </p>
                </div>

                <div
                  class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-3"
                >
                  <span class="text-xs text-gray-500">{{
                    formattedDateFor(prompt)
                  }}</span>
                  <div
                    class="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity"
                  >
                    <UButton
                      size="xs"
                      color="primary"
                      variant="soft"
                      icon="i-heroicons-play"
                      @click="() => openLink(prompt.link)"
                      >{{ $t("common.use") || "Użyj" }}</UButton
                    >
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="outline"
                      @click="() => shareLink(prompt.link)"
                      >{{ $t("common.share") || "Udostępnij" }}</UButton
                    >
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      @click="() => openPreview(prompt)"
                      >{{ $t("common.preview") || "Podgląd" }}</UButton
                    >
                    <UButton
                      size="xs"
                      color="error"
                      variant="ghost"
                      icon="i-heroicons-trash"
                      title="Usuń prompt"
                      aria-label="Usuń prompt"
                      @click="() => requestDeleteEditorPrompt(prompt.savedId)"
                    />
                  </div>
                </div>
              </UCard>
            </div>
          </template>

          <template #tagFavorites>
            <div class="mt-4">
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-2"
              >
                Ulubione tagi
              </h3>
              <div class="space-y-4">
                <template v-if="Object.keys(groupedTagFavorites).length">
                  <div
                    v-for="(items, category) in groupedTagFavorites"
                    :key="category"
                    class=""
                  >
                    <h4
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {{
                        category === "_uncategorized"
                          ? $t("pages.library.tags.uncategorized") || "Inne"
                          : category
                      }}
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <template v-for="(tagObj, i) in items" :key="tagObj.raw">
                        <div
                          class="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm text-gray-700 dark:text-gray-200"
                        >
                          <button
                            class="mr-2 text-xs text-gray-500"
                            @click="() => setTagFilter(tagObj.raw)"
                          >
                            {{
                              locale === "pl"
                                ? tagObj.pl || tagObj.en
                                : tagObj.en || tagObj.pl
                            }}
                          </button>
                          <UButton
                            size="xs"
                            variant="ghost"
                            color="error"
                            icon="i-heroicons-trash"
                            @click="() => requestDeleteTag(tagObj.raw)"
                          />
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <p class="text-sm text-gray-500">Brak ulubionych tagów.</p>
                </template>
              </div>
            </div>
          </template>

          <template #history>
            <LibraryHistoryTab
              :prompts="promptHistory"
              @use="usePrompt"
              @clear="handleClearHistory"
            />
          </template>

          <template #collections>
            <LibraryCollectionsTab
              :collections="collections"
              :all-prompts="allPrompts"
              @create="showCreateCollectionModal = true"
              @view="viewCollection"
              @delete="handleDeleteCollection"
              @add-prompts="handleAddPromptsDialog"
              @use-prompt="usePrompt"
              @remove-prompt="handleRemoveFromCollection"
            />
          </template>
        </UTabs>
      </div>
    </div>

    <!-- Modals - Teleport to body ONLY on client -->
    <Teleport v-if="isMounted" to="body">
      <ImportModal v-model:open="showImportModal" @import="handleImport" />

      <CreateCollectionModal
        v-model:open="showCreateCollectionModal"
        @create="handleCreateCollection"
      />

      <EditPromptModal
        v-model:open="showEditModal"
        :prompt="editingPrompt"
        @save="handleSaveEdit"
      />

      <AddToCollectionModal
        v-model:open="showAddToCollectionModal"
        :collection="selectedCollection"
        :available-prompts="availablePromptsForCollection"
        @add="handleAddToCollection"
      />

      <!-- Confirm delete tag modal -->
      <div
        v-if="showConfirmDeleteTag"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="cancelDeleteTag"
        ></div>
        <transition name="scale-fade">
          <UCard
            class="z-50 max-w-lg w-full p-6 transform transition-all duration-200"
          >
            <h3 class="text-lg font-semibold mb-2">
              {{
                t("pages.library.actions.confirmRemoveTagTitle") || "Usuń tag"
              }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{
                t("pages.library.actions.confirmRemoveTag") ||
                `Czy na pewno chcesz usunąć tag "${tagToDelete}"?`
              }}
            </p>
            <div class="flex justify-end gap-2">
              <UButton size="sm" variant="ghost" @click="cancelDeleteTag">{{
                t("common.cancel") || "Anuluj"
              }}</UButton>
              <UButton size="sm" color="error" @click="confirmDeleteTag">{{
                t("common.confirm") || "Usuń"
              }}</UButton>
            </div>
          </UCard>
        </transition>
      </div>

      <!-- Preview Modal component -->
      <!-- Confirm delete editor prompt modal -->
      <div
        v-if="showConfirmDeleteEditorPrompt"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="cancelDeleteEditorPrompt"
        ></div>
        <transition name="scale-fade">
          <UCard
            class="z-50 max-w-lg w-full p-6 transform transition-all duration-200"
          >
            <h3 class="text-lg font-semibold mb-2">
              {{ t("library.actions.confirmDelete") || "Usuń prompt" }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{
                t("pages.library.actions.confirmDeletePrompt") ||
                `Czy na pewno chcesz usunąć prompt "${editorPromptToDeleteName || ""}"?`
              }}
            </p>
            <div class="flex justify-end gap-2">
              <UButton
                size="sm"
                variant="ghost"
                @click="cancelDeleteEditorPrompt"
                >{{ t("common.cancel") || "Anuluj" }}</UButton
              >
              <UButton
                size="sm"
                color="error"
                @click="confirmDeleteEditorPrompt"
                >{{ t("common.confirm") || "Usuń" }}</UButton
              >
            </div>
          </UCard>
        </transition>
      </div>

      <!-- Preview Modal component -->
      <PreviewModal v-model:open="showPreviewModal" :prompt="previewPrompt" />
    </Teleport>

    <!-- Undo snackbar for soft-deletes -->
    <div
      v-if="pendingDelete"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <UCard class="px-4 py-2 flex items-center gap-4">
        <div class="text-sm">
          {{ t("pages.library.actions.promptRemoved") || "Usunięto prompt" }}
        </div>
        <div class="ml-2">
          <UButton size="sm" variant="ghost" @click="undoSoftDelete">
            {{ t("common.undo") || "Cofnij" }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditPromptModal from "~/components/library/modals/EditPromptModal.vue";
import AddToCollectionModal from "~/components/library/modals/AddToCollectionModal.vue";
import CreateCollectionModal from "~/components/library/modals/CreateCollectionModal.vue";
import ImportModal from "~/components/library/modals/ImportModal.vue";
import PreviewModal from "~/components/library/PreviewModal.vue";
import LibrarySavedTab from "~/components/library/LibrarySavedTab.vue";
import LibraryCustomTab from "~/components/library/LibraryCustomTab.vue";
import LibraryCollectionsTab from "~/components/library/LibraryCollectionsTab.vue";
import LibraryHistoryTab from "~/components/library/LibraryHistoryTab.vue";
import LibraryStats from "~/components/library/LibraryStats.vue";
import { useLibrary } from "~/composables/useLibrary";
import type { SavedPrompt, PromptCollection } from "~/composables/useLibrary";

definePageMeta({
  layout: "dashboard",
});

const { t, locale } = useI18n();

const {
  savedPrompts,
  customPrompts,
  collections,
  promptHistory,
  stats,
  loadLibrary,
  removePrompt,
  removeCustomPrompt,
  deleteCollection: delCollection,
  clearHistory: clearHist,
  importLibrary,
  downloadLibrary,
  createCollection,
  createCustomPrompt,
  updateCustomPrompt,
  addToCollection,
  removeFromCollection: removeFromCollectionFn,
  addToHistory,
  tagFavorites,
  editorCustomPrompts,
  removeEditorPrompt,
} = useLibrary();

const activeTab = ref(0);
const showImportModal = ref(false);
const showCreateCollectionModal = ref(false);
const showEditModal = ref(false);
const showAddToCollectionModal = ref(false);
const editingPrompt = ref<SavedPrompt | null>(null);
const selectedCollection = ref<PromptCollection | null>(null);
const isMounted = ref(false);
const showPreviewModal = ref(false);
const previewPrompt = ref<SavedPrompt | null>(null);

const tabs = computed(() => [
  {
    label: t("library.tabs.saved"),
    icon: "i-heroicons-bookmark",
    slot: "saved",
  },
  {
    label: t("library.tabs.custom"),
    icon: "i-heroicons-pencil",
    slot: "custom",
  },
  {
    // Custom prompts from editor will be shown here under a separate tab
    label: "Prompts tags",
    icon: "i-heroicons-sparkles",
    slot: "promptsTags",
  },
  {
    // Favorite tags saved by editor
    label: "Ulubione tagi",
    icon: "i-heroicons-star",
    slot: "tagFavorites",
  },
  {
    label: t("library.tabs.history"),
    icon: "i-heroicons-clock",
    slot: "history",
  },
  {
    label: t("library.tabs.collections"),
    icon: "i-heroicons-folder",
    slot: "collections",
  },
]);

// Tag filter for Prompts tags view
const activeTagFilter = ref<string | null>(null);

const setTagFilter = (tag: string) => {
  // tag may be a raw favorite string in format category__pl__en or category_pl_en
  const parsed = parseFavoriteTag(tag);
  const localized =
    locale.value === "pl"
      ? parsed.pl || parsed.en || parsed.raw
      : parsed.en || parsed.pl || parsed.raw;
  activeTagFilter.value = localized;
  toast.add &&
    toast.add({
      title:
        t("pages.library.actions.filterSet") || `Filtr ustawiony: ${localized}`,
      color: "info",
    });
};

const filteredEditorPrompts = computed(() => {
  if (!activeTagFilter.value) return editorCustomPrompts.value;
  return editorCustomPrompts.value.filter((p) =>
    (p.tags || []).includes(activeTagFilter.value as string)
  );
});

const allPrompts = computed(() => [
  ...savedPrompts.value,
  ...customPrompts.value,
]);

const availablePromptsForCollection = computed(() => {
  if (!selectedCollection.value) return [];
  return allPrompts.value.filter(
    (p) => !selectedCollection.value!.promptIds.includes(p.savedId)
  );
});

// Actions
const usePrompt = (prompt: SavedPrompt) => {
  // Dla zapisanych promptów używamy promptId, a nie id
  const templateId = prompt.promptId;

  if (!templateId) {
    console.error("Brak promptId dla promptu:", prompt);
    return;
  }

  navigateTo({
    path: "/prompts",
    query: { templateId },
  });
  addToHistory(prompt);
};

const handleDeletePrompt = (prompt: SavedPrompt) => {
  if (confirm(t("library.actions.confirmDelete"))) {
    removePrompt(prompt.savedId);
  }
};

const handleEditPrompt = (prompt: SavedPrompt) => {
  editingPrompt.value = prompt;
  showEditModal.value = true;
};

const handleSaveEdit = (data: SavedPrompt) => {
  console.log("📝 Otrzymano dane do zapisu:", data);

  // POPRAWKA: Przekaż WSZYSTKIE pola, nie tylko name/description/template
  updateCustomPrompt(data.savedId, {
    name: data.name,
    description: data.description,
    template: data.template,
    tags: data.tags || [], // Dodaj tagi
    categories: data.categories || [], // Dodaj kategorie
    placeholder_keys: data.placeholder_keys || [], // Dodaj placeholder_keys
    placeholderValues: data.placeholderValues || {}, // Dodaj placeholderValues
    result: data.result, // Dodaj result
  });

  editingPrompt.value = null;

  console.log("✅ Zaktualizowano prompt w bibliotece");
};

const handleDeleteCustomPrompt = (prompt: SavedPrompt) => {
  if (confirm(t("library.actions.confirmDeleteCustom"))) {
    removeCustomPrompt(prompt.savedId);
  }
};

const handleClearHistory = () => {
  if (confirm(t("library.actions.confirmClearHistory"))) {
    clearHist();
  }
};

const viewCollection = (collection: PromptCollection) => {
  console.log("View collection:", collection);
};

const handleDeleteCollection = (id: string) => {
  if (confirm(t("library.actions.confirmDeleteCollection"))) {
    delCollection(id);
  }
};

const handleAddPromptsDialog = (collection: PromptCollection) => {
  selectedCollection.value = collection;
  showAddToCollectionModal.value = true;
};

const handleAddToCollection = (promptIds: string[]) => {
  if (!selectedCollection.value) return;
  promptIds.forEach((promptId) => {
    addToCollection(selectedCollection.value!.id, promptId);
  });
  selectedCollection.value = null;
};

const handleRemoveFromCollection = (collectionId: string, promptId: string) => {
  if (confirm(t("library.actions.confirmRemoveFromCollection"))) {
    removeFromCollectionFn(collectionId, promptId);
  }
};

const createNewPrompt = () => {
  const currentLocale = locale.value as "en" | "pl";

  const prompt = createCustomPrompt({
    name: { en: "New Custom Prompt", pl: "Nowy Własny Prompt" },
    description: { en: "Enter description...", pl: "Wprowadź opis..." },
    template: {
      en: "Enter your template here...",
      pl: "Wprowadź swój szablon tutaj...",
    },
  });

  // Użyj nextTick aby upewnić się, że Vue zakończył aktualizację DOM
  nextTick(() => {
    editingPrompt.value = prompt;
    showEditModal.value = true;
  });
};

// Helpers for the new Prompts tags view and favorites
const toast = useToast ? useToast() : { add: () => {} };

const getLocalizedText = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return locale.value === "pl"
    ? value.pl || value.en || ""
    : value.en || value.pl || "";
};

const formattedDateFor = (prompt: SavedPrompt) => {
  const timestamp = prompt.savedAt || prompt.timestamp || 0;
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString(locale.value === "pl" ? "pl-PL" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Parse favorite tag stored as "category__pl__en" or "category_pl_en"
const parseFavoriteTag = (raw: string | null | undefined) => {
  const rawTag = raw || "";
  // Accept both __ and _ separators; prefer double-underscore
  const parts = rawTag.includes("__") ? rawTag.split("__") : rawTag.split("_");
  const [category = "", pl = "", en = ""] = parts;
  return { raw: rawTag, category, pl, en };
};

const parsedTagFavorites = computed(() => {
  return (tagFavorites.value || []).map((t) => parseFavoriteTag(t));
});

// Group parsed favorites by category for more readable UI
const groupedTagFavorites = computed(() => {
  const groups: Record<string, Array<any>> = {};
  (tagFavorites.value || []).forEach((raw) => {
    const t = parseFavoriteTag(raw);
    const key = t.category || "_uncategorized";
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
});

const shareLink = async (link?: string) => {
  if (!link) {
    toast.add && toast.add({ title: t("common.no_link"), color: "warning" });
    return;
  }

  try {
    await navigator.clipboard.writeText(link);
    toast.add &&
      toast.add({
        title: t("common.copied") || "Skopiowano do schowka",
        color: "success",
      });
  } catch (e) {
    console.error("Copy failed:", e);
    toast.add &&
      toast.add({
        title: t("common.copy_failed") || "Nie udało się skopiować",
        color: "error",
      });
  }
};

// Modal-based delete flow for tag favorites
const showConfirmDeleteTag = ref(false);
const tagToDelete = ref<string | null>(null);

const requestDeleteTag = (tag: string) => {
  tagToDelete.value = tag;
  showConfirmDeleteTag.value = true;
};

const cancelDeleteTag = () => {
  tagToDelete.value = null;
  showConfirmDeleteTag.value = false;
};

const confirmDeleteTag = () => {
  const tag = tagToDelete.value;
  if (!tag) return cancelDeleteTag();

  const idx = tagFavorites.value.indexOf(tag);
  if (idx === -1) return cancelDeleteTag();

  tagFavorites.value.splice(idx, 1);
  try {
    localStorage.setItem(
      "tag_favorites",
      JSON.stringify([...tagFavorites.value])
    );
    toast.add &&
      toast.add({
        title: t("pages.library.actions.tagRemoved") || "Usunięto tag",
        color: "success",
      });
  } catch (e) {
    console.error("Failed to save tag_favorites:", e);
    toast.add &&
      toast.add({
        title: t("pages.library.actions.saveFailed") || "Błąd zapisu",
        color: "error",
      });
  }

  tagToDelete.value = null;
  showConfirmDeleteTag.value = false;
};

// Modal-based delete flow for editor (legacy) prompts
const showConfirmDeleteEditorPrompt = ref(false);
const editorPromptToDelete = ref<string | null>(null);
const editorPromptToDeleteName = ref<string | null>(null);
// Pending soft-delete state for undo
const pendingDelete = ref<{
  id: string;
  prompt: SavedPrompt | null;
  timeoutId: number | null;
} | null>(null);

const UNDO_TIMEOUT = 6000; // ms

const requestDeleteEditorPrompt = (savedId: string) => {
  // On small screens show confirm modal, on larger screens do soft-delete + undo
  if (process.client && window.innerWidth <= 640) {
    editorPromptToDelete.value = savedId;
    // resolve a friendly name for the modal
    const p = editorCustomPrompts.value.find((x) => x.savedId === savedId);
    editorPromptToDeleteName.value = p
      ? locale.value === "pl"
        ? p.name?.pl || p.name?.en || p.result || null
        : p.name?.en || p.name?.pl || p.result || null
      : null;
    showConfirmDeleteEditorPrompt.value = true;
    return;
  }

  // Large screen: perform soft-delete immediately and offer undo
  const p =
    editorCustomPrompts.value.find((x) => x.savedId === savedId) || null;
  scheduleSoftDelete(savedId, p);
};

const scheduleSoftDelete = (savedId: string, prompt: SavedPrompt | null) => {
  // Remove from UI immediately
  const index = editorCustomPrompts.value.findIndex(
    (x) => x.savedId === savedId
  );
  let removedPrompt: SavedPrompt | null = null;
  if (index !== -1) {
    // splice returns an array; assert first element or null
    const spliced = editorCustomPrompts.value.splice(index, 1);
    removedPrompt = spliced && spliced[0] ? (spliced[0] as SavedPrompt) : null;
  }

  // Set pending delete with timeout to finalize
  if (pendingDelete.value && pendingDelete.value.timeoutId) {
    // if another pending exists, finalize it immediately
    clearTimeout(pendingDelete.value.timeoutId as any);
    // finalize previous
    if (pendingDelete.value.id) removeEditorPrompt(pendingDelete.value.id);
    pendingDelete.value = null;
  }

  const timeoutId = setTimeout(() => {
    // finalize deletion in composable (update localStorage)
    try {
      removeEditorPrompt(savedId);
    } catch (e) {
      console.error("Finalize delete failed", e);
    }
    pendingDelete.value = null;
  }, UNDO_TIMEOUT) as unknown as number;

  pendingDelete.value = {
    id: savedId,
    prompt: prompt || removedPrompt,
    timeoutId,
  };

  // show a toast as hint
  toast.add &&
    toast.add({
      title: t("pages.library.actions.promptRemoved") || "Usunięto prompt",
      color: "info",
    });
};

const undoSoftDelete = () => {
  if (!pendingDelete.value) return;
  const pd = pendingDelete.value;
  if (pd.timeoutId) clearTimeout(pd.timeoutId as any);

  // restore the prompt into the beginning of the list (preserve editor behavior)
  if (pd.prompt) {
    editorCustomPrompts.value.unshift(pd.prompt);
  }

  // Remove pending marker
  pendingDelete.value = null;

  // feedback
  toast.add &&
    toast.add({ title: t("common.undo") || "Cofnij", color: "success" });
};

const cancelDeleteEditorPrompt = () => {
  editorPromptToDelete.value = null;
  showConfirmDeleteEditorPrompt.value = false;
};

const confirmDeleteEditorPrompt = () => {
  const id = editorPromptToDelete.value;
  if (!id) return cancelDeleteEditorPrompt();

  try {
    removeEditorPrompt(id);
    toast.add &&
      toast.add({
        title: t("pages.library.actions.promptRemoved") || "Usunięto prompt",
        color: "success",
      });
  } catch (e) {
    console.error("Failed to remove editor prompt:", e);
    toast.add &&
      toast.add({
        title: t("pages.library.actions.saveFailed") || "Błąd",
        color: "error",
      });
  }

  editorPromptToDelete.value = null;
  editorPromptToDeleteName.value = null;
  showConfirmDeleteEditorPrompt.value = false;
};

const openLink = (link?: string) => {
  if (!link) return;
  try {
    // Open in new tab
    window.open(link, "_blank");
  } catch (e) {
    // Fallback
    window.location.href = link;
  }
};

const openPreview = (prompt: SavedPrompt) => {
  previewPrompt.value = prompt as any;
  showPreviewModal.value = true;

  // Toast to indicate preview opened
  toast.add &&
    toast.add({
      title: t("pages.library.actions.previewOpened") || "Otworzono podgląd",
      color: "info",
    });
};

const handleImport = async (file: File, mode: "merge" | "replace") => {
  try {
    const text = await file.text();
    const success = importLibrary(text, mode);

    if (success) {
      alert(t("library.modals.import.success"));
    } else {
      alert(t("library.modals.import.error"));
    }
  } catch (e) {
    alert(t("library.modals.import.error"));
  }
};

const handleExport = () => {
  downloadLibrary();
};

const handleCreateCollection = (data: {
  name: string;
  description: string;
}) => {
  createCollection(data.name, data.description);
};

onMounted(() => {
  loadLibrary();
  isMounted.value = true;
});

useHead({
  title: "Biblioteka - Prompt Forge",
});
</script>

<style>
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 200ms ease;
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
