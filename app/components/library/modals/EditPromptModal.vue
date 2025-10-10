<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('library.modals.edit.title')"
    :description="$t('library.modals.edit.description')"
    :ui="{
      content: 'max-w-4xl',
      body: 'overflow-y-auto max-h-[calc(100vh-16rem)]',
      footer: 'justify-between',
    }"
  >
    <template #body>
      <div v-if="editData" class="space-y-8">
        <!-- Sekcja: Podstawowe informacje -->
        <div class="space-y-4">
          <div
            class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
          >
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-primary-500"
            />
            <span>{{ $t("library.modals.edit.sections.basic") }}</span>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Nazwa PL -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <UIcon name="i-heroicons-language" class="w-4 h-4" />
                <span>{{ $t("library.modals.edit.fields.namePL") }}</span>
                <UBadge color="primary" variant="subtle" size="xs">
                  {{ $t("library.modals.edit.badges.pl") }}
                </UBadge>
              </label>
              <UInput
                v-model="editData.name.pl"
                :placeholder="$t('library.modals.edit.placeholders.namePL')"
                size="lg"
                leading-icon="i-heroicons-pencil"
                class="w-full"
              />
            </div>

            <!-- Nazwa EN -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <UIcon name="i-heroicons-language" class="w-4 h-4" />
                <span>{{ $t("library.modals.edit.fields.nameEN") }}</span>
                <UBadge color="info" variant="subtle" size="xs">
                  {{ $t("library.modals.edit.badges.en") }}
                </UBadge>
              </label>
              <UInput
                v-model="editData.name.en"
                :placeholder="$t('library.modals.edit.placeholders.nameEN')"
                size="lg"
                leading-icon="i-heroicons-pencil"
                class="w-full"
              />
            </div>

            <!-- Opis PL -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                <span>{{
                  $t("library.modals.edit.fields.descriptionPL")
                }}</span>
                <UBadge color="primary" variant="subtle" size="xs">
                  {{ $t("library.modals.edit.badges.pl") }}
                </UBadge>
              </label>
              <UTextarea
                v-model="editData.description.pl"
                :rows="3"
                :placeholder="
                  $t('library.modals.edit.placeholders.descriptionPL')
                "
                class="w-full"
              />
            </div>

            <!-- Opis EN -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                <span>{{
                  $t("library.modals.edit.fields.descriptionEN")
                }}</span>
                <UBadge color="info" variant="subtle" size="xs">
                  {{ $t("library.modals.edit.badges.en") }}
                </UBadge>
              </label>
              <UTextarea
                v-model="editData.description.en"
                :rows="3"
                :placeholder="
                  $t('library.modals.edit.placeholders.descriptionEN')
                "
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Sekcja: Szablon -->
        <div class="space-y-4">
          <div
            class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
          >
            <UIcon
              name="i-heroicons-code-bracket"
              class="w-5 h-5 text-green-500"
            />
            <span>{{ $t("library.modals.edit.sections.template") }}</span>
          </div>

          <div class="grid gap-6">
            <!-- Template PL -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span>{{ $t("library.modals.edit.fields.templatePL") }}</span>
                <UBadge color="primary" variant="subtle" size="xs">
                  {{ $t("library.modals.edit.badges.pl") }}
                </UBadge>
              </label>
              <UTextarea
                v-model="editData.template.pl"
                :rows="6"
                class="font-mono text-sm w-full"
                :placeholder="$t('library.modals.edit.placeholders.templatePL')"
              />
            </div>

            <!-- Template EN -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span>{{ $t("library.modals.edit.fields.templateEN") }}</span>
                <UBadge color="info" variant="subtle" size="xs">
                  {{ $t("library.modals.edit.badges.en") }}
                </UBadge>
              </label>
              <UTextarea
                v-model="editData.template.en"
                :rows="6"
                class="font-mono text-sm w-full"
                :placeholder="$t('library.modals.edit.placeholders.templateEN')"
              />
            </div>
          </div>
        </div>

        <!-- Sekcja: Kategorie i Tagi -->
        <div class="space-y-4">
          <div
            class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
          >
            <UIcon name="i-heroicons-tag" class="w-5 h-5 text-purple-500" />
            <span>{{ $t("library.modals.edit.sections.organization") }}</span>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Kategorie -->
            <div class="space-y-3">
              <label
                class="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span class="flex items-center gap-2">
                  <UIcon name="i-heroicons-folder" class="w-4 h-4" />
                  {{ $t("library.modals.edit.fields.categories") }}
                </span>
                <span class="text-xs text-gray-400">
                  {{
                    $t("library.modals.edit.hints.categoryCount", {
                      count: editData.categories.length,
                    })
                  }}
                </span>
              </label>

              <div
                class="flex flex-wrap gap-2 min-h-[2.5rem] p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              >
                <template
                  v-for="(cat, i) in editData.categories"
                  :key="`cat-${i}`"
                >
                  <UBadge
                    color="primary"
                    variant="solid"
                    size="lg"
                    class="cursor-pointer hover:bg-red-500 transition-colors"
                    @click="removeCategory(i)"
                  >
                    {{ cat }}
                    <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1" />
                  </UBadge>
                </template>
              </div>

              <div class="relative">
                <div class="flex gap-2">
                  <UInput
                    v-model="newCategory"
                    :placeholder="
                      $t('library.modals.edit.placeholders.category')
                    "
                    size="md"
                    class="flex-1"
                    leading-icon="i-heroicons-folder"
                    @keydown.enter="addCategory()"
                  >
                    <template v-if="newCategory.trim()" #trailing>
                      <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-heroicons-x-mark"
                        :aria-label="$t('library.modals.edit.actions.clear')"
                        @click="newCategory = ''"
                      />
                    </template>
                  </UInput>
                  <UButton
                    icon="i-heroicons-plus"
                    color="primary"
                    @click="addCategory()"
                    :disabled="!newCategory.trim()"
                  >
                    {{ $t("library.modals.edit.actions.add") }}
                  </UButton>
                </div>

                <!-- Sugestie kategorii -->
                <div
                  v-if="suggestedCategories.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto"
                >
                  <button
                    v-for="cat in suggestedCategories"
                    :key="cat"
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    @click="addCategory(cat)"
                  >
                    <UIcon
                      name="i-heroicons-folder"
                      class="w-4 h-4 text-gray-400"
                    />
                    <span>{{ cat }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tagi -->
            <div class="space-y-3">
              <label
                class="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span class="flex items-center gap-2">
                  <UIcon name="i-heroicons-hashtag" class="w-4 h-4" />
                  {{ $t("library.modals.edit.fields.tags") }}
                </span>
                <span class="text-xs text-gray-400">
                  {{
                    $t("library.modals.edit.hints.tagCount", {
                      count: editData.tags.length,
                    })
                  }}
                </span>
              </label>

              <div
                class="flex flex-wrap gap-2 min-h-[2.5rem] p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              >
                <template v-for="(tag, i) in editData.tags" :key="`tag-${i}`">
                  <UBadge
                    color="secondary"
                    variant="solid"
                    size="lg"
                    class="cursor-pointer hover:bg-red-500 transition-colors"
                    @click="removeTag(i)"
                  >
                    {{ tag }}
                    <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1" />
                  </UBadge>
                </template>
              </div>

              <div class="relative">
                <div class="flex gap-2">
                  <UInput
                    v-model="newTag"
                    :placeholder="$t('library.modals.edit.placeholders.tag')"
                    size="md"
                    class="flex-1"
                    leading-icon="i-heroicons-hashtag"
                    @keydown.enter="addTag()"
                  >
                    <template v-if="newTag.trim()" #trailing>
                      <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-heroicons-x-mark"
                        :aria-label="$t('library.modals.edit.actions.clear')"
                        @click="newTag = ''"
                      />
                    </template>
                  </UInput>
                  <UButton
                    icon="i-heroicons-plus"
                    color="secondary"
                    @click="addTag()"
                    :disabled="!newTag.trim()"
                  >
                    {{ $t("library.modals.edit.actions.add") }}
                  </UButton>
                </div>

                <!-- Sugestie tagów -->
                <div
                  v-if="suggestedTags.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto"
                >
                  <button
                    v-for="tag in suggestedTags"
                    :key="tag"
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    @click="addTag(tag)"
                  >
                    <UIcon
                      name="i-heroicons-hashtag"
                      class="w-4 h-4 text-gray-400"
                    />
                    <span>{{ tag }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sekcja: Placeholders -->
        <div class="space-y-4">
          <div
            class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
          >
            <UIcon
              name="i-heroicons-variable"
              class="w-5 h-5 text-orange-500"
            />
            <span>{{ $t("library.modals.edit.sections.variables") }}</span>
            <span class="text-xs text-gray-400 font-normal">
              {{ $t("library.modals.edit.sections.variables_hint") }}
            </span>
          </div>

          <div class="space-y-3">
            <div
              v-if="editData.placeholderEntries.length > 0"
              class="space-y-2"
            >
              <div
                v-for="(ph, i) in editData.placeholderEntries"
                :key="`ph-${i}`"
                class="flex gap-3 items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-primary-400 transition-colors"
              >
                <div class="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label
                      class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                    >
                      {{ $t("library.modals.edit.labels.key") }}
                    </label>
                    <UInput
                      v-model="ph.key"
                      :placeholder="
                        $t(
                          'library.modals.edit.placeholders.variableKeyExample'
                        )
                      "
                      size="md"
                      leading-icon="i-heroicons-key"
                      class="font-mono"
                    />
                  </div>
                  <div>
                    <label
                      class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                    >
                      {{ $t("library.modals.edit.labels.value") }}
                    </label>
                    <UInput
                      v-model="ph.value"
                      :placeholder="
                        $t(
                          'library.modals.edit.placeholders.variableValueExample'
                        )
                      "
                      size="md"
                      leading-icon="i-heroicons-pencil-square"
                    />
                  </div>
                </div>
                <UButton
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="md"
                  class="mt-6"
                  :aria-label="$t('library.modals.edit.actions.remove')"
                  @click="removePlaceholder(i)"
                />
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-400 text-sm">
              <UIcon
                name="i-heroicons-variable"
                class="w-12 h-12 mx-auto mb-2 opacity-30"
              />
              <p>{{ $t("library.modals.edit.empty.noVariables") }}</p>
            </div>

            <!-- Dodaj nowy placeholder -->
            <div
              class="flex gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-400 transition-colors"
            >
              <UInput
                v-model="newPlaceholderKey"
                :placeholder="
                  $t('library.modals.edit.placeholders.variableKey')
                "
                size="md"
                class="flex-1 font-mono"
                leading-icon="i-heroicons-key"
                @keydown.enter="addPlaceholder"
              >
                <template v-if="newPlaceholderKey.trim()" #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-heroicons-x-mark"
                    :aria-label="$t('library.modals.edit.actions.clear')"
                    @click="newPlaceholderKey = ''"
                  />
                </template>
              </UInput>
              <UInput
                v-model="newPlaceholderValue"
                :placeholder="
                  $t('library.modals.edit.placeholders.variableValue')
                "
                size="md"
                class="flex-1"
                leading-icon="i-heroicons-pencil-square"
                @keydown.enter="addPlaceholder"
              >
                <template v-if="newPlaceholderValue.trim()" #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-heroicons-x-mark"
                    :aria-label="$t('library.modals.edit.actions.clear')"
                    @click="newPlaceholderValue = ''"
                  />
                </template>
              </UInput>
              <UButton
                icon="i-heroicons-plus"
                color="primary"
                @click="addPlaceholder"
                :disabled="!newPlaceholderKey.trim()"
              >
                {{ $t("library.modals.edit.actions.add") }}
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 text-gray-500">
        <UIcon
          name="i-heroicons-exclamation-circle"
          class="w-16 h-16 mx-auto mb-4 opacity-30"
        />
        <p class="text-lg">{{ $t("library.modals.edit.empty.noData") }}</p>
      </div>
    </template>

    <template #footer>
      <div class="text-xs text-gray-500 flex items-center">
        <UIcon name="i-heroicons-information-circle" class="w-4 h-4 mr-1" />
        {{ $t("library.modals.edit.hints.saveNote") }}
      </div>
      <div class="flex items-center gap-3">
        <UButton color="neutral" variant="outline" @click="close" size="lg">
          <UIcon name="i-heroicons-x-mark" class="mr-2" />
          {{ $t("common.cancel") }}
        </UButton>
        <UButton
          color="primary"
          @click="handleSave"
          :disabled="!canSave"
          size="lg"
        >
          <UIcon name="i-heroicons-check" class="mr-2" />
          {{ $t("common.save") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { SavedPrompt } from "~/composables/useLibrary";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  open: boolean;
  prompt: SavedPrompt | null;
}>();

const emit = defineEmits<{
  "update:open": [v: boolean];
  save: [data: SavedPrompt];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit("update:open", v),
});

type LangText = { pl: string; en: string };
type PlaceholderEntry = { key: string; value: string };

const emptyLang = (): LangText => ({ pl: "", en: "" });

const editData = ref<{
  savedId: string;
  promptId: string;
  name: LangText;
  description: LangText;
  template: LangText;
  tags: string[];
  categories: string[];
  placeholderEntries: PlaceholderEntry[];
  result?: string;
  isCustom?: boolean;
} | null>(null);

const newTag = ref("");
const newCategory = ref("");
const newPlaceholderKey = ref("");
const newPlaceholderValue = ref("");

// Pobierz preloadowane tagi i kategorie
const { availableTags, availableCategories } = usePreloadedContent();

// Pobierz wszystkie zapisane prompty z biblioteki
const { savedPrompts, customPrompts } = useLibrary();

// Łączenie tagów z content i z biblioteki
const existingTags = computed(() => {
  const allTags = new Set<string>(availableTags.value || []);

  [...savedPrompts.value, ...customPrompts.value].forEach((p) => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach((tag) => allTags.add(tag));
    }
  });

  return Array.from(allTags).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
});

