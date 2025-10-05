<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white truncate">
          {{ translatedName }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ translatedDescription }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Copy button -->
        <UButton color="primary" variant="outline" @click="copyResult">
          <UIcon name="i-heroicons-clipboard" class="mr-2" />
          {{ copied ? $t("common.copied") : $t("common.copy") }}
        </UButton>

        <!-- Save to library button - with toggle state -->
        <UButton
          :color="isInLibrary ? 'success' : 'neutral'"
          :variant="isInLibrary ? 'solid' : 'outline'"
          @click="toggleLibrary"
        >
          <UIcon
            :name="
              isInLibrary
                ? 'i-heroicons-bookmark-solid'
                : 'i-heroicons-bookmark'
            "
            class="mr-2"
          />
          {{ isInLibrary ? "W bibliotece" : "Zapisz do biblioteki" }}
        </UButton>

        <!-- Close button -->
        <UButton
          color="neutral"
          variant="subtle"
          size="xl"
          @click="$emit('close')"
        >
          <UIcon name="i-heroicons-x-mark" />
        </UButton>
      </div>
    </div>

    <!-- Metadata -->
    <div class="flex flex-wrap gap-2">
      <UBadge v-if="template.type" color="secondary" size="lg" variant="subtle">
        {{ template.type }}
      </UBadge>
      <UBadge
        v-for="category in template.categories?.slice(0, 3)"
        :key="category"
        color="primary"
        variant="subtle"
        size="md"
      >
        {{ category }}
      </UBadge>
      <UBadge
        v-for="tag in template.tags?.slice(0, 5)"
        :key="tag"
        color="neutral"
        variant="outline"
        size="md"
      >
        #{{ tag }}
      </UBadge>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- LEFT: Template Editor -->
      <div class="space-y-4">
        <UCard :ui="{ body: 'p-4' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ $t("pages.templates.template_editor") }}
              </h3>
              <UButton
                color="neutral"
                variant="subtle"
                size="xs"
                @click="resetTemplate"
              >
                <UIcon name="i-heroicons-arrow-path" class="mr-1" />
                Reset
              </UButton>
            </div>
          </template>

          <!-- Editable template -->
          <textarea
            v-model="editedTemplate"
            rows="12"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
            :placeholder="$t('pages.templates.template_placeholder')"
          />

          <!-- Character count -->
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2"
          >
            <span
              >{{ editedTemplate.length }}
              {{ $t("pages.templates.characters") }}</span
            >
            <span
              >{{ detectedPlaceholders.length }}
              {{ $t("pages.templates.placeholders") }}</span
            >
          </div>
        </UCard>
      </div>

      <!-- RIGHT: Placeholder Inputs as Tabs -->
      <div class="space-y-4">
        <UCard :ui="{ body: 'p-4' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ $t("pages.templates.placeholder_values") }}
              </h3>
              <UBadge color="primary" variant="subtle">
                {{ filledPlaceholders }}/{{ detectedPlaceholders.length }}
                {{ $t("pages.templates.filled") }}
              </UBadge>
            </div>
          </template>

          <!-- Empty state -->
          <div
            v-if="detectedPlaceholders.length === 0"
            class="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            <UIcon
              name="i-heroicons-variable"
              class="w-12 h-12 mx-auto mb-2 opacity-50"
            />
            <p>{{ $t("pages.templates.no_placeholders") }}</p>
          </div>

          <!-- Placeholder Tabs -->
          <div v-else class="space-y-4">
            <!-- Tab Navigation -->
            <div
              class="flex flex-wrap gap-2 pb-3 border-b border-gray-200 dark:border-gray-700"
            >
              <button
                v-for="(placeholderKey, index) in detectedPlaceholders"
                :key="placeholderKey"
                type="button"
                class="px-3 py-2 text-sm font-medium rounded-lg transition-all relative"
                :class="[
                  selectedPlaceholderIndex === index
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
                ]"
                @click="selectedPlaceholderIndex = index"
              >
                {{ placeholderKey }}

                <!-- Filled indicator -->
                <span
                  v-if="placeholderValues[placeholderKey]?.trim()"
                  class="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-gray-900"
                />
              </button>
            </div>

            <!-- Selected Placeholder Editor -->
            <div
              v-if="selectedPlaceholderKey"
              class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <!-- Placeholder info -->
              <div class="flex items-center justify-between">
                <div>
                  <h4
                    class="text-base font-semibold text-gray-900 dark:text-white"
                  >
                    {{ selectedPlaceholderKey }}
                  </h4>
                  <p
                    v-if="hasOptions(selectedPlaceholderKey)"
                    class="text-xs text-gray-500 mt-1"
                  >
                    {{ getOptionsForKey(selectedPlaceholderKey).length }}
                    {{ $t("pages.templates.options_available") }}
                  </p>
                </div>

                <!-- Quick clear button -->
                <UButton
                  v-if="placeholderValues[selectedPlaceholderKey]"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="clearPlaceholder(selectedPlaceholderKey)"
                >
                  Wyczyść
                </UButton>
              </div>

              <!-- Input with search -->
              <div class="space-y-3">
                <UTextarea
                  v-model="placeholderValues[selectedPlaceholderKey]"
                  :rows="4"
                  :placeholder="
                    hasOptions(selectedPlaceholderKey)
                      ? $t('pages.templates.select_or_type')
                      : $t('pages.templates.enter_value')
                  "
                  class="font-mono w-full"
                  @input="updateResult"
                />

                <!-- Search bar for options -->
                <UInput
                  v-if="
                    hasOptions(selectedPlaceholderKey) &&
                    getOptionsForKey(selectedPlaceholderKey).length > 6
                  "
                  v-model="optionsSearch"
                  placeholder="Szukaj opcji..."
                  icon="i-heroicons-magnifying-glass"
                  size="sm"
                />
              </div>

              <!-- All options as expandable chips -->
              <div
                v-if="
                  hasOptions(selectedPlaceholderKey) &&
                  getOptionsForKey(selectedPlaceholderKey).length > 0
                "
                class="space-y-2"
              >
                <div class="flex items-center justify-between">
                  <p
                    class="text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{
                      showAllOptions[selectedPlaceholderKey]
                        ? "Wszystkie opcje:"
                        : "Szybki wybór:"
                    }}
                  </p>
                  <span class="text-xs text-gray-500">
                    {{ filteredVisibleOptions(selectedPlaceholderKey).length }}
                    opcji
                  </span>
                </div>

                <!-- Options grid -->
                <div class="flex flex-wrap gap-2 max-h-96 overflow-y-auto pr-2">
                  <UButton
                    v-for="option in filteredVisibleOptions(
                      selectedPlaceholderKey
                    )"
                    :key="option.value"
                    :color="
                      placeholderValues[selectedPlaceholderKey] ===
                      getOptionValueForTemplate(option)
                        ? 'primary'
                        : 'neutral'
                    "
                    :variant="
                      placeholderValues[selectedPlaceholderKey] ===
                      getOptionValueForTemplate(option)
                        ? 'solid'
                        : 'soft'
                    "
                    size="sm"
                    class="flex-shrink-0"
                    @click="selectOption(selectedPlaceholderKey, option.value)"
                  >
                    <UIcon
                      v-if="
                        placeholderValues[selectedPlaceholderKey] ===
                        getOptionValueForTemplate(option)
                      "
                      name="i-heroicons-check"
                      class="mr-1 w-3 h-3"
                    />
                    {{ getTranslatedLabel(option) }}
                  </UButton>
                </div>

                <!-- Load More / Show Less button -->
                <div
                  v-if="
                    getOptionsForKey(selectedPlaceholderKey).length > 6 &&
                    !optionsSearch
                  "
                  class="text-center pt-2"
                >
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    @click="toggleShowAllOptions(selectedPlaceholderKey)"
                  >
                    <UIcon
                      :name="
                        showAllOptions[selectedPlaceholderKey]
                          ? 'i-heroicons-chevron-up'
                          : 'i-heroicons-chevron-down'
                      "
                      class="mr-1"
                    />
                    {{
                      showAllOptions[selectedPlaceholderKey]
                        ? "Pokaż mniej"
                        : `Pokaż wszystkie (${getOptionsForKey(selectedPlaceholderKey).length})`
                    }}
                  </UButton>
                </div>
              </div>

              <!-- Preview of current value -->
              <div
                v-if="placeholderValues[selectedPlaceholderKey]?.trim()"
                class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
              >
                <p
                  class="text-xs font-medium text-primary-700 dark:text-primary-300 mb-1"
                >
                  Podgląd:
                </p>
                <p class="text-sm text-gray-900 dark:text-white font-mono">
                  {{ placeholderValues[selectedPlaceholderKey] }}
                </p>
              </div>
            </div>

            <!-- Navigation hints -->
            <div
              class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700"
            >
              <UButton
                :disabled="selectedPlaceholderIndex === 0"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="
                  selectedPlaceholderIndex = Math.max(
                    0,
                    selectedPlaceholderIndex - 1
                  )
                "
              >
                <UIcon name="i-heroicons-chevron-left" class="mr-1" />
                Poprzedni
              </UButton>

              <span class="text-xs text-gray-500">
                {{ selectedPlaceholderIndex + 1 }} /
                {{ detectedPlaceholders.length }}
              </span>

              <UButton
                :disabled="
                  selectedPlaceholderIndex === detectedPlaceholders.length - 1
                "
                color="neutral"
                variant="ghost"
                size="xs"
                @click="
                  selectedPlaceholderIndex = Math.min(
                    detectedPlaceholders.length - 1,
                    selectedPlaceholderIndex + 1
                  )
                "
              >
                Następny
                <UIcon name="i-heroicons-chevron-right" class="ml-1" />
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- RESULT: Final Prompt -->
    <UCard
      v-if="resultPrompt"
      :ui="{
        body: 'p-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t("pages.templates.final_prompt") }}
          </h3>
          <div class="flex items-center gap-2">
            <UBadge color="success" variant="subtle">
              {{ filledPlaceholders }}/{{ detectedPlaceholders.length }}
              {{ $t("pages.templates.filled") }}
            </UBadge>
          </div>
        </div>
      </template>

      <!-- Result text -->
      <div class="space-y-3">
        <pre
          class="whitespace-pre-wrap break-words text-gray-900 dark:text-white font-mono text-sm p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          >{{ resultPrompt }}</pre
        >

        <!-- Unfilled placeholders warning -->
        <div
          v-if="unfilledPlaceholders.length > 0"
          class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div class="flex items-start gap-2">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
            />
            <div class="flex-1 text-sm">
              <p class="font-medium text-yellow-900 dark:text-yellow-100">
                {{ $t("pages.templates.unfilled_placeholders") }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <button
                  v-for="key in unfilledPlaceholders"
                  :key="key"
                  type="button"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 rounded text-xs font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                  @click="
                    selectedPlaceholderIndex = detectedPlaceholders.indexOf(key)
                  "
                >
                  [{{ key }}]
                  <UIcon name="i-heroicons-pencil" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Prompt, OptionItem } from "~/types/content";

