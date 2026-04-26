<template>
  <div class="space-y-4 p-3 sm:p-4 md:p-6 min-h-screen relative overflow-hidden">

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center py-8 md:py-12"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-3 sm:mb-4"
        ></div>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          <span v-once>{{ $t("pages.shared.loading") }}</span>
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 md:py-12 px-4">
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-red-500 mb-3 sm:mb-4"
      />
      <h3
        class="text-base sm:text-lg font-medium text-slate-900 dark:text-white mb-2"
      >
        <span v-once>{{ $t("pages.templates.error_loading") }}</span>
      </h3>
      <p
        class="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-3 sm:mb-4"
      >
        {{ error }}
      </p>
      <div class="flex flex-col sm:flex-row gap-2 justify-center">
        <GlassButton color="primary" size="md" @click="loadTemplate">
          <span v-once>{{ $t("pages.templates.try_again") }}</span>
        </GlassButton>
        <GlassButton
          color="neutral"
          variant="outline"
          size="md"
          @click="handleClose"
        >
          <span v-once>{{ $t("common.back") }}</span>
        </GlassButton>
      </div>
    </div>

    <!-- Prompt Editor -->
    <PromptEditor
      v-else-if="selectedTemplate"
      :template="selectedTemplate"
      @close="handleClose"
    />

    <!-- Empty State with Prompt Selection -->
    <div
      v-else
      class="max-w-7xl mx-auto w-full flex flex-col h-[calc(100vh-8rem)] overflow-hidden"
    >
      <!-- Header Area (Fixed) -->
      <div class="flex-shrink-0">
        <!-- Header -->
        <div class="text-center mb-4 sm:mb-6 px-4">
          <h2
            class="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2"
          >
            <span v-once>{{ $t("pages.prompts.choose_template") }}</span>
          </h2>
          <p
            class="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-4xl mx-auto"
          >
            <span v-once>{{
              $t("pages.prompts.choose_template_description")
            }}</span>
          </p>
        </div>

        <!-- Search Bar -->
        <div class="mb-4 sm:mb-6 mx-auto w-full px-4 max-w-4xl">
          <UInput
            v-model="searchQuery"
            :placeholder="$t('pages.prompts.search_templates')"
            icon="i-heroicons-magnifying-glass"
            size="lg"
            class="w-full"
          >
            <template #trailing>
              <GlassButton
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
        <div
          class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 max-w-4xl mx-auto px-4"
        >
          <div
            class="text-center p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
          >
            <div
              class="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400"
            >
              {{ totalPrompts }}
            </div>
            <div
              class="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5"
            >
              <span v-once>{{ $t("pages.prompts.total_templates") }}</span>
            </div>
          </div>
          <div
            class="text-center p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
          >
            <div
              class="text-lg sm:text-xl md:text-2xl font-bold text-success-600 dark:text-success-400"
            >
              {{ filteredPromptsCount }}
            </div>
            <div
              class="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5"
            >
              <span v-once>{{ $t("pages.prompts.matching") }}</span>
            </div>
          </div>
          <div
            class="text-center p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
          >
            <div
              class="text-lg sm:text-xl md:text-2xl font-bold text-info-600 dark:text-info-400"
            >
              {{ uniqueCategories }}
            </div>
            <div
              class="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5"
            >
              {{ $t("pages.prompts.categories") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Templates List (Scrollable) -->
      <div
        v-if="filteredPrompts.length > 0"
        class="flex-1 overflow-y-auto custom-scrollbar px-4 pb-12 space-y-3 sm:space-y-4"
      >
        <button
          v-for="prompt in filteredPrompts"
          :key="prompt.id"
          class="block w-full text-left p-4 sm:p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl transition-all group bg-white dark:bg-slate-800"
          @click="selectPrompt(prompt)"
        >
          <div class="flex items-start justify-between gap-2 sm:gap-4">
            <div class="flex-1 min-w-0">
              <h3
                class="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ getTranslatedName(prompt) }}
              </h3>
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
              >
                {{ getTranslatedDescription(prompt) }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                <UBadge
                  v-if="prompt.type"
                  color="secondary"
                  variant="subtle"
                  size="xs"
                  class="text-[10px] sm:text-xs"
                >
                  {{ prompt.type }}
                </UBadge>
                <UBadge
                  v-if="prompt.placeholder_keys?.length"
                  color="info"
                  variant="subtle"
                  size="xs"
                  class="text-[10px] sm:text-xs"
                >
                  {{ prompt.placeholder_keys.length }}
                  {{ $t("pages.prompts.variables") }}
                </UBadge>
              </div>
            </div>
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0"
            />
          </div>
        </button>
      </div>

      <!-- No Results -->
      <div
        v-else-if="searchQuery"
        class="text-center py-8 md:py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-slate-400 dark:text-slate-600 mb-2 sm:mb-3"
        />
        <h3
          class="text-base sm:text-lg font-medium text-slate-900 dark:text-white mb-2"
        >
          <span v-once>{{ $t("pages.prompts.no_results") }}</span>
        </h3>
        <p
          class="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-3 sm:mb-4"
        >
          <span v-once>{{ $t("pages.prompts.try_different_search") }}</span>
        </p>
        <GlassButton
          size="md"
          color="neutral"
          variant="ghost"
          @click="searchQuery = ''"
          icon="i-heroicons-x-mark"
        >
          <span v-once>{{ $t("pages.prompts.clear_search") }}</span>
        </GlassButton>
      </div>

      <!-- Browse All Link -->
      <div class="text-center mt-4 sm:mt-6 px-4">
        <GlassButton
          color="primary"
          variant="outline"
          size="md"
          class="text-sm sm:text-base"
          @click="navigateTo('/templates')"
          icon="i-heroicons-squares-2x2"
        >
          <span v-once>{{ $t("pages.prompts.browse_all_templates") }}</span>
        </GlassButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prompt } from "~~/shared/types/content";
import PromptEditor from "~/components/prompts/PromptEditor.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const { locale } = useI18n();
const { prompts, isLoaded } = usePreloadedContent();
const { getPromptById } = useLibrary();

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
  if (prompt.name) {
    return locale.value === "pl"
      ? prompt.name.pl || prompt.name.en
      : prompt.name.en || prompt.name.pl;
  }
  return prompt.title || "Untitled";
};

const getTranslatedDescription = (prompt: Prompt) => {
  if (prompt.description) {
    return locale.value === "pl"
      ? prompt.description.pl || prompt.description.en
      : prompt.description.en || prompt.description.pl;
  }
  return "";
};

const selectPrompt = (prompt: Prompt) => {
  navigateTo({
    path: "/prompts",
    query: {
      templateId: String(prompt.id),
    },
  });
};

const loadTemplate = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const templateId = route.query.templateId as string;

    if (!templateId) {
      selectedTemplate.value = null;
      isLoading.value = false;
      return;
    }

    // NOWA LOGIKA: Sprawdź czy to custom prompt
    if (
      typeof templateId === "string" &&
      (templateId.startsWith("custom-") || templateId.startsWith("custom_"))
    ) {
      const customPrompt = getPromptById(templateId);

      if (customPrompt) {
        selectedTemplate.value = customPrompt;
        isLoading.value = false;
        return;
      }

      error.value = `Prompt with ID ${templateId} not found`;
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
  title: `${selectedTemplate.value?.name?.pl || selectedTemplate.value?.title || "Prompt Editor"} - Prompt Forge`,
});
</script>
