<template>
  <div class="min-h-[300px] flex items-center justify-center">
    <div class="text-center space-y-4">
      <div class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-full blur-2xl"
        ></div>
        <div
          class="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-lg"
        >
          <UIcon
            name="i-heroicons-arrow-left"
            class="w-10 h-10 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>
      <div>
        <p class="text-gray-600 dark:text-gray-400 font-medium">
          {{ $t("app.demo.empty_state_title") }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
          {{ $t("app.demo.empty_state_description") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