// Łączenie kategorii z content i z biblioteki
const existingCategories = computed(() => {
  const allCategories = new Set<string>(availableCategories.value || []);

  [...savedPrompts.value, ...customPrompts.value].forEach((p) => {
    if (Array.isArray(p.categories)) {
      p.categories.forEach((cat) => allCategories.add(cat));
    }
  });

  return Array.from(allCategories).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
});

// Filtrowane sugestie tagów (bez już dodanych)
const suggestedTags = computed(() => {
  if (!newTag.value.trim() || !editData.value) return [];

  const search = newTag.value.toLowerCase();
  return existingTags.value
    .filter(
      (tag) =>
        tag.toLowerCase().includes(search) &&
        !editData.value!.tags.includes(tag)
    )
    .slice(0, 5);
});

// Filtrowane sugestie kategorii (bez już dodanych)
const suggestedCategories = computed(() => {
  if (!newCategory.value.trim() || !editData.value) return [];

  const search = newCategory.value.toLowerCase();
  return existingCategories.value
    .filter(
      (cat) =>
        cat.toLowerCase().includes(search) &&
        !editData.value!.categories.includes(cat)
    )
    .slice(0, 5);
});

const toLang = (v: any): LangText => {
  if (!v) return emptyLang();
  if (typeof v === "string") return { pl: v, en: v };
  return { pl: v.pl ?? "", en: v.en ?? "" };
};

