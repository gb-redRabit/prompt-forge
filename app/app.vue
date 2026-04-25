<template>
  <UApp>
    <!-- Global Background Effects (controlled by route metadata) -->
    <ClientOnly>
      <span v-if="showGlobalBackground">
        <BackgroundEffects
          :orb-count="8"
          intensity="medium"
          :colors="['primary', 'purple', 'pink', 'blue', 'green']"
          :enable-mouse-follow="false"
          :animated="true"
        />
      </span>
      <template #fallback>
        <!-- Wypełniacz powstrzymujący Nuxt przed generowaniem "start of fragment" na serwerze -->
        <span></span>
      </template>
    </ClientOnly>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Pojedyncza, ciągła instancja ładowarki (SSG & CSR połączone) -->
    <LoadingOverlay :shown="showOverlay" />

    <!-- Powiadomienie o aktualizacji PWA -->
    <PwaUpdate />
  </UApp>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const { isLoaded: isContentLoaded } = usePreloadedContent();
const route = useRoute();
const nuxtApp = useNuxtApp();

const isHydrated = ref(false);

onMounted(() => {
  // Use Nuxt hook to ensure application is fully ready
  nuxtApp.hooks.hook('app:suspense:resolve', () => {
    isHydrated.value = true;
  });
  
  // Fallback if hook already fired or doesn't fire as expected
  if (!nuxtApp.isHydrating) {
    isHydrated.value = true;
  }
});

// Ekran ładowania jest widoczny dopóki nie załadują się dane ATAKŻE aplikacja nie zakończy pełnej hydracji
const showOverlay = computed(() => !isContentLoaded.value || !isHydrated.value);

// PWA Manifest link
useHead({
  link: [
    {
      rel: "manifest",
      href: "/manifest.webmanifest",
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
    {
      rel: "apple-touch-icon",
      href: "/icon-192x192.png",
    },
  ],
});

// Sterowanie tłem przez metadane strony (np. definePageMeta({ hideGlobalBackground: true }))
const showGlobalBackground = computed(() => {
  // Jeśli layout to dashboard, domyślnie ukrywamy (dashboard ma własne efekty)
  if (route.meta.layout === 'dashboard') return false;
  
  // Możliwość jawnego ukrycia/pokazania przez meta
  if (route.meta.hideGlobalBackground === true) return false;
  
  return true;
});
</script>
