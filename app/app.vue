<template>
  <UApp>
    <!-- Global Background Effects (dla stron bez dashboard layout) -->
    <ClientOnly>
      <BackgroundEffects
        :orb-count="8"
        intensity="medium"
        :colors="['primary', 'purple', 'pink', 'blue', 'green']"
        :enable-mouse-follow="true"
        :animated="true"
      />
    </ClientOnly>

    <NuxtLayout>
      <NuxtPage />
      <LoadingOverlay :shown="!isContentLoaded && !isDashboardPage" />
    </NuxtLayout>

    <!-- Global Loading Overlay -->
  </UApp>
</template>

<script setup lang="ts">
const { isLoaded: isContentLoaded } = usePreloadedContent();
const route = useRoute();

// Fallback - jeśli zawartość nie załaduje się w 5 sekund, wyłącz overlay

// Sprawdź czy jesteśmy na stronie z dashboard layout
const isDashboardPage = computed(() => {
  // Dashboard layout już ma BackgroundEffects
  const dashboardRoutes = [
    "/prompts",
    "/library",
    "/templates",
    "/settings",
    "/chat",
    "/editor",
  ];
  return dashboardRoutes.some((r) => route.path.startsWith(r));
});
</script>
