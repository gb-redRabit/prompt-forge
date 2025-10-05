<template>
  <UCard class="hover:shadow-lg transition-all">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon :name="categoryIcon" class="w-5 h-5 text-primary-600" />
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ promptName }}
          </h3>
        </div>
        <UBadge
          v-if="prompt.isCustom"
          color="success"
          variant="subtle"
          size="xs"
        >
          {{ $t("library.custom.badge") || "Własny" }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-3">
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ promptDescription }}
      </p>

      <div class="flex flex-wrap gap-1">
        <UBadge
          v-for="tag in prompt.tags?.slice(0, 3)"
          :key="tag"
          variant="subtle"
          size="xs"
        >
          {{ tag }}
        </UBadge>
        <UBadge
          v-if="(prompt.tags?.length || 0) > 3"
          variant="subtle"
          size="xs"
        >
          +{{ (prompt.tags?.length || 0) - 3 }}
        </UBadge>
      </div>

      <div
        class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
      >
        <span class="text-xs text-gray-500">
          {{ new Date(prompt.savedAt).toLocaleDateString() }}
        </span>

        <div class="flex items-center gap-1">
          <!-- Use button - zawsze widoczny -->
          <UButton
            color="primary"
            variant="ghost"
            size="xs"
            icon="i-heroicons-arrow-right"
            :title="$t('library.actions.use')"
            @click="$emit('use', prompt)"
          />

          <!-- Edit button - TYLKO dla własnych promptów -->
          <UButton
            v-if="prompt.isCustom && showEdit"
            color="warning"
            variant="ghost"
            size="xs"
            icon="i-heroicons-pencil"
            :title="$t('library.actions.edit')"
            @click="$emit('edit', prompt)"
          />

          <!-- Delete button - opcjonalny -->
          <UButton
            v-if="showDelete"
            color="error"
            variant="ghost"
            size="xs"
            icon="i-heroicons-trash"
            :title="$t('library.actions.delete')"
            @click="$emit('delete', prompt)"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";

const props = withDefaults(
  defineProps<{
    prompt: SavedPrompt;
    showEdit?: boolean;
    showDelete?: boolean;
  }>(),
  {
    showEdit: true,
    showDelete: true,
  }
);

defineEmits<{
  use: [prompt: SavedPrompt];
  edit: [prompt: SavedPrompt];
  delete: [prompt: SavedPrompt];
}>();

const { locale } = useI18n();

const promptName = computed(() => {
  if (!props.prompt.name) return "Bez nazwy";
  return locale.value === "pl" ? props.prompt.name.pl : props.prompt.name.en;
});

const promptDescription = computed(() => {
  if (!props.prompt.description) return "";
  return locale.value === "pl"
    ? props.prompt.description.pl
    : props.prompt.description.en;
});

const categoryIcon = computed(() => {
  const icons: Record<string, string> = {
    custom: "i-heroicons-pencil",
    writing: "i-heroicons-pencil-square",
    coding: "i-heroicons-code-bracket",
    business: "i-heroicons-briefcase",
    education: "i-heroicons-academic-cap",
    creative: "i-heroicons-sparkles",
    analysis: "i-heroicons-chart-bar",
  };
  return icons[props.prompt.category] || "i-heroicons-document-text";
});
</script>
