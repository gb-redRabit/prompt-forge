<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t("library.title") }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t("library.subtitle") }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <UButton
          color="success"
          variant="outline"
          @click="showImportModal = true"
        >
          <UIcon name="i-heroicons-arrow-up-tray" class="mr-2" />{{
            $t("library.import")
          }}
        </UButton>
        <UButton color="primary" variant="outline" @click="handleExport">
          <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />{{
            $t("library.export")
          }}
        </UButton>
      </div>
    </div>

    <!-- Stats -->
    <LibraryStats :stats="stats" />

    <!-- Tabs -->
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import LibraryStats from "~/components/library/LibraryStats.vue";
import LibrarySavedTab from "~/components/library/LibrarySavedTab.vue";
import LibraryCustomTab from "~/components/library/LibraryCustomTab.vue";
import LibraryHistoryTab from "~/components/library/LibraryHistoryTab.vue";
import LibraryCollectionsTab from "~/components/library/LibraryCollectionsTab.vue";
import ImportModal from "~/components/library/modals/ImportModal.vue";
import CreateCollectionModal from "~/components/library/modals/CreateCollectionModal.vue";
import EditPromptModal from "~/components/library/modals/EditPromptModal.vue";
import AddToCollectionModal from "~/components/library/modals/AddToCollectionModal.vue";
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
} = useLibrary();

const activeTab = ref(0);
const showImportModal = ref(false);
const showCreateCollectionModal = ref(false);
const showEditModal = ref(false);
const showAddToCollectionModal = ref(false);
const editingPrompt = ref<SavedPrompt | null>(null);
const selectedCollection = ref<PromptCollection | null>(null);
const isMounted = ref(false);

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
