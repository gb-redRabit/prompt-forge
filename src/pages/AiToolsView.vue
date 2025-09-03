<template>
  <div class="flex justify-center items-start min-h-[94vh]">
    <div class="w-full max-w-7xl px-2">
      <AiToolsHeader />
      <AiToolsCategorySelector
        :allCategories="allCategories"
        v-model="selectedCategory"
      />
      <AiToolsGrid
        :tools="filteredTools"
        :locale="locale"
        :tagClass="tagClass"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAiToolsStore } from "../store/aiToolsStore";
import { useI18n } from "vue-i18n";
import AiToolsHeader from "../components/aiTools/AiToolsHeader.vue";
import AiToolsCategorySelector from "../components/aiTools/AiToolsCategorySelector.vue";
import AiToolsGrid from "../components/aiTools/AiToolsGrid.vue";

const { tools } = useAiToolsStore();
const { locale } = useI18n();

const selectedCategory = ref("all");

// Zbierz wszystkie unikalne kategorie z narzędzi
const allCategories = computed(() => {
  const cats = new Set();
  tools.value.forEach((tool) => {
    (tool.category || []).forEach((cat) => cats.add(cat));
  });
  return ["all", ...Array.from(cats)];
});

// Filtrowanie narzędzi po kategorii
const filteredTools = computed(() => {
  if (selectedCategory.value === "all") return tools.value;
  return tools.value.filter((tool) =>
    (tool.category || []).includes(selectedCategory.value)
  );
});

// Funkcja doboru koloru badge na podstawie tagu
function tagClass(tag) {
  if (tag.toLowerCase().includes("free")) return "badge-success";
  if (tag.toLowerCase().includes("trial")) return "badge-warning";
  if (
    tag.toLowerCase().includes("płatne") ||
    tag.toLowerCase().includes("paid")
  )
    return "badge-error";
  if (tag.toLowerCase().includes("open source")) return "badge-info";
  if (tag.toLowerCase().includes("konto")) return "badge-secondary";
  return "badge-neutral";
}
</script>
