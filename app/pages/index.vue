<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <!-- skip link for keyboard users -->
    <a href="#hero" class="skip-link">Przejdź do zawartości</a>
    <!-- fullpage viewport - no native scroll -->
    <div
      id="fullpage-container"
      class="fullpage-viewport h-screen w-full overflow-hidden"
      role="main"
    >
      <div id="fullpage-track" class="fullpage-track">
        <section
          id="hero"
          data-fullpage-section
          class="fullpage-section flex items-center"
          role="region"
          aria-label="Hero"
        >
          <UContainer class="py-8 lg:py-16 w-full">
            <LandingHero
              :is-content-loaded="isContentLoaded"
              :prompts-count="promptsCount"
              :options-count="optionsCount"
              :tags-count="tagsCount"
              @learn-more="handleLearnMore"
            />
          </UContainer>
        </section>

        <section
          id="features"
          data-fullpage-section
          class="fullpage-section flex items-center"
          role="region"
          aria-label="Funkcje"
        >
          <UContainer class="py-8 lg:py-16 w-full">
            <LandingFeatures />
          </UContainer>
        </section>

        <section
          id="demo"
          data-fullpage-section
          class="fullpage-section flex items-center"
          role="region"
          aria-label="Demo"
        >
          <UContainer class="py-8 lg:py-16 w-full">
            <LandingInteractiveDemo />
          </UContainer>
        </section>

        <section
          id="how"
          data-fullpage-section
          class="fullpage-section flex items-center"
          role="region"
          aria-label="Jak to działa"
        >
          <UContainer class="py-8 lg:py-16 w-full">
            <LandingHowItWorks />
          </UContainer>
        </section>

        <section
          id="faq"
          data-fullpage-section
          class="fullpage-section flex items-center"
          role="region"
          aria-label="FAQ"
        >
          <UContainer class="py-8 lg:py-16 w-full">
            <LandingFAQ />
          </UContainer>
        </section>

        <section
          id="cta"
          data-fullpage-section
          class="fullpage-section flex items-center"
          role="region"
          aria-label="Start"
        >
          <UContainer class="py-8 lg:py-16 w-full">
            <LandingCTA @get-started="handleGetStarted" />
          </UContainer>
        </section>
      </div>
    </div>

    <FullPageDots
      :items="dotItems"
      @change="onDotChange"
      :wheel-trigger="140"
      :wheel-decay-ms="300"
      :duration-ms="600"
      :enable-mouse-drag="true"
      :wheel-immediate-threshold="20"
    />

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

const dotItems = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Funkcje" },
  { id: "demo", label: "Demo" },
  { id: "how", label: "Jak to działa" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Start" },
];

const onDotChange = (idx: number) => {
  // można obsłużyć dodatkowo — aktualnie wszystko robi komponent FullPageDots
};

const handleGetStarted = async () => {
  await navigateTo("/editor");
};

const handleLearnMore = async () => {
  await navigateTo("/about");
};

// upewnij się że scroll container ma focus by działały klawisze pgup/pagedown jeśli potrzebne
onMounted(() => {
  const container = document.getElementById("fullpage-container");
  if (container) container.tabIndex = -1;
});
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

/* Fullpage styles */
.fullpage-viewport {
  position: relative;
  height: 100vh;
  width: 100%;
  /* allow native scrolling so scroll-snap can work */
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

.fullpage-track {
  width: 100%;
  /* wysokość nie musi być ustawiona; sections używają 100vh */
  transform: translateY(0);
}

.fullpage-section {
  height: 100vh;
  width: 100%;
  /* ensure sections participate in scroll snapping */
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

/* Skip link */
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus {
  position: fixed;
  left: 1rem;
  top: 1rem;
  width: auto;
  height: auto;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  z-index: 60;
  border-radius: 6px;
}
</style>
