<template>
  <div class="relative">
    <UCard
      class="text-center h-full hover:scale-105 transition-all duration-300 hover:shadow-xl relative z-10 bg-white dark:bg-gray-800"
      :ui="{
        body: 'p-8 ring-2 ring-primary-500/20',
      }"
    >
      <div class="space-y-4">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center mx-auto text-2xl font-bold text-white shadow-lg"
        >
          {{ number }}
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: number;
  title: string;
  description: string;
}>();
</script>