const props = defineProps<{
  template: Prompt;
}>();

defineEmits<{
  close: [];
}>();

const { locale } = useI18n();
const { options } = usePreloadedContent();
const { savePrompt, removePrompt, savedPrompts, addToHistory } = useLibrary();
const { trackEvent } = useAnalytics();
// State
const editedTemplate = ref("");
const placeholderValues = ref<Record<string, string>>({});
const resultPrompt = ref("");
const copied = ref(false);
const savedPromptId = ref<string | null>(null);
const selectedPlaceholderIndex = ref(0);
const optionsSearch = ref("");
const showAllOptions = ref<Record<string, boolean>>({});

// Selected placeholder key
const selectedPlaceholderKey = computed(() => {
  return detectedPlaceholders.value[selectedPlaceholderIndex.value] || null;
});

// Check if current prompt is saved in library
const isInLibrary = computed(() => {
  return savedPrompts.value.some(
    (p) => p.id === props.template.id && p.savedId === savedPromptId.value
  );
});
const usePrompt = (template: Prompt) => {
  trackEvent("prompt_used", {
    promptId: template.id,
    category: template.category,
    hasPlaceholders: !!template.placeholder_keys?.length,
  });
};
// Translated fields - reactive to locale changes
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

// Get translated template based on current locale
const translatedTemplate = computed(() => {
  if (!props.template.template) return "";
  return locale.value === "pl"
    ? props.template.template.pl || ""
    : props.template.template.en || "";
});

