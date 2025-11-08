<template>
  <div class="space-y-3 sm:space-y-4 md:space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex-1 min-w-0">
        <h2
          class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate"
        >
          {{ translatedName }}
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          {{ translatedDescription }}
        </p>
      </div>

      <div class="flex items-center gap-1.5 sm:gap-2">
        <!-- Copy button -->
        <GlassButton
          color="primary"
          variant="outline"
          size="sm"
          class="text-xs sm:text-sm"
          @click="copyResult"
          icon="i-heroicons-clipboard"
        >
          <span class="hidden sm:inline">{{
            copied ? $t("common.copied") : $t("common.copy")
          }}</span>
        </GlassButton>

        <!-- Save to library button - with toggle state -->
        <GlassButton
          :color="isInLibrary ? 'success' : 'neutral'"
          :variant="isInLibrary ? 'solid' : 'outline'"
          size="sm"
          class="text-xs sm:text-sm"
          @click="toggleLibrary"
          :icon="
            isInLibrary ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'
          "
        >
          <span class="hidden sm:inline">{{
            isInLibrary
              ? $t("pages.templates.saved_in_library")
              : $t("pages.templates.save_to_library")
          }}</span>
        </GlassButton>

        <!-- Close button -->
        <GlassButton
          color="neutral"
          variant="soft"
          size="md"
          @click="$emit('close')"
          icon="i-heroicons-x-mark"
        />
      </div>
    </div>

    <!-- Metadata -->
    <div class="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
      <GlassBadge
        v-if="template.type"
        color="secondary"
        size="sm"
        variant="soft"
        class="text-[10px] sm:text-xs"
      >
        {{ template.type }}
      </GlassBadge>

      <!-- Kategorie -->
      <GlassBadge
        v-for="category in template.categories?.slice(0, 3)"
        :key="category"
        color="primary"
        variant="soft"
        size="sm"
        class="text-[10px] sm:text-xs"
      >
        {{ category }}
      </GlassBadge>
      <GlassBadge
        v-if="(template.categories?.length || 0) > 3"
        color="primary"
        variant="soft"
        size="sm"
        class="text-[10px] sm:text-xs"
      >
        +{{ (template.categories?.length || 0) - 3 }}
      </GlassBadge>

      <!-- Tagi -->
      <GlassBadge
        v-for="tag in template.tags?.slice(0, 5)"
        :key="tag"
        color="neutral"
        variant="outline"
        size="sm"
        class="text-[10px] sm:text-xs"
      >
        #{{ tag }}
      </GlassBadge>
      <GlassBadge
        v-if="(template.tags?.length || 0) > 5"
        color="neutral"
        variant="outline"
        size="sm"
        class="text-[10px] sm:text-xs"
      >
        +{{ (template.tags?.length || 0) - 5 }}
      </GlassBadge>
    </div>

    <div class="grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      <!-- LEFT: Template Editor -->
      <div class="space-y-3 sm:space-y-4">
        <GlassCard padding="sm">
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
              >
                <span v-once>{{ $t("pages.templates.template_editor") }}</span>
              </h3>
              <GlassButton
                color="neutral"
                variant="soft"
                size="xs"
                class="text-xs"
                @click="resetTemplate"
                icon="i-heroicons-arrow-path"
              >
                <span v-once class="hidden sm:inline">{{
                  $t("pages.templates.reset")
                }}</span>
              </GlassButton>
            </div>
          </template>

          <!-- Editable template -->
          <textarea
            v-model="editedTemplate"
            :rows="8"
            class="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-xs sm:text-sm resize-none"
            :placeholder="$t('pages.templates.template_placeholder')"
          />

          <!-- Character count -->
          <div
            class="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2"
          >
            <span>
              {{ editedTemplate.length }}
              {{ $t("pages.templates.characters") }}
            </span>
            <span>
              {{ detectedPlaceholders.length }}
              {{ $t("pages.templates.placeholders") }}
            </span>
          </div>
        </GlassCard>
      </div>

      <!-- RIGHT: Placeholder Inputs as Tabs -->
      <div class="space-y-3 sm:space-y-4">
        <GlassCard padding="sm">
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <h3
                class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
              >
                <span v-once>{{
                  $t("pages.templates.placeholder_values")
                }}</span>
              </h3>
              <GlassBadge
                color="primary"
                variant="soft"
                size="sm"
                class="text-[10px] sm:text-xs"
              >
                {{ filledPlaceholders }}/{{ detectedPlaceholders.length }}
                <span v-once>{{ $t("pages.templates.filled") }}</span>
              </GlassBadge>
            </div>
          </template>

          <!-- Empty state -->
          <div
            v-if="detectedPlaceholders.length === 0"
            class="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400"
          >
            <UIcon
              name="i-heroicons-variable"
              class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50"
            />
            <p class="text-sm sm:text-base">
              {{ $t("pages.templates.no_placeholders") }}
            </p>
          </div>

          <!-- Placeholder Tabs -->
          <div v-else class="space-y-3 sm:space-y-4">
            <!-- Tab Navigation -->
            <div
              class="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700"
            >
              <button
                v-for="(placeholderKey, index) in detectedPlaceholders"
                :key="placeholderKey"
                type="button"
                class="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all relative"
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
                  class="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-success-500 rounded-full border-2 border-white dark:border-gray-900"
                />
              </button>
            </div>

            <!-- Selected Placeholder Editor -->
            <div
              v-if="selectedPlaceholderKey"
              class="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <!-- Placeholder info -->
              <div class="flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <h4
                    class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate"
                  >
                    {{ selectedPlaceholderKey }}
                  </h4>
                  <p
                    v-if="hasOptions(selectedPlaceholderKey)"
                    class="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1"
                  >
                    {{ getOptionsForKey(selectedPlaceholderKey).length }}
                    {{ $t("pages.templates.options_available") }}
                  </p>
                </div>

                <!-- Quick clear button -->
                <GlassButton
                  v-if="placeholderValues[selectedPlaceholderKey]"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="text-xs flex-shrink-0"
                  icon="i-heroicons-x-mark"
                  @click="clearPlaceholder(selectedPlaceholderKey)"
                >
                  <span v-once class="hidden sm:inline">{{
                    $t("pages.templates.clear")
                  }}</span>
                </GlassButton>
              </div>

              <!-- Input with search -->
              <div class="space-y-2 sm:space-y-3">
                <UTextarea
                  v-model="placeholderValues[selectedPlaceholderKey]"
                  :rows="3"
                  :placeholder="
                    hasOptions(selectedPlaceholderKey)
                      ? $t('pages.templates.select_or_type')
                      : $t('pages.templates.enter_value')
                  "
                  class="font-mono w-full text-xs sm:text-sm"
                  @input="updateResult"
                />

                <!-- Search bar for options -->
                <UInput
                  v-if="
                    hasOptions(selectedPlaceholderKey) &&
                    getOptionsForKey(selectedPlaceholderKey).length > 6
                  "
                  v-model="optionsSearch"
                  :placeholder="$t('pages.templates.search_options')"
                  icon="i-heroicons-magnifying-glass"
                  size="sm"
                  class="text-xs sm:text-sm"
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
                <div class="flex items-center justify-between gap-2">
                  <p
                    class="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 truncate"
                  >
                    {{
                      showAllOptions[selectedPlaceholderKey]
                        ? $t("pages.templates.all_options")
                        : $t("pages.templates.quick_select")
                    }}
                  </p>
                  <span
                    class="text-[10px] sm:text-xs text-gray-500 flex-shrink-0"
                  >
                    {{
                      $t("pages.templates.options_count", {
                        count: filteredVisibleOptions(selectedPlaceholderKey)
                          .length,
                      })
                    }}
                  </span>
                </div>

                <!-- Options grid -->
                <div
                  class="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto pr-1 sm:pr-2"
                >
                  <GlassButton
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
                    size="xs"
                    class="flex-shrink-0 text-[10px] sm:text-xs"
                    @click="selectOption(selectedPlaceholderKey, option.value)"
                    :icon="
                      placeholderValues[selectedPlaceholderKey] ===
                      getOptionValueForTemplate(option)
                        ? 'i-heroicons-check'
                        : undefined
                    "
                  >
                    {{ getTranslatedLabel(option) }}
                  </GlassButton>
                </div>

                <!-- Load More / Show Less button -->
                <div
                  v-if="
                    getOptionsForKey(selectedPlaceholderKey).length > 6 &&
                    !optionsSearch
                  "
                  class="text-center pt-1.5 sm:pt-2"
                >
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="xs"
                    class="text-xs"
                    @click="toggleShowAllOptions(selectedPlaceholderKey)"
                  >
                    <UIcon
                      :name="
                        showAllOptions[selectedPlaceholderKey]
                          ? 'i-heroicons-chevron-up'
                          : 'i-heroicons-chevron-down'
                      "
                      class="mr-1 w-3 h-3"
                    />
                    {{
                      showAllOptions[selectedPlaceholderKey]
                        ? $t("pages.templates.show_less")
                        : $t("pages.templates.show_all", {
                            count: getOptionsForKey(selectedPlaceholderKey)
                              .length,
                          })
                    }}
                  </UButton>
                </div>
              </div>

              <!-- Preview of current value -->
              <div
                v-if="placeholderValues[selectedPlaceholderKey]?.trim()"
                class="p-2 sm:p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
              >
                <p
                  class="text-[10px] sm:text-xs font-medium text-primary-700 dark:text-primary-300 mb-1"
                >
                  {{ $t("pages.templates.preview") }}
                </p>
                <p
                  class="text-xs sm:text-sm text-gray-900 dark:text-white font-mono break-words"
                >
                  {{ placeholderValues[selectedPlaceholderKey] }}
                </p>
              </div>
            </div>

            <!-- Navigation hints -->
            <div
              class="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700"
            >
              <GlassButton
                :disabled="selectedPlaceholderIndex === 0"
                color="neutral"
                variant="ghost"
                size="xs"
                class="text-xs"
                @click="
                  selectedPlaceholderIndex = Math.max(
                    0,
                    selectedPlaceholderIndex - 1
                  )
                "
                icon="i-heroicons-chevron-left"
              >
                <span v-once class="hidden sm:inline">{{
                  $t("pages.templates.previous")
                }}</span>
              </GlassButton>

              <span class="text-[10px] sm:text-xs text-gray-500">
                {{ selectedPlaceholderIndex + 1 }} /
                {{ detectedPlaceholders.length }}
              </span>

              <GlassButton
                :disabled="
                  selectedPlaceholderIndex === detectedPlaceholders.length - 1
                "
                color="neutral"
                variant="ghost"
                size="xs"
                class="text-xs"
                @click="
                  selectedPlaceholderIndex = Math.min(
                    detectedPlaceholders.length - 1,
                    selectedPlaceholderIndex + 1
                  )
                "
                icon="i-heroicons-chevron-right"
                icon-position="right"
              >
                <span v-once class="hidden sm:inline">{{
                  $t("pages.templates.next")
                }}</span>
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- RESULT: Final Prompt -->
    <GlassCard
      v-if="resultPrompt"
      padding="sm"
      class="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20"
    >
      <template #header>
        <div class="flex items-center justify-between gap-2">
          <h3
            class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
          >
            <span v-once>{{ $t("pages.templates.final_prompt") }}</span>
          </h3>
          <div class="flex items-center gap-1 sm:gap-2">
            <GlassBadge
              color="success"
              variant="soft"
              size="sm"
              class="text-[10px] sm:text-xs"
            >
              {{ filledPlaceholders }}/{{ detectedPlaceholders.length }}
              <span v-once>{{ $t("pages.templates.filled") }}</span>
            </GlassBadge>
          </div>
        </div>
      </template>

      <!-- Result text -->
      <div class="space-y-2 sm:space-y-3">
        <pre
          class="whitespace-pre-wrap break-words text-gray-900 dark:text-white font-mono text-xs sm:text-sm p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          >{{ resultPrompt }}</pre
        >

        <!-- Unfilled placeholders warning -->
        <div
          v-if="unfilledPlaceholders.length > 0"
          class="p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div class="flex items-start gap-1.5 sm:gap-2">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
            />
            <div class="flex-1 min-w-0">
              <p
                class="text-xs sm:text-sm font-medium text-yellow-900 dark:text-yellow-100"
              >
                {{ $t("pages.templates.unfilled_placeholders") }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <button
                  v-for="key in unfilledPlaceholders"
                  :key="key"
                  type="button"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 rounded text-[10px] sm:text-xs font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                  @click="
                    selectedPlaceholderIndex = detectedPlaceholders.indexOf(key)
                  "
                >
                  [{{ key }}]
                  <UIcon
                    name="i-heroicons-pencil"
                    class="w-2.5 h-2.5 sm:w-3 sm:h-3"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
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

// NAPRAWA: Konwertuj template.id na string
const templateIdString = computed(() => {
  return props.template.id?.toString() || "";
});

// Check if current prompt is saved in library
const isInLibrary = computed(() => {
  return savedPrompts.value.some(
    (p) =>
      p.promptId === templateIdString.value && p.savedId === savedPromptId.value
  );
});

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

  // Jeśli to zapisany prompt, załaduj zapisane wartości
  if (props.template.placeholderValues) {
    Object.entries(props.template.placeholderValues).forEach(([key, value]) => {
      placeholderValues.value[key] = String(value ?? "");
    });
  }

  checkIfInLibrary();
  addToHistory(props.template);
  updateResult();
};

// Check if prompt is in library
const checkIfInLibrary = () => {
  const existing = savedPrompts.value.find(
    (p) => p.promptId === templateIdString.value
  );
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
    const saved = savePrompt({
      savedId: `saved_${Date.now()}`,
      promptId: templateIdString.value,
      result: resultPrompt.value,
      placeholderValues: { ...placeholderValues.value },
      timestamp: Date.now(),
    });
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
