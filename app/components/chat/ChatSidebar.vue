<template>
  <div
    class="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col h-full"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-800">
      <GlassButton color="primary" full-width @click="createNew">
        <template #icon>
          <UIcon name="i-heroicons-plus" />
        </template>
        {{ $t("chat.sidebar.new_conversation") }}
      </GlassButton>
    </div>

    <!-- Conversations list -->
    <div class="flex-1 overflow-y-auto p-2 space-y-1">
      <button
        v-for="conv in conversations"
        :key="conv.id"
        class="w-full text-left p-3 rounded-lg transition-all group"
        :class="[
          conv.id === activeConversationId
            ? 'bg-white dark:bg-gray-800 shadow-sm'
            : 'hover:bg-white/50 dark:hover:bg-gray-800/50',
        ]"
        @click="selectConv(conv.id)"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <h3
              class="font-medium text-sm text-gray-900 dark:text-white truncate"
              :title="conv.title"
            >
              {{ conv.title }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{
                $t("chat.sidebar.message_count", {
                  count: conv.messages.length,
                })
              }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-600 mt-1">
              {{ formatDate(conv.updatedAt) }}
            </p>
          </div>

          <!-- Delete button -->
          <GlassButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-heroicons-trash"
            :title="$t('chat.sidebar.delete_conversation')"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="deleteConv(conv.id)"
          />
        </div>
      </button>

      <!-- Empty state -->
      <div v-if="conversations.length === 0" class="text-center py-8 px-4">
        <UIcon
          name="i-heroicons-chat-bubble-left-right"
          class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2"
        />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t("chat.sidebar.no_conversations") }}
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-600 mt-2">
          {{ $t("chat.sidebar.start_conversation") }}
        </p>
      </div>
    </div>

    <!-- Footer with stats -->
    <div
      v-if="conversations.length > 0"
      class="p-4 border-t border-gray-200 dark:border-gray-800"
    >
      <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div class="flex items-center justify-between">
          <span>{{ $t("chat.sidebar.total_conversations") }}</span>
          <span class="font-medium">{{ conversations.length }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>{{ $t("chat.sidebar.total_messages") }}</span>
          <span class="font-medium">{{ totalMessages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChat } from "~/composables/useChat";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const {
  conversations,
  activeConversationId,
  createConversation,
  deleteConversation,
  selectConversation,
} = useChat();

const createNew = () => {
  createConversation();
};

const selectConv = (id: string) => {
  selectConversation(id);
};

const deleteConv = (id: string) => {
  if (window.confirm(t("chat.sidebar.confirm_delete"))) {
    deleteConversation(id);
  }
};

// Oblicz całkowitą liczbę wiadomości
const totalMessages = computed(() => {
  return conversations.value.reduce(
    (sum, conv) => sum + conv.messages.length,
    0
  );
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    // Dziś - pokaż godzinę
    return date.toLocaleTimeString(locale.value === "pl" ? "pl-PL" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffDays === 1) {
    return t("chat.sidebar.yesterday");
  }

  if (diffDays < 7) {
    return t("chat.sidebar.days_ago", { count: diffDays });
  }

  // Starsze - pełna data
  return date.toLocaleDateString(locale.value === "pl" ? "pl-PL" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: diffDays > 365 ? "2-digit" : undefined,
  });
};
</script>
