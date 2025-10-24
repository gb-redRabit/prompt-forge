<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
      <LoadingOverlay v-if="!isContentLoaded" />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { isLoaded: isContentLoaded } = usePreloadedContent();
</script>
