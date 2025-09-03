<template>
  <div class="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
    <!-- Lewy panel -->
    <aside class="flex flex-col gap-4 lg:w-1/5">
      <!-- Typy -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2">
        <button
          v-for="type in types"
          :key="type.key"
          class="btn btn-outline btn-sm justify-start"
          :class="{ 'btn-primary': selectedType === type.key }"
          @click="selectType(type.key)"
        >
          {{ $t(type.label) }}
        </button>
      </div>

      <!-- Wyszukiwanie tagów -->
      <input
        v-model="tagSearch"
        type="text"
        class="input input-bordered input-sm w-full"
        :placeholder="$t('prompts.tagSearchPlaceholder')"
      />

      <!-- Sortowanie -->
      <label class="form-control w-full">
        <div class="label py-1">
          <span class="label-text text-xs font-semibold">
            {{ $t('prompts.sortLabel') }}
          </span>
        </div>
        <select
          v-model="sortMode"
            class="select select-bordered select-xs w-full"
        >
          <option value="alpha">
            {{ $t('prompts.sort.alphabetical') }}
          </option>
          <option value="count">
            {{ $t('prompts.sort.tagCount') }}
          </option>
        </select>
      </label>

      <!-- Tag cloud -->
      <PromptTags
        :tags="filteredTagsWithCount"
        :selectedTags="selectedTags"
        @toggle="toggleTag"
        @clear="clearTag"
      />
    </aside>

    <!-- Prawy panel -->
    <div class="flex-1 flex flex-col">
      <!-- Pasek narzędzi -->
      <div
        class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="font-semibold">
            {{ $t('prompts.resultsCount') }}: {{ filteredPrompts.length }}
          </span>
          <span v-if="selectedTags.length" class="opacity-70">
            {{ $t('prompts.activeFilters') }}: {{ selectedTags.length }}
          </span>
          <button
            v-if="hasAnyFilter"
            class="btn btn-ghost btn-xs"
            @click="resetFilters"
          >
            {{ $t('prompts.clearFilters') }}
          </button>
        </div>
        <div class="flex gap-2 items-center">
          <div class="join">
            <button
              class="btn btn-xs join-item"
              :class="layoutMode === 'grid' ? 'btn-primary' : 'btn-outline'"
              @click="setLayout('grid')"
              :title="$t('prompts.view.grid')"
            >
              ⬚
            </button>
            <button
              class="btn btn-xs join-item"
              :class="layoutMode === 'list' ? 'btn-primary' : 'btn-outline'"
              @click="setLayout('list')"
              :title="$t('prompts.view.list')"
            >
              ≣
            </button>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            class="input input-bordered input-sm w-48"
            :placeholder="$t('prompts.searchPlaceholder')"
          />
          <button
            class="btn btn-info btn-xs"
            @click="showPlaceholders = true"
          >
            {{ $t('prompts.showPlaceholders') }}
          </button>
        </div>
      </div>

      <!-- Wybrane tagi -->
      <div
        v-if="selectedTags.length"
        class="flex flex-wrap gap-2 mb-4"
      >
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="badge badge-primary gap-1 cursor-pointer"
          @click="toggleTag(tag)"
        >
          {{ tag }} ✕
        </span>
      </div>

      <h2 class="text-2xl font-bold mb-4">
        {{ $t(types.find((t) => t.key === selectedType).label) }}
      </h2>

      <!-- Lista / Grid -->
      <div v-if="layoutMode === 'grid'">
        <MasonryWall
          :items="filteredPrompts"
          :column-width="330"
          :gap="24"
          v-slot="{ item }"
          class="w-full"
        >
          <PromptCard :prompt="item" />
        </MasonryWall>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="p in filteredPrompts"
          :key="p.id || p.name?.en || p.name"
          class="p-4 rounded-xl bg-base-200 border border-base-300/40 flex flex-col gap-2"
        >
          <div class="flex items-center justify-between gap-4">
            <h3 class="font-semibold">
              {{ p.name?.[locale] || p.name?.en || p.name }}
            </h3>
            <PromptCard :prompt="p" />
          </div>
          <p class="text-xs opacity-70">
            {{ p.description?.[locale] || p.description?.en }}
          </p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in p.tags || p.tags_ids"
              :key="tag"
              class="badge badge-outline badge-xs"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="!filteredPrompts.length"
        class="text-center text-base-content/60 mt-10"
      >
        <p class="mb-2">{{ $t('prompts.empty') }}</p>
        <button
          v-if="hasAnyFilter"
          class="btn btn-sm btn-outline"
          @click="resetFilters"
        >
          {{ $t('prompts.clearFilters') }}
        </button>
      </div>

      <!-- Modal Placeholderów -->
      <dialog v-if="showPlaceholders" class="modal modal-open">
        <div class="modal-box max-w-2xl">
          <h3 class="font-bold text-lg mb-4">
            {{ $t("prompts.allPlaceholders") }}
          </h3>
            <div class="max-h-96 overflow-y-auto">
              <ul class="columns-2 md:columns-3 text-sm">
                <li
                  v-for="key in allPlaceholderKeys"
                  :key="key"
                  class="mb-1 break-inside-avoid"
                >
                  <span class="font-semibold">{{ key }}</span>
                </li>
              </ul>
            </div>
          <div class="modal-action">
            <button class="btn btn-sm" @click="showPlaceholders = false">
              {{ $t("close") }}
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showPlaceholders = false">close</button>
        </form>
      </dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { usePromptsStore } from "../store/index";
