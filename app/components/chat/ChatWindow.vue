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
    <div ref="messagesContainer" class="flex-1 overflow-y-auto">
      <div
        v-if="!activeConversation || activeConversation.messages.length === 0"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center space-y-4 p-8 max-w-md">
          <div
            class="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-chat-bubble-left-right"
              class="w-8 h-8 text-white"
            />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ $t("chat.window.start_title") }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t("chat.window.start_description") }}
          </p>

          <!-- Quick prompts -->
          <div class="grid grid-cols-1 gap-2 pt-4">
            <GlassButton
              v-for="(prompt, index) in quickPrompts"
              :key="index"
              variant="outline"
              full-width
              :icon="prompt.icon"
              @click="sendQuickPrompt(prompt.text)"
            >
              <UIcon :name="prompt.icon" class="mr-2" />
              {{ prompt.text }}
            </GlassButton>
          </div>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
        <ChatMessage
          v-for="message in activeConversation.messages"
          :key="message.id"
          :message="message"
          @retry="retryMessage(activeConversation.id, message.id)"
        />

        <!-- AI "myśli" - pokazuje się gdy generuje -->
        <div
          v-if="isGenerating"
          class="group px-6 py-4 bg-purple-50/50 dark:bg-purple-900/10"
        >
          <div class="max-w-4xl mx-auto flex gap-4">
            <!-- Avatar AI -->
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
              >
                <UIcon
                  name="i-heroicons-sparkles"
                  class="w-5 h-5 text-white animate-pulse"
                />
              </div>
            </div>

            <!-- Thinking animation -->
            <div class="flex-1 min-w-0 space-y-2">
              <div class="flex items-center gap-2">
                <span
                  class="font-semibold text-gray-900 dark:text-white text-sm"
                >
                  {{ $t("chat.ai_label") }}
                </span>
                <span class="text-xs text-purple-600 dark:text-purple-400">
                  {{ $t("chat.window.thinking") }}
                </span>
              </div>

              <!-- Animated dots -->
              <div class="flex gap-1">
                <div
                  class="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style="animation-delay: 0ms"
                />
                <div
                  class="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style="animation-delay: 150ms"
                />
                <div
                  class="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
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
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Auto-scroll gdy pojawiają się nowe wiadomości LUB gdy AI generuje
watch(
  () => [activeConversation.value?.messages.length, isGenerating.value],
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);
</script>

<style></style>
