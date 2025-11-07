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
            <span v-once>{{ $t("library.modals.import.selectFile") }}</span>
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
            <span v-once>{{ $t("library.modals.import.mode") }}</span>
          </label>
          <div class="flex gap-2" role="group" aria-label="Import mode">
            <GlassButton
              :color="importMode === 'merge' ? 'primary' : 'neutral'"
              :variant="importMode === 'merge' ? 'solid' : 'outline'"
              @click="importMode = 'merge'"
            >
              <span v-once>{{ $t("library.modals.import.merge") }}</span>
            </GlassButton>
            <GlassButton
              :color="importMode === 'replace' ? 'primary' : 'neutral'"
              :variant="importMode === 'replace' ? 'solid' : 'outline'"
              @click="importMode = 'replace'"
            >
              <span v-once>{{ $t("library.modals.import.replace") }}</span>
            </GlassButton>
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <GlassButton color="neutral" variant="ghost" @click="close">
        <span v-once>{{ $t("library.modals.import.cancel") }}</span>
      </GlassButton>
      <GlassButton
        color="primary"
        :disabled="!selectedFile"
        @click="handleImport"
      >
        <span v-once>{{ $t("library.modals.import.submit") }}</span>
      </GlassButton>
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
