<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col lg:flex-row p-3 sm:p-4 lg:p-8">
    <ChatSidebar />
    <div class="flex-1 flex flex-col min-h-0">
      <ChatWindow />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Chat - Prompt Forge",
});
</script>

<style></style>
