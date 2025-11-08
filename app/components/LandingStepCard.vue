<template>
  <div class="relative group">
    <!-- Glass card with hover effects -->
    <GlassCard
      variant="subtle"
      padding="sm"
      hover
      shadow
      gradient
      class="h-full transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      <!-- Content -->
      <div
        class="relative space-y-2 md:space-y-3 lg:space-y-4 xl:space-y-6 text-center"
      >
        <!-- Number badge with glow -->
        <div class="relative inline-flex">
          <div
            class="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-primary-500 via-purple-600 to-blue-600 flex items-center justify-center text-xl md:text-2xl lg:text-2xl xl:text-3xl font-black text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
          >
            <!-- Glow effect -->
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 opacity-0 group-hover:opacity-70 blur-2xl transition-opacity duration-500"
            ></div>
            <span class="relative">{{ number }}</span>
          </div>

          <!-- Pulse ring animation -->
          <div
            class="absolute inset-0 rounded-full border-2 border-primary-500/30 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"
          ></div>
        </div>

        <!-- Title -->
        <h3
          class="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight"
        >
          {{ title }}
        </h3>

        <!-- Description -->
        <p
          class="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          {{ description }}
        </p>
      </div>

      <!-- Decorative corner accent -->
      <div
        class="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      ></div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import type { StepItem } from "~/types/landing";

defineProps<{
  number: number;
  title: string;
  description: string;
}>();
</script>