// Get translated label for option - używane do WYŚWIETLANIA w UI
const getTranslatedLabel = (option: OptionItem): string => {
  if (!option.label) return option.value;
  return locale.value === "pl"
    ? option.label.pl || option.label.en || option.value
    : option.label.en || option.label.pl || option.value;
};

// Get value to use in template (translated label, not value!)
const getOptionValueForTemplate = (option: OptionItem): string => {
  if (!option.label) return option.value;
  return locale.value === "pl"
    ? option.label.pl || option.label.en || option.value
    : option.label.en || option.label.pl || option.value;
};

// Initialize template
const initializeTemplate = () => {
  editedTemplate.value = translatedTemplate.value;

  // Initialize placeholder values
  props.template.placeholder_keys?.forEach((key) => {
    if (!placeholderValues.value[key]) {
      placeholderValues.value[key] = "";
    }
  });

  checkIfInLibrary();
  addToHistory(props.template);
  updateResult();
};

// Check if prompt is in library
const checkIfInLibrary = () => {
  const existing = savedPrompts.value.find((p) => p.id === props.template.id);
  if (existing) {
    savedPromptId.value = existing.savedId;
  } else {
    savedPromptId.value = null;
  }
};

// Detect placeholders in edited template
const detectedPlaceholders = computed<string[]>(() => {
  const regex = /\[([^\]]+)\]/g;
  const matches = [...editedTemplate.value.matchAll(regex)];
  const keys = matches
    .map((m) => m[1])
    .filter((k): k is string => k !== undefined);
  return [...new Set(keys)];
});

