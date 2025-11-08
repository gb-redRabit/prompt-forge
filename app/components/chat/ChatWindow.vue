<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <ChatHeader
      :conversation="activeConversation"
      :is-generating="isGenerating"
      @clear="handleClear"
      @rename="handleRename"
    />

    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto scroll-smooth"
      style="will-change: scroll-position"
    >
      <div
        v-if="!activeConversation || activeConversation.messages.length === 0"
        class="flex items-center justify-center h-full"
      >
        <div
          class="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 md:p-8 max-w-md"
        >
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-chat-bubble-left-right"
              class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
            />
          </div>
          <h3
            class="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ $t("chat.window.start_title") }}
          </h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {{ $t("chat.window.start_description") }}
          </p>

          <!-- Quick prompts -->
          <div class="grid grid-cols-1 gap-1.5 sm:gap-2 pt-2 sm:pt-4">
            <GlassButton
              v-for="(prompt, index) in quickPrompts"
              :key="index"
              variant="outline"
              size="sm"
              class="text-xs sm:text-sm"
              full-width
              :icon="prompt.icon"
              @click="sendQuickPrompt(prompt.text)"
            >
              <UIcon
                :name="prompt.icon"
                class="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
              />
              {{ prompt.text }}
            </GlassButton>
          </div>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
        <ChatMessage
          v-for="message in activeConversation.messages"
          :key="message.id"
          v-memo="[message.id, message.content, message.timestamp]"
          :message="message"
          @retry="retryMessage(activeConversation.id, message.id)"
        />

        <!-- AI "myśli" - pokazuje się gdy generuje -->
        <div
          v-if="isGenerating"
          class="group px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-purple-50/50 dark:bg-purple-900/10"
        >
          <div class="max-w-4xl mx-auto flex gap-2 sm:gap-3 md:gap-4">
            <!-- Avatar AI -->
            <div class="flex-shrink-0">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
              >
                <UIcon
                  name="i-heroicons-sparkles"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse"
                />
              </div>
            </div>

            <!-- Thinking animation -->
            <div class="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span
                  class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm"
                >
                  {{ $t("chat.ai_label") }}
                </span>
                <span
                  class="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400"
                >
                  {{ $t("chat.window.thinking") }}
                </span>
              </div>

              <!-- Animated dots -->
              <div class="flex gap-1">
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce"
                  style="animation-delay: 0ms"
                />
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce"
                  style="animation-delay: 150ms"
                />
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce"
                  style="animation-delay: 300ms"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <ChatInput
      :disabled="isGenerating"
      :is-configured="isConfigured"
      @send="handleSend"
    />
  </div>
</template>

<script setup lang="ts">
import { useChat } from "~/composables/useChat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const {
  activeConversation,
  isGenerating,
  isConfigured,
  sendMessage,
  clearConversation,
  retryMessage,
  updateConversationTitle,
} = useChat();

const messagesContainer = ref<HTMLDivElement | null>(null);

const quickPrompts = computed(() => [
  {
    text: t("chat.window.quick_prompts.help_email"),
    icon: "i-heroicons-envelope",
  },
  {
    text: t("chat.window.quick_prompts.explain_ai"),
    icon: "i-heroicons-light-bulb",
  },
  {
    text: t("chat.window.quick_prompts.project_ideas"),
    icon: "i-heroicons-sparkles",
  },
  {
    text: t("chat.window.quick_prompts.analyze_code"),
    icon: "i-heroicons-code-bracket",
  },
]);

const handleSend = async (message: string) => {
  if (!activeConversation.value) return;

  try {
    await sendMessage(activeConversation.value.id, message);

    // Scroll to bottom
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error: any) {
    console.error("Failed to send message:", error);
  }
};

const sendQuickPrompt = (prompt: string) => {
  handleSend(prompt);
};

const handleClear = () => {
  if (!activeConversation.value) return;

  if (confirm(t("chat.window.confirm_clear"))) {
    clearConversation(activeConversation.value.id);
  }
};

const handleRename = () => {
  if (!activeConversation.value) return;

  const newTitle = prompt(
    t("chat.window.rename_prompt"),
    activeConversation.value.title
  );
  if (newTitle && newTitle.trim()) {
    updateConversationTitle(activeConversation.value.id, newTitle.trim());
  }
};

const scrollToBottom = () => {
  if (!messagesContainer.value) return;

  // Użyj natywnego smooth scroll - przeglądarka zoptymalizuje to automatycznie
  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior: "smooth",
  });
};

// Auto-scroll gdy pojawiają się nowe wiadomości LUB gdy AI generuje
watch(
  () => [activeConversation.value?.messages.length, isGenerating.value],
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { flush: "post" } // Wykonaj po renderowaniu DOM
);
</script>

<style></style>
