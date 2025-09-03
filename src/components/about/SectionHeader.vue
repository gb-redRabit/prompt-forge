<template>
  <div class="flex items-center gap-3 mb-4">
    <div
      class="h-10 w-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-base-300/50"
    >
      {{ icon }}
    </div>
    <h2 class="text-lg font-semibold tracking-wide">
      {{ title }}
    </h2>
    <div class="flex-1 h-px bg-gradient-to-r from-base-300/70 to-transparent"></div>
  </div>
</template>
<script setup>
defineProps({
  icon: { type: String, default: 'ℹ️' },
  title: { type: String, required: true }
});
</script>