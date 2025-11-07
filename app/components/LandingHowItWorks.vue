<template>
  <section class="relative">
    <!-- Header -->
    <div class="text-center mb-20 animate-fade-in-up">
      <h2
        v-once
        class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {{ $t("app.section_how_title") }}
      </h2>
      <p
        v-once
        class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
      >
        {{ $t("app.section_how_subtitle") }}
      </p>
    </div>

    <!-- Steps grid with animated timeline -->
    <div class="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Animated connection line (desktop only) -->
      <div
        class="hidden lg:block absolute top-20 left-0 right-0 h-1 overflow-hidden pointer-events-none"
        style="margin: 0 10%"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-500/60 to-primary-500/20 rounded-full"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent w-1/4 animate-shimmer rounded-full"
        ></div>
      </div>

      <!-- Step cards -->
      <LandingStepCard
        v-for="(step, index) in steps"
        :key="index"
        :number="index + 1"
        :title="$t(step.title)"
        :description="$t(step.description)"
        :class="`animate-fade-in-up animation-delay-${(index + 1) * 150}`"
      />
    </div>

    <!-- CTA Section -->
    <div class="text-center mt-20 animate-fade-in-up animation-delay-600">
      <GlassBadge variant="soft" size="lg" pill class="mb-6">
        {{ $t("app.how_cta_badge") }}
      </GlassBadge>
      <h3
        v-once
        class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {{ $t("app.how_cta_title") }}
      </h3>
      <p
        v-once
        class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
      >
        {{ $t("app.how_cta_subtitle") }}
      </p>
      <NuxtLink to="/editor">
        <GlassButton
          color="primary"
          size="xl"
          glow
          icon="i-heroicons-rocket-launch"
          icon-position="right"
        >
          {{ $t("app.cta_try_now") }}
        </GlassButton>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: "app.section_how_steps.collect",
    description: "app.section_how_steps.collect_desc",
  },
  {
    title: "app.section_how_steps.refine",
    description: "app.section_how_steps.refine_desc",
  },
  {
    title: "app.section_how_steps.test",
    description: "app.section_how_steps.test_desc",
  },
  {
    title: "app.section_how_steps.deploy",
    description: "app.section_how_steps.deploy_desc",
  },
];
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}
</style>
