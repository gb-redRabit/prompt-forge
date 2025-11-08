<template>
  <div
    v-if="prompts.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4"
  >
    <LibraryPromptCard
      v-for="prompt in prompts"
      :key="prompt.savedId"
      :prompt="prompt"
      :show-edit="false"
      @use="$emit('use', prompt)"
      @delete="$emit('delete', prompt)"
    />
  </div>
  <div v-else class="text-center py-8 sm:py-12">
    <UIcon
      name="i-heroicons-bookmark"
      class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4"
    />
    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
      <span v-once>{{ $t("library.saved.empty") }}</span>
    </p>
    <GlassButton
      size="sm"
      color="primary"
      class="mt-3 sm:mt-4"
      @click="navigateTo('/templates')"
    >
      <UIcon name="i-heroicons-squares-2x2" class="mr-2 w-4 h-4" />
      <span v-once>{{ $t("library.saved.browse") }}</span>
    </GlassButton>
  </div>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";

defineProps<{
  prompts: SavedPrompt[];
}>();

defineEmits<{
  use: [prompt: SavedPrompt];
  delete: [prompt: SavedPrompt];
}>();
</script>
