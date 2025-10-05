<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Analiza kluczy opcji
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Wszystkie klucze oraz analiza duplikatów
        </p>
      </div>
      <div class="flex gap-2">
        <UButton
          v-if="duplicateGroups.length > 0"
          @click="mergeDuplicates"
          color="warning"
          variant="solid"
        >
          <UIcon name="i-heroicons-arrow-path" class="mr-2" />
          Połącz duplikaty ({{ duplicateGroups.length }})
        </UButton>
        <UButton @click="exportCleanedJson" variant="outline">
          <UIcon name="i-heroicons-document-text" class="mr-2" />
          Eksportuj oczyszczony JSON
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
      ></div>
      <p>Ładowanie opcji...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>Błąd podczas ładowania: {{ error.message }}</p>
      <UButton @click="refresh()" variant="outline" class="mt-4">
        Spróbuj ponownie
      </UButton>
    </div>

    <!-- Results -->
    <div v-else-if="promptsData" class="space-y-6">
      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">
              {{ allKeys.length }}
            </div>
            <div class="text-sm text-gray-500">Wszystkie klucze</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ duplicateKeys.length }}
            </div>
            <div class="text-sm text-gray-500">Zduplikowane klucze</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ uniqueKeys.length }}
            </div>
            <div class="text-sm text-gray-500">Unikalne klucze</div>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ Object.keys(cleanedData).length }}
            </div>
            <div class="text-sm text-gray-500">Po oczyszczeniu</div>
          </div>
        </UCard>
      </div>

      <!-- Merge Actions -->
      <UCard
        v-if="duplicateGroups.length > 0"
        class="border-orange-200 dark:border-orange-800"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="text-orange-500"
            />
            <h2 class="text-lg font-semibold text-orange-600">
              Akcje dla duplikatów ({{ duplicateGroups.length }} grup)
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <div
            v-for="group in duplicateGroups"
            :key="group.normalizedKey"
            class="border border-orange-200 dark:border-orange-800 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-orange-600">
                Grupa: "{{ group.normalizedKey }}" → "{{ group.mergedKey }}"
              </h3>
              <div class="flex gap-2">
                <UButton
                  @click="previewMerge(group)"
                  size="xs"
                  variant="outline"
                  color="warning"
                >
                  <UIcon name="i-heroicons-eye" class="mr-1" />
                  Podgląd
                </UButton>
                <UButton @click="mergeGroup(group)" size="xs" color="warning">
                  <UIcon name="i-heroicons-arrow-path" class="mr-1" />
                  Połącz
                </UButton>
              </div>
            </div>

            <div class="grid gap-2">
              <div
                v-for="key in group.keys"
                :key="key"
                class="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded"
              >
                <div class="flex items-center gap-2">
                  <span class="font-mono">{{ key }}</span>
                  <UBadge variant="soft" size="xs" color="warning"
                    >{{ getItemCount(key) }} opcji</UBadge
                  >
                </div>
                <div class="flex items-center gap-2">
                  <UButton
                    @click="showKeyPreview(key)"
                    size="xs"
                    variant="ghost"
                    icon="i-heroicons-eye"
                  />
                  <UButton
                    @click="copyKey(key)"
                    size="xs"
                    variant="ghost"
                    icon="i-heroicons-clipboard"
                  />
                </div>
              </div>
            </div>

            <!-- Merged preview -->
            <div
              v-if="group.mergedItems"
              class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800"
            >
              <h4 class="text-sm font-semibold text-green-600 mb-2">
                Po połączeniu ({{ group.mergedItems.length }} opcji):
              </h4>
              <div
                class="text-xs font-mono text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto"
              >
                <div
                  v-for="item in group.mergedItems.slice(0, 5)"
                  :key="item.value"
                  class="truncate"
                >
                  {{ item.value }} →
                  {{ item.label?.pl || item.label?.en || item.value }}
                </div>
                <div v-if="group.mergedItems.length > 5" class="text-gray-500">
                  +{{ group.mergedItems.length - 5 }} więcej...
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Cleaned Data Preview -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-green-600">
              Oczyszczony JSON ({{ Object.keys(cleanedData).length }} kluczy)
            </h2>
            <div class="flex gap-2">
              <UButton @click="copyCleanedJson" variant="outline" size="xs">
                <UIcon name="i-heroicons-clipboard" class="mr-1" />
                Kopiuj JSON
              </UButton>
              <UButton @click="downloadCleanedJson" variant="outline" size="xs">
                <UIcon name="i-heroicons-arrow-down-tray" class="mr-1" />
                Pobierz
              </UButton>
            </div>
          </div>
        </template>
      </UCard>

      <!-- All Keys Section -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Wszystkie klucze ({{ allKeys.length }})
          </h2>
        </template>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="keyInfo in allKeys"
            :key="keyInfo.key"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded"
          >
            <div class="flex items-center gap-3">
              <span class="font-mono">{{ keyInfo.key }}</span>
              <UBadge v-if="keyInfo.isDuplicate" color="warning" size="xs"
                >DUPLIKAT</UBadge
              >
              <UBadge variant="soft" size="xs"
                >{{ keyInfo.itemCount }} opcji</UBadge
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">{{
                keyInfo.normalizedKey
              }}</span>
              <UButton
                variant="ghost"
                size="xs"
                @click="copyKey(keyInfo.key)"
                icon="i-heroicons-clipboard"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OptionItem } from "~/types/content";

