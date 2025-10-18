<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <UContainer class="py-8 lg:py-16 space-y-24 lg:space-y-32">
      <LandingHero
        :is-content-loaded="isContentLoaded"
        :prompts-count="promptsCount"
        :options-count="optionsCount"
        :tags-count="tagsCount"
        @learn-more="handleLearnMore"
      />
      <LandingFeatures />
      <LandingInteractiveDemo />
      <LandingHowItWorks />
      <LandingFAQ />
      <LandingCTA @get-started="handleGetStarted" />
    </UContainer>
    <LoadingOverlay v-if="!isContentLoaded" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

useHead({
  title: "Prompt Forge – Twórz prompty AI szybciej",
  meta: [
    {
      name: "description",
      content: "Nowoczesny edytor promptów AI z Nuxt, Vue i Nuxt UI.",
    },
  ],
});

const {
  options,
  prompts,
  tags,
  isLoaded: isContentLoaded,
} = usePreloadedContent();

const promptsCount = computed(() => prompts.value?.length || 0);
const optionsCount = computed(() => Object.keys(options.value || {}).length);
const tagsCount = computed(() => Object.keys(tags.value || {}).length);

const handleGetStarted = async () => {
  await navigateTo("/editor");
};

const handleLearnMore = async () => {
  await navigateTo("/about");
};
</script>

<style scoped>
/* Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes gradient-shift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30%, -20%) scale(1.1);
  }
  66% {
    transform: translate(-20%, 30%) scale(0.9);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

/* Gradient orbs */
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: gradient-shift 20s ease-in-out infinite;
}

.gradient-orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  top: -10%;
  left: -10%;
}

.gradient-orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #ec4899, #f59e0b);
  top: 50%;
  right: -10%;
  animation-delay: 5s;
}

.gradient-orb-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(225deg, #10b981, #3b82f6);
  bottom: -10%;
  left: 50%;
  animation-delay: 10s;
}

/* Grid pattern */
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Smooth transitions */
* {
  transition-property: transform, box-shadow, border-color;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
