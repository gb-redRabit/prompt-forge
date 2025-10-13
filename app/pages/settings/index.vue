<template>
  <div class="space-y-8 p-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t("settings.title") }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t("settings.subtitle") }}
      </p>
    </div>

    <ClientOnly>
      <!-- AI Configuration -->
      <SettingsCard
        icon="i-heroicons-cpu-chip"
        :title="$t('settings.ai.title')"
        :description="$t('settings.ai.description')"
        icon-bg-class="bg-gradient-to-br from-purple-500 to-pink-500"
        icon-color-class="text-white"
      >
        <AIConfigSettings />
      </SettingsCard>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Language Settings -->
        <SettingsCard
          icon="i-heroicons-language"
          :title="$t('settings.language.title')"
          :description="$t('settings.language.description')"
          icon-bg-class="bg-gradient-to-br from-blue-500 to-cyan-500"
          icon-color-class="text-white"
        >
          <LanguageSettings />
        </SettingsCard>

        <!-- Theme Settings -->
        <SettingsCard
          icon="i-heroicons-paint-brush"
          :title="$t('settings.theme.title')"
          :description="$t('settings.theme.description')"
          icon-bg-class="bg-gradient-to-br from-orange-500 to-yellow-500"
          icon-color-class="text-white"
        >
          <ThemeSettings />
        </SettingsCard>
      </div>

      <template #fallback>
        <div class="flex items-center justify-center py-12">
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"
            ></div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("pages.common.loading") }}
            </p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import SettingsCard from "~/components/settings/SettingsCard.vue";
import AIConfigSettings from "~/components/settings/AIConfigSettings.vue";
import LanguageSettings from "~/components/settings/LanguageSettings.vue";
import ThemeSettings from "~/components/settings/ThemeSettings.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: `${useI18n().t("settings.title")} - Prompt Forge`,
});
</script>
