<template>
  <div class="flex flex-row min-h-screen" data-theme="cupcake">
    <AppNavbar />
    <main
      class="flex-1 flex flex-col justify-start items-center transition-all p-4 duration-300 ml-20"
    >
      <AppBreadcrumbs class="w-full container" />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from "./components/AppNavbar.vue";
import AppBreadcrumbs from "./components/AppBreadcrumbs.vue";
</script>

<style scoped></style>
