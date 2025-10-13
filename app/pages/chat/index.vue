<template>
  <div class="h-[calc(100vh-4rem)] flex p-8">
    <ChatSidebar />
    <div class="flex-1 flex flex-col">
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
