<template>
  <!-- Floating Button (Mobile Only) -->
  <div class="lg:hidden">
    <!-- Summary Button - Fixed at bottom center -->
    <button
      @click="isOpen = true"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-6 py-3.5 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 backdrop-blur-xl border-2 border-white/20 active:scale-95"
    >
      <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
      <span class="font-semibold text-sm">{{
        $t("prompt_creator.summary")
      }}</span>
      <span
        v-if="totalTags > 0"
        class="px-2 py-0.5 rounded-full bg-white/30 text-xs font-bold min-w-[24px] text-center"
      >
        {{ totalTags }}
      </span>
    </button>

    <!-- Sliding Panel -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-end lg:hidden"
          @click.self="isOpen = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="isOpen = false"
          ></div>

          <!-- Panel Content -->
          <div
            class="relative w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden z-50"
          >
            <!-- Header -->
            <div
              class="flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-document-text"
                      class="w-4 h-4 text-white"
                    />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ $t("prompt_creator.selected_tags") }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ totalTags }}
                      {{ $t("prompt_creator.tags_selected") }}
                    </p>
                  </div>
                </div>
                <button
                  @click="isOpen = false"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <UIcon
                    name="i-heroicons-x-mark"
                    class="w-6 h-6 text-gray-500 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar">
              <div class="p-4 space-y-4">
                <!-- NSFW Toggle -->
                <div
                  class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-eye-slash"
                      class="w-5 h-5 text-red-500"
                    />
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ $t("prompt_creator.show_nsfw") }}
                    </span>
                  </div>
                  <button
                    @click="$emit('update:show-nsfw', !showNsfw)"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      showNsfw ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700',
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        showNsfw ? 'translate-x-6' : 'translate-x-1',
                      ]"
                    />
                  </button>
                </div>

                <!-- Selected Tags by Category -->
                <div
                  v-if="Object.keys(selectedTags).length > 0"
                  class="space-y-3"
                >
                  <div
                    v-for="(tagObjs, category) in selectedTags"
                    :key="category"
                    class="glass-card p-3 rounded-xl"
                  >
                    <!-- Category Header -->
                    <div
                      class="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700"
                    >
                      <div class="flex items-center gap-2">
                        <UIcon
                          name="i-heroicons-folder"
                          class="w-4 h-4 text-primary-500"
                        />
                        <span
                          class="text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {{ getCategoryName(category) }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          ({{ tagObjs.length }})
                        </span>
                      </div>
                      <button
                        @click="$emit('clear-category', category)"
                        class="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <UIcon
                          name="i-heroicons-trash"
                          class="w-4 h-4 text-red-500"
                        />
                      </button>
                    </div>

                    <!-- Tags -->
                    <div class="space-y-2">
                      <div
                        v-for="(tagObj, idx) in tagObjs"
                        :key="idx"
                        class="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800/50"
                      >
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <span
                              class="text-sm font-medium text-gray-900 dark:text-white truncate"
                            >
                              {{ getTagText(tagObj) }}
                            </span>
                            <span
                              v-if="tagObj.weight && tagObj.weight !== 1.0"
                              class="text-xs text-primary-600 dark:text-primary-400 font-mono"
                            >
                              :{{ tagObj.weight.toFixed(1) }}
                            </span>
                            <span
                              v-if="tagObj.emphasis && tagObj.emphasis > 0"
                              class="text-xs text-purple-600 dark:text-purple-400 font-mono"
                            >
                              {{ "(".repeat(tagObj.emphasis) }}
                            </span>
                          </div>

                          <!-- Weight Slider (Mobile Optimized) -->
                          <div class="space-y-1">
                            <div class="flex items-center justify-between">
                              <label
                                class="text-xs text-gray-600 dark:text-gray-400"
                              >
                                {{ $t("prompt_creator.weight") }}
                              </label>
                              <span
                                class="text-xs font-semibold text-primary-600 dark:text-primary-400"
                              >
                                {{ (tagObj.weight || 1.0).toFixed(1) }}
                              </span>
                            </div>
                            <USlider
                              :model-value="tagObj.weight || 1.0"
                              @update:model-value="
                                (value) =>
                                  updateTag(category, idx, {
                                    ...tagObj,
                                    weight: value as number,
                                  })
                              "
                              :min="0"
                              :max="3"
                              :step="0.1"
                              color="primary"
                              size="sm"
                            />
                          </div>

                          <!-- Emphasis Buttons -->
                          <div class="mt-2">
                            <label
                              class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
                            >
                              {{ $t("prompt_creator.emphasis") }}
                            </label>
                            <div class="flex gap-1">
                              <button
                                v-for="n in [0, 1, 2, 3]"
                                :key="n"
                                @click="
                                  updateTag(category, idx, {
                                    ...tagObj,
                                    emphasis: n,
                                  })
                                "
                                :class="[
                                  'flex-1 px-2 py-1 text-xs rounded-lg font-medium transition-all',
                                  (tagObj.emphasis || 0) === n
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                                ]"
                              >
                                {{ n === 0 ? "0" : "(".repeat(n) }}
                              </button>
                            </div>
                          </div>
                        </div>

                        <!-- Remove Button -->
                        <button
                          @click="$emit('remove-tag', category, idx)"
                          class="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <UIcon
                            name="i-heroicons-x-mark"
                            class="w-4 h-4 text-red-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div
                  v-else
                  class="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  <UIcon
                    name="i-heroicons-tag"
                    class="w-12 h-12 mx-auto mb-2 opacity-50"
                  />
                  <p class="text-sm">{{ $t("prompt_creator.no_tags_yet") }}</p>
                </div>

                <!-- Prompts Preview -->
                <div v-if="positivePrompt" class="space-y-3">
                  <!-- Positive Prompt -->
                  <div class="glass-card p-3 rounded-xl">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <UIcon
                          name="i-heroicons-plus-circle"
                          class="w-4 h-4 text-green-500"
                        />
                        <span
                          class="text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {{ $t("prompt_creator.positive_prompt") }}
                        </span>
                      </div>
                      <button
                        @click="$emit('copy-prompt', 'positive')"
                        class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <UIcon
                          :name="
                            copiedPositive
                              ? 'i-heroicons-check'
                              : 'i-heroicons-clipboard-document'
                          "
                          :class="[
                            'w-4 h-4',
                            copiedPositive
                              ? 'text-green-500'
                              : 'text-gray-500 dark:text-gray-400',
                          ]"
                        />
                      </button>
                    </div>
                    <p
                      class="text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed break-words"
                    >
                      {{ positivePrompt }}
                    </p>
                  </div>

                  <!-- Negative Prompt -->
                  <div v-if="negativePrompt" class="glass-card p-3 rounded-xl">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <UIcon
                          name="i-heroicons-minus-circle"
                          class="w-4 h-4 text-red-500"
                        />
                        <span
                          class="text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {{ $t("prompt_creator.negative_prompt") }}
                        </span>
                      </div>
                      <button
                        @click="$emit('copy-prompt', 'negative')"
                        class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <UIcon
                          :name="
                            copiedNegative
                              ? 'i-heroicons-check'
                              : 'i-heroicons-clipboard-document'
                          "
                          :class="[
                            'w-4 h-4',
                            copiedNegative
                              ? 'text-green-500'
                              : 'text-gray-500 dark:text-gray-400',
                          ]"
                        />
                      </button>
                    </div>
                    <p
                      class="text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed break-words"
                    >
                      {{ negativePrompt }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div
              class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 safe-area-bottom"
            >
              <div class="grid grid-cols-2 gap-2 mb-3">
                <GlassButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  @click="
                    $emit('add-custom-tag');
                    isOpen = false;
                  "
                  icon="i-heroicons-plus-circle"
                  class="w-full"
                >
                  <span class="text-xs">{{
                    $t("prompt_creator.add_tag")
                  }}</span>
                </GlassButton>
                <GlassButton
                  color="error"
                  variant="outline"
                  size="sm"
                  @click="
                    $emit('show-negative-templates');
                    isOpen = false;
                  "
                  icon="i-heroicons-minus-circle"
                  class="w-full"
                >
                  <span class="text-xs">{{
                    $t("prompt_creator.negative_templates_short")
                  }}</span>
                </GlassButton>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <GlassButton
                  color="success"
                  size="md"
                  @click="
                    $emit('save-prompt');
                    isOpen = false;
                  "
                  icon="i-heroicons-bookmark"
                  class="w-full"
                >
                  <span class="text-sm font-semibold">{{
                    $t("common.save")
                  }}</span>
                </GlassButton>
                <GlassButton
                  color="primary"
                  size="md"
                  @click="
                    $emit('use-prompt');
                    isOpen = false;
                  "
                  icon="i-heroicons-arrow-right-circle"
                  class="w-full"
                >
                  <span class="text-sm font-semibold">{{
                    $t("common.use")
                  }}</span>
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface TagObject {
  pl: string;
  en: string;
  neg_pl: string;
  neg_en: string;
  category: string;
  nsfw: boolean;
  custom?: boolean;
  weight?: number;
  emphasis?: number;
}

const props = defineProps<{
  selectedTags: Record<string, TagObject[]>;
  positivePrompt: string;
  negativePrompt: string;
  showNsfw: boolean;
  copiedPositive: boolean;
  copiedNegative: boolean;
}>();

const emit = defineEmits<{
  "update:show-nsfw": [value: boolean];
  "add-custom-tag": [];
  "show-negative-templates": [];
  "clear-category": [category: string];
  "remove-tag": [category: string, index: number];
  "update-tag": [category: string, index: number, tag: TagObject];
  "copy-prompt": [type: "positive" | "negative"];
  "save-prompt": [];
  "use-prompt": [];
  "clear-all": [];
}>();

const { t, locale } = useI18n();
const isOpen = ref(false);

const totalTags = computed(() => {
  return Object.values(props.selectedTags).reduce(
    (sum, tags) => sum + tags.length,
    0
  );
});

const getTagText = (tagObj: TagObject): string => {
  return locale.value === "pl" ? tagObj.pl : tagObj.en;
};

const getCategoryName = (category: string): string => {
  // Map category label to i18n key
  const categoryKeyMap: Record<string, string> = {
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

  const key = categoryKeyMap[category];
  return key ? t(`prompt_creator.categories.${key}`) : category;
};

const updateTag = (category: string, index: number, updatedTag: TagObject) => {
  emit("update-tag", category, index, updatedTag);
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from > div:last-child,
.slide-up-leave-to > div:last-child {
  transform: translateY(100%);
}

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

/* Safe area for devices with notch/home indicator */
.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>
