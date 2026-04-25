<template>
  <div class="mt-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
      {{ $t("library.tags.favorites_title") || "Ulubione tagi" }}
    </h3>
    <div class="space-y-6">
      <template v-if="Object.keys(groupedFavorites).length">
        <div
          v-for="(items, category) in groupedFavorites"
          :key="category"
          class="animate-fade-in"
        >
          <h4 class="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <UIcon name="i-heroicons-tag" class="w-4 h-4 text-primary-500" />
            {{
              category === "_uncategorized"
                ? $t("pages.library.tags.uncategorized") || "Inne"
                : category
            }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="tagObj in items"
              :key="tagObj.raw"
              class="inline-flex items-center bg-gray-100 dark:bg-slate-800/80 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full px-3 py-1.5 text-sm text-gray-700 dark:text-slate-200 transition-colors border border-transparent hover:border-primary-500/30"
            >
              <button
                class="mr-2 font-medium"
                @click="$emit('filter', tagObj.raw)"
              >
                {{
                  locale === "pl"
                    ? tagObj.pl || tagObj.en
                    : tagObj.en || tagObj.pl
                }}
              </button>
              <button 
                class="text-gray-400 hover:text-rose-500 transition-colors"
                @click="$emit('delete', tagObj.raw)"
              >
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-center py-12 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
          <UIcon name="i-heroicons-star" class="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">
            {{ $t("library.custom.no_favorite_tags") }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  groupedFavorites: Record<string, any[]>;
}>();

const { locale } = useI18n();

defineEmits<{
  filter: [tag: string];
  delete: [tag: string];
}>();
</script>