watch(
  () => props.prompt,
  (p) => {
    if (!p) {
      editData.value = null;
      return;
    }

    console.log("📝 Ładowanie promptu do edycji:", {
      savedId: p.savedId,
      tags: p.tags,
      categories: p.categories,
      placeholderValues: p.placeholderValues,
      placeholder_keys: p.placeholder_keys,
    });

    const placeholderEntries: PlaceholderEntry[] = [];

    // POPRAWKA: Użyj placeholder_keys jeśli są dostępne
    if (p.placeholder_keys && Array.isArray(p.placeholder_keys)) {
      p.placeholder_keys.forEach((key) => {
        const value = p.placeholderValues?.[key] ?? "";
        placeholderEntries.push({ key, value: String(value) });
      });
    } else if (p.placeholderValues) {
      // Fallback - załaduj z placeholderValues
      for (const [k, v] of Object.entries(p.placeholderValues)) {
        placeholderEntries.push({ key: k, value: String(v ?? "") });
      }
    }

    editData.value = {
      savedId: p.savedId,
      promptId: p.promptId,
      name: toLang(p.name),
      description: toLang(p.description),
      template: toLang(p.template ?? p.result),
      tags: Array.isArray(p.tags) ? [...p.tags] : [],
      categories: Array.isArray(p.categories) ? [...p.categories] : [],
      placeholderEntries,
      result: typeof p.result === "string" ? p.result : "",
      isCustom: !!p.isCustom,
    };

    console.log("✅ Załadowano dane do edycji:", {
      tags: editData.value.tags,
      categories: editData.value.categories,
      placeholderEntries: editData.value.placeholderEntries,
    });
  },
  { immediate: true }
);

