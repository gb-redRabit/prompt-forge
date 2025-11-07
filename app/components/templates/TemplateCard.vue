<template>
  <GlassCard
    hover
    shadow
    class="cursor-pointer group transition-all duration-200"
    padding="lg"
    @click="$emit('select', template)"
  >
    <!-- Typ i ID -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <GlassBadge
          v-if="template.type"
          color="secondary"
          variant="soft"
          size="xs"
        >
          {{ template.type }}
        </GlassBadge>
        <GlassBadge v-if="template.id" color="neutral" variant="soft" size="xs">
          #{{ template.id }}
        </GlassBadge>
      </div>
    </div>

    <!-- Nazwa -->
    <h3
      class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
    >
      {{ translatedName }}
    </h3>

    <!-- Opis -->
    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
      {{ translatedDescription }}
    </p>

    <!-- Kategorie - dynamiczne, znikają gdy brak -->
    <div v-if="visibleCategories.length > 0" class="flex flex-wrap gap-1 mb-3">
      <GlassBadge
        v-for="category in visibleCategories"
        :key="category"
        color="primary"
        variant="soft"
        size="xs"
      >
        {{ category }}
      </GlassBadge>
      <GlassBadge
        v-if="hasMoreCategories"
        color="primary"
        variant="soft"
        size="xs"
      >
        +{{ remainingCategoriesCount }}
      </GlassBadge>
    </div>

    <!-- Tagi - dynamiczne, znikają gdy brak -->
    <div v-if="visibleTags.length > 0" class="flex flex-wrap gap-1 mb-4">
      <GlassBadge
        v-for="tag in visibleTags"
        :key="tag"
        color="neutral"
        variant="outline"
        size="xs"
      >
        #{{ tag }}
      </GlassBadge>
      <GlassBadge
        v-if="hasMoreTags"
        color="neutral"
        variant="outline"
        size="xs"
      >
        +{{ remainingTagsCount }}
      </GlassBadge>
    </div>

    <!-- Preview - dynamiczny, znika gdy brak template -->
    <div
      v-if="showPreview && hasTemplate"
      class="bg-gray-50 dark:bg-gray-900/50 rounded p-3 mb-4 border border-gray-200 dark:border-gray-700"
    >
      <p
        v-once
        class="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium"
      >
        {{ $t("pages.templates.preview") }}
      </p>
      <p
        class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 font-mono whitespace-pre-wrap"
      >
        {{ previewText }}
      </p>
    </div>

    <!-- Placeholder keys - dynamiczne, znikają gdy brak -->
    <div v-if="visiblePlaceholders.length > 0" class="mb-4">
      <p
        v-once
        class="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium"
      >
        {{ $t("pages.templates.placeholders") }}
      </p>
      <div class="flex flex-wrap gap-1">
        <GlassBadge
          v-for="key in visiblePlaceholders"
          :key="key"
          color="primary"
          variant="soft"
          size="xs"
        >
          {{ key }}
        </GlassBadge>
        <GlassBadge
          v-if="hasMorePlaceholders"
          color="primary"
          variant="soft"
          size="xs"
        >
          +{{ remainingPlaceholdersCount }}
        </GlassBadge>
      </div>
    </div>

    <!-- Akcje -->
    <div
      class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700"
    >
      <div v-once class="text-xs text-gray-500 dark:text-gray-500">
        {{ $t("pages.templates.use_template") }}
      </div>
      <UIcon
        name="i-heroicons-arrow-right"
        class="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
      />
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import type { Prompt } from "~/types/content";

const props = withDefaults(
  defineProps<{
    template: Prompt;
    showPreview?: boolean;
  }>(),
  {
    showPreview: true,
  }
);

defineEmits<{
  select: [template: Prompt];
}>();

const { locale } = useI18n();

// Memoizuj tłumaczenia
const translatedName = computed(() => {
  if (!props.template.name) return "Untitled";
  return locale.value === "pl"
    ? props.template.name.pl
    : props.template.name.en;
});

const translatedDescription = computed(() => {
  if (!props.template.description) return "";
  return locale.value === "pl"
    ? props.template.description.pl
    : props.template.description.en;
});

// Kategorie - dynamiczne
const MAX_CATEGORIES = 3;
const visibleCategories = computed(() => {
  return props.template.categories?.slice(0, MAX_CATEGORIES) || [];
});

const hasMoreCategories = computed(() => {
  return (props.template.categories?.length || 0) > MAX_CATEGORIES;
});

const remainingCategoriesCount = computed(() => {
  return (props.template.categories?.length || 0) - MAX_CATEGORIES;
});

// Tagi - dynamiczne
const MAX_TAGS = 4;
const visibleTags = computed(() => {
  return props.template.tags?.slice(0, MAX_TAGS) || [];
});

const hasMoreTags = computed(() => {
  return (props.template.tags?.length || 0) > MAX_TAGS;
});

const remainingTagsCount = computed(() => {
  return (props.template.tags?.length || 0) - MAX_TAGS;
});

// Placeholders - dynamiczne
const MAX_PLACEHOLDERS = 5;
const visiblePlaceholders = computed(() => {
  return props.template.placeholder_keys?.slice(0, MAX_PLACEHOLDERS) || [];
});

const hasMorePlaceholders = computed(() => {
  return (props.template.placeholder_keys?.length || 0) > MAX_PLACEHOLDERS;
});

const remainingPlaceholdersCount = computed(() => {
  return (props.template.placeholder_keys?.length || 0) - MAX_PLACEHOLDERS;
});

// Template preview - dynamiczny
const hasTemplate = computed(() => {
  return !!props.template.template?.en || !!props.template.template?.pl;
});

const previewText = computed(() => {
  if (!hasTemplate.value) return "";
  const text =
    locale.value === "pl"
      ? props.template.template?.pl || ""
      : props.template.template?.en || "";
  return text.length > 150 ? text.slice(0, 150) + "..." : text;
});
</script>
