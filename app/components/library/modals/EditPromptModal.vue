<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('library.modals.edit.title')"
    :description="$t('library.modals.edit.description')"
    :ui="{ footer: 'justify-end', body: 'p-6  max-h-[85vh]' }"
  >
    <template #body>
      <div v-if="editData" class="space-y-6 h-full">
        <!-- Nazwy -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex flex-col h-full">
            <label
              class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
            >
              <UIcon name="i-heroicons-language" class="inline w-4 h-4 mr-1" />
              {{ $t("library.modals.edit.namePL") }}
            </label>
            <UInput
              v-model="editData.name.pl"
              :placeholder="$t('library.modals.edit.namePlaceholder')"
              size="lg"
            />
          </div>
          <div class="flex flex-col h-full">
            <label
              class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
            >
              <UIcon name="i-heroicons-language" class="inline w-4 h-4 mr-1" />
              {{ $t("library.modals.edit.nameEN") }}
            </label>
            <UInput
              v-model="editData.name.en"
              :placeholder="$t('library.modals.edit.nameEnPlaceholder')"
              size="lg"
            />
          </div>
        </div>

        <!-- Opisy -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex flex-col h-full">
            <label
              class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="inline w-4 h-4 mr-1"
              />
              {{ $t("library.modals.edit.descriptionPL") }}
            </label>
            <UTextarea
              v-model="editData.description.pl"
              :placeholder="$t('library.modals.edit.descriptionPlaceholder')"
              :rows="3"
            />
          </div>
          <div class="flex flex-col h-full">
            <label
              class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="inline w-4 h-4 mr-1"
              />
              {{ $t("library.modals.edit.descriptionEN") }}
            </label>
            <UTextarea
              v-model="editData.description.en"
              :placeholder="$t('library.modals.edit.descriptionEnPlaceholder')"
              :rows="3"
            />
          </div>
        </div>

        <!-- Szablony -->
        <div class="grid md:grid-cols-2 gap-4 flex-1">
          <div class="flex flex-col h-full">
            <label
              class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
            >
              <UIcon
                name="i-heroicons-code-bracket"
                class="inline w-4 h-4 mr-1"
              />
              {{ $t("library.modals.edit.templatePL") }}
            </label>
            <UTextarea
              v-model="editData.template.pl"
              :placeholder="$t('library.modals.edit.templatePlaceholder')"
              class="flex-1 font-mono text-sm"
              :rows="15"
            />
          </div>
          <div class="flex flex-col h-full">
            <label
              class="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
            >
              <UIcon
                name="i-heroicons-code-bracket"
                class="inline w-4 h-4 mr-1"
              />
              {{ $t("library.modals.edit.templateEN") }}
            </label>
            <UTextarea
              v-model="editData.template.en"
              :placeholder="$t('library.modals.edit.templateEnPlaceholder')"
              class="flex-1 font-mono text-sm"
              :rows="15"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center justify-between w-full">
        <p class="text-xs text-gray-500">
          <UIcon name="i-heroicons-information-circle" class="inline w-4 h-4" />
          {{ $t("library.modals.edit.saveNote") }}
        </p>
        <div class="flex gap-2">
          <UButton color="neutral" variant="ghost" @click="close">
            {{ $t("library.modals.edit.cancel") }}
          </UButton>
          <UButton color="primary" @click="handleSave">
            <UIcon name="i-heroicons-check" class="mr-1" />
            {{ $t("library.modals.edit.save") }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";

const isOpen = defineModel<boolean>("open");

const props = defineProps<{
  prompt: SavedPrompt | null;
}>();

const emit = defineEmits<{
  save: [data: SavedPrompt];
}>();

const editData = ref<SavedPrompt | null>(null);

watch(
  () => props.prompt,
  (newPrompt) => {
    if (newPrompt) {
      editData.value = JSON.parse(JSON.stringify(newPrompt));
    }
  },
  { immediate: true }
);

const handleSave = () => {
  if (!editData.value) return;
  emit("save", editData.value);
  isOpen.value = false;
};
</script>
