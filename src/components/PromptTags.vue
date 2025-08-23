<template>
  <div class="mt-6 flex flex-wrap gap-2">
    <span
      v-for="t in tags"
      :key="t.tag"
      class="badge badge-outline cursor-pointer"
      :class="{ 'badge-primary': selectedTags.includes(t.tag) }"
      @click="toggleTag(t.tag)"
    >
      {{ t.tag }}<span class="opacity-60 ml-1">({{ t.count }})</span>
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
  tags: Array, // [{ tag, count }]
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
