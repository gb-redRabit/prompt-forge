<template>
  <div v-if="prompts.length > 0">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4"
    >
      <div>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span v-once>{{ $t("library.history.title") }}</span>
        </p>
        <p class="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
          <span v-once>{{ $t("library.history.description") }}</span>
        </p>
      </div>
      <GlassButton
        color="error"
        variant="ghost"
        size="xs"
        @click="$emit('clear')"
        class="self-end sm:self-auto"
      >
        <UIcon name="i-heroicons-trash" class="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
        <span v-once class="text-xs">{{ $t("library.history.clear") }}</span>
      </GlassButton>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
  <div v-else class="text-center py-8 sm:py-12 px-4">
    <UIcon
      name="i-heroicons-clock"
      class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4"
    />
    <p
      class="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium mb-2"
    >
      <span v-once>{{ $t("library.history.empty") }}</span>
    </p>
    <div class="max-w-md mx-auto text-xs sm:text-sm text-gray-500 space-y-2">
      <p>
        <strong
          ><span v-once>{{ $t("library.history.howItWorks") }}</span></strong
        >
      </p>
      <ul class="text-left space-y-1 pl-2">
        <li>
          <span v-once>• {{ $t("library.history.features.autoSave") }}</span>
        </li>
        <li>
          <span v-once>• {{ $t("library.history.features.quickAccess") }}</span>
        </li>
        <li>
          <span v-once>• {{ $t("library.history.features.noSpace") }}</span>
        </li>
        <li>
          <span v-once>• {{ $t("library.history.features.canClear") }}</span>
        </li>
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