definePageMeta({
  layout: "dashboard",
});

// Interface dla analizy kluczy
interface KeyAnalysis {
  key: string;
  normalizedKey: string;
  itemCount: number;
  isDuplicate: boolean;
}

// Interface dla grup duplikatów z dodatkowymi polami
interface DuplicateGroup {
  normalizedKey: string;
  keys: string[];
  mergedKey: string;
  mergedItems?: OptionItem[];
}

// Reactive state
const showPreviewModal = ref(false);
const previewTitle = ref("");
const previewData = ref("");

// Wczytaj dane z collection używając nowego API
const {
  data: promptsData,
  pending,
  error,
  refresh,
} = await useAsyncData("options", () => queryCollection("options").first());

// Funkcja normalizująca klucze - usuwa znaki specjalne, spacje, podkreślenia
const normalizeKey = (key: string): string => {
  return key
    .toLowerCase()
    .replace(/[\s_\-\/\\]/g, "")
    .replace(/[^a-z0-9]/g, "");
};

// Funkcja zwracająca liczbę opcji dla klucza
const getItemCount = (key: string): number => {
  const originalMeta = (promptsData.value?.meta ?? {}) as Record<
    string,
    OptionItem[]
  >;
  const items = originalMeta[key] ?? [];
  return Array.isArray(items) ? items.length : 0;
};

// Funkcja generująca preferowany klucz z grupy duplikatów
const getPreferredKey = (keys: string[]): string => {
  if (!keys || keys.length === 0) return "";
  const sorted = [...keys].sort((a, b) => {
    const aScore =
      a.length + (a.includes(" ") ? 100 : 0) + (a.includes("-") ? 50 : 0);
    const bScore =
      b.length + (b.includes(" ") ? 100 : 0) + (b.includes("-") ? 50 : 0);
    return aScore - bScore;
  });
  return sorted[0] || keys[0] || "";
};

// Computed - wszystkie klucze z analizą
const allKeys = computed<KeyAnalysis[]>(() => {
  if (!promptsData.value?.meta || typeof promptsData.value.meta !== "object")
    return [];

  const keys = Object.keys(promptsData.value.meta as Record<string, any>);
  const analysis: KeyAnalysis[] = keys.map((key) => {
    const normalizedKey = normalizeKey(key);
    const itemCount = getItemCount(key);

    return {
      key,
      normalizedKey,
      itemCount,
      isDuplicate: false, // będzie ustawione później
    };
  });

  // Znajdź duplikaty
  const normalizedCounts = new Map<string, string[]>();
  analysis.forEach((item) => {
    if (!normalizedCounts.has(item.normalizedKey)) {
      normalizedCounts.set(item.normalizedKey, []);
    }
    normalizedCounts.get(item.normalizedKey)!.push(item.key);
  });

  // Oznacz duplikaty
  analysis.forEach((item) => {
    const duplicateKeys = normalizedCounts.get(item.normalizedKey) || [];
    item.isDuplicate = duplicateKeys.length > 1;
  });

  return analysis.sort((a, b) => a.key.localeCompare(b.key));
});

// Computed - tylko zduplikowane klucze
const duplicateKeys = computed<KeyAnalysis[]>(() => {
  return allKeys.value.filter((key) => key.isDuplicate);
});

// Computed - tylko unikalne klucze
const uniqueKeys = computed<KeyAnalysis[]>(() => {
  return allKeys.value.filter((key) => !key.isDuplicate);
});

