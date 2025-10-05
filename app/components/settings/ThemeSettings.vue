<template>
  <div class="space-y-4">
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="theme in themes"
        :key="theme.value"
        @click="changeTheme(theme.value)"
        class="p-4 rounded-lg border-2 transition-all hover:scale-105"
        :class="[
          colorMode?.preference === theme.value
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
        ]"
      >
        <div class="flex flex-col items-center gap-2">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="[
              colorMode?.preference === theme.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            ]"
          >
            <UIcon :name="theme.icon" class="w-6 h-6" />
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-900 dark:text-white text-sm">
              {{ $t(theme.labelKey) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ $t(theme.descKey) }}
            </div>
          </div>
          <UIcon
            v-if="colorMode?.preference === theme.value"
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-primary-500"
          />
        </div>
      </button>
    </div>

    <div
      class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
    >
      <p class="text-xs text-blue-800 dark:text-blue-200">
        <UIcon
          name="i-heroicons-information-circle"
          class="w-4 h-4 inline mr-1"
        />
        {{ $t("settings.theme.system_info") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = process.client ? useColorMode() : null;

const themes = [
  {
    value: "light",
    labelKey: "settings.theme.light",
    descKey: "settings.theme.light_desc",
    icon: "i-heroicons-sun",
  },
  {
    value: "dark",
    labelKey: "settings.theme.dark",
    descKey: "settings.theme.dark_desc",
    icon: "i-heroicons-moon",
  },
  {
    value: "system",
    labelKey: "settings.theme.system",
    descKey: "settings.theme.system_desc",
    icon: "i-heroicons-computer-desktop",
  },
];

const changeTheme = (theme: string) => {
  if (colorMode) {
    colorMode.preference = theme;
  }
};
</script>
