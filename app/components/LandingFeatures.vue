<template>
  <section class="relative">
    <div class="text-center mb-16">
      <h2
        class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {{ $t("app.features_title") }}
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
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
