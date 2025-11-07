<template>
  <section class="relative">
    <!-- Animated gradient background -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl"
      ></div>
      <div
        class="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Glass container -->
    <GlassCard
      variant="strong"
      padding="xl"
      gradient
      shadow
      class="rounded-3xl"
    >
      <div class="relative z-10 text-center space-y-8 animate-fade-in-up">
        <!-- Title with gradient -->
        <h2
          v-once
          class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white"
        >
          <span class="block mb-2">{{ $t("app.cta_title") }}</span>
          <span
            class="bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 dark:from-primary-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent"
          >
            {{ $t("app.tagline") }}
          </span>
        </h2>

        <!-- Subtitle -->
        <p
          v-once
          class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          {{ $t("app.footer_note") }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <GlassButton
            color="primary"
            size="xl"
            glow
            icon="i-heroicons-arrow-right"
            icon-position="right"
            @click="$emit('get-started')"
            class="animate-pulse-glow"
          >
            {{ $t("app.cta_primary") }}
          </GlassButton>

          <GlassButton
            variant="outline"
            size="xl"
            color="neutral"
            icon="i-heroicons-play"
            icon-position="right"
            @click="$emit('learn-more')"
          >
            {{ $t("app.cta_secondary") }}
          </GlassButton>
        </div>

        <!-- Trust indicators -->
        <div
          class="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <GlassBadge
            variant="soft"
            size="sm"
            color="primary"
            icon="i-heroicons-check-circle"
          >
            {{ $t("app.stats.availability") }}
          </GlassBadge>
          <GlassBadge
            variant="soft"
            size="sm"
            color="primary"
            icon="i-heroicons-shield-check"
          >
            Open Source
          </GlassBadge>
          <GlassBadge
            variant="soft"
            size="sm"
            color="primary"
            icon="i-heroicons-sparkles"
          >
            {{ $t("app.stats.prompts") }}
          </GlassBadge>
        </div>
      </div>
    </GlassCard>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  "get-started": [];
  "learn-more": [];
}>();
</script>

<style scoped>
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
</style>
