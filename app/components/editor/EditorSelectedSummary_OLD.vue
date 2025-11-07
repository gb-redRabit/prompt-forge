<template>
  <div class="flex flex-col space-y-4 h-full">
    <!-- Settings Bar -->
    <div
      class="flex items-center gap-2 flex-shrink-0 p-2 glass-card rounded-xl"
    >
      <USwitch
        :model-value="showNsfw"
        @update:model-value="$emit('update:show-nsfw', $event)"
        color="error"
        size="sm"
        :checked-icon="'i-heroicons-eye'"
        :unchecked-icon="'i-heroicons-eye-slash'"
      />
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        @click="$emit('add-custom-tag')"
        icon="i-heroicons-plus"
      >
        {{ $t("prompt_creator.add_custom_tag") }}
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        @click="$emit('show-negative-templates')"
        icon="i-heroicons-exclamation-triangle"
      >
        Negative
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        @click="$emit('share-prompt')"
        icon="i-heroicons-share"
      >
        Share
      </UButton>
    </div>

    <!-- Main Summary Card -->
    <div class="glass-card flex-1 overflow-hidden flex flex-col shadow-lg">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-primary-500/10 to-purple-600/10 dark:from-primary-500/20 dark:to-purple-600/20 backdrop-blur-sm px-5 py-3 border-b border-white/20 dark:border-gray-700/50 flex-shrink-0"
      >
        <div class="flex justify-between items-center">
          <h3
            class="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2"
          >
            <span
              class="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 shadow-lg shadow-primary-500/50"
            ></span>
            {{ $t("prompt_creator.selected_tags") }}
          </h3>
          <div class="flex gap-4">
            <!-- Categories Count -->
            <div
              class="flex justify-center items-center gap-2 px-3 py-1 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <span
                class="text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                {{ $t("prompt_creator.categories_name").slice(0, 1) }}:
              </span>
              <span
                class="text-sm font-bold text-primary-600 dark:text-primary-400"
              >
                {{ categoriesCount }}
              </span>
            </div>
            <!-- Tags Count -->
            <div
              class="flex justify-center items-center gap-2 px-3 py-1 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <span
                class="text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                {{ $t("prompt_creator.total_tags").slice(0, 1) }}:
              </span>
              <span
                class="text-sm font-bold text-purple-600 dark:text-purple-400"
              >
                {{ totalTagsCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Tags by Category -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div v-if="hasSelectedTags" class="space-y-4">
          <div
            v-for="(tags, category) in selectedTags"
            :key="category"
            class="space-y-2"
          >
            <div class="flex items-center justify-between">
              <h4
                class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <UIcon :name="getCategoryIcon(category)" class="w-4 h-4" />
                {{ getCategoryName(category) }}
              </h4>
              <button
                @click="$emit('clear-category', category)"
                class="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
              >
                {{ $t("common.clear") }} ({{ tags.length }})
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(tag, index) in tags"
                :key="index"
                @click="$emit('remove-tag', category, tag)"
                class="group relative px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {{ getTagText(tag) }}
                <span
                  v-if="tag.weight && tag.weight !== 1.0"
                  class="ml-1 text-xs opacity-70"
                >
                  :{{ tag.weight.toFixed(1) }}
                </span>
                <span
                  v-if="tag.emphasis && tag.emphasis > 0"
                  class="ml-1 text-xs opacity-70"
                >
                  {{ "(".repeat(tag.emphasis) }}
                </span>
                <UIcon
                  name="i-heroicons-x-mark"
                  class="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <UIcon name="i-heroicons-tag" class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-gray-600 dark:text-gray-400 font-medium text-sm">
              {{ $t("prompt_creator.no_selections_yet") }}
            </p>
          </div>
        </div>
      </div>

      <!-- Generated Prompts Preview -->
      <div
        v-if="hasSelectedTags"
        class="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 p-4 space-y-3"
      >
        <!-- Positive -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-2"
            >
              <span
                class="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
              ></span>
              {{ $t("prompt_creator.positive") }}
            </span>
            <button
              @click="$emit('copy-prompt', 'positive')"
              class="px-3 py-1 rounded-lg text-xs font-medium bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:scale-105 transition-all duration-300"
            >
              {{ copiedPositive ? "✓" : "📋" }}
            </button>
          </div>
          <div
            class="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200/50 dark:border-green-800/50 rounded-xl p-3 backdrop-blur-sm"
          >
            <p
              class="text-xs font-mono text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed"
            >
              {{ positivePrompt }}
            </p>
          </div>
        </div>

        <!-- Negative -->
        <div v-if="negativePrompt">
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2"
            >
              <span
                class="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
              ></span>
              {{ $t("prompt_creator.negative") }}
            </span>
            <button
              @click="$emit('copy-prompt', 'negative')"
              class="px-3 py-1 rounded-lg text-xs font-medium bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 transition-all duration-300"
            >
              {{ copiedNegative ? "✓" : "📋" }}
            </button>
          </div>
          <div
            class="bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10 border border-red-200/50 dark:border-red-800/50 rounded-xl p-3 backdrop-blur-sm"
          >
            <p
              class="text-xs font-mono text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed"
            >
              {{ negativePrompt }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 space-y-2.5">
          <UButton
            color="success"
            size="md"
            block
            @click="$emit('save-prompt')"
            class="transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <UIcon name="i-heroicons-bookmark-solid" class="mr-2" />
            {{ $t("common.save") }}
          </UButton>
          <UButton
            color="primary"
            class="transition-all duration-300 hover:scale-105 hover:shadow-lg"
            size="md"
            block
            @click="$emit('use-prompt')"
          >
            <UIcon name="i-heroicons-play-solid" class="mr-2" />
            {{ $t("common.use") }}
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            block
            @click="$emit('clear-all')"
          >
            <UIcon name="i-heroicons-trash" class="mr-2" />
            {{ $t("common.clear_all") }}
          </UButton>

          <!-- Undo/Redo/History -->
          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="outline"
              size="xs"
              @click="$emit('undo')"
              :disabled="!canUndo"
              icon="i-heroicons-arrow-uturn-left"
            >
              {{ $t("common.undo") }}
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="xs"
              @click="$emit('redo')"
              :disabled="!canRedo"
              icon="i-heroicons-arrow-uturn-right"
            >
              {{ $t("common.redo") }}
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="xs"
              @click="$emit('save-snapshot')"
              icon="i-heroicons-clock"
            >
              Snapshot
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="xs"
              @click="$emit('show-history')"
              icon="i-heroicons-queue-list"
            >
              History
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TagItem } from "~/types/content";

interface Props {
  selectedTags: Record<string, TagItem[]>;
  positivePrompt: string;
  negativePrompt: string;
  showNsfw: boolean;
  copiedPositive: boolean;
  copiedNegative: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  "update:show-nsfw": [value: boolean];
  "add-custom-tag": [];
  "show-negative-templates": [];
  "share-prompt": [];
  "clear-category": [category: string];
  "remove-tag": [category: string, tag: TagItem];
  "copy-prompt": [type: "positive" | "negative"];
  "save-prompt": [];
  "use-prompt": [];
  "clear-all": [];
  undo: [];
  redo: [];
  "save-snapshot": [];
  "show-history": [];
}>();

// Composables
const { t } = useI18n();

// Computed
const hasSelectedTags = computed(() => {
  return Object.keys(props.selectedTags).length > 0;
});

const categoriesCount = computed(() => {
  return Object.keys(props.selectedTags).length;
});

const totalTagsCount = computed(() => {
  return Object.values(props.selectedTags).reduce(
    (sum, tags) => sum + tags.length,
    0
  );
});

// Label to i18n key mapping (English labels → i18n keys)
const labelToKeyMap: Record<string, string> = {
  Subject: "subject",
  "Art Style": "art_style",
  Medium: "medium",
  Quality: "quality",
  Characters: "characters",
  "Character Traits": "character_traits",
  "Facial Features": "facial_features",
  Eyes: "eyes",
  Hair: "hair",
  "Body Features": "body_features",
  Breasts: "breasts",
  Genitals: "genitals",
  "Anatomy Details": "anatomy_details",
  "Hand Details": "hand_details",
  "Expression/Pose": "expression_pose",
  Posture: "posture",
  Clothing: "clothing",
  Accessories: "accessories",
  Setting: "setting",
  "Environment Details": "environment_details",
  "Background Elements": "background_elements",
  "Time of Day": "time_of_day",
  Weather: "weather",
  "Lighting/Effects": "lighting_effects",
  "Themes/Moods": "themes_moods",
  "Color Palettes": "color_palettes",
  "Camera Angles": "camera_angles",
  Perspectives: "perspectives",
  "Camera Settings": "camera_settings",
  "Lens Type": "lens_type",
  "Composition Rules": "composition_rules",
  "Motion Effects": "motion_effects",
  "Rendering Engine": "rendering_engine",
  "Post Processing": "post_processing",
  "Texture Materials": "texture_materials",
  "Technology/Objects": "technology_objects",
  Other: "other",
};

// Icon mapping (using English labels as keys)
const labelIconMap: Record<string, string> = {
  Subject: "i-heroicons-photo",
  "Art Style": "i-heroicons-paint-brush",
  Medium: "i-heroicons-photo",
  Quality: "i-heroicons-star",
  Characters: "i-heroicons-user-group",
  "Character Traits": "i-heroicons-identification",
  "Facial Features": "i-heroicons-face-smile",
  Eyes: "i-heroicons-eye",
  Hair: "i-heroicons-scissors",
  "Body Features": "i-heroicons-user-circle",
  Breasts: "i-heroicons-heart",
  Genitals: "i-heroicons-shield-exclamation",
  "Anatomy Details": "i-heroicons-finger-print",
  "Hand Details": "i-heroicons-hand-raised",
  "Expression/Pose": "i-heroicons-face-smile",
  Posture: "i-heroicons-arrow-trending-up",
  Clothing: "i-heroicons-shopping-bag",
  Accessories: "i-heroicons-sparkles",
  Setting: "i-heroicons-map-pin",
  "Environment Details": "i-heroicons-building-office",
  "Background Elements": "i-heroicons-square-3-stack-3d",
  "Time of Day": "i-heroicons-clock",
  Weather: "i-heroicons-cloud",
  "Lighting/Effects": "i-heroicons-light-bulb",
  "Themes/Moods": "i-heroicons-face-frown",
  "Color Palettes": "i-heroicons-swatch",
  "Camera Angles": "i-heroicons-camera",
  Perspectives: "i-heroicons-cube",
  "Camera Settings": "i-heroicons-cog-6-tooth",
  "Lens Type": "i-heroicons-magnifying-glass-circle",
  "Composition Rules": "i-heroicons-squares-2x2",
  "Motion Effects": "i-heroicons-arrow-path",
  "Rendering Engine": "i-heroicons-cpu-chip",
  "Post Processing": "i-heroicons-adjustments-horizontal",
  "Texture Materials": "i-heroicons-cube-transparent",
  "Technology/Objects": "i-heroicons-rocket-launch",
  Other: "i-heroicons-ellipsis-horizontal-circle",
};

// Category icons (same as EditorSidebar)
const categoryIcons: Record<string, string> = {
  subject: "i-heroicons-photo",
  characters: "i-heroicons-user-group",
  character_traits: "i-heroicons-star",
  facial_features: "i-heroicons-face-smile",
  eyes: "i-heroicons-eye",
  hair: "i-heroicons-sparkles",
  body_features: "i-heroicons-hand-raised",
  clothing: "i-heroicons-shopping-bag",
  art_style: "i-heroicons-paint-brush",
  camera_angles: "i-heroicons-camera",
  setting: "i-heroicons-map-pin",
  lighting_effects: "i-heroicons-light-bulb",
  other: "i-heroicons-ellipsis-horizontal-circle",
};

const getCategoryIcon = (categoryLabel: string) => {
  // First try direct label match
  if (labelIconMap[categoryLabel]) {
    return labelIconMap[categoryLabel];
  }

  // Fallback: try converting label to key and use categoryIcons
  const key = labelToKeyMap[categoryLabel];
  if (key && categoryIcons[key]) {
    return categoryIcons[key];
  }

  return "i-heroicons-tag";
};

const getCategoryName = (categoryLabel: string) => {
  // Convert label to i18n key
  const key = labelToKeyMap[categoryLabel];
  if (key) {
    return t(`prompt_creator.categories.${key}`);
  }
  // Fallback to label
  return categoryLabel;
};

const getTagText = (tag: TagItem) => {
  const locale = useI18n().locale.value;
  return locale === "pl" ? tag.pl : tag.en;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
