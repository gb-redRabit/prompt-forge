<template>
  <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
    <!-- Saved (bookmark, primary) -->
    <GlassCard padding="md">
      <div class="text-center">
        <UIcon
          name="i-heroicons-bookmark"
          class="mx-auto mb-1 text-primary-500 w-6 h-6"
        />
        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
          {{ stats.totalSaved }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span v-once>{{ $t("library.stats.saved") }}</span>
        </div>
      </div>
    </GlassCard>

    <!-- Custom (pencil, success) -->
    <GlassCard padding="md">
      <div class="text-center">
        <UIcon
          name="i-heroicons-pencil"
          class="mx-auto mb-1 text-success-500 w-6 h-6"
        />
        <div class="text-3xl font-bold text-success-600 dark:text-success-400">
          {{ stats.totalCustom }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span v-once>{{ $t("library.stats.custom") }}</span>
        </div>
      </div>
    </GlassCard>

    <!-- Editor Prompts (first, indigo) -->
    <GlassCard padding="md">
      <div class="text-center">
        <UIcon
          name="i-heroicons-sparkles"
          class="mx-auto mb-1 text-indigo-500 w-6 h-6"
        />
        <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {{ stats.totalEditorPrompts }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span v-once>{{ $t("library.stats.editorPrompts") }}</span>
        </div>
      </div>
    </GlassCard>

    <!-- Tag Favorites (star, pink) -->
    <GlassCard padding="md">
      <div class="text-center">
        <UIcon
          name="i-heroicons-star"
          class="mx-auto mb-1 text-pink-500 w-6 h-6"
        />
        <div class="text-3xl font-bold text-pink-600 dark:text-pink-400">
          {{ stats.totalTagFavorites }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span v-once>{{ $t("library.stats.tagFavorites") }}</span>
        </div>
      </div>
    </GlassCard>

    <!-- History (clock, warning) -->
    <GlassCard padding="md">
      <div class="text-center">
        <UIcon
          name="i-heroicons-clock"
          class="mx-auto mb-1 text-warning-500 w-6 h-6"
        />
        <div class="text-3xl font-bold text-warning-600 dark:text-warning-400">
          {{ stats.totalHistory }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span v-once>{{ $t("library.stats.history") }}</span>
        </div>
      </div>
    </GlassCard>

    <!-- Collections (folder, info) -->
    <GlassCard padding="md">
      <div class="text-center">
        <UIcon
          name="i-heroicons-folder"
          class="mx-auto mb-1 text-blue-500 w-6 h-6"
        />
        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ stats.totalCollections }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span v-once>{{ $t("library.stats.collections") }}</span>
        </div>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    totalSaved: number;
    totalCustom: number;
    totalCollections: number;
    totalHistory: number;
    totalEditorPrompts: number;
    totalTagFavorites: number;
  };
}>();
</script>
