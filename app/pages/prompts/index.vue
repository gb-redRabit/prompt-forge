<template>
  <div class="space-y-2">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t("pages.common.loading") }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="w-16 h-16 mx-auto text-red-500 mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ $t("pages.templates.error_loading") }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        {{ error }}
      </p>
      <div class="flex gap-2 justify-center">
        <UButton color="primary" @click="loadTemplate">
          {{ $t("pages.templates.try_again") }}
        </UButton>
        <UButton color="neutral" variant="outline" @click="handleClose">
          {{ $t("common.back") }}
        </UButton>
      </div>
    </div>

    <!-- Prompt Editor -->
    <PromptEditor
      v-else-if="selectedTemplate"
      :template="selectedTemplate"
      @close="handleClose"
    />

    <!-- Empty State with Prompt Selection -->
    <div v-else class="max-w-6xl mx-auto flex flex-col justify-center">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t("pages.prompts.choose_template") }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t("pages.prompts.choose_template_description") }}
        </p>
      </div>

      <!-- Search Bar -->
      <div class="mb-6 mx-auto">
        <UInput
          v-model="searchQuery"
          :placeholder="$t('pages.prompts.search_templates')"
          icon="i-heroicons-magnifying-glass"
          size="xl"
          class="w-2xl"
        >
          <template #trailing>
            <UButton
              v-if="searchQuery"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              @click="searchQuery = ''"
            />
          </template>
        </UInput>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div
            class="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            {{ totalPrompts }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ $t("pages.prompts.total_templates") }}
          </div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div
            class="text-2xl font-bold text-success-600 dark:text-success-400"
          >
            {{ filteredPromptsCount }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ $t("pages.prompts.matching") }}
          </div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="text-2xl font-bold text-info-600 dark:text-info-400">
            {{ uniqueCategories }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ $t("pages.prompts.categories") }}
          </div>
        </div>
      </div>

      <!-- Templates List -->
      <div
        v-if="filteredPrompts.length > 0"
        class="grid gap-3 max-h-[500px] overflow-y-auto pr-2"
      >
        <button
          v-for="prompt in filteredPrompts"
          :key="prompt.id"
          class="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg transition-all group bg-white dark:bg-gray-800"
          @click="selectPrompt(prompt)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3
                class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ getTranslatedName(prompt) }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ getTranslatedDescription(prompt) }}
              </p>
              <div class="flex flex-wrap gap-1 mt-2">
                <UBadge
                  v-if="prompt.type"
                  color="secondary"
                  variant="subtle"
                  size="xs"
                >
                  {{ prompt.type }}
                </UBadge>
                <UBadge
                  v-if="prompt.placeholder_keys?.length"
                  color="info"
                  variant="subtle"
                  size="xs"
                >
                  {{ prompt.placeholder_keys.length }}
                  {{ $t("pages.prompts.variables") }}
                </UBadge>
              </div>
            </div>
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0"
            />
          </div>
        </button>
      </div>

      <!-- No Results -->
      <div
        v-else-if="searchQuery"
        class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ $t("pages.prompts.no_results") }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t("pages.prompts.try_different_search") }}
        </p>
        <UButton color="neutral" variant="ghost" @click="searchQuery = ''">
          <UIcon name="i-heroicons-x-mark" class="mr-2" />
          {{ $t("pages.prompts.clear_search") }}
        </UButton>
      </div>

      <!-- Browse All Link -->
      <div class="text-center mt-6">
        <UButton
          color="primary"
          variant="outline"
          size="lg"
          @click="navigateTo('/templates')"
        >
          <UIcon name="i-heroicons-squares-2x2" class="mr-2" />
          {{ $t("pages.prompts.browse_all_templates") }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prompt } from "~/types/content";
import PromptEditor from "~/components/prompts/PromptEditor.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const { locale } = useI18n();
const { prompts, isLoaded } = usePreloadedContent();
const { customPrompts, savedPrompts } = useLibrary();

const selectedTemplate = ref<Prompt | null>(null);
const isLoading = ref(true);
const error = ref("");
const searchQuery = ref("");

// Computed properties for empty state
const totalPrompts = computed(() => prompts.value?.length || 0);

const filteredPrompts = computed(() => {
  if (!prompts.value) return [];
  if (!searchQuery.value) return prompts.value.slice(0, 20); // Show first 20

  const query = searchQuery.value.toLowerCase();
  return prompts.value
    .filter((p) => {
      const name = getTranslatedName(p).toLowerCase();
      const description = getTranslatedDescription(p).toLowerCase();
      const type = p.type?.toLowerCase() || "";
      return (
        name.includes(query) ||
        description.includes(query) ||
        type.includes(query)
      );
    })
    .slice(0, 50); // Max 50 results
});

const filteredPromptsCount = computed(() => filteredPrompts.value.length);

const uniqueCategories = computed(() => {
  if (!prompts.value) return 0;
  const categories = new Set();
  prompts.value.forEach((p) => {
    p.categories?.forEach((cat) => categories.add(cat));
  });
  return categories.size;
});

const getTranslatedName = (prompt: Prompt) => {
  if (!prompt.name) return "Untitled";
  return locale.value === "pl" ? prompt.name.pl : prompt.name.en;
};

const getTranslatedDescription = (prompt: Prompt) => {
  if (!prompt.description) return "";
  return locale.value === "pl" ? prompt.description.pl : prompt.description.en;
};

const selectPrompt = (prompt: Prompt) => {
  navigateTo({
    path: "/prompts",
    query: {
      templateId: prompt.id,
    },
  });
};

const loadTemplate = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const templateId = route.query.templateId as string;

    if (!templateId) {
      isLoading.value = false;
      return;
    }

    // NOWA LOGIKA: Sprawdź czy to custom prompt (string ID)
    if (typeof templateId === "string" && templateId.startsWith("custom-")) {
      // Szukaj w customPrompts
      const customPrompt = customPrompts.value.find((p) => p.id === templateId);

      if (customPrompt) {
        selectedTemplate.value = customPrompt as Prompt;
        isLoading.value = false;
        return;
      }

      // Jeśli nie znaleziono w custom, sprawdź savedPrompts
      const savedPrompt = savedPrompts.value.find((p) => p.id === templateId);

      if (savedPrompt) {
        selectedTemplate.value = savedPrompt as Prompt;
        isLoading.value = false;
        return;
      }

      error.value = `Custom prompt with ID ${templateId} not found`;
      isLoading.value = false;
      return;
    }

    // Oryginalna logika dla ID numerycznych (prompty z kolekcji)
    const numericId = Number(templateId);

    if (isNaN(numericId)) {
      error.value = `Invalid template ID: ${templateId}`;
      isLoading.value = false;
      return;
    }

    // Wait for content to load
    if (!isLoaded.value) {
      await new Promise((resolve) => {
        const unwatch = watch(isLoaded, (loaded) => {
          if (loaded) {
            unwatch();
            resolve(true);
          }
        });
      });
    }

    // Find template by numeric ID
    const template = prompts.value?.find((p) => p.id === numericId);

    if (!template) {
      error.value = `Template with ID ${numericId} not found`;
      isLoading.value = false;
      return;
    }

    selectedTemplate.value = template as Prompt;
  } catch (err: any) {
    error.value = err.message || "Failed to load template";
    console.error("Error loading template:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  navigateTo("/templates");
};

// Watch for route changes
watch(
  () => route.query.templateId,
  () => {
    loadTemplate();
  },
  { immediate: true }
);

useHead({
  title: `${selectedTemplate.value?.name?.pl || "Prompt Editor"} - Prompt Forge`,
});
</script>
