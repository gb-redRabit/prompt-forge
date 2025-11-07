<template>
  <div class="flex gap-6 p-8">
    <!-- LEFT COLUMN: Filters -->
    <aside
      class="w-90 flex-shrink-0 overflow-y-auto space-y-4 h-[calc(100vh-6rem)]"
    >
      <!-- Type Filter -->
      <GlassCard padding="md">
        <template #header>
          <h3
            v-once
            class="text-sm font-semibold text-gray-900 dark:text-white"
          >
            {{ $t("pages.templates.types") }}
          </h3>
        </template>

        <div class="space-y-2">
          <GlassButton
            v-for="{ type, count } in availableTypes"
            :key="type"
            :variant="selectedType === type ? 'solid' : 'outline'"
            :color="selectedType === type ? 'primary' : 'neutral'"
            full-width
            size="sm"
            @click="toggleType(type)"
          >
            <div class="flex items-center justify-between w-full">
              <span>{{ type }}</span>
              <GlassBadge
                :color="selectedType === type ? 'secondary' : 'neutral'"
                variant="soft"
                size="xs"
              >
                {{ count }}
              </GlassBadge>
            </div>
          </GlassButton>

          <GlassButton
            v-if="selectedType"
            color="neutral"
            variant="ghost"
            full-width
            size="xs"
            icon="i-heroicons-x-mark"
            @click="clearType"
          >
            Wyczyść
          </GlassButton>
        </div>
      </GlassCard>

      <!-- Category/Tags Tabs -->
      <GlassCard padding="md">
        <template #header>
          <div class="flex gap-2">
            <GlassButton
              :variant="filterMode === 'categories' ? 'solid' : 'soft'"
              :color="filterMode === 'categories' ? 'primary' : 'neutral'"
              size="sm"
              class="flex-1"
              @click="filterMode = 'categories'"
            >
              {{ $t("pages.templates.categories") }}
            </GlassButton>
            <GlassButton
              :variant="filterMode === 'tags' ? 'solid' : 'soft'"
              :color="filterMode === 'tags' ? 'primary' : 'neutral'"
              size="sm"
              class="flex-1"
              @click="filterMode = 'tags'"
            >
              {{ $t("pages.templates.tags") }}
            </GlassButton>
          </div>
        </template>

        <!-- Categories View -->
        <div v-if="filterMode === 'categories'">
          <div class="flex flex-wrap gap-1">
            <GlassBadge
              v-for="{ category, count } in availableCategories"
              :key="category"
              :color="
                selectedCategories.includes(category) ? 'primary' : 'neutral'
              "
              :variant="
                selectedCategories.includes(category) ? 'solid' : 'soft'
              "
              size="md"
              :removable="selectedCategories.includes(category)"
              class="cursor-pointer hover:opacity-80 transition-opacity"
              @click="toggleCategory(category)"
            >
              {{ category }} ({{ count }})
            </GlassBadge>
          </div>
        </div>

        <!-- Tags View -->
        <div v-else class="space-y-3">
          <!-- Tag Search -->
          <UInput
            v-model="tagSearch"
            :placeholder="$t('pages.templates.search_tags')"
            icon="i-heroicons-magnifying-glass"
            size="sm"
          />

          <!-- Tags List -->
          <div class="overflow-y-auto">
            <div class="flex flex-wrap gap-2">
              <GlassBadge
                v-for="{ tag, count } in filteredTagsWithCounts"
                :key="tag"
                :color="selectedTags.includes(tag) ? 'primary' : 'neutral'"
                :variant="selectedTags.includes(tag) ? 'solid' : 'soft'"
                size="sm"
                :removable="selectedTags.includes(tag)"
                class="cursor-pointer hover:opacity-80 transition-opacity"
                @click="toggleTag(tag)"
              >
                #{{ tag }} ({{ count }})
              </GlassBadge>
            </div>
          </div>

          <p
            v-if="hiddenTagsCount > 0"
            class="text-xs text-gray-500 dark:text-gray-400 text-center pt-2"
          >
            {{ $t("pages.templates.hidden_tags", { count: hiddenTagsCount }) }}
          </p>
        </div>

        <template #footer v-if="hasActiveFilters">
          <GlassButton
            color="neutral"
            variant="ghost"
            full-width
            size="xs"
            icon="i-heroicons-x-mark"
            @click="resetFilters"
          >
            {{ $t("pages.templates.reset_filters") }}
          </GlassButton>
        </template>
      </GlassCard>
    </aside>

    <!-- RIGHT COLUMN: Templates -->
    <main class="flex-1 flex flex-col">
      <!-- Toolbar -->
      <div
        class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"
      >
        <!-- Left: Sort & Count -->
        <div class="flex items-center gap-3">
          <!-- Sort by ID -->
          <GlassButton
            :variant="sortBy === 'id' ? 'solid' : 'outline'"
            :color="sortBy === 'id' ? 'primary' : 'neutral'"
            size="sm"
            :icon="
              sortBy === 'id'
                ? sortOrder === 'asc'
                  ? 'i-heroicons-arrow-up'
                  : 'i-heroicons-arrow-down'
                : undefined
            "
            icon-position="right"
            @click="toggleSort('id')"
          >
            ID
          </GlassButton>

          <!-- Sort by Name -->
          <GlassButton
            :variant="sortBy === 'name' ? 'solid' : 'outline'"
            :color="sortBy === 'name' ? 'primary' : 'neutral'"
            size="sm"
            :icon="
              sortBy === 'name'
                ? sortOrder === 'asc'
                  ? 'i-heroicons-arrow-up'
                  : 'i-heroicons-arrow-down'
                : undefined
            "
            icon-position="right"
            @click="toggleSort('name')"
          >
            A-Z
          </GlassButton>

          <!-- Count -->
          <div class="text-sm text-gray-600 dark:text-gray-400 ml-2">
            <span class="font-medium">{{ displayedPrompts.length }}</span>
            {{ $t("pages.templates.of") }}
            <span class="font-medium">{{ totalCount }}</span>
          </div>
        </div>
        <!-- Search -->
        <UInput
          v-model="searchQuery"
          :placeholder="$t('pages.templates.search')"
          icon="i-heroicons-magnifying-glass"
          size="lg"
          class="w-1/3"
        />
        <!-- Right: View Mode -->
        <div class="flex items-center gap-2">
          <GlassButton
            :variant="viewMode === 'list' ? 'solid' : 'outline'"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            size="sm"
            icon="i-heroicons-list-bullet"
            @click="viewMode = 'list'"
          />
          <GlassButton
            :variant="viewMode === 'grid-2' ? 'solid' : 'outline'"
            :color="viewMode === 'grid-2' ? 'primary' : 'neutral'"
            size="sm"
            @click="viewMode = 'grid-2'"
          >
            2
          </GlassButton>
          <GlassButton
            :variant="viewMode === 'grid-3' ? 'solid' : 'outline'"
            :color="viewMode === 'grid-3' ? 'primary' : 'neutral'"
            size="sm"
            @click="viewMode = 'grid-3'"
          >
            3
          </GlassButton>
          <GlassButton
            :variant="viewMode === 'grid-4' ? 'solid' : 'outline'"
            :color="viewMode === 'grid-4' ? 'primary' : 'neutral'"
            size="sm"
            @click="viewMode = 'grid-4'"
          >
            4
          </GlassButton>
        </div>
      </div>

      <!-- Templates Grid/List -->
      <div class="flex-1">
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="space-y-4">
          <TemplateListItem
            v-for="template in displayedPrompts"
            :key="template.id"
            :template="template"
            @select="handleSelectTemplate"
          />
        </div>

        <!-- Grid View -->
        <div
          v-else
          class="grid gap-6"
          :class="{
            'grid-cols-1 md:grid-cols-2': viewMode === 'grid-2',
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': viewMode === 'grid-3',
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
              viewMode === 'grid-4',
          }"
        >
          <TemplateCard
            v-for="template in displayedPrompts"
            :key="template.id"
            :template="template"
            :show-preview="true"
            @select="handleSelectTemplate"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="displayedPrompts.length === 0 && !isLoading"
          class="text-center py-12"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
          />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ $t("pages.templates.empty.title") }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t("pages.templates.empty.description") }}
          </p>
        </div>

        <!-- Loader -->
        <div
          v-if="isLoading && hasMore"
          class="grid gap-6 mt-6"
          :class="getGridClass"
        >
          <TemplateSkeleton v-for="i in 4" :key="i" />
        </div>

        <!-- End -->
        <div
          v-if="!hasMore && displayedPrompts.length > 0"
          class="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          {{ $t("pages.templates.no_more") }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
