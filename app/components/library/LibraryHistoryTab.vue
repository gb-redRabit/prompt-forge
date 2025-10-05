<template>
  <div v-if="prompts.length > 0">
    <div class="flex justify-between items-center mb-4">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("library.history.title") }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          {{ $t("library.history.description") }}
        </p>
      </div>
      <UButton color="error" variant="ghost" size="xs" @click="$emit('clear')">
        <UIcon name="i-heroicons-trash" class="mr-1" />
        {{ $t("library.history.clear") }}
      </UButton>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <LibraryPromptCard
        v-for="prompt in prompts"
        :key="prompt.savedId"
        :prompt="prompt"
        :show-edit="false"
        :show-delete="false"
        @use="$emit('use', prompt)"
      />
    </div>
  </div>
  <div v-else class="text-center py-12">
    <UIcon
      name="i-heroicons-clock"
      class="w-16 h-16 mx-auto text-gray-400 mb-4"
    />
    <p class="text-gray-600 dark:text-gray-400 font-medium mb-2">
      {{ $t("library.history.empty") }}
    </p>
    <div class="max-w-md mx-auto text-sm text-gray-500 space-y-2">
      <p>
        <strong>{{ $t("library.history.howItWorks") }}</strong>
      </p>
      <ul class="text-left space-y-1">
        <li>• {{ $t("library.history.features.autoSave") }}</li>
        <li>• {{ $t("library.history.features.quickAccess") }}</li>
        <li>• {{ $t("library.history.features.noSpace") }}</li>
        <li>• {{ $t("library.history.features.canClear") }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";

defineProps<{
  prompts: SavedPrompt[];
}>();

defineEmits<{
  use: [prompt: SavedPrompt];
  clear: [];
}>();
</script>
