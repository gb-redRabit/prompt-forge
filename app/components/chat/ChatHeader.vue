<template>
  <div
    class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
  >
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <!-- Conversation title -->
      <div class="flex-1 min-w-0">
        <h2
          v-if="activeConversation"
          class="text-lg font-semibold text-gray-900 dark:text-white truncate"
        >
          {{ activeConversation.title }}
        </h2>
        <h2
          v-else
          class="text-lg font-semibold text-gray-500 dark:text-gray-400"
        >
          {{ $t("chat.select_start") }}
        </h2>

        <!-- Model info -->
        <div v-if="currentModel" class="flex items-center gap-2 mt-1">
          <GlassBadge
            color="primary"
            variant="soft"
            size="xs"
            icon="i-heroicons-cpu-chip"
          >
            {{ currentModel }}
          </GlassBadge>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            |
            {{
              isConfigured
                ? $t("ai.status.connected")
                : $t("ai.status.not_configured")
            }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Rename button -->
        <GlassButton
          v-if="activeConversation"
          color="success"
          variant="ghost"
          size="sm"
          icon="i-heroicons-pencil"
          @click="$emit('rename')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChat } from "~/composables/useChat";
import { useAI } from "~/composables/useAI";

const { activeConversation } = useChat();
const { config, isConfigured } = useAI();

const currentModel = computed(() => {
  return config.value?.modelId || null;
});

defineEmits(["rename"]);
</script>

<style></style>
