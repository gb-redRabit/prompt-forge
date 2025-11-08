<template>
  <section class="relative">
    <div class="text-center mb-4 md:mb-8 lg:mb-12 xl:mb-16 animate-fade-in-up">
      <h2
        v-once
        class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 lg:mb-4"
      >
        {{ $t("app.features_title") }}
      </h2>
      <p
        v-once
        class="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
      >
        {{ $t("app.features_subtitle") }}
      </p>
    </div>

    <div
      class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-5 xl:gap-6"
    >
      <LandingFeatureCard
        v-for="(feature, index) in features"
        :key="index"
        :icon="feature.icon"
        :title="$t(feature.title)"
        :description="$t(feature.description)"
        :class="`animate-fade-in-up animation-delay-${(index + 1) * 100}`"
      />
    </div>

    <!-- CTA Section -->
    <div
      class="text-center mt-4 md:mt-8 lg:mt-12 xl:mt-16 animate-fade-in-up animation-delay-500"
    >
      <p
        v-once
        class="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-3 md:mb-4 lg:mb-6 hidden md:block"
      >
        {{ $t("app.features_cta_text") }}
      </p>
      <div class="flex gap-2 md:gap-3 lg:gap-4 justify-center flex-wrap">
        <NuxtLink to="/editor">
          <GlassButton
            color="primary"
            size="md"
            class="text-xs md:text-sm lg:text-base"
            glow
            icon="i-heroicons-sparkles"
            icon-position="right"
          >
            {{ $t("app.cta_start_creating") }}
          </GlassButton>
        </NuxtLink>
        <NuxtLink to="/templates" class="hidden md:inline-block">
          <GlassButton
            variant="outline"
            size="md"
            class="text-xs md:text-sm lg:text-base"
            icon="i-heroicons-arrow-right"
            icon-position="right"
          >
            {{ $t("app.cta_browse_templates") }}
          </GlassButton>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FeatureItem } from "~/types/landing";

const features: FeatureItem[] = [
  {
    icon: "i-heroicons-tag",
    title: "app.features.library_title",
    description: "app.features.library_desc",
  },
  {
    icon: "i-heroicons-adjustments-horizontal",
    title: "app.features.collab_title",
    description: "app.features.collab_desc",
  },
  {
    icon: "i-heroicons-folder",
    title: "app.features.quality_title",
    description: "app.features.quality_desc",
  },
  {
    icon: "i-heroicons-clipboard-document-check",
    title: "app.features.export_title",
    description: "app.features.export_desc",
  },
];
</script>
