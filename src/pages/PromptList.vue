<template>
  <div class="container mx-auto p-4 flex flex-col md:flex-row gap-8">
    <!-- Lewy panel: przyciski -->
    <div class="flex flex-row md:flex-col gap-4 md:w-1/6">
      <button
        v-for="type in types"
        :key="type.key"
        class="btn btn-outline w-full"
        :class="{ 'btn-primary': selectedType === type.key }"
        @click="
          () => {
            selectedType = type.key;
            selectedTags = [];
          }
        "
      >
        {{ $t(type.label) }}
      </button>
      <PromptTags
        :tags="sortedTags"
        :selectedTags="selectedTags"
        @toggle="toggleTag"
        @clear="clearTag"
      />
    </div>
    <!-- Prawy panel: lista promptów -->
    <div class="flex-1">
      <div class="flex justify-end mb-4">
        <button class="btn btn-info" @click="showPlaceholders = true">
          {{ $t("prompts.showPlaceholders") }}
        </button>
      </div>
      <h2 class="text-2xl font-bold mb-4">
        {{ $t(types.find((t) => t.key === selectedType).label) }}
      </h2>
      <ul
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <li v-for="prompt in filteredPrompts" :key="prompt.id" class="w-full">
          <PromptCard :prompt="prompt" />
        </li>
        <li
          v-if="filteredPrompts.length === 0"
          class="col-span-full text-center text-base-content/60"
        >
          {{ $t("prompts.empty") }}
        </li>
      </ul>
    </div>

    <!-- Modal z placeholderami -->
    <dialog v-if="showPlaceholders" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">
          {{ $t("prompts.allPlaceholders") }}
        </h3>
        <div class="max-h-96 overflow-y-auto">
          <ul>
            <li v-for="key in allPlaceholderKeys" :key="key" class="mb-2">
              <span class="font-semibold">{{ key }}</span>
            </li>
          </ul>
        </div>
        <div class="modal-action">
          <button class="btn" @click="showPlaceholders = false">
            {{ $t("close") }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showPlaceholders = false">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import promptsText from "../prompts/promptsText.json";
import promptsVideo from "../prompts/promptsVideo.json";
import promptsAudio from "../prompts/promptsAudio.json";
import promptsImage from "../prompts/promptsImage.json";
import PromptTags from "../components/PromptTags.vue";
import PromptCard from "../components/PromptCard.vue";

const types = [
  { key: "text", label: "prompts.types.text" },
  { key: "video", label: "prompts.types.video" },
  { key: "audio", label: "prompts.types.audio" },
  { key: "image", label: "prompts.types.image" },
];

const promptsByType = {
  text: promptsText,
  video: promptsVideo,
  audio: promptsAudio,
  image: promptsImage,
};

const selectedType = ref("text");
const selectedTags = ref([]);
const showPlaceholders = ref(false);

// Dynamicznie wyliczaj dostępne tagi na podstawie już wybranych tagów
const sortedTags = computed(() => {
  const prompts = promptsByType[selectedType.value] || [];
  let filteredPrompts = prompts;
  if (selectedTags.value.length) {
    filteredPrompts = prompts.filter((p) =>
      selectedTags.value.every((tag) => (p.tags_ids || []).includes(tag))
    );
  }
  // Zbierz tagi z przefiltrowanych promptów
  const tags = new Set();
  filteredPrompts.forEach((p) => {
    (p.tags_ids || []).forEach((tag) => tags.add(tag));
  });
  // Dodaj zawsze wybrane tagi (nawet jeśli nie ma ich już w przefiltrowanych)
  selectedTags.value.forEach((tag) => tags.add(tag));
  return Array.from(tags).sort();
});

// Filtrowanie promptów po wybranych tagach (wszystkie muszą być obecne)
const filteredPrompts = computed(() => {
  const prompts = promptsByType[selectedType.value] || [];
  if (!selectedTags.value.length) return prompts;
  return prompts.filter((p) =>
    selectedTags.value.every((tag) => (p.tags_ids || []).includes(tag))
  );
});

function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
}
function clearTag() {
  selectedTags.value = [];
}
// --- NOWOŚĆ: placeholdery ze wszystkich plików prompts ---
const allPrompts = [
  ...promptsText,
  ...promptsVideo,
  ...promptsAudio,
  ...promptsImage,
];

// Zbierz wszystkie unikalne placeholder_keys
const allPlaceholderKeys = computed(() => {
  const keys = new Set();
  allPrompts.forEach((p) => {
    if (Array.isArray(p.placeholder_keys)) {
      p.placeholder_keys.forEach((k) => keys.add(k));
    }
  });
  return Array.from(keys).sort();
});
</script>
