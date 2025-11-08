<template>
  <GlassCard
    variant="default"
    padding="sm"
    hover
    shadow
    gradient
    class="group transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full"
  >
    <!-- Content -->
    <div class="relative space-y-2 md:space-y-3 lg:space-y-4">
      <!-- Icon with gradient background -->
      <div
        class="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
      >
        <!-- Glow effect on hover -->
        <div
          class="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500"
        ></div>
        <UIcon
          :name="icon"
          class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white relative z-10"
        />
      </div>

      <!-- Title -->
      <h3
        class="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight"
      >
        {{ title }}
      </h3>

      <!-- Description -->
      <p
        class="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300"
      >
        {{ description }}
      </p>
    </div>

    <!-- Decorative corner accent -->
    <div
      class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    ></div>
  </GlassCard>
</template>

<script setup lang="ts">
import type { FeatureItem } from "~/types/landing";

defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>
