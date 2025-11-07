<template>
  <div>
    <!-- Header Info -->
    <div class="flex items-center justify-between mb-2">
      <div>
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"
        >
          {{ categoryName }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t("prompt_creator.step") }} {{ currentStep }} / {{ totalSteps }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <slot name="stats" />
      </div>
    </div>

    <!-- Progress Bar -->
    <div
      class="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
    >
      <div
        class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
        :style="{
          width: `${progressPercent}%`,
        }"
      >
        <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  categoryName: string;
  currentStep: number; // Already 1-based (1, 2, 3...)
  totalSteps: number;
}

const props = defineProps<Props>();

// Computed
const progressPercent = computed(() => {
  return (props.currentStep / props.totalSteps) * 100;
});
</script>
