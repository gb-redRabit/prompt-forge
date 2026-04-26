<template>
  <div v-if="prompts.length > 0">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
      <LibraryPromptCard
        v-for="prompt in displayedPrompts"
        :key="prompt.savedId"
        :prompt="prompt"
        :show-edit="false"
        @use="$emit('use', prompt)"
        @delete="$emit('delete', prompt)"
      />
    </div>
    <!-- Obserwator do nieskończonego przewijania -->
    <div ref="loadMoreTrigger" class="w-full h-4 mt-4"></div>
  </div>
  <div v-else class="text-center py-8 sm:py-12">
    <UIcon
      name="i-heroicons-bookmark"
      class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-400 mb-3 sm:mb-4"
    />
    <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-4">
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
import { ref, computed, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps<{
  prompts: SavedPrompt[];
}>();

defineEmits<{
  use: [prompt: SavedPrompt];
  delete: [prompt: SavedPrompt];
}>();

const displayLimit = ref(20);
const loadMoreTrigger = ref<HTMLElement | null>(null);

watch(() => props.prompts, () => {
  displayLimit.value = 20;
});

const displayedPrompts = computed(() => {
  return props.prompts.slice(0, displayLimit.value);
});

useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && displayLimit.value < props.prompts.length) {
    displayLimit.value += 20;
  }
});
</script>
