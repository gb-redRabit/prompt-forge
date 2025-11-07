<template>
  <div class="space-y-4">
    <!-- Success Badge -->
    <div
      class="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
    >
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
        >
          <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
        </div>
        <span class="text-sm font-semibold text-green-900 dark:text-green-100">
          {{ $t("app.demo.success") }}
        </span>
      </div>
    </div>

    <!-- Typing Output -->
    <div
      class="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 min-h-[200px]"
    >
      <div class="prose dark:prose-invert max-w-none">
        <div
          class="typing-effect whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed"
        >
          {{ displayedText
          }}<span
            v-if="isTyping"
            class="inline-block w-0.5 h-5 bg-primary-500 animate-pulse ml-0.5"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  typingSpeed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  typingSpeed: 20,
});

const displayedText = ref("");
const isTyping = ref(false);
let typingInterval: NodeJS.Timeout | null = null;

// Typing effect
watch(
  () => props.text,
  (newText) => {
    if (!newText) {
      displayedText.value = "";
      isTyping.value = false;
      return;
    }

    // Clear previous interval
    if (typingInterval) {
      clearInterval(typingInterval);
    }

    displayedText.value = "";
    isTyping.value = true;
    let currentIndex = 0;

    typingInterval = setInterval(() => {
      if (currentIndex < newText.length) {
        displayedText.value += newText[currentIndex];
        currentIndex++;
      } else {
        isTyping.value = false;
        if (typingInterval) {
          clearInterval(typingInterval);
          typingInterval = null;
        }
      }
    }, props.typingSpeed);
  },
  { immediate: true }
);

// Cleanup on unmount
onUnmounted(() => {
  if (typingInterval) {
    clearInterval(typingInterval);
  }
});
</script>

<style scoped>
.typing-effect {
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 0.95rem;
  line-height: 1.7;
}
</style>
