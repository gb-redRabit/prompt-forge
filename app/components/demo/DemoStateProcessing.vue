<template>
  <div class="min-h-[300px] flex items-center justify-center">
    <div class="text-center space-y-6">
      <!-- Animated Spinner -->
      <div class="relative w-24 h-24 mx-auto">
        <div
          class="absolute inset-0 rounded-full border-4 border-primary-500/20"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"
        ></div>
        <div
          class="absolute inset-3 rounded-full bg-gradient-to-br from-primary-500/10 to-purple-500/10 flex items-center justify-center"
        >
          <UIcon
            name="i-heroicons-sparkles"
            class="w-10 h-10 text-primary-600 dark:text-primary-400 animate-pulse"
          />
        </div>
      </div>

      <!-- Processing Text -->
      <div>
        <p
          class="text-lg font-semibold text-gray-900 dark:text-white animate-pulse"
        >
          {{ $t("app.demo.processing") }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ $t("app.demo.processing_description") }}
        </p>
      </div>

      <!-- Progress Dots -->
      <div class="flex items-center justify-center gap-2">
        <div
          class="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
          style="animation-delay: 0ms"
        ></div>
        <div
          class="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
          style="animation-delay: 150ms"
        ></div>
        <div
          class="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
          style="animation-delay: 300ms"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
