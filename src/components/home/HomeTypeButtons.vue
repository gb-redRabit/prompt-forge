<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl"
  >
    <button
      v-for="type in types"
      :key="type.key"
      :class="type.class"
      class="btn btn-xl flex flex-col items-center shadow-md hover:scale-105 transition"
      @click="$emit('goToCreatePrompt', type.key)"
    >
      <span class="text-xs text-base-content">{{ $t(type.desc) }}</span>
    </button>
  </div>
</template>

<script setup>
const types = [
  { key: "Text", class: "btn-primary", desc: "home.textBtnDesc" },
  { key: "Video", class: "btn-secondary", desc: "home.videoBtnDesc" },
  { key: "Audio", class: "btn-accent", desc: "home.audioBtnDesc" },
  { key: "Image", class: "btn-info", desc: "home.imageBtnDesc" },
];
</script>
