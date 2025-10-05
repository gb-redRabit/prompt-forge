<template>
  <section class="relative">
    <div class="text-center mb-16">
      <h2
        class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {{ $t("app.section_how_title") }}
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ $t("app.section_how_subtitle") }}
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
      <!-- Connection lines -->
      <div
        class="hidden lg:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/20 via-primary-500/40 to-primary-500/20"
      />

      <LandingStepCard
        v-for="(step, index) in steps"
        :key="index"
        :number="index + 1"
        :title="$t(step.title)"
        :description="$t(step.description)"
      />
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
