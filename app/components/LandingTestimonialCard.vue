<template>
  <UCard
    class="hover:scale-105 transition-all duration-300"
    :ui="{ body: 'p-6' }"
  >
    <div class="space-y-4">
      <div class="flex gap-1">
        <UIcon
          v-for="star in 5"
          :key="star"
          name="i-heroicons-star-solid"
          class="w-5 h-5 text-yellow-400"
        />
      </div>
      <p class="text-gray-600 dark:text-gray-400 italic">"{{ text }}"</p>
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center text-white font-bold"
        >
          {{ name.charAt(0) }}
        </div>
        <div>
          <div class="font-semibold text-gray-900 dark:text-white">
            {{ name }}
          </div>
          <div class="text-sm text-gray-500">{{ role }}</div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  name: string;
  role: string;
}>();
</script>