// Computed - grupy duplikatów z dodatkowymi informacjami
const duplicateGroups = computed<DuplicateGroup[]>(() => {
  const groups = new Map<string, string[]>();

  duplicateKeys.value.forEach((item) => {
    if (!groups.has(item.normalizedKey)) {
      groups.set(item.normalizedKey, []);
    }
    if (!groups.get(item.normalizedKey)!.includes(item.key)) {
      groups.get(item.normalizedKey)!.push(item.key);
    }
  });

  return Array.from(groups.entries()).map(([normalizedKey, keys]) => ({
    normalizedKey,
    keys: keys.sort(),
    mergedKey: getPreferredKey(keys) || keys[0] || "",
  }));
});

// Computed - oczyszczone dane bez duplikatów
const cleanedData = computed(() => {
  const originalData = (promptsData.value?.meta ?? {}) as Record<
    string,
    OptionItem[]
  >;
  const cleaned: Record<string, OptionItem[]> = {};
  const processed = new Set<string>();

  // Przetwórz grupy duplikatów
  duplicateGroups.value.forEach((group) => {
    const allItems: OptionItem[] = [];
    const seenValues = new Set<string>();

    // Połącz wszystkie opcje z duplikowanych kluczy
    group.keys.forEach((key) => {
      const items = originalData[key] ?? [];
      items.forEach((item) => {
        if (!item?.value) return; // ignore malformed entries
        if (!seenValues.has(item.value)) {
          seenValues.add(item.value);
          allItems.push(item);
        }
      });
      processed.add(key);
    });

    // Sortuj opcje alfabetycznie po value
    allItems.sort((a, b) => a.value.localeCompare(b.value));
    cleaned[group.mergedKey || ""] = allItems;
  });

  // Dodaj unikalne klucze (nie duplikaty)
  Object.keys(originalData).forEach((key) => {
    if (!processed.has(key)) {
      cleaned[key] = originalData[key] ?? [];
    }
  });

  // Sortuj klucze alfabetycznie
  const sortedCleaned: Record<string, OptionItem[]> = {};
  Object.keys(cleaned)
    .sort()
    .forEach((key) => {
      sortedCleaned[key] = cleaned[key];
    });

  return sortedCleaned;
});

// Funkcje akcji
const mergeGroup = (group: DuplicateGroup) => {
  const originalData = (promptsData.value?.meta ?? {}) as Record<
    string,
    OptionItem[]
  >;
  const allItems: OptionItem[] = [];
  const seenValues = new Set<string>();

  // Połącz wszystkie opcje z grupy
  group.keys.forEach((key) => {
    const items = originalData[key] ?? [];
    items.forEach((item) => {
      if (!item?.value) return;
      if (!seenValues.has(item.value)) {
        seenValues.add(item.value);
        allItems.push(item);
      }
    });
  });

  // Sortuj opcje
  allItems.sort((a, b) => a.value.localeCompare(b.value));
  group.mergedItems = allItems;

  console.log(
    `Połączono grupę "${group.normalizedKey}": ${group.keys.length} kluczy → "${group.mergedKey}" (${allItems.length} opcji)`
  );
};

const mergeDuplicates = () => {
  duplicateGroups.value.forEach((group) => {
    mergeGroup(group);
  });
  console.log("Połączono wszystkie duplikaty!");
};

const previewMerge = (group: DuplicateGroup) => {
  mergeGroup(group);
  previewTitle.value = `Podgląd połączenia: ${group.mergedKey}`;
  previewData.value = JSON.stringify(group.mergedItems ?? [], null, 2);
  showPreviewModal.value = true;
};

const showKeyPreview = (key: string) => {
  const data =
    ((promptsData.value?.meta ?? {}) as Record<string, OptionItem[]>)[key] ??
    [];
  previewTitle.value = `Podgląd klucza: ${key}`;
  previewData.value = JSON.stringify(data, null, 2);
  showPreviewModal.value = true;
};

const copyKey = async (keyName: string) => {
  try {
    await navigator.clipboard.writeText(keyName);
    console.log(`Skopiowano klucz: ${keyName}`);
  } catch (err) {
    console.error("Błąd kopiowania:", err);
  }
};

const copyCleanedJson = async () => {
  try {
    await navigator.clipboard.writeText(
      JSON.stringify(cleanedData.value ?? {}, null, 2)
    );
    console.log("Skopiowano oczyszczony JSON do schowka");
  } catch (err) {
    console.error("Błąd kopiowania:", err);
  }
};

const downloadCleanedJson = () => {
  const blob = new Blob([JSON.stringify(cleanedData.value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `options-cleaned-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportCleanedJson = () => {
  previewTitle.value = "Oczyszczony JSON";
  previewData.value = JSON.stringify(cleanedData.value ?? {}, null, 2);
  showPreviewModal.value = true;
};
</script>
