<template>
  <GlassCard
    hover
    shadow
    class="cursor-pointer group transition-all duration-200"
    padding="lg"
    @click="$emit('select', template)"
  >
    <div class="flex gap-6">
      <!-- Left: Main Info -->
      <div class="flex-1 min-w-0 space-y-3">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <GlassBadge
                v-if="template.id"
                color="neutral"
                variant="soft"
                size="md"
              >
                #{{ template.id }}
              </GlassBadge>
              <GlassBadge
                v-if="template.type"
                color="secondary"
                variant="soft"
                size="md"
              >
                {{ template.type }}
              </GlassBadge>
            </div>

            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
            >
              {{ translatedName }}
            </h3>

            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ translatedDescription }}
            </p>
          </div>

          <UIcon
            name="i-heroicons-arrow-right"
            class="w-6 h-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0"
          />
        </div>

        <!-- Template Preview - PEŁNY TEKST -->
        <div
          v-if="hasTemplate"
          class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-2">
            <p
              v-once
              class="text-xs text-gray-500 dark:text-gray-400 font-medium"
            >
              {{ $t("pages.templates.preview") }}
            </p>
            <GlassBadge color="neutral" variant="soft" size="xs">
              {{ previewText.length }} {{ $t("pages.templates.characters") }}
            </GlassBadge>
          </div>
          <div class="max-h-[400px] overflow-y-auto pr-2">
            <pre
              class="text-xs text-gray-600 dark:text-gray-300 font-mono whitespace-pre-wrap break-words"
              >{{ previewText }}</pre
            >
          </div>
        </div>

        <!-- Metadata Row -->
        <div
          class="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400"
        >
          <!-- Categories -->
          <div
            v-if="template.categories?.length"
            class="flex items-center gap-1"
          >
            <UIcon name="i-heroicons-folder" class="w-4 h-4" />
            <span
              >{{ template.categories.length }}
              {{ $t("pages.templates.categories") }}</span
            >
          </div>

          <!-- Tags -->
          <div v-if="template.tags?.length" class="flex items-center gap-1">
            <UIcon name="i-heroicons-hashtag" class="w-4 h-4" />
            <span
              >{{ template.tags.length }} {{ $t("pages.templates.tags") }}</span
            >
          </div>

          <!-- Placeholders -->
          <div
            v-if="template.placeholder_keys?.length"
            class="flex items-center gap-1"
          >
            <UIcon name="i-heroicons-variable" class="w-4 h-4" />
            <span
              >{{ template.placeholder_keys.length }}
              {{ $t("pages.templates.placeholders") }}</span
            >
          </div>
        </div>
      </div>

      <!-- Right: Tags & Categories -->
      <div class="w-64 flex-shrink-0 space-y-3">
        <!-- Categories -->
        <div v-if="template.categories?.length">
          <p
            v-once
            class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium"
          >
            {{ $t("pages.templates.categories") }}
          </p>
          <div class="flex flex-wrap gap-1">
            <GlassBadge
              v-for="category in template.categories.slice(0, 5)"
              :key="category"
              color="primary"
              variant="soft"
              size="md"
            >
              {{ category }}
            </GlassBadge>
            <GlassBadge
              v-if="template.categories.length > 5"
              color="primary"
              variant="soft"
              size="md"
            >
              +{{ template.categories.length - 5 }}
            </GlassBadge>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="template.tags?.length">
          <p
            v-once
            class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium"
          >
            {{ $t("pages.templates.tags") }}
          </p>
          <div class="flex flex-wrap gap-1">
            <GlassBadge
              v-for="tag in template.tags.slice(0, 8)"
              :key="tag"
              color="neutral"
              variant="outline"
              size="md"
            >
              #{{ tag }}
            </GlassBadge>
            <GlassBadge
              v-if="template.tags.length > 8"
              color="neutral"
              variant="outline"
              size="md"
            >
              +{{ template.tags.length - 8 }}
            </GlassBadge>
          </div>
        </div>

        <!-- Placeholders -->
        <div v-if="template.placeholder_keys?.length">
          <p
            v-once
            class="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium"
          >
            {{ $t("pages.templates.placeholders") }}
          </p>
          <div class="flex flex-wrap gap-1">
            <GlassBadge
              v-for="key in template.placeholder_keys.slice(0, 6)"
              :key="key"
              color="primary"
              variant="soft"
              size="md"
            >
              {{ key }}
            </GlassBadge>
            <GlassBadge
              v-if="template.placeholder_keys.length > 6"
              color="primary"
              variant="soft"
              size="md"
            >
              +{{ template.placeholder_keys.length - 6 }}
            </GlassBadge>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import type { Prompt } from "~/types/content";

const props = defineProps<{
  template: Prompt;
}>();

defineEmits<{
  select: [template: Prompt];
}>();

const { locale } = useI18n();

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

const hasTemplate = computed(() => {
  return !!props.template.template?.en || !!props.template.template?.pl;
});

const previewText = computed(() => {
  if (!hasTemplate.value) return "";
  const text =
    locale.value === "pl"
      ? props.template.template?.pl || ""
      : props.template.template?.en || "";
  return text; // Zwraca CAŁY tekst bez obcinania
});
</script>
