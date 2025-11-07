<template>
  <div
    class="glass-card px-5 py-2 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
  >
    <div
      class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"
    >
      {{ progressPercent }}%
    </div>
    <div class="text-xs font-medium text-gray-600 dark:text-gray-400">
      {{ $t("prompt_creator.completed") }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number; // Already 1-based (1, 2, 3...)
  totalSteps: number;
}

const props = defineProps<Props>();

// Computed
const progressPercent = computed(() => {
  return Math.round((props.currentStep / props.totalSteps) * 100);
});
</script>