import PromptTags from "../components/PromptTags.vue";
import PromptCard from "../components/PromptCard.vue";
import MasonryWall from "@yeger/vue-masonry-wall";

const { locale } = useI18n();
const promptsStore = usePromptsStore();
const route = useRoute();
const router = useRouter();

const types = [
  { key: "text", label: "prompts.types.text" },
  { key: "video", label: "prompts.types.video" },
  { key: "audio", label: "prompts.types.audio" },
  { key: "image", label: "prompts.types.image" },
];

const selectedType = ref(route.query.type || "text");
const selectedTags = ref(
  route.query.tags ? String(route.query.tags).split(",").filter(Boolean) : []
);
const showPlaceholders = ref(false);
const searchQuery = ref(route.query.search || "");
const tagSearch = ref(route.query.tagSearch || "");
const layoutMode = ref(route.query.view === "list" ? "list" : "grid");
const sortMode = ref(route.query.sort || "alpha");

const hasAnyFilter = computed(
  () =>
    !!searchQuery.value ||
    !!selectedTags.value.length ||
    tagSearch.value ||
    layoutMode.value !== "grid" ||
    sortMode.value !== "alpha"
);

function syncQuery() {
  const q = {
    type: selectedType.value,
  };
  if (searchQuery.value) q.search = searchQuery.value;
  if (selectedTags.value.length) q.tags = selectedTags.value.join(",");
  if (tagSearch.value) q.tagSearch = tagSearch.value;
  if (layoutMode.value !== "grid") q.view = layoutMode.value;
  if (sortMode.value !== "alpha") q.sort = sortMode.value;
  router.replace({ query: q });
}

watch(
  [selectedType, selectedTags, searchQuery, tagSearch, layoutMode, sortMode],
  syncQuery,
  { deep: true }
);

// Wybór typu resetuje tagi
function selectType(t) {
  selectedType.value = t;
  selectedTags.value = [];
}

function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
}
function clearTag() {
  selectedTags.value = [];
  tagSearch.value = "";
}
function resetFilters() {
  selectedTags.value = [];
  searchQuery.value = "";
  tagSearch.value = "";
  layoutMode.value = "grid";
  sortMode.value = "alpha";
}

function setLayout(m) {
  layoutMode.value = m;
}

// Tag counts + filtrowanie tagów przez szukanie
const filteredTagsWithCount = computed(() => {
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
  const tagCounts = {};
  filteredPrompts.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      if (tagSearch.value && !tag.toLowerCase().includes(tagSearch.value.toLowerCase())) return;
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  selectedTags.value.forEach((tag) => {
    if (!(tag in tagCounts)) tagCounts[tag] = 0;
  });

  let arr = Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));
  if (sortMode.value === "count") {
    arr.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  } else {
    arr.sort((a, b) => a.tag.localeCompare(b.tag));
  }
  return arr;
});

// Prompty po filtrach
const filteredPrompts = computed(() => {
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

// Placeholdery
const allPlaceholderKeys = computed(() => promptsStore.allPlaceholderKeys);
</script>
