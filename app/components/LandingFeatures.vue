<template>
  <section class="relative">
    <div class="text-center mb-16 animate-fade-in-up">
      <h2
        v-once
        class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {{ $t("app.features_title") }}
      </h2>
      <p
        v-once
        class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
      >
        {{ $t("app.features_subtitle") }}
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <div class="text-center mt-16 animate-fade-in-up animation-delay-500">
      <p v-once class="text-lg text-gray-600 dark:text-gray-400 mb-6">
        {{ $t("app.features_cta_text") }}
      </p>
      <div class="flex gap-4 justify-center flex-wrap">
        <NuxtLink to="/editor">
          <GlassButton
            color="primary"
            size="lg"
            glow
            icon="i-heroicons-sparkles"
            icon-position="right"
          >
            {{ $t("app.cta_start_creating") }}
          </GlassButton>
        </NuxtLink>
        <NuxtLink to="/templates">
          <GlassButton
            variant="outline"
            size="lg"
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
    icon: "i-heroicons-book-open",
    title: "app.features.library_title",
    description: "app.features.library_desc",
  },
  {
    icon: "i-heroicons-users",
    title: "app.features.collab_title",
    description: "app.features.collab_desc",
  },
  {
    icon: "i-heroicons-shield-check",
    title: "app.features.quality_title",
    description: "app.features.quality_desc",
  },
  {
    icon: "i-heroicons-arrow-down-tray",
    title: "app.features.export_title",
    description: "app.features.export_desc",
  },
];
</script>
