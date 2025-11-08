<template>
  <div class="border-t border-gray-200 dark:border-gray-700 p-2 sm:p-3 md:p-4">
    <!-- Model indicator -->
    <div
      v-if="currentModel"
      class="mb-1.5 sm:mb-2 flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400"
    >
      <span class="flex items-center gap-1 truncate">
        <UIcon
          name="i-heroicons-cpu-chip"
          class="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0"
        />
        <span class="truncate">
          {{ $t("chat.input.sending_to") }}
          <strong class="text-primary-600 dark:text-primary-400">{{
            currentModel
          }}</strong>
        </span>
      </span>
    </div>

    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-2 sm:space-y-3">
        <div class="flex gap-2 sm:gap-3">
          <!-- Textarea -->
          <div class="flex-1 relative">
            <textarea
              ref="inputRef"
              v-model="input"
              rows="1"
              :disabled="disabled || !isConfigured"
              :placeholder="
                !isConfigured
                  ? $t('chat.placeholder_configure')
                  : $t('chat.placeholder_write')
              "
              class="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style="min-height: 44px; max-height: 200px"
              @keydown="handleKeydown"
              @input="autoResize"
            />

            <!-- Character count -->
            <div
              v-if="input.length > 0"
              class="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 text-[10px] sm:text-xs text-gray-400 dark:text-gray-600"
              :title="$t('chat.input.character_count')"
            >
              {{ input.length }}
            </div>
          </div>

          <!-- Send button -->
          <GlassButton
            type="submit"
            color="primary"
            size="md"
            :disabled="!canSend"
            :loading="disabled"
            :icon="disabled ? undefined : 'i-heroicons-paper-airplane'"
            :title="$t('chat.input.send_message')"
            class="self-center m-auto"
          />
        </div>

        <!-- Quick actions -->
        <div class="flex items-center justify-between mt-2 sm:mt-3 gap-2">
          <div
            class="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide flex-nowrap"
          >
            <GlassButton
              v-for="action in quickActions"
              :key="action.labelKey"
              variant="ghost"
              size="xs"
              :icon="action.icon"
              :title="$t(action.labelKey)"
              class="text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0"
              @click="insertQuickAction(action.text)"
            >
              <span class="hidden sm:inline">{{ $t(action.labelKey) }}</span>
            </GlassButton>
          </div>

          <div
            class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden md:flex items-center gap-1 flex-shrink-0"
          >
            <kbd
              class="px-1.5 py-0.5 sm:px-2 bg-gray-100 dark:bg-gray-800 rounded text-[10px] sm:text-xs"
              >{{ $t("chat.input.key_shift") }}</kbd
            >
            <span>+</span>
            <kbd
              class="px-1.5 py-0.5 sm:px-2 bg-gray-100 dark:bg-gray-800 rounded text-[10px] sm:text-xs"
              >{{ $t("chat.input.key_enter") }}</kbd
            >
            <span class="hidden lg:inline">{{
              $t("chat.keyboard_newline")
            }}</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useChat } from "~/composables/useChat";
import { useAI } from "~/composables/useAI";
const { t } = useI18n();

const { config, isConfigured } = useAI();

const currentModel = computed(() => config.value?.modelId || null);

const props = defineProps<{
  disabled?: boolean;
  isConfigured: boolean;
}>();

const emit = defineEmits<{
  send: [message: string];
}>();

const input = ref("");
const inputRef = ref<HTMLTextAreaElement | null>(null);

const quickActions = [
  {
    labelKey: "chat.quick.explain",
    text: t("chat.quick_text.explain"),
    icon: "i-heroicons-light-bulb",
  },
  {
    labelKey: "chat.quick.summarize",
    text: t("chat.quick_text.summarize"),
    icon: "i-heroicons-document-text",
  },
  {
    labelKey: "chat.quick.translate",
    text: t("chat.quick_text.translate"),
    icon: "i-heroicons-language",
  },
];

const canSend = computed(() => {
  return input.value.trim().length > 0 && !props.disabled && props.isConfigured;
});

const handleSubmit = () => {
  if (!canSend.value) return;

  const message = input.value.trim();
  if (!message) return;

  emit("send", message);
  input.value = "";

  // Reset height
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = "auto";
    }
  });
};

const handleKeydown = (e: KeyboardEvent) => {
  // Enter bez Shift - wyślij wiadomość
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};

let resizeFrameId: number | null = null;

const autoResize = () => {
  if (!inputRef.value) return;

  // Cancel poprzedni frame jeśli istnieje
  if (resizeFrameId !== null) {
    cancelAnimationFrame(resizeFrameId);
  }

  // Zaplanuj resize w następnym frame
  resizeFrameId = requestAnimationFrame(() => {
    if (!inputRef.value) return;

    // Batch DOM operations
    const scrollHeight = inputRef.value.scrollHeight;
    inputRef.value.style.height = "auto";
    inputRef.value.style.height = `${scrollHeight}px`;

    resizeFrameId = null;
  });
};

const insertQuickAction = (text: string) => {
  input.value = text;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

// Focus input on mount
onMounted(() => {
  inputRef.value?.focus();
});

// Cleanup przy unmount
onUnmounted(() => {
  if (resizeFrameId !== null) {
    cancelAnimationFrame(resizeFrameId);
  }
});
</script>

<style></style>
