<template>
  <aside
    :class="[
      'glass-panel border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 relative backdrop-blur-xl',
      expanded ? 'w-72' : 'w-16',
    ]"
  >
    <!-- Magnetic Toggle Button -->
    <div
      ref="toggleButtonContainer"
      class="absolute -right-10 top-0 z-50 hidden md:block h-full pointer-events-none"
    >
      <button
        @click="$emit('update:expanded', !expanded)"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        :style="{ transform: `translateY(${buttonY}px)` }"
        class="relative w-8 h-16 glass-card rounded-r-2xl flex items-center justify-center shadow-xl hover:shadow-2xl group transition-all duration-150 pointer-events-auto hover:w-10"
      >
        <!-- Animated gradient background -->
        <div
          :class="[
            'absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-r-2xl transition-all duration-200',
            isHovering ? 'opacity-100 scale-105' : 'opacity-0 scale-95',
          ]"
        ></div>

        <!-- Glass overlay -->
        <div
          class="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-r-2xl border-l-0 border border-white/20 dark:border-white/10"
        ></div>

        <!-- Icon with rotation animation -->
        <div
          class="relative z-50 transition-transform duration-150 group-hover:scale-110"
        >
          <UIcon
            :name="
              expanded
                ? 'i-heroicons-chevron-left'
                : 'i-heroicons-chevron-right'
            "
            :class="[
              'w-5 h-5 transition-all duration-150',
              isHovering
                ? 'text-white drop-shadow-lg'
                : 'text-gray-600 dark:text-gray-400',
            ]"
          />
        </div>

        <!-- Glow effect on hover -->
        <div
          :class="[
            'absolute inset-0 rounded-r-2xl blur-xl transition-opacity duration-200',
            'bg-gradient-to-br from-primary-400 via-purple-400 to-pink-400',
            isHovering ? 'opacity-60' : 'opacity-0',
          ]"
        ></div>

        <!-- Active pulse -->
        <div
          class="absolute inset-0 bg-primary-500 rounded-r-2xl opacity-0 group-active:opacity-40 transition-opacity duration-100"
        ></div>

        <!-- Dots indicator -->
        <div
          class="absolute left-1 top-1/2 -translate-y-1/2 space-y-1 opacity-30 group-hover:opacity-60 transition-opacity duration-150"
        >
          <div class="w-0.5 h-0.5 rounded-full bg-current"></div>
          <div class="w-0.5 h-0.5 rounded-full bg-current"></div>
          <div class="w-0.5 h-0.5 rounded-full bg-current"></div>
        </div>
      </button>
    </div>

    <!-- Categories List -->
    <div class="overflow-y-auto h-full custom-scrollbar">
      <div
        :class="[
          expanded ? 'p-3' : 'p-1',
          expanded ? 'space-y-3' : 'space-y-1.5 flex flex-col items-center',
        ]"
      >
        <!-- Grouped Categories -->
        <div
          v-for="group in categoryGroups"
          :key="group.key"
          class="space-y-2 w-full"
        >
          <!-- Group Header -->
          <div
            v-if="expanded"
            class="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider bg-white/30 dark:bg-gray-800/30 rounded-lg backdrop-blur-sm"
          >
            {{ group.title }}
          </div>
          <div
            v-else-if="group.key !== 'basics'"
            class="px-2 border-b border-white/30 dark:border-gray-700/50 w-3/4 mx-auto"
          ></div>

          <!-- Category Buttons -->
          <button
            v-for="category in group.items"
            :key="category"
            @click="$emit('select-category', category)"
            :class="[
              'group w-full flex items-center rounded-lg transition-all duration-300',
              expanded ? 'gap-2 p-2' : 'gap-0 p-1 justify-center',
              currentCategory === category
                ? expanded
                  ? 'glass-card ring-2 ring-primary-500/50 shadow-md shadow-primary-500/20'
                  : 'glass-card shadow-sm shadow-primary-500/20'
                : 'glass-button hover:shadow-sm hover:scale-[1.02]',
            ]"
          >
            <!-- Icon Container -->
            <div
              :class="[
                'flex-shrink-0 rounded-lg flex items-center justify-center relative transition-all duration-300',
                expanded ? 'w-8 h-8' : 'w-9 h-9',
                currentCategory === category
                  ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-sm shadow-primary-500/30'
                  : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-500 group-hover:scale-110',
              ]"
            >
              <UIcon
                :name="getCategoryIcon(category) || 'i-heroicons-tag'"
                :class="[
                  'transition-transform duration-300',
                  expanded ? 'w-5 h-5' : 'w-6 h-6',
                ]"
              />
              <!-- Badge (collapsed) -->
              <div
                v-if="getTagCount(category) && !expanded"
                class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 text-white text-[10px] flex items-center justify-center font-bold shadow-sm shadow-primary-500/40 ring-1 ring-white dark:ring-gray-900"
              >
                {{ getTagCount(category) }}
              </div>
            </div>

            <!-- Category Label (expanded) -->
            <div v-if="expanded" class="flex-1 text-left min-w-0">
              <p
                :class="[
                  'text-sm font-semibold transition-colors duration-300 truncate',
                  currentCategory === category
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-primary-600',
                ]"
              >
                {{ getCategoryName(category) }}
              </p>
            </div>

            <!-- Badge (expanded) -->
            <div
              v-if="getTagCount(category) && expanded"
              class="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 text-white text-xs flex items-center justify-center font-bold shadow-sm shadow-primary-500/30"
            >
              {{ getTagCount(category) }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { TagItem } from "~/types/content";

// Extend Window type for mouse tracking
declare global {
  interface Window {
    mouseY?: number;
  }
}

// Props
interface Props {
  expanded: boolean;
  currentCategory: string;
  selectedTags: Record<string, TagItem[]>;
  categoryGroups: Array<{
    key: string;
    title: string;
    items: string[];
  }>;
}

const props = defineProps<Props>();

// Emits
defineEmits<{
  "update:expanded": [value: boolean];
  "select-category": [category: string];
}>();

// Composables
const { t } = useI18n();

// Mouse tracking for magnetic button
const toggleButtonContainer = ref<HTMLElement | null>(null);
const buttonY = ref(100); // Initial position
const isHovering = ref(false);
const targetY = ref(100);

// Smooth mouse tracking
const updateButtonPosition = () => {
  if (typeof window === "undefined") return;

  const mouseY = window.mouseY || window.innerHeight / 2;
  const containerHeight =
    toggleButtonContainer.value?.offsetHeight || window.innerHeight;

  // Calculate target position (center button on mouse, with padding)
  const buttonHeight = 64; // h-16 = 4rem = 64px
  const padding = 50;

  // Constrain within container bounds
  targetY.value = Math.max(
    padding,
    Math.min(
      mouseY - buttonHeight / 2,
      containerHeight - buttonHeight - padding
    )
  );

  // Smooth easing (faster response)
  const diff = targetY.value - buttonY.value;
  buttonY.value += diff * 0.35; // Faster interpolation (was 0.15)

  requestAnimationFrame(updateButtonPosition);
};

// Track mouse globally
const handleMouseMove = (e: MouseEvent) => {
  if (typeof window !== "undefined") {
    window.mouseY = e.clientY;
  }
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.mouseY = window.innerHeight / 2;
    window.addEventListener("mousemove", handleMouseMove);
    updateButtonPosition();
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("mousemove", handleMouseMove);
  }
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

// Category icons mapping (i18n keys)
const categoryIcons: Record<string, string> = {
  subject: "i-heroicons-photo",
  characters: "i-heroicons-user-group",
  character_traits: "i-heroicons-star",
  facial_features: "i-heroicons-face-smile",
  eyes: "i-heroicons-eye",
  hair: "i-heroicons-sparkles",
  body_features: "i-heroicons-hand-raised",
  breasts: "i-heroicons-heart",
  genitals: "i-heroicons-lock-closed",
  anatomy_details: "i-heroicons-beaker",
  hand_details: "i-heroicons-hand-raised",
  expression_pose: "i-heroicons-face-smile",
  posture: "i-heroicons-arrows-up-down",
  clothing: "i-heroicons-shopping-bag",
  accessories: "i-heroicons-sparkles",
  art_style: "i-heroicons-paint-brush",
  medium: "i-heroicons-photo",
  quality: "i-heroicons-star",
  camera_angles: "i-heroicons-camera",
  perspectives: "i-heroicons-view-columns",
  camera_settings: "i-heroicons-adjustments-horizontal",
  lens_type: "i-heroicons-camera",
  composition_rules: "i-heroicons-squares-2x2",
  motion_effects: "i-heroicons-arrow-path",
  setting: "i-heroicons-map-pin",
  environment_details: "i-heroicons-globe-alt",
  background_elements: "i-heroicons-photo",
  time_of_day: "i-heroicons-sun",
  weather: "i-heroicons-cloud",
  lighting_effects: "i-heroicons-light-bulb",
  themes_moods: "i-heroicons-heart",
  color_palettes: "i-heroicons-swatch",
  rendering_engine: "i-heroicons-cpu-chip",
  post_processing: "i-heroicons-cog-6-tooth",
  texture_materials: "i-heroicons-cube",
  technology_objects: "i-heroicons-rocket-launch",
  other: "i-heroicons-ellipsis-horizontal-circle",
};

// Helper functions
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

const getTagCount = (categoryLabel: string) => {
  return props.selectedTags[categoryLabel]?.length || 0;
};
</script>

<style scoped>
/* Custom scrollbar */
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

/* Smooth transitions for magnetic button */
button {
  will-change: transform;
}
</style>
