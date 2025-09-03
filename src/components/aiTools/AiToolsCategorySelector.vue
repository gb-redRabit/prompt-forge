<template>
  <div class="flex flex-wrap justify-center gap-2 mb-8">
    <button
      v-for="cat in allCategories"
      :key="cat"
      class="btn btn-xs"
      :class="modelValue === cat ? 'btn-primary' : 'btn-outline'"
      @click="$emit('update:modelValue', cat)"
    >
      {{ cat === "all" ? $t("aiTools.all") : cat }}
    </button>
  </div>
</template>
<script setup>
defineProps({
  allCategories: Array,
  modelValue: String,
});
</script>
