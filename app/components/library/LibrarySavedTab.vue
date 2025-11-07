<template>
  <div
    v-if="prompts.length > 0"
    class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
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
  <div v-else class="text-center py-12">
    <UIcon
      name="i-heroicons-bookmark"
      class="w-16 h-16 mx-auto text-gray-400 mb-4"
    />
    <p class="text-gray-600 dark:text-gray-400">
      <span v-once>{{ $t("library.saved.empty") }}</span>
    </p>
    <GlassButton color="primary" class="mt-4" @click="navigateTo('/templates')">
      <UIcon name="i-heroicons-squares-2x2" class="mr-2" />
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
