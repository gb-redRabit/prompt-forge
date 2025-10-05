<template>
  <div
    class="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
  >
    <div class="text-4xl font-bold text-primary-600 dark:text-primary-400">
      {{ value }}
    </div>
    <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number;
  label: string;
}>();
</script>
