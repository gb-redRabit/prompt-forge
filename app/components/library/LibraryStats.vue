<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <UCard :ui="{ body: 'p-4' }">
      <div class="text-center">
        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
          {{ stats.totalSaved }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t("library.stats.saved") }}
        </div>
      </div>
    </UCard>
    <UCard :ui="{ body: 'p-4' }">
      <div class="text-center">
        <div class="text-3xl font-bold text-success-600 dark:text-success-400">
          {{ stats.totalCustom }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t("library.stats.custom") }}
        </div>
      </div>
    </UCard>
    <UCard :ui="{ body: 'p-4' }">
      <div class="text-center">
        <div class="text-3xl font-bold text-info-600 dark:text-info-400">
          {{ stats.totalCollections }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t("library.stats.collections") }}
        </div>
      </div>
    </UCard>
    <UCard :ui="{ body: 'p-4' }">
      <div class="text-center">
        <div class="text-3xl font-bold text-warning-600 dark:text-warning-400">
          {{ stats.totalHistory }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t("library.stats.history") }}
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    totalSaved: number;
    totalCustom: number;
    totalCollections: number;
    totalHistory: number;
  };
}>();
</script>
