<template>
  <div
    class="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-3 md:p-4 lg:p-8"
  >
    <!-- LEFT COLUMN: Filters (hidden on mobile) -->
    <aside
      class="hidden lg:block w-90 flex-shrink-0 overflow-y-auto space-y-4 h-[calc(100vh-6rem)]"
    >
      <!-- Type Filter -->
      <GlassCard padding="md">
        <template #header>
          <h3
            v-once
            class="text-sm font-semibold text-gray-900 dark:text-white"
          >
            {{ t("pages.templates.types") }}
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
              {{ t("pages.templates.categories") }}
            </GlassButton>
            <GlassButton
              :variant="filterMode === 'tags' ? 'solid' : 'soft'"
              :color="filterMode === 'tags' ? 'primary' : 'neutral'"
              size="sm"
              class="flex-1"
              @click="filterMode = 'tags'"
            >
              {{ t("pages.templates.tags") }}
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
            :placeholder="t('pages.templates.search_tags')"
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
            {{ t("pages.templates.hidden_tags", { count: hiddenTagsCount }) }}
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
            {{ t("pages.templates.reset_filters") }}
          </GlassButton>
        </template>
      </GlassCard>
    </aside>

    <!-- RIGHT COLUMN: Templates -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Toolbar -->
      <div
        class="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700"
      >
        <!-- Top row: Search -->
        <UInput
          v-model="searchQuery"
          :placeholder="t('pages.templates.search')"
          icon="i-heroicons-magnifying-glass"
          size="md"
          class="w-full"
        />

        <!-- Bottom row: Filters (mobile), Sort, Count & View Mode -->
        <div class="flex items-center justify-between gap-2">
          <!-- Left: Filters button (mobile only) + Sort & Count -->
          <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <!-- Mobile Filters Button -->
            <GlassButton
              color="primary"
              variant="outline"
              size="xs"
              icon="i-heroicons-adjustments-horizontal"
              class="lg:hidden flex-shrink-0"
              @click="showFiltersModal = true"
            >
              <span class="hidden sm:inline">{{
                t("pages.templates.show_filters")
              }}</span>
              <GlassBadge
                v-if="activeFiltersCount > 0"
                color="primary"
                variant="solid"
                size="xs"
                class="ml-1 sm:ml-2"
              >
                {{ activeFiltersCount }}
              </GlassBadge>
            </GlassButton>

            <!-- Sort by ID -->
            <GlassButton
              :variant="sortBy === 'id' ? 'solid' : 'outline'"
              :color="sortBy === 'id' ? 'primary' : 'neutral'"
              size="xs"
              class="text-xs"
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
              <span class="hidden sm:inline">ID</span>
            </GlassButton>

            <!-- Sort by Name -->
            <GlassButton
              :variant="sortBy === 'name' ? 'solid' : 'outline'"
              :color="sortBy === 'name' ? 'primary' : 'neutral'"
              size="xs"
              class="text-xs"
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
            <div
              class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate"
            >
              <span class="font-medium">{{ displayedPrompts.length }}</span>
              <span class="hidden sm:inline">
                {{ t("pages.templates.of") }}</span
              >
              <span class="sm:hidden">/</span>
              <span class="font-medium">{{ totalCount }}</span>
            </div>
          </div>

          <!-- Right: View Mode (hide grid numbers on mobile) -->
          <div
            class="hidden lg:flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
          >
            <GlassButton
              :variant="viewMode === 'list' ? 'solid' : 'outline'"
              :color="viewMode === 'list' ? 'primary' : 'neutral'"
              size="xs"
              icon="i-heroicons-list-bullet"
              @click="viewMode = 'list'"
            />
            <GlassButton
              :variant="viewMode === 'grid-2' ? 'solid' : 'outline'"
              :color="viewMode === 'grid-2' ? 'primary' : 'neutral'"
              size="xs"
              class="hidden sm:inline-flex"
              @click="viewMode = 'grid-2'"
            >
              2
            </GlassButton>
            <GlassButton
              :variant="viewMode === 'grid-3' ? 'solid' : 'outline'"
              :color="viewMode === 'grid-3' ? 'primary' : 'neutral'"
              size="xs"
              @click="viewMode = 'grid-3'"
            >
              <span class="hidden sm:inline">3</span>
              <span class="sm:hidden">●●●</span>
            </GlassButton>
            <GlassButton
              :variant="viewMode === 'grid-4' ? 'solid' : 'outline'"
              :color="viewMode === 'grid-4' ? 'primary' : 'neutral'"
              size="xs"
              class="hidden sm:inline-flex"
              @click="viewMode = 'grid-4'"
            >
              4
            </GlassButton>
          </div>
        </div>
      </div>

      <!-- Templates Grid/List -->
      <div class="flex-1">
        <!-- List View -->
        <div
          v-if="viewMode === 'list'"
          class="space-y-2 sm:space-y-3 md:space-y-4"
        >
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
          class="grid gap-3 sm:gap-4 md:gap-6"
          :class="{
            'grid-cols-1 sm:grid-cols-2': viewMode === 'grid-2',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': viewMode === 'grid-3',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
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
          class="text-center py-8 sm:py-12 px-4"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 dark:text-gray-600 mb-3 sm:mb-4"
          />
          <h3
            class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2"
          >
            {{ t("pages.templates.empty.title") }}
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {{ t("pages.templates.empty.description") }}
          </p>
        </div>

        <!-- Loader -->
        <div
          v-if="isLoading && hasMore"
          class="grid gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6"
          :class="getGridClass"
        >
          <TemplateSkeleton v-for="i in 4" :key="i" />
        </div>

        <!-- End -->
        <div
          v-if="!hasMore && displayedPrompts.length > 0"
          class="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500 dark:text-gray-400"
        >
          {{ t("pages.templates.no_more") }}
        </div>
      </div>
    </main>

    <!-- MOBILE: Filters Modal (full screen) -->
    <UModal
      v-model:open="showFiltersModal"
      fullscreen
      :title="t('pages.templates.filters')"
      :description="t('pages.templates.filters_description')"
    >
      <template #content>
        <div
          class="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <!-- Compact Header -->
          <div
            class="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
          >
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-adjustments-horizontal"
                class="w-5 h-5 text-primary-500"
              />
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ t("pages.templates.filters") }}
              </h2>
              <GlassBadge
                v-if="activeFiltersCount > 0"
                color="primary"
                variant="solid"
                size="sm"
              >
                {{ activeFiltersCount }}
              </GlassBadge>
            </div>
            <GlassButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark"
              @click="showFiltersModal = false"
            />
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto px-4 py-4">
            <div class="max-w-2xl mx-auto space-y-4">
              <!-- Type Filter Section -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h3
                    class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                  >
                    {{ t("pages.templates.types") }}
                  </h3>
                  <GlassButton
                    v-if="selectedType"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-x-mark"
                    @click="clearType"
                  >
                    {{ t("pages.templates.clear") }}
                  </GlassButton>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <GlassButton
                    v-for="{ type, count } in availableTypes"
                    :key="type"
                    :variant="selectedType === type ? 'solid' : 'outline'"
                    :color="selectedType === type ? 'primary' : 'neutral'"
                    size="sm"
                    @click="toggleType(type)"
                    class="justify-between"
                  >
                    <span class="truncate">{{ type }}</span>
                    <GlassBadge
                      :color="selectedType === type ? 'secondary' : 'neutral'"
                      variant="soft"
                      size="xs"
                    >
                      {{ count }}
                    </GlassBadge>
                  </GlassButton>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-200 dark:border-gray-700"></div>

              <!-- Category/Tags Toggle -->
              <div
                class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <button
                  @click="filterMode = 'categories'"
                  class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all"
                  :class="
                    filterMode === 'categories'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  "
                >
                  {{ t("pages.templates.categories") }}
                </button>
                <button
                  @click="filterMode = 'tags'"
                  class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all"
                  :class="
                    filterMode === 'tags'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  "
                >
                  {{ t("pages.templates.tags") }}
                </button>
              </div>

              <!-- Categories View -->
              <div v-if="filterMode === 'categories'" class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3
                    class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                  >
                    {{ t("pages.templates.categories") }}
                  </h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ selectedCategories.length }}
                    {{ t("pages.templates.selected") }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <GlassBadge
                    v-for="{ category, count } in availableCategories"
                    :key="category"
                    :color="
                      selectedCategories.includes(category)
                        ? 'primary'
                        : 'neutral'
                    "
                    :variant="
                      selectedCategories.includes(category) ? 'solid' : 'soft'
                    "
                    size="md"
                    :removable="selectedCategories.includes(category)"
                    class="cursor-pointer hover:scale-105 transition-transform"
                    @click="toggleCategory(category)"
                  >
                    {{ category }} <span class="opacity-70">({{ count }})</span>
                  </GlassBadge>
                </div>
              </div>

              <!-- Tags View -->
              <div v-else class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3
                    class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                  >
                    {{ t("pages.templates.tags") }}
                  </h3>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ selectedTags.length }}
                    {{ t("pages.templates.selected") }}
                  </span>
                </div>

                <!-- Tag Search -->
                <UInput
                  v-model="tagSearch"
                  :placeholder="t('pages.templates.search_tags')"
                  icon="i-heroicons-magnifying-glass"
                  size="md"
                  class="w-full"
                />

                <!-- Selected Tags (if any) -->
                <div v-if="selectedTags.length > 0" class="space-y-2">
                  <p
                    class="text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("pages.templates.selected") }}:
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <GlassBadge
                      v-for="tag in selectedTags"
                      :key="`selected-${tag}`"
                      color="primary"
                      variant="solid"
                      size="sm"
                      removable
                      class="cursor-pointer"
                      @click="toggleTag(tag)"
                    >
                      #{{ tag }}
                    </GlassBadge>
                  </div>
                </div>

                <!-- Available Tags -->
                <div class="space-y-2">
                  <p
                    class="text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("pages.templates.available") }}:
                  </p>
                  <div class="max-h-64 overflow-y-auto pr-2">
                    <div class="flex flex-wrap gap-2">
                      <GlassBadge
                        v-for="{ tag, count } in filteredTagsWithCounts.filter(
                          (t) => !selectedTags.includes(t.tag)
                        )"
                        :key="tag"
                        color="neutral"
                        variant="soft"
                        size="sm"
                        class="cursor-pointer hover:scale-105 transition-transform"
                        @click="toggleTag(tag)"
                      >
                        #{{ tag }} <span class="opacity-70">({{ count }})</span>
                      </GlassBadge>
                    </div>
                  </div>
                </div>

                <p
                  v-if="hiddenTagsCount > 0"
                  class="text-xs text-gray-500 dark:text-gray-400 text-center italic"
                >
                  {{
                    t("pages.templates.hidden_tags", { count: hiddenTagsCount })
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Sticky Footer with Actions -->
          <div
            class="px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10"
          >
            <div class="max-w-2xl mx-auto flex gap-2">
              <GlassButton
                v-if="hasActiveFilters"
                color="neutral"
                variant="outline"
                icon="i-heroicons-x-mark"
                @click="resetFilters"
                class="flex-1"
              >
                {{ t("pages.templates.reset_filters") }}
              </GlassButton>
              <GlassButton
                color="primary"
                variant="solid"
                icon="i-heroicons-check"
                @click="showFiltersModal = false"
                :class="hasActiveFilters ? 'flex-1' : 'w-full'"
              >
                {{ t("pages.templates.apply_filters") }}
                <GlassBadge
                  v-if="activeFiltersCount > 0"
                  color="secondary"
                  variant="solid"
                  size="xs"
                  class="ml-2"
                >
                  {{ activeFiltersCount }}
                </GlassBadge>
              </GlassButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
import TemplateCard from "~/components/templates/TemplateCard.vue";
import TemplateListItem from "~/components/templates/TemplateListItem.vue";
import TemplateSkeleton from "~/components/templates/TemplateSkeleton.vue";

const { t } = useI18n();

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
const showFiltersModal = ref(false);

// Active filters count for mobile badge
const activeFiltersCount = computed(() => {
  let count = 0;
  if (selectedType.value) count++;
  count += selectedCategories.value.length;
  count += selectedTags.value.length;
  return count;
});

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
