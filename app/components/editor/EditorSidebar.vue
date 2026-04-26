<template>
  <aside
    :class="[
      'glass-panel border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 relative backdrop-blur-xl',
      expanded ? 'w-72' : 'w-16',
    ]"
  >
    <!-- Gooey Toggle (Schowany pod listą) -->
    <div
      ref="toggleButtonContainer"
      class="absolute top-0 right-0 w-24 h-full pointer-events-none overflow-hidden z-0"
      style="transform: translateX(100%);"
    >
      <div class="absolute inset-0 pointer-events-none" style="filter: url('#liquid-tab');">
        <!-- Baza śluzu: przywrócona zieleń -->
        <div 
          class="absolute left-0 -top-3 -bottom-3 h-[106%] w-4 bg-primary-500 dark:bg-purple-900/70 transition-transform duration-500 ease-out shadow-[2px_0_10px_rgba(34,197,94,0.2)] dark:shadow-[4px_0_20px_rgba(89,22,139,0.4)]"
          :style="{
            transform: `translateX(${(isMouseNear || isHoveringBtn) ? '-3px' : '-18px'})`
          }"
        ></div>
        
        <!-- Bąbelek: zielony z silniejszym cieniem -->
        <div
          class="absolute left-0 rounded-full bg-primary-500 dark:bg-purple-900/70 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[4px_0_15px_rgba(34,197,94,0.3)] dark:shadow-[6px_0_25px_rgba(89,22,139,0.6)]"
          :style="{
            transform: `translateY(${buttonY}px) translateX(${isMouseNear || isHoveringBtn ? '12px' : '-20px'}) scale(${isMouseNear || isHoveringBtn ? 1 : 0.4})`,
            height: isHoveringBtn ? '64px' : '48px',
            width: isHoveringBtn ? '36px' : '28px',
            opacity: isMouseNear || isHoveringBtn ? 1 : 0
          }"
        ></div>
      </div>

      <!-- Ikonka (Biała na zielonym tle) -->
      <button
        @click="$emit('update:expanded', !expanded)"
        @mouseenter="isHoveringBtn = true"
        @mouseleave="isHoveringBtn = false"
        :style="{
          transform: `translateY(${buttonY}px) translateX(${isMouseNear || isHoveringBtn ? '12px' : '-20px'})`,
          height: isHoveringBtn ? '64px' : '48px',
          width: isHoveringBtn ? '36px' : '28px'
        }"
        class="absolute left-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-auto rounded-full z-10 focus:outline-none group overflow-hidden"
      >
        <UIcon
          :name="expanded ? 'i-heroicons-chevron-left' : 'i-heroicons-chevron-right'"
          :class="[
            'transition-all duration-300 transform',
            isMouseNear || isHoveringBtn ? 'opacity-100 scale-110' : 'opacity-0 scale-50',
            'text-white w-5 h-5 drop-shadow-md'
          ]"
        />
        
        <!-- Subtle Glow Effect on Hover -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>

    <!-- Filtry wektorowe (Gooey Engine) -->
    <svg width="0" height="0" class="absolute pointer-events-none">
      <defs>
        <filter id="liquid-tab" x="-100%" y="-10%" width="300%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -11" result="goo" />
        </filter>
      </defs>
    </svg>

    <!-- Główny układ panelu Bocznego -->
    <div class="flex flex-col h-full overflow-hidden relative bg-white dark:bg-slate-900 z-10">
      <!-- Categories List (Przewijana część) -->
      <div class="overflow-y-auto flex-1 custom-scrollbar">
        <div
        :class="[
          expanded ? 'p-2' : 'p-1',
          expanded ? 'space-y-1.5' : 'space-y-1 flex flex-col items-center',
        ]"
      >
        <!-- Grouped Categories -->
        <div
          v-for="group in categoryGroups"
          :key="group.key"
          class="space-y-1 w-full"
        >
          <!-- Group Header -->
          <div
            v-if="expanded"
            class="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider bg-white/30 dark:bg-slate-800/30 rounded-lg backdrop-blur-sm"
          >
            {{ group.title }}
          </div>
          <div
            v-else-if="group.key !== 'basics'"
            class="px-2 border-b border-white/30 dark:border-slate-700/50 w-3/4 mx-auto"
          ></div>

          <!-- Category Buttons -->
          <button
            v-for="category in group.items"
            :key="category"
            @click="$emit('select-category', category)"
            :class="[
              'group w-full flex items-center rounded-lg transition-all duration-300',
              expanded ? 'gap-2 p-1.5' : 'gap-0 p-1 justify-center',
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
                  : 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-600 dark:text-slate-400 group-hover:text-primary-500 group-hover:scale-110',
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
                class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 text-white text-[10px] flex items-center justify-center font-bold shadow-sm shadow-primary-500/40 ring-1 ring-white dark:ring-slate-900"
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
                    : 'text-slate-700 dark:text-slate-300 group-hover:text-primary-600',
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
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { TagItem } from "~~/shared/types/content";
import { 
  LABEL_TO_KEY_MAP, 
  CATEGORY_ICONS 
} from "~~/shared/constants/categories";

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

// Magnetic interaction state
const toggleButtonContainer = ref<HTMLElement | null>(null);
const buttonY = ref(100);
const isMouseNear = ref(false);
const isHoveringBtn = ref(false);

let animationFrameId: number | null = null;
let currentY = 100;

// Smooth physics-based tracking
const updateButtonPosition = () => {
  if (import.meta.server) return;

  const containerHeight = toggleButtonContainer.value?.offsetHeight || window.innerHeight;
  const buttonHeight = isHoveringBtn.value ? 64 : 48;
  const padding = 20;

  let targetY = 0;
  if (!isMouseNear.value && !isHoveringBtn.value) {
    targetY = containerHeight / 2 - buttonHeight / 2;
  } else {
    // Podąża za myszką
    const mouseY = (window as any).mouseY || containerHeight / 2;
    targetY = Math.max(
      padding,
      Math.min(
        mouseY - buttonHeight / 2,
        containerHeight - buttonHeight - padding
      )
    );
  }

  const diff = targetY - currentY;
  currentY += diff * 0.35; 
  buttonY.value = currentY;

  animationFrameId = requestAnimationFrame(updateButtonPosition);
};

// Global distance tracking 
const handleMouseMove = (e: MouseEvent) => {
  (window as any).mouseY = e.clientY;
  
  const container = toggleButtonContainer.value;
  if (container) {
    const rect = container.getBoundingClientRect();
    const distanceX = Math.abs(e.clientX - rect.left);
    isMouseNear.value = distanceX < 30;
  }
};

onMounted(() => {
  if (import.meta.client) {
    (window as any).mouseY = window.innerHeight / 2;
    window.addEventListener("mousemove", handleMouseMove);
    updateButtonPosition();
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("mousemove", handleMouseMove);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
});

// Helper functions
const getCategoryIcon = (categoryLabel: string) => {
  const key = LABEL_TO_KEY_MAP[categoryLabel];
  return (key && CATEGORY_ICONS[key]) || "i-heroicons-tag";
};

const getCategoryName = (categoryLabel: string) => {
  const key = LABEL_TO_KEY_MAP[categoryLabel];
  return key ? t(`prompt_creator.categories.${key}`) : categoryLabel;
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