// Check if options exist for a key
const hasOptions = (key: string): boolean => {
  return !!(
    options.value &&
    options.value[key] &&
    options.value[key].length > 0
  );
};

// Get options for a placeholder key
const getOptionsForKey = (key: string): readonly OptionItem[] => {
  if (!options.value || !options.value[key]) return [];
  return options.value[key] || [];
};

// Get filtered and visible options (with search and show all/less)
const filteredVisibleOptions = (key: string): readonly OptionItem[] => {
  let opts = getOptionsForKey(key);

  // Apply search filter
  if (optionsSearch.value) {
    const searchTerm = optionsSearch.value.toLowerCase();
    opts = opts.filter((opt) => {
      const label = getTranslatedLabel(opt).toLowerCase();
      return (
        label.includes(searchTerm) ||
        opt.value.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Apply show all/less limit
  if (!showAllOptions.value[key] && !optionsSearch.value) {
    return opts.slice(0, 6);
  }

  return opts;
};

// Toggle show all options
const toggleShowAllOptions = (key: string): void => {
  showAllOptions.value[key] = !showAllOptions.value[key];
};

// Select option
const selectOption = (key: string, optionValue: string): void => {
  const option = getOptionsForKey(key).find((opt) => opt.value === optionValue);

  if (option) {
    placeholderValues.value[key] = getOptionValueForTemplate(option);
  } else {
    placeholderValues.value[key] = optionValue;
  }

  updateResult();
};

// Clear placeholder
const clearPlaceholder = (key: string): void => {
  placeholderValues.value[key] = "";
  updateResult();
};

// Count filled placeholders
const filledPlaceholders = computed(() => {
  return detectedPlaceholders.value.filter(
    (key) =>
      placeholderValues.value[key] && placeholderValues.value[key].trim() !== ""
  ).length;
});

// Unfilled placeholders
const unfilledPlaceholders = computed<string[]>(() => {
  return detectedPlaceholders.value.filter(
    (key) =>
      !placeholderValues.value[key] ||
      placeholderValues.value[key].trim() === ""
  );
});

// Update result prompt
const updateResult = (): void => {
  let result = editedTemplate.value;

  detectedPlaceholders.value.forEach((key) => {
    const value = placeholderValues.value[key] || `[${key}]`;
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\[${escapedKey}\\]`, "g");
    result = result.replace(regex, value);
  });

  resultPrompt.value = result;
};

// Reset template
const resetTemplate = (): void => {
  Object.keys(placeholderValues.value).forEach((key) => {
    placeholderValues.value[key] = "";
  });
  initializeTemplate();
};

// Copy result
const copyResult = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(resultPrompt.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Toggle library
const toggleLibrary = () => {
  if (isInLibrary.value && savedPromptId.value) {
    removePrompt(savedPromptId.value);
    savedPromptId.value = null;
  } else {
    const saved = savePrompt(
      props.template,
      resultPrompt.value,
      placeholderValues.value
    );
    savedPromptId.value = saved.savedId;
  }
};

// Watchers
watch(editedTemplate, () => {
  updateResult();
});

watch(locale, () => {
  Object.keys(placeholderValues.value).forEach((key) => {
    if (placeholderValues.value[key] && hasOptions(key)) {
      const currentValue = placeholderValues.value[key];
      const matchingOption = getOptionsForKey(key).find((opt) => {
        const plLabel = opt.label?.pl || opt.value;
        const enLabel = opt.label?.en || opt.value;
        return currentValue === plLabel || currentValue === enLabel;
      });

      if (matchingOption) {
        placeholderValues.value[key] =
          getOptionValueForTemplate(matchingOption);
      }
    }
  });

  initializeTemplate();
});

watch(
  savedPrompts,
  () => {
    checkIfInLibrary();
  },
  { deep: true }
);

onMounted(() => {
  initializeTemplate();
});
</script>
