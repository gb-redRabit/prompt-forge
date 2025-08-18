<template>
  <div class="mt-6 flex flex-wrap gap-2">
    <span
      v-for="tag in tags"
      :key="tag"
      class="badge badge-outline cursor-pointer"
      :class="{ 'badge-primary': selectedTags.includes(tag) }"
      @click="toggleTag(tag)"
    >
      {{ tag }}
    </span>
    <span
      v-if="selectedTags.length"
      class="badge badge-error cursor-pointer"
      @click="clearTag"
    >
      {{ $t("prompts.tagsClear") }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  tags: Array,
  selectedTags: Array,
});
const emit = defineEmits(["toggle", "clear"]);
function toggleTag(tag) {
  emit("toggle", tag);
}
function clearTag() {
  emit("clear");
}
import { useI18n } from "vue-i18n";
useI18n();
</script>
