<template>
  <section class="relative">
    <div class="text-center max-w-5xl mx-auto space-y-8">
      <!-- Badge -->
      <div class="flex justify-center">
        <UBadge variant="subtle" size="lg" class="animate-fade-in-up">
          <UIcon name="i-heroicons-sparkles" class="mr-2" />
          {{ $t("app.tagline") }}
        </UBadge>
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

      <!-- CTA Buttons -->
      <div
        class="flex gap-4 justify-center pt-4 flex-wrap animate-fade-in-up animation-delay-300"
      >
        <UButton
          color="primary"
          size="xl"
          @click="$emit('get-started')"
          class="group shadow-lg hover:shadow-xl transition-all"
        >
          {{ $t("app.cta_primary") }}
          <UIcon
            name="i-heroicons-arrow-right"
            class="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </UButton>
        <UButton
          variant="outline"
          size="xl"
          @click="$emit('learn-more')"
          class="group"
        >
          {{ $t("app.cta_secondary") }}
          <UIcon
            name="i-heroicons-play"
            class="ml-2 group-hover:scale-110 transition-transform"
          />
        </UButton>
      </div>

      <!-- Stats -->
      <div
        v-if="isContentLoaded"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-4xl mx-auto pt-12 animate-fade-in-up animation-delay-400"
      >
        <LandingStatCard
          :value="`${promptsCount}+`"
          :label="$t('app.stats.prompts')"
        />
        <LandingStatCard
          :value="`${optionsCount}+`"
          :label="$t('app.stats.options')"
        />
        <LandingStatCard
          :value="`${tagsCount}+`"
          :label="$t('app.stats.tags')"
        />
        <LandingStatCard
          :value="$t('app.stats.availability')"
          :label="$t('app.stats.availability_label')"
        />
        <LandingStatCard
          :value="$t('app.stats.possibilities')"
          :label="$t('app.stats.possibilities_label')"
        />
      </div>
    </div>

    <!-- Floating elements -->
    <div
      class="absolute top-20 -left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"
    />
    <div
      class="absolute bottom-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"
    />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  isContentLoaded: boolean;
  promptsCount: number;
  optionsCount: number;
  tagsCount: number;
}>();

defineEmits<{
  "get-started": [];
  "learn-more": [];
}>();
</script>
