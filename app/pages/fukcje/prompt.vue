<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t("nav.prompts") }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Zarządzaj swoimi promptami AI
        </p>
      </div>
      <UButton color="primary" @click="createPrompt">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        Utwórz Prompt
      </UButton>
    </div>

    <!-- Search & Filters -->
    <div class="flex gap-4">
      <UInput
        v-model="searchQuery"
        placeholder="Szukaj promptów..."
        class="flex-1"
      />
      <USelect
        v-model="selectedCategory"
        :options="categoryOptions"
        placeholder="Kategoria"
      />
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
      ></div>
      <p>Ładowanie promptów...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>Błąd podczas ładowania: {{ error.message }}</p>
      <UButton @click="refresh()" class="mt-4" variant="outline">
        Spróbuj ponownie
      </UButton>
    </div>

    <!-- Results -->
    <div v-else-if="filteredPrompts?.length" class="grid gap-4">
      <UCard v-for="prompt in filteredPrompts" :key="prompt.id">
        <template #header>
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold text-lg">
                {{ prompt.name?.pl || prompt.name?.en || "Bez nazwy" }}
              </h3>
              <div class="flex flex-wrap gap-1 mt-2">
                <UBadge
                  v-for="category in prompt.categories?.slice(0, 3)"
                  :key="category"
                  :style="{ color: getCategoryColor(category) }"
                  variant="soft"
                  size="xs"
                >
                  {{ category }}
                </UBadge>
                <UBadge
                  v-if="prompt.categories?.length > 3"
                  variant="soft"
                  size="xs"
                  style="color: grey"
                >
                  +{{ prompt.categories.length - 3 }}
                </UBadge>
              </div>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            {{
              prompt.description?.pl || prompt.description?.en || "Bez opisu"
            }}
          </p>

          <!-- Tags -->
          <div v-if="prompt.tags?.length" class="flex flex-wrap gap-1">
            <UBadge
              v-for="tag in prompt.tags?.slice(0, 3)"
              :key="tag"
              variant="outline"
              size="xs"
              style="color: grey"
            >
              {{ tag }}
            </UBadge>
            <UBadge
              v-if="prompt.tags?.length > 3"
              variant="outline"
              size="xs"
              style="color: grey"
            >
              +{{ prompt.tags.length - 3 }}
            </UBadge>
          </div>

          <!-- Placeholder keys -->
          <div
            v-if="prompt.placeholder_keys?.length"
            class="flex flex-wrap gap-1"
          >
            <UBadge
              v-for="key in prompt.placeholder_keys?.slice(0, 3)"
              :key="key"
              variant="soft"
              size="xs"
              style="color: blue"
            >
              {{ "{" + key + "}" }}
            </UBadge>
            <UBadge
              v-if="prompt.placeholder_keys?.length > 3"
              variant="soft"
              size="xs"
              style="color: blue"
            >
              +{{ prompt.placeholder_keys.length - 3 }}
            </UBadge>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <UButton
              variant="outline"
              size="xs"
              @click="editPrompt(prompt)"
              class="flex-1"
            >
              Edytuj
            </UButton>
            <UButton
              color="primary"
              size="xs"
              @click="usePrompt(prompt)"
              class="flex-1"
            >
              Użyj
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UIcon
        name="i-heroicons-document-text"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        Brak promptów
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Zacznij od utworzenia swojego pierwszego promptu.
      </p>
      <div class="mt-6">
        <UButton color="primary" @click="createPrompt">
          <UIcon name="i-heroicons-plus" class="mr-2" />
          Utwórz Prompt
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prompt } from "~/types/content";

definePageMeta({
  layout: "dashboard",
});

// Wczytaj dane z collection używając nowego API
const {
  data: promptsData,
  pending,
  error,
  refresh,
} = await useAsyncData("prompts", () => queryCollection("prompts").first());

// Reactive variables
const searchQuery = ref("");
const selectedCategory = ref("");

// Przetwórz dane - pobierz z meta.body
const prompts = computed(() => {
  if (!promptsData.value) {
    console.log("No promptsData.value");
    return [];
  }

  // Dane są w meta.body w collections
  if (
    promptsData.value.meta?.body &&
    Array.isArray(promptsData.value.meta.body)
  ) {
    console.log(
      "Found data in meta.body, length:",
      promptsData.value.meta.body.length
    );
    return promptsData.value.meta.body;
  }

  // Fallback - sprawdź inne możliwe lokalizacje
  if (promptsData.value.body && Array.isArray(promptsData.value.body)) {
    console.log("Found data in body, length:", promptsData.value.body.length);
    return promptsData.value.body;
  }

  if (Array.isArray(promptsData.value)) {
    console.log("Data is array directly, length:", promptsData.value.length);
    return promptsData.value;
  }

  // Sprawdź wszystkie klucze w obiekcie
  console.warn(
    "Unexpected data structure. Available keys:",
    Object.keys(promptsData.value)
  );
  console.warn("Full data:", promptsData.value);

  return [];
});

// Get unique categories for filter
const categoryOptions = computed(() => {
  const allCategories = prompts.value.flatMap(
    (p: Prompt) => p.categories || []
  );
  const uniqueCategories = [...new Set(allCategories)].filter(Boolean);

  return [
    { label: "Wszystkie kategorie", value: "" },
    ...uniqueCategories.map((cat) => ({ label: cat, value: cat })),
  ];
});

// Filtered prompts
const filteredPrompts = computed(() => {
  let filtered = prompts.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((prompt: Prompt) => {
      const name = (prompt.name?.pl || prompt.name?.en || "").toLowerCase();
      const description = (
        prompt.description?.pl ||
        prompt.description?.en ||
        ""
      ).toLowerCase();
      const tags = prompt.tags?.join(" ").toLowerCase() || "";
      const categories = prompt.categories?.join(" ").toLowerCase() || "";

      return (
        name.includes(query) ||
        description.includes(query) ||
        tags.includes(query) ||
        categories.includes(query)
      );
    });
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((prompt: Prompt) =>
      prompt.categories?.includes(selectedCategory.value)
    );
  }

  return filtered;
});

// Category colors
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    marketing: "green",
    support: "blue",
    development: "purple",
    content: "orange",
    sales: "red",
    business: "yellow",
  };
  return colors[category?.toLowerCase()] || "gray";
};

// Actions
const createPrompt = () => {
  console.log("Create new prompt");
};

const editPrompt = (prompt: Prompt) => {
  console.log("Edit prompt:", prompt);
};

const usePrompt = (prompt: Prompt) => {
  console.log("Use prompt:", prompt);
};
</script>
