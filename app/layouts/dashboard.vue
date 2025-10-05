<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <AppSidebar v-model:open="sidebarOpen" />

    <div
      class="flex-1 flex flex-col transition-all duration-300 ease-in-out mt-4"
      :class="[sidebarOpen ? 'lg:ml-72' : 'lg:ml-18']"
    >
      

      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-auto">
        <div class="mx-auto max-w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(true);

// Zapisz stan sidebara w localStorage
watch(sidebarOpen, (value) => {
  if (process.client) {
    localStorage.setItem("sidebar-open", JSON.stringify(value));
  }
});

// Załaduj stan sidebara z localStorage
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      sidebarOpen.value = JSON.parse(saved);
    }
  }
});
</script>
