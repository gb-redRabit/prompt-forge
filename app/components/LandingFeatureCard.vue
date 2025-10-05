<template>
  <UCard
    class="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-primary-500/20"
    :ui="{
      body: 'p-6 sm:p-8 ring-1 ring-gray-200 dark:ring-gray-700',
    }"
  >
    <div class="space-y-4">
      <div
        class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform"
      >
        <UIcon :name="icon" class="w-7 h-7 text-white" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>
