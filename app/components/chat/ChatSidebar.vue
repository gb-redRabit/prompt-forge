<template>
  <div
    class="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col h-full"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-800">
      <UButton color="primary" block @click="createNew">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        {{ $t("chat.new_conversation") }}
      </UButton>
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
            >
              {{ conv.title }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ conv.messages.length }} wiadomości
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-600 mt-1">
              {{ formatDate(conv.updatedAt) }}
            </p>
          </div>

          <!-- Delete button -->
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="deleteConv(conv.id)"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </UButton>
        </div>
      </button>

      <!-- Empty state -->
      <div v-if="conversations.length === 0" class="text-center py-8 px-4">
        <UIcon
          name="i-heroicons-chat-bubble-left-right"
          class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2"
        />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t("chat.no_conversations") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChat } from "~/composables/useChat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
  if (window.confirm(t("chat.confirm_delete"))) {
    deleteConversation(id);
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return t("chat.today") || "Dziś";
  if (diffDays === 1) return t("chat.yesterday") || "Wczoraj";
  if (diffDays < 7) return `${diffDays} ${t("chat.days_ago") || "dni temu"}`;

  return date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
};
</script>