const addTag = (tag?: string) => {
  if (!editData.value) return;
  const tagToAdd = tag || newTag.value.trim();
  if (!tagToAdd) return;
  if (!editData.value.tags.includes(tagToAdd))
    editData.value.tags.push(tagToAdd);
  newTag.value = "";
};

const removeTag = (i: number) => {
  editData.value?.tags.splice(i, 1);
};

const addCategory = (category?: string) => {
  if (!editData.value) return;
  const catToAdd = category || newCategory.value.trim();
  if (!catToAdd) return;
  if (!editData.value.categories.includes(catToAdd))
    editData.value.categories.push(catToAdd);
  newCategory.value = "";
};

const removeCategory = (i: number) => {
  editData.value?.categories.splice(i, 1);
};

const addPlaceholder = () => {
  if (!editData.value) return;
  const k = newPlaceholderKey.value.trim();
  if (!k) return;
  editData.value.placeholderEntries.push({
    key: k,
    value: newPlaceholderValue.value,
  });
  newPlaceholderKey.value = "";
  newPlaceholderValue.value = "";
};

const removePlaceholder = (i: number) => {
  editData.value?.placeholderEntries.splice(i, 1);
};

const canSave = computed(() => {
  return (
    !!editData.value &&
    (editData.value.name.pl.trim() || editData.value.template.pl.trim())
  );
});

