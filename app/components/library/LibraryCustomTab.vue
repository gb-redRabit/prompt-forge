<template>
  <div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4"
    >
      <LibraryPromptCard
        v-for="prompt in displayedPrompts"
        :key="prompt.savedId"
        :prompt="prompt"
        :show-edit="true"
        @use="$emit('use', prompt)"
        @edit="$emit('edit', prompt)"
        @delete="$emit('delete', prompt)"
      />

    <GlassCard
      class="hover:shadow-lg transition-all cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 bg-slate-50 dark:bg-slate-900 flex items-center justify-center min-h-[150px] sm:min-h-[200px]"
      @click="$emit('create')"
    >
      <div class="text-center p-4 sm:p-6">
        <UIcon
          name="i-heroicons-plus-circle"
          class="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-slate-400 mb-2 sm:mb-3"
        />
        <p
          class="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          <span v-once>{{ $t("library.custom.addNew") }}</span>
        </p>
        <p class="text-[10px] sm:text-xs text-slate-500 mt-1">
          <span v-once>{{ $t("library.custom.clickToCreate") }}</span>
        </p>
      </div>
      </GlassCard>
    </div>
    <!-- Obserwator do nieskończonego przewijania -->
    <div ref="loadMoreTrigger" class="w-full h-4 mt-4"></div>
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
  edit: [prompt: SavedPrompt];
  delete: [prompt: SavedPrompt];
  create: [];
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
