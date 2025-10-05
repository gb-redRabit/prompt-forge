<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('library.modals.import.title')"
    :description="$t('library.modals.import.description')"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-4">
        <div>
          <label for="file-input" class="block text-sm font-medium mb-2">
            {{ $t("library.modals.import.selectFile") }}
          </label>
          <input
            id="file-input"
            type="file"
            accept=".json"
            @change="handleFileSelect"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">
            {{ $t("library.modals.import.mode") }}
          </label>
          <div class="flex gap-2" role="group" aria-label="Import mode">
            <UButton
              :color="importMode === 'merge' ? 'primary' : 'neutral'"
              :variant="importMode === 'merge' ? 'solid' : 'outline'"
              @click="importMode = 'merge'"
            >
              {{ $t("library.modals.import.merge") }}
            </UButton>
            <UButton
              :color="importMode === 'replace' ? 'primary' : 'neutral'"
              :variant="importMode === 'replace' ? 'solid' : 'outline'"
              @click="importMode = 'replace'"
            >
              {{ $t("library.modals.import.replace") }}
            </UButton>
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton color="neutral" variant="ghost" @click="close">
        {{ $t("library.modals.import.cancel") }}
      </UButton>
      <UButton color="primary" :disabled="!selectedFile" @click="handleImport">
        {{ $t("library.modals.import.submit") }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>("open");

const emit = defineEmits<{
  import: [file: File, mode: "merge" | "replace"];
}>();

const { t } = useI18n();

const selectedFile = ref<File | null>(null);
const importMode = ref<"merge" | "replace">("merge");

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] || null;
};

const handleImport = () => {
  if (!selectedFile.value) return;
  emit("import", selectedFile.value, importMode.value);
  selectedFile.value = null;
  isOpen.value = false;
};
</script>
