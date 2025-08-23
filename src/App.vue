<template>
  <div class="flex flex-row min-h-screen" data-theme="synthwave">
    <AppNavbar />
    <OpenAIStatus />
    <main
      class="flex-1 flex flex-col justify-start items-center transition-all p-4 duration-300 lg:ml-20"
    >
      <AppBreadcrumbs class="w-full container" />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from "./components/layout/AppNavbar.vue";
import AppBreadcrumbs from "./components/layout/AppBreadcrumbs.vue";
import OpenAIStatus from "./components/layout/OpenAIStatus.vue";
</script>

<style scoped></style>
