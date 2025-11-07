<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    <LibraryPromptCard
      v-for="prompt in prompts"
      :key="prompt.savedId"
      :prompt="prompt"
      :show-edit="true"
      @use="$emit('use', prompt)"
      @edit="$emit('edit', prompt)"
      @delete="$emit('delete', prompt)"
    />

    <GlassCard
      class="hover:shadow-lg transition-all cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-[200px]"
      @click="$emit('create')"
    >
      <div class="text-center p-6">
        <UIcon
          name="i-heroicons-plus-circle"
          class="w-12 h-12 mx-auto text-gray-400 mb-3"
        />
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          <span v-once>{{ $t("library.custom.addNew") }}</span>
        </p>
        <p class="text-xs text-gray-500 mt-1">
          <span v-once>{{ $t("library.custom.clickToCreate") }}</span>
        </p>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";

defineProps<{
  prompts: SavedPrompt[];
}>();

defineEmits<{
  use: [prompt: SavedPrompt];
  edit: [prompt: SavedPrompt];
  delete: [prompt: SavedPrompt];
  create: [];
}>();
</script>
