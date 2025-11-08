<template>
  <div>
    <!-- Mobile: Ultra Compact Grid + Actions -->
    <div class="sm:hidden">
      <div class="flex flex-col gap-2 mb-3">
        <!-- Stats in 3x2 grid -->
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="stat in mobileStats"
            :key="stat.key"
            class="glass-card rounded-lg p-2"
          >
            <div class="flex flex-col items-center text-center">
              <UIcon :name="stat.icon" :class="['w-5 h-5 mb-1', stat.color]" />
              <div
                :class="['text-base font-bold leading-none', stat.textColor]"
              >
                {{ stat.value }}
              </div>
              <div
                class="text-[8px] text-gray-600 dark:text-gray-400 leading-tight mt-0.5 px-1"
              >
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Import/Export buttons on mobile -->
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="$emit('import')"
            class="h-8 rounded-lg bg-success-500/20 hover:bg-success-500/30 text-success-600 dark:text-success-400 flex items-center justify-center gap-1.5 transition-colors"
            :title="$t('library.import')"
          >
            <UIcon name="i-heroicons-arrow-up-tray" class="w-3.5 h-3.5" />
            <span class="text-[11px] font-medium">{{
              $t("library.import")
            }}</span>
          </button>
          <button
            @click="$emit('export')"
            class="h-8 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-600 dark:text-primary-400 flex items-center justify-center gap-1.5 transition-colors"
            :title="$t('library.export')"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5" />
            <span class="text-[11px] font-medium">{{
              $t("library.export")
            }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop: Grid layout -->
    <div class="hidden sm:grid grid-cols-2 md:grid-cols-6 gap-3 lg:gap-4">
      <!-- Saved (bookmark, primary) -->
      <GlassCard padding="md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-bookmark"
            class="mx-auto mb-1 text-primary-500 w-5 h-5 lg:w-6 lg:h-6"
          />
          <div
            class="text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400"
          >
            {{ stats.totalSaved }}
          </div>
          <div class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span v-once>{{ $t("library.stats.saved") }}</span>
          </div>
        </div>
      </GlassCard>

      <!-- Custom (pencil, success) -->
      <GlassCard padding="md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-pencil"
            class="mx-auto mb-1 text-success-500 w-5 h-5 lg:w-6 lg:h-6"
          />
          <div
            class="text-2xl lg:text-3xl font-bold text-success-600 dark:text-success-400"
          >
            {{ stats.totalCustom }}
          </div>
          <div class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span v-once>{{ $t("library.stats.custom") }}</span>
          </div>
        </div>
      </GlassCard>

      <!-- Editor Prompts (sparkles, indigo) -->
      <GlassCard padding="md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-sparkles"
            class="mx-auto mb-1 text-indigo-500 w-5 h-5 lg:w-6 lg:h-6"
          />
          <div
            class="text-2xl lg:text-3xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            {{ stats.totalEditorPrompts }}
          </div>
          <div class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span v-once>{{ $t("library.stats.editorPrompts") }}</span>
          </div>
        </div>
      </GlassCard>

      <!-- Tag Favorites (star, pink) -->
      <GlassCard padding="md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-star"
            class="mx-auto mb-1 text-pink-500 w-5 h-5 lg:w-6 lg:h-6"
          />
          <div
            class="text-2xl lg:text-3xl font-bold text-pink-600 dark:text-pink-400"
          >
            {{ stats.totalTagFavorites }}
          </div>
          <div class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span v-once>{{ $t("library.stats.tagFavorites") }}</span>
          </div>
        </div>
      </GlassCard>

      <!-- History (clock, warning) -->
      <GlassCard padding="md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-clock"
            class="mx-auto mb-1 text-warning-500 w-5 h-5 lg:w-6 lg:h-6"
          />
          <div
            class="text-2xl lg:text-3xl font-bold text-warning-600 dark:text-warning-400"
          >
            {{ stats.totalHistory }}
          </div>
          <div class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span v-once>{{ $t("library.stats.history") }}</span>
          </div>
        </div>
      </GlassCard>

      <!-- Collections (folder, info) -->
      <GlassCard padding="md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-folder"
            class="mx-auto mb-1 text-blue-500 w-5 h-5 lg:w-6 lg:h-6"
          />
          <div
            class="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400"
          >
            {{ stats.totalCollections }}
          </div>
          <div class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span v-once>{{ $t("library.stats.collections") }}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: {
    totalSaved: number;
    totalCustom: number;
    totalCollections: number;
    totalHistory: number;
    totalEditorPrompts: number;
    totalTagFavorites: number;
  };
}>();

defineEmits<{
  import: [];
  export: [];
}>();

const { t } = useI18n();

const mobileStats = computed(() => [
  {
    key: "saved",
    icon: "i-heroicons-bookmark",
    color: "text-primary-500",
    textColor: "text-primary-600 dark:text-primary-400",
    value: props.stats.totalSaved,
    label: t("library.stats.saved"),
  },
  {
    key: "custom",
    icon: "i-heroicons-pencil",
    color: "text-success-500",
    textColor: "text-success-600 dark:text-success-400",
    value: props.stats.totalCustom,
    label: t("library.stats.custom"),
  },
  {
    key: "editor",
    icon: "i-heroicons-sparkles",
    color: "text-indigo-500",
    textColor: "text-indigo-600 dark:text-indigo-400",
    value: props.stats.totalEditorPrompts,
    label: t("library.stats.editorPrompts"),
  },
  {
    key: "tags",
    icon: "i-heroicons-star",
    color: "text-pink-500",
    textColor: "text-pink-600 dark:text-pink-400",
    value: props.stats.totalTagFavorites,
    label: t("library.stats.tagFavorites"),
  },
  {
    key: "history",
    icon: "i-heroicons-clock",
    color: "text-warning-500",
    textColor: "text-warning-600 dark:text-warning-400",
    value: props.stats.totalHistory,
    label: t("library.stats.history"),
  },
  {
    key: "collections",
    icon: "i-heroicons-folder",
    color: "text-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    value: props.stats.totalCollections,
    label: t("library.stats.collections"),
  },
]);
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
