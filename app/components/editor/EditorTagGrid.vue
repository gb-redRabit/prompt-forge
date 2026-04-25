<script setup lang="ts">
import type { TagItem } from '~~/shared/types/content';
import { getTagId, getTagText } from '~/utils/tags';
import { ref, computed, watch } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

interface Props {
  tags: TagItem[];
  selectedTags: Record<string, TagItem[]>;
  isFavorite: (tag: TagItem) => boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggle: [tag: TagItem];
  toggleFavorite: [tag: TagItem];
}>();

const { locale } = useI18n();

const isTagSelected = (tagObj: TagItem) => {
  const category = tagObj.category;
  if (!props.selectedTags[category]) return false;
  
  return props.selectedTags[category].some(
    (selected) => getTagId(selected) === getTagId(tagObj)
  );
};

// --- Virtualization / Infinite Scroll for massive DOM performance boost ---
const displayLimit = ref(100);
const loadMoreTrigger = ref<HTMLElement | null>(null);

// Reset the limit whenever the tags list changes (e.g. search or category switch)
watch(() => props.tags, () => {
  displayLimit.value = 100;
});

const displayedTags = computed(() => {
  return props.tags.slice(0, displayLimit.value);
});

useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && displayLimit.value < props.tags.length) {
    // Increase limit by 100 smoothly when user reaches the bottom
    displayLimit.value += 100;
  }
});
</script>

<template>
  <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-5 overflow-hidden shadow-sm flex flex-col">
    <div
      v-if="tags.length > 0"
      class="flex flex-wrap justify-start items-start gap-1 sm:gap-1.5 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar h-full"
    >
      <button
        v-for="tagObj in displayedTags"
        :key="getTagId(tagObj)"
        @click="emit('toggle', tagObj)"
        :class="[
          'group relative px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-300 text-left h-fit border shadow-sm hover:shadow-md hover:-translate-y-[1px]',
          'active:scale-95 active:translate-y-0',
          isTagSelected(tagObj) && tagObj.nsfw
            ? 'bg-red-600 border-red-500 text-white shadow-md'
            : isTagSelected(tagObj)
              ? 'bg-primary-600 border-primary-500 text-white shadow-md'
              : tagObj.nsfw
                ? 'bg-red-50 dark:bg-red-900/15 text-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-100 dark:border-red-900/30'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200/60 dark:border-gray-700'
        ]"
      >
        <div class="flex items-center gap-1">
          <span class="truncate leading-tight">
            {{ getTagText(tagObj, locale) }}
          </span>
          <button
            @click.stop="emit('toggleFavorite', tagObj)"
            :class="[
              'flex-shrink-0 p-0.5 rounded transition-all',
              isFavorite(tagObj)
                ? 'text-yellow-400'
                : isTagSelected(tagObj)
                  ? 'text-white/50 hover:text-white'
                  : 'text-gray-400 hover:text-yellow-400',
            ]"
          >
            <UIcon
              :name="isFavorite(tagObj) ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
              class="w-2.5 h-2.5 sm:w-3 sm:h-3"
            />
          </button>
        </div>
      </button>
      
      <!-- Invisible element to trigger loading more tags -->
      <div ref="loadMoreTrigger" class="w-full h-4 shrink-0"></div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex items-center justify-center h-full min-h-[200px]">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-600 dark:text-gray-400 font-medium text-sm">
          {{ $t("prompt_creator.no_results") }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.4);
}
</style>
