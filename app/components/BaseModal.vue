<template>
  <UModal
    v-model="isOpen"
    :ui="{
      wrapper: 'z-[75]',
      overlay: 'bg-black/50 backdrop-blur-sm',
      content:
        'relative w-full flex flex-col glass-card rounded-2xl shadow-2xl',
    }"
    :fullscreen="fullscreen"
    :prevent-close="preventClose"
  >
    <!-- Header -->
    <div
      v-if="$slots.header || title"
      class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex-1">
        <slot name="header">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p
            v-if="description"
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ description }}
          </p>
        </slot>
      </div>
      <UButton
        v-if="!hideClose"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class="-my-1"
        @click="closeModal"
      />
    </div>

    <!-- Body -->
    <div :class="['flex-1 overflow-y-auto custom-scrollbar', bodyClass]">
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="$slots.footer"
      class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700"
    >
      <slot name="footer" :close="closeModal" />
    </div>
  </UModal>
</template>

<script setup lang="ts">
/**
 * BaseModal - Wrapper dla Nuxt UI UModal z glassmorphism i prawidłowym z-index
 * Używa UModal z Nuxt UI jako bazy
 */

interface Props {
  modelValue?: boolean;
  title?: string;
  description?: string;
  fullscreen?: boolean;
  preventClose?: boolean;
  hideClose?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  bodyClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  fullscreen: false,
  preventClose: false,
  hideClose: false,
  size: "2xl",
  bodyClass: "p-6",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const closeModal = () => {
  isOpen.value = false;
  emit("close");
};

const modalWidth = computed(() => {
  const sizes = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
  };
  return sizes[props.size];
});

const modalHeight = computed(() => {
  return props.fullscreen ? "h-screen" : "";
});

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && !props.preventClose && isOpen.value) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
/* Dodatkowe style dla glassmorphism są już w main.css */
</style>
