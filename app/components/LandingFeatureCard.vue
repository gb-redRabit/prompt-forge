<template>
  <GlassCard
    variant="default"
    padding="lg"
    hover
    shadow
    gradient
    class="group transition-all duration-500 hover:-translate-y-2 overflow-hidden"
  >
    <!-- Content -->
    <div class="relative space-y-4">
      <!-- Icon with gradient background -->
      <div
        class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
      >
        <!-- Glow effect on hover -->
        <div
          class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500"
        ></div>
        <UIcon :name="icon" class="w-8 h-8 text-white relative z-10" />
      </div>

      <!-- Title -->
      <h3
        class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
      >
        {{ title }}
      </h3>

      <!-- Description -->
      <p
        class="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300"
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
