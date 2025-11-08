<template>
  <div
    class="glass-card p-3 sm:p-4 flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <!-- Search & Filter Controls -->
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <UInput
        :model-value="search"
        @update:model-value="$emit('update:search', $event)"
        :placeholder="$t('prompt_creator.search_placeholder')"
        icon="i-heroicons-magnifying-glass"
        size="md"
        class="flex-1"
      />
      <div class="flex gap-2">
        <GlassButton
          :color="showFavorites ? 'primary' : 'neutral'"
          :variant="showFavorites ? 'solid' : 'outline'"
          size="md"
          @click="$emit('update:showFavorites', !showFavorites)"
          class="transition-all duration-300 hover:scale-105 flex-1 sm:flex-initial"
          icon="i-heroicons-star-solid"
        >
          <span v-once class="hidden sm:inline">{{
            $t("prompt_creator.favorites")
          }}</span>
        </GlassButton>
        <GlassButton
          color="primary"
          variant="outline"
          size="md"
          @click="$emit('randomize')"
          class="transition-all duration-300 hover:scale-105 flex-1 sm:flex-initial"
          icon="i-heroicons-arrows-right-left"
        >
          <span v-once class="hidden sm:inline">{{
            $t("prompt_creator.randomize")
          }}</span>
        </GlassButton>
      </div>
    </div>

    <!-- Results & Clear -->
    <div class="mt-3 flex items-center justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400 font-medium">
        {{ resultsCount }}
        <span v-once>{{ $t("prompt_creator.results") }}</span>
      </span>
      <button
        v-if="selectedCount > 0"
        @click="$emit('clear')"
        class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
      >
        <span v-once>{{ $t("common.clear") }}</span> ({{ selectedCount }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  search: string;
  showFavorites: boolean;
  resultsCount: number;
  selectedCount: number;
}

defineProps<Props>();

defineEmits<{
  "update:search": [value: string];
  "update:showFavorites": [value: boolean];
  randomize: [];
  clear: [];
}>();
</script>
