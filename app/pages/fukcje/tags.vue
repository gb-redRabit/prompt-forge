<template>
  <div class="space-y-6 p-6">
    <!-- Nagłówek -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tagi</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Wszystkie tagi, liczba duplikatów (po polu "pl") i eksport
          oczyszczonego JSON.
        </p>
      </div>
      <div class="flex gap-2">
        <UButton color="primary" variant="solid" @click="copyCleanedJson">
          <UIcon name="i-heroicons-clipboard" class="mr-2" /> Kopiuj JSON
        </UButton>
        <UButton color="neutral" variant="outline" @click="downloadCleanedJson">
          <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" /> Pobierz JSON
        </UButton>
      </div>
    </div>

    <!-- Statystyki -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <div class="text-center">
          <div
            class="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            {{ totalCount }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Łącznie tagów (surowe)
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {{ duplicateCount }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Duplikaty po "pl"
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div
            class="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
          >
            {{ uniqueCount }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Unikalne po "pl"
          </div>
        </div>
      </UCard>
    </div>

    <!-- Lista tagów (surowa) -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Wszystkie tagi (surowe)
          </h3>
          <div class="flex items-center gap-2">
            <UInput
              v-model="search"
              placeholder="Szukaj w pl/en/kategorii..."
              size="sm"
            />
            <UBadge> {{ filteredRawTags.length }} / {{ totalCount }} </UBadge>
          </div>
        </div>
      </template>

      <div class="max-h-[50vh] overflow-y-auto space-y-2">
        <div
          v-for="(tag, i) in filteredRawTags"
          :key="i"
          class="flex items-center justify-between p-2 rounded border border-gray-200 dark:border-gray-700"
          :class="
            isDuplicate(tag)
              ? 'bg-amber-50 dark:bg-amber-900/20'
              : 'bg-white dark:bg-gray-800'
          "
        >
          <div class="min-w-0">
            <div
              class="text-sm font-medium text-gray-900 dark:text-white truncate"
            >
              {{ tag.pl }} <span class="text-gray-400">/</span> {{ tag.en }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              kategoria:
              <span class="font-mono">{{ tag.category || "-" }}</span>
              <span class="mx-2">•</span>
              nsfw:
              <span class="font-mono">{{ tag.nsfw ? "true" : "false" }}</span>
            </div>
          </div>
          <UBadge
            v-if="isDuplicate(tag)"
            color="warning"
            variant="subtle"
            size="xs"
            >duplikat</UBadge
          >
        </div>
      </div>
    </UCard>

    <!-- Podgląd JSON (unikalne) -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Oczyszczone tagi (unikalne po "pl") — {{ uniqueCount }} pozycji
          </h3>
          <div class="flex gap-2">
            <UButton size="xs" variant="ghost" @click="copyCleanedJson">
              <UIcon name="i-heroicons-clipboard" class="mr-1" /> Kopiuj
            </UButton>
            <UButton size="xs" variant="ghost" @click="downloadCleanedJson">
              <UIcon name="i-heroicons-arrow-down-tray" class="mr-1" /> Pobierz
            </UButton>
          </div>
        </div>
      </template>
      <pre class="text-xs whitespace-pre-wrap max-h-[40vh] overflow-y-auto">{{
        cleanedJson
      }}</pre>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

interface TagItem {
  pl: string;
  en: string;
  neg_pl?: string;
  neg_en?: string;
  category?: string;
  nsfw?: boolean;
  // dopuszczamy dodatkowe pola (jeśli istnieją w źródle)
  [key: string]: any;
}

const { tags, isLoaded } = usePreloadedContent();
const search = ref("");

/**
 * Uniwersalne zebranie tagów do płaskiej tablicy:
 * - obsługuje zarówno tablice, jak i obiekty zagnieżdżone (rekurencja)
 * - zbiera obiekty, które mają co najmniej pola "pl" i "en"
 */
const allTagsRaw = computed<TagItem[]>(() => {
  const out: TagItem[] = [];
  const visited = new Set<any>();

  const isTagLike = (obj: any) =>
    obj &&
    typeof obj === "object" &&
    typeof obj.pl === "string" &&
    typeof obj.en === "string";

  const walk = (node: any) => {
    if (!node || visited.has(node)) return;
    visited.add(node);

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (typeof node === "object") {
      if (isTagLike(node)) {
        // Normalizacja minimalna, zachowując oryginalne pola
        out.push({
          pl: node.pl?.toString() ?? "",
          en: node.en?.toString() ?? "",
          neg_pl: node.neg_pl?.toString() ?? "",
          neg_en: node.neg_en?.toString() ?? "",
          category: node.category?.toString() ?? "",
          nsfw: !!node.nsfw,
          ...node,
        });
        return;
      }

      // Jeśli to zwykły obiekt — wejdź w wartości
      Object.values(node).forEach(walk);
      return;
    }
  };

  const src = tags.value;
  if (!src) return out;

  // Jeśli to czysta tablica
  if (Array.isArray(src)) {
    walk(src);
  } else {
    // Obiekt/rekord — rekurencyjnie
    walk(src);
  }

  return out;
});

const totalCount = computed(() => allTagsRaw.value.length);

// Grupowanie po znormalizowanym kluczu "pl"
const normalizePl = (pl?: string) =>
  (pl || "").trim().toLowerCase().replace(/\s+/g, " ");

const duplicateGroups = computed<Map<string, TagItem[]>>(() => {
  const map = new Map<string, TagItem[]>();
  for (const tag of allTagsRaw.value) {
    const key = normalizePl(tag.pl);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tag);
  }
  return map;
});

const duplicateCount = computed(() => {
  let dup = 0;
  for (const [, arr] of duplicateGroups.value.entries()) {
    if (arr.length > 1) dup += arr.length - 1;
  }
  return dup;
});

// Wybór reprezentanta dla grupy duplikatów:
// preferuj nsfw=false, w przeciwnym razie pierwszy
const uniqueByPl = computed<TagItem[]>(() => {
  const unique: TagItem[] = [];
  for (const [, arr] of duplicateGroups.value.entries()) {
    if (arr.length === 1) {
      unique.push(arr[0]);
    } else {
      const safe = arr.find((t) => !t.nsfw);
      unique.push(safe || arr[0]);
    }
  }
  // Stabilne sortowanie po "pl"
  return unique.sort((a, b) =>
    a.pl.localeCompare(b.pl, "pl", { sensitivity: "base" })
  );
});

const uniqueCount = computed(() => uniqueByPl.value.length);

// Filtr wyszukiwania po pl/en/category
const filteredRawTags = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return allTagsRaw.value;
  return allTagsRaw.value.filter((t) => {
    return (
      t.pl?.toLowerCase().includes(q) ||
      t.en?.toLowerCase().includes(q) ||
      (t.category || "").toLowerCase().includes(q)
    );
  });
});

// Oznacz czy dany tag (surowy) jest duplikatem (ma grupę > 1)
const isDuplicate = (tag: TagItem) => {
  const key = normalizePl(tag.pl);
  return key ? (duplicateGroups.value.get(key)?.length || 0) > 1 : false;
};

// JSON do podglądu/eksportu
const cleanedJson = computed(() => JSON.stringify(uniqueByPl.value, null, 2));

const copyCleanedJson = async () => {
  try {
    await navigator.clipboard.writeText(cleanedJson.value);
  } catch (e) {
    console.error("Błąd kopiowania JSON:", e);
  }
};

const downloadCleanedJson = () => {
  const blob = new Blob([cleanedJson.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tags-unique-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>
