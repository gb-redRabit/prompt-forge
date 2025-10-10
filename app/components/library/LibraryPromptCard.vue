<template>
  <UCard class="hover:shadow-lg transition-all flex flex-col justify-between">
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

      <div
        class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
      >
        <span class="text-xs text-gray-500">
          {{ formattedDate }}
        </span>

        <div class="flex items-center gap-1">
          <UButton
            icon="i-heroicons-play"
            size="xs"
            color="primary"
            variant="soft"
            @click="$emit('use', prompt)"
          >
            {{ $t("common.use") || "Użyj" }}
          </UButton>

          <UButton
            v-if="showEdit"
            icon="i-heroicons-pencil"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="$emit('edit', prompt)"
          />

          <UButton
            icon="i-heroicons-trash"
            size="xs"
            color="error"
            variant="ghost"
            @click="$emit('delete', prompt.savedId)"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";

const props = defineProps<{
  prompt: SavedPrompt;
  showEdit?: boolean;
}>();

defineEmits<{
  use: [prompt: SavedPrompt];
  edit: [prompt: SavedPrompt];
  delete: [savedId: string];
}>();

const { locale } = useI18n();

// Używamy preloadowanych danych zamiast ładować ponownie
const { prompts: templates } = usePreloadedContent();

// Helper do pobierania tekstu w odpowiednim języku
const getLocalizedText = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    return locale.value === "pl"
      ? value.pl || value.en || ""
      : value.en || value.pl || "";
  }
  return "";
};

// Nazwa promptu
const promptName = computed(() => {
  // Jeśli ma name w obiekcie
  if (props.prompt.name) {
    return getLocalizedText(props.prompt.name);
  }

  // Jeśli to zapisany prompt z promptId, pobierz z templates
  if (props.prompt.promptId && templates.value?.length) {
    const template = templates.value.find(
      (t) => t.id?.toString() === props.prompt.promptId
    );
    if (template?.name) {
      return getLocalizedText(template.name);
    }
  }

  // Fallback - pierwsze 50 znaków z result
  const resultText = props.prompt.result || "Prompt";
  return resultText.length > 50
    ? resultText.substring(0, 50) + "..."
    : resultText;
});

// Opis promptu
const promptDescription = computed(() => {
  // Jeśli ma description w obiekcie
  if (props.prompt.description) {
    return getLocalizedText(props.prompt.description);
  }

  // Jeśli to zapisany prompt z promptId, pobierz z templates
  if (props.prompt.promptId && templates.value?.length) {
    const template = templates.value.find(
      (t) => t.id?.toString() === props.prompt.promptId
    );
    if (template?.description) {
      return getLocalizedText(template.description);
    }
  }

  // Fallback - fragment result
  const resultText = props.prompt.result || "";
  return resultText.length > 100
    ? resultText.substring(0, 100) + "..."
    : resultText;
});

// Ikona kategorii
const categoryIcon = computed(() => {
  // Jeśli to custom prompt
  if (props.prompt.isCustom) {
    return "i-heroicons-sparkles";
  }
  return "i-heroicons-document-text";
});

// Sformatowana data
const formattedDate = computed(() => {
  const timestamp = props.prompt.savedAt || props.prompt.timestamp;
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleDateString(locale.value === "pl" ? "pl-PL" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
</script>