const close = () => {
  emit("update:open", false);
};

const handleSave = () => {
  if (!editData.value) return;

  const placeholderValues: Record<string, string> = {};
  const placeholder_keys: string[] = [];

  for (const e of editData.value.placeholderEntries) {
    if (e.key.trim()) {
      placeholderValues[e.key] = e.value ?? "";
      placeholder_keys.push(e.key);
    }
  }

  // POPRAWKA: Upewnij się, że wszystkie pola są przekazywane
  const saved: SavedPrompt = {
    savedId: editData.value.savedId,
    promptId: editData.value.promptId,
    name: editData.value.name,
    description: editData.value.description,
    template: editData.value.template,
    result: editData.value.template.pl || editData.value.template.en || "", // Fallback
    placeholderValues,
    placeholder_keys,
    timestamp: Date.now(), // Zachowaj oryginalny lub użyj nowego
    savedAt: Date.now(),
    isCustom: !!editData.value.isCustom,
    // WAŻNE: Przekaż tagi i kategorie nawet jeśli są puste
    tags: editData.value.tags || [],
    categories: editData.value.categories || [],
  };

  console.log("💾 Zapisywanie promptu (przed emit):", {
    tags: saved.tags,
    categories: saved.categories,
    placeholder_keys: saved.placeholder_keys,
    placeholderValues: saved.placeholderValues,
    name: saved.name,
    description: saved.description,
    template: saved.template,
  });

  emit("save", saved);
  close();
};
</script>
