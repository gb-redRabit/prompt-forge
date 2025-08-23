<template>
  <div class="container mx-auto p-4 flex flex-row gap-8">
    <!-- Lewy panel: przyciski -->
    <div class="flex flex-col gap-4 md:w-1/6">
      <button
        v-for="type in types"
        :key="type.key"
        class="btn btn-outline w-full"
        :class="{ 'btn-primary': selectedType === type.key }"
        @click="
          () => {
            selectedType = type.key;
            selectedTags = [];
            searchQuery = '';
          }
        "
      >
        {{ $t(type.label) }}
      </button>
      <PromptTags
        :tags="sortedTagsWithCount"
        :selectedTags="selectedTags"
        @toggle="toggleTag"
        @clear="clearTag"
      />
    </div>
    <!-- Prawy panel: lista promptów -->
    <div class="flex-1">
      <div class="mb-4 flex justify-between items-center">
        <input
          v-model="searchQuery"
          type="search"
          class="input input-bordered w-full max-w-xs"
          :placeholder="$t('prompts.searchPlaceholder')"
        />
        <div class="flex justify-end mb-4">
          <button class="btn btn-info" @click="showPlaceholders = true">
            {{ $t("prompts.showPlaceholders") }}
          </button>
        </div>
      </div>
      <h2 class="text-2xl font-bold mb-4">
        {{ $t(types.find((t) => t.key === selectedType).label) }}
      </h2>
      <MasonryWall
        :items="filteredPrompts"
        :column-width="330"
        :gap="24"
        v-slot="{ item }"
        class="w-full"
      >
        <PromptCard :prompt="item" />
      </MasonryWall>
      <div
        v-if="filteredPrompts.length === 0"
        class="text-center text-base-content/60 mt-8"
        style="width: 100%"
      >
        {{ $t("prompts.empty") }}
      </div>
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
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePromptsStore } from "../store/index";
import PromptTags from "../components/PromptTags.vue";
import PromptCard from "../components/PromptCard.vue";
import MasonryWall from "@yeger/vue-masonry-wall";

const types = [
  { key: "text", label: "prompts.types.text" },
  { key: "video", label: "prompts.types.video" },
  { key: "audio", label: "prompts.types.audio" },
  { key: "image", label: "prompts.types.image" },
];

const promptsStore = usePromptsStore();
const route = useRoute();
const router = useRouter();

const selectedType = ref("text");
const selectedTags = ref([]);
const showPlaceholders = ref(false);
const searchQuery = ref(route.query.search || "");

// Synchronizuj searchQuery z query w URL
watch(
  () => route.query.search,
  (val) => {
    searchQuery.value = val || "";
  }
);

watch(searchQuery, (val) => {
  router.replace({ query: { ...route.query, search: val } });
});

// Dynamicznie wyliczaj dostępne tagi na podstawie już wybranych tagów ORAZ liczność promptów dla każdego tagu
const sortedTagsWithCount = computed(() => {
  const prompts = Array.isArray(
    promptsStore.getPromptsByType(selectedType.value)
  )
    ? promptsStore.getPromptsByType(selectedType.value)
    : [];
  let filteredPrompts = prompts;
  if (selectedTags.value.length) {
    filteredPrompts = prompts.filter((p) =>
      selectedTags.value.every((tag) => (p.tags || []).includes(tag))
    );
  }
  // Zlicz wystąpienia tagów
  const tagCounts = {};
  filteredPrompts.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  // Dodaj zawsze wybrane tagi (nawet jeśli nie ma ich już w przefiltrowanych)
  selectedTags.value.forEach((tag) => {
    if (!(tag in tagCounts)) tagCounts[tag] = 0;
  });
  // Zwróć tablicę obiektów { tag, count }
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
});

// Filtrowanie promptów po wybranych tagach i wyszukiwaniu
const filteredPrompts = computed(() => {
  // Zawsze wymuszaj tablicę!
  const prompts = Array.isArray(
    promptsStore.getPromptsByType(selectedType.value)
  )
    ? promptsStore.getPromptsByType(selectedType.value)
    : [];
  let result = prompts;
  if (selectedTags.value.length) {
    result = result.filter((p) =>
      selectedTags.value.every((tag) => (p.tags || []).includes(tag))
    );
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    result = result.filter((p) => {
      const name =
        typeof p.name === "object" ? Object.values(p.name).join(" ") : p.name;
      const desc =
        typeof p.description === "object"
          ? Object.values(p.description).join(" ")
          : p.description;
      return (
        (name && name.toLowerCase().includes(q)) ||
        (desc && desc.toLowerCase().includes(q))
      );
    });
  }
  return result;
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
  searchQuery.value = "";
}

// Placeholdery ze wszystkich plików prompts przez store
const allPlaceholderKeys = computed(() => promptsStore.allPlaceholderKeys);
</script>
