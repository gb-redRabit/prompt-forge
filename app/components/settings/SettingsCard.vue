<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
  >
    <!-- Header -->
    <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-3 sm:gap-4">
        <!-- Icon -->
        <div
          :class="[
            iconBgClass || 'bg-gradient-to-br from-purple-500 to-pink-500',
            'rounded-lg p-2 sm:p-3 flex-shrink-0',
          ]"
        >
          <UIcon
            :name="icon"
            :class="[iconColorClass || 'text-white', 'w-5 h-5 sm:w-6 sm:h-6']"
          />
        </div>

        <!-- Title & Description -->
        <div class="flex-1 min-w-0">
          <h3
            class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1"
          >
            {{ title }}
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content (slot) -->
    <div class="p-4 sm:p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description: string;
  iconBgClass?: string;
  iconColorClass?: string;
}

// Użyj withDefaults jeśli potrzebujesz domyślnych wartości
const props = withDefaults(defineProps<Props>(), {
  iconBgClass: "bg-gradient-to-br from-purple-500 to-pink-500",
  iconColorClass: "text-white",
});
</script>
