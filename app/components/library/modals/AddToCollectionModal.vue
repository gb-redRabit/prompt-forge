<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('library.modals.addToCollection.title')"
    :description="
      $t('library.modals.addToCollection.description', {
        name: collection?.name || '',
      })
    "
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-2 max-h-96 overflow-y-auto">
        <div
          v-for="prompt in availablePrompts"
          :key="prompt.savedId"
          class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          @click="togglePrompt(prompt.savedId)"
        >
          <input
            type="checkbox"
            :checked="selectedIds.includes(prompt.savedId)"
            class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            @click.stop
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">
              {{ getPromptName(prompt) }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ getPromptDescription(prompt) }}
            </p>
          </div>
        </div>

        <div
          v-if="availablePrompts.length === 0"
          class="text-center py-8 text-gray-500"
        >
          <UIcon
            name="i-heroicons-check-circle"
            class="w-12 h-12 mx-auto mb-2 text-gray-400"
          />
          <p>{{ $t("library.modals.addToCollection.empty") }}</p>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton color="neutral" variant="ghost" @click="close">
        {{ $t("library.modals.addToCollection.cancel") }}
      </UButton>
      <UButton
        color="primary"
        :disabled="selectedIds.length === 0"
        @click="handleAdd"
      >
        <UIcon name="i-heroicons-plus" class="mr-1" />
        {{
          $t("library.modals.addToCollection.add", {
            count: selectedIds.length,
          })
        }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { PromptCollection, SavedPrompt } from "~/composables/useLibrary";

const isOpen = defineModel<boolean>("open");

const props = defineProps<{
  collection: PromptCollection | null;
  availablePrompts: SavedPrompt[];
}>();

const emit = defineEmits<{
  add: [promptIds: string[]];
}>();

const { locale } = useI18n();

const selectedIds = ref<string[]>([]);

const getPromptName = (prompt: SavedPrompt) => {
  if (!prompt.name) return "Bez nazwy";
  return locale.value === "pl" ? prompt.name.pl : prompt.name.en;
};

const getPromptDescription = (prompt: SavedPrompt) => {
  if (!prompt.description) return "";
  return locale.value === "pl" ? prompt.description.pl : prompt.description.en;
};

const togglePrompt = (promptId: string) => {
  const index = selectedIds.value.indexOf(promptId);
  if (index === -1) {
    selectedIds.value.push(promptId);
  } else {
    selectedIds.value.splice(index, 1);
  }
};

const handleAdd = () => {
  emit("add", selectedIds.value);
  selectedIds.value = [];
  isOpen.value = false;
};

watch(isOpen, (newValue) => {
  if (!newValue) {
    selectedIds.value = [];
  }
});
</script>