import TemplateCard from "~/components/templates/TemplateCard.vue";
import TemplateListItem from "~/components/templates/TemplateListItem.vue";
import TemplateSkeleton from "~/components/templates/TemplateSkeleton.vue";

const {
  displayedPrompts,
  searchQuery,
  selectedCategories,
  selectedTags,
  availableCategories,
  availableTags,
  availableTypes,
  hasMore,
  loadMore,
  totalCount,
  sortBy,
  sortOrder,
  selectedType,
} = useTemplates();

const { isLoading } = useInfiniteScroll(loadMore, { threshold: 400 });

// UI State
const filterMode = ref<"categories" | "tags">("categories");
const viewMode = ref<"list" | "grid-2" | "grid-3" | "grid-4">("grid-3");
const tagSearch = ref("");

// Filtered tags for search
const filteredTagsWithCounts = computed(() => {
  let tags = availableTags.value;

  if (tagSearch.value) {
    const query = tagSearch.value.toLowerCase();
    tags = tags.filter((item) => item.tag.toLowerCase().includes(query));
  }

  const selected = tags.filter((item) => selectedTags.value.includes(item.tag));
  const unselected = tags
    .filter((item) => !selectedTags.value.includes(item.tag))
    .slice(0, 50);

  return [...selected, ...unselected];
});

const hiddenTagsCount = computed(() => {
  return Math.max(
    0,
    availableTags.value.length - filteredTagsWithCounts.value.length
  );
});

const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    selectedTags.value.length > 0 ||
    selectedType.value !== null ||
    searchQuery.value.length > 0
  );
});

const getGridClass = computed(() => {
  if (viewMode.value === "grid-2") return "grid-cols-1 md:grid-cols-2";
  if (viewMode.value === "grid-3")
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  if (viewMode.value === "grid-4")
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  return "";
});

// Actions
const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category);
  if (index === -1) {
    selectedCategories.value.push(category);
  } else {
    selectedCategories.value.splice(index, 1);
  }
};

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

const toggleType = (type: string) => {
  selectedType.value = selectedType.value === type ? null : type;
};

const clearType = () => {
  selectedType.value = null;
};

const toggleSort = (field: "id" | "name") => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "asc";
  }
};

const resetFilters = () => {
  selectedCategories.value = [];
  selectedTags.value = [];
  selectedType.value = null;
  searchQuery.value = "";
  tagSearch.value = "";
};

const handleSelectTemplate = (template: any) => {
  navigateTo({
    path: "/prompts",
    query: {
      templateId: template.id,
    },
  });
};
</script>
