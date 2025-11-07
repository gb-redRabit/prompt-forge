<template>
  <Teleport to="body">
    <div
      v-if="shown"
      class="fixed inset-0 flex items-center justify-center glass-panel transition-opacity duration-300"
      :style="{ ...zIndexStyle('LOADING') }"
    >
      <div class="flex flex-col items-center gap-6 animate-fade-in-up">
        <div class="relative flex items-center justify-center">
          <!-- Animated Ring -->
          <svg
            class="h-20 w-20 text-primary-600 dark:text-primary-400 animate-spin-slow drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 48 48"
          >
            <circle
              class="opacity-20"
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-90"
              fill="currentColor"
              d="M24 4a20 20 0 0 1 20 20h-6a14 14 0 0 0-14-14V4z"
            />
          </svg>

          <!-- Floating orb in center -->
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 animate-pulse-glow"
          ></div>

          <!-- Logo Text -->
          <span
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white tracking-widest uppercase"
            >PF</span
          >
        </div>

        <!-- Loading Text -->
        <div class="text-center space-y-2">
          <h2
            class="text-2xl font-bold gradient-text animate-pulse tracking-wide"
          >
            {{ $t("common.loading") }}
          </h2>
          <p
            v-once
            class="text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-200 max-w-md"
          >
            {{ $t("common.loading_desc") || "Proszę chwilę zaczekać..." }}
          </p>
        </div>

        <!-- Progress Indicator -->
        <div
          class="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 animate-pulse"
            style="animation: shimmer 2s ease-in-out infinite"
          ></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { zIndexStyle } = useZIndex();

withDefaults(
  defineProps<{
    shown?: boolean;
  }>(),
  {
    shown: true,
  }
);
</script>

<style scoped>
@keyframes spin-slow {
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow,
  .animate-pulse-glow,
  .animate-pulse {
    animation: none;
  }
}
</style>
