<template>
  <section class="relative">
    <div class="text-center max-w-5xl mx-auto space-y-8">
      <!-- Badge with Glass Effect -->
      <div class="flex justify-center">
        <GlassBadge
          variant="soft"
          size="lg"
          icon="i-heroicons-sparkles"
          pill
          class="animate-fade-in-up"
        >
          {{ $t("app.tagline") }}
        </GlassBadge>
      </div>

      <!-- Main heading -->
      <h1
        class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-tight animate-fade-in-up animation-delay-100"
      >
        <span
          class="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent"
        >
          {{ $t("app.hero_intro") }}
        </span>
      </h1>

      <!-- Subtitle -->
      <p
        class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200"
      >
        {{ $t("app.hero_sub") }}
      </p>

      <!-- CTA Buttons with Glass Effect -->
      <div
        class="flex gap-4 justify-center pt-4 flex-wrap animate-fade-in-up animation-delay-300"
      >
        <GlassButton
          color="primary"
          size="xl"
          icon="i-heroicons-arrow-right"
          icon-position="right"
          glow
          @click="$emit('get-started')"
        >
          {{ $t("app.cta_primary") }}
        </GlassButton>
        <GlassButton
          variant="outline"
          size="xl"
          icon="i-heroicons-play"
          icon-position="right"
          @click="$emit('learn-more')"
        >
          {{ $t("app.cta_secondary") }}
        </GlassButton>
      </div>

      <!-- Stats with Glass Cards -->
      <div
        v-if="isContentLoaded"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-4xl mx-auto pt-12 animate-fade-in-up animation-delay-400"
      >
        <GlassCard
          v-for="(stat, index) in stats"
          :key="index"
          variant="subtle"
          padding="md"
          hover
          shadow
          class="text-center"
        >
          <div
            class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2"
          >
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ stat.label }}
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Floating elements -->
    <div
      class="absolute top-20 -left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"
    />
    <div
      class="absolute bottom-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000 pointer-events-none"
    />
  </section>
</template>

<script setup lang="ts">
import type { LandingHeroProps, LandingHeroEmits } from "~/types/landing";

const props = defineProps<LandingHeroProps>();

defineEmits<LandingHeroEmits>();

const { t } = useI18n();

const stats = computed(() => [
  { value: `${props.promptsCount}+`, label: t("app.stats.prompts") },
  { value: `${props.optionsCount}+`, label: t("app.stats.options") },
  { value: `${props.tagsCount}+`, label: t("app.stats.tags") },
  {
    value: t("app.stats.availability"),
    label: t("app.stats.availability_label"),
  },
  {
    value: t("app.stats.possibilities"),
    label: t("app.stats.possibilities_label"),
  },
]);
</script>
