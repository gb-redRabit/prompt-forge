<template>
  <div class="space-y-3 sm:space-y-4">
    <div class="grid grid-cols-3 gap-2 sm:gap-3">
      <button
        v-for="theme in themes"
        :key="theme.value"
        @click="setTheme(theme.value as any)"
        class="p-2.5 sm:p-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 glass-button"
        :class="[
          currentTheme === theme.value
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
        ]"
      >
        <div class="flex flex-col items-center gap-1.5 sm:gap-2">
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all"
            :class="[
              currentTheme === theme.value
                ? 'bg-gradient-to-br from-primary-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            ]"
          >
            <UIcon :name="theme.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div class="text-center">
            <div
              class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm"
            >
              {{ $t(theme.labelKey) }}
            </div>
            <div
              class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight"
            >
              {{ $t(theme.descKey) }}
            </div>
          </div>
          <UIcon
            v-if="currentTheme === theme.value"
            name="i-heroicons-check-circle"
            class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500"
          />
        </div>
      </button>
    </div>

    <GlassCard padding="sm" variant="subtle">
      <p
        class="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5 sm:gap-2 leading-relaxed"
      >
        <UIcon
          name="i-heroicons-information-circle"
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"
        />
        <span v-once>{{ $t("settings.theme.system_info") }}</span>
      </p>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
// Używamy centralnego composable dla motywu
const { themes, setTheme, currentTheme } = useTheme();
</script>
