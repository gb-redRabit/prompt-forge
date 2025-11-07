<template>
  <div class="border-t border-gray-200 dark:border-gray-700 p-4">
    <!-- Model indicator -->
    <div
      v-if="currentModel"
      class="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
    >
      <span class="flex items-center gap-1">
        <UIcon name="i-heroicons-cpu-chip" class="w-3 h-3" />
        {{ $t("chat.input.sending_to") }}
        <strong class="text-primary-600 dark:text-primary-400">{{
          currentModel
        }}</strong>
      </span>
    </div>

    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div class="flex gap-3">
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
              class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style="min-height: 52px; max-height: 200px"
              @keydown="handleKeydown"
              @input="autoResize"
            />

            <!-- Character count -->
            <div
              v-if="input.length > 0"
              class="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-600"
              :title="$t('chat.input.character_count')"
            >
              {{ input.length }}
            </div>
          </div>

          <!-- Send button -->
          <GlassButton
            type="submit"
            color="primary"
            size="xl"
            :disabled="!canSend"
            :loading="disabled"
            :icon="disabled ? undefined : 'i-heroicons-paper-airplane'"
            :title="$t('chat.input.send_message')"
            class="self-center m-auto"
          />
        </div>

        <!-- Quick actions -->
        <div class="flex items-center justify-between mt-3">
          <div class="flex gap-2">
            <GlassButton
              v-for="action in quickActions"
              :key="action.labelKey"
              variant="ghost"
              size="xs"
              :icon="action.icon"
              :title="$t(action.labelKey)"
              @click="insertQuickAction(action.text)"
            >
              {{ $t(action.labelKey) }}
            </GlassButton>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400">
            <kbd class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{{
              $t("chat.input.key_shift")
            }}</kbd>
            +
            <kbd class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{{
              $t("chat.input.key_enter")
            }}</kbd>
            {{ $t("chat.keyboard_newline") }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const autoResize = () => {
  if (!inputRef.value) return;

  inputRef.value.style.height = "auto";
  inputRef.value.style.height = `${inputRef.value.scrollHeight}px`;
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
</script>

<style></style>
