<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex relative">
    <!-- Background Effects -->
    <ClientOnly>
      <BackgroundEffects />
    </ClientOnly>

    <!-- Sidebar -->
    <AppSidebar v-model:open="sidebarOpen" />

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col transition-all duration-300 ease-in-out relative"
      :class="sidebarOpen ? 'lg:ml-72' : 'lg:ml-16'"
      :style="zIndexStyle('CONTENT')"
    >
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const { zIndexStyle } = useZIndex();
const sidebarOpen = ref(true);

// Synchronizacja stanu sidebara z localStorage
watch(sidebarOpen, (value) => {
  if (process.client) {
    localStorage.setItem("sidebar-open", JSON.stringify(value));
  }
});

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      sidebarOpen.value = JSON.parse(saved);
    }
  }
});
</script>
