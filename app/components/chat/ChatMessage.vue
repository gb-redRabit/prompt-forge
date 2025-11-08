<template>
  <div
    class="group px-3 sm:px-4 md:px-6 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    :class="{
      'bg-blue-50/50 dark:bg-blue-900/10': message.role === 'user',
    }"
  >
    <div class="max-w-4xl mx-auto flex gap-2 sm:gap-3 md:gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div
          class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
          :class="
            message.role === 'user'
              ? 'bg-primary-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          "
        >
          <UIcon
            :name="
              message.role === 'user'
                ? 'i-heroicons-user'
                : 'i-heroicons-sparkles'
            "
            class="w-4 h-4 sm:w-5 sm:h-5 text-white"
          />
        </div>
      </div>

      <!-- Message content -->
      <div class="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
        <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span
            class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm"
          >
            {{ message.role === "user" ? $t("chat.you") : $t("chat.ai_label") }}
          </span>

          <!-- Model badge for AI messages -->
          <GlassBadge
            v-if="message.role === 'assistant' && message.model"
            color="neutral"
            variant="soft"
            size="xs"
            icon="i-heroicons-cpu-chip"
            class="text-[10px] sm:text-xs"
          >
            {{ message.model }}
          </GlassBadge>

          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {{ formatTime(message.timestamp) }}
          </span>
        </div>

        <!-- Message text with markdown support -->
        <div
          class="prose prose-sm sm:prose dark:prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100"
        >
          <div class="whitespace-pre-wrap break-words text-xs sm:text-sm">
            {{ message.content }}
          </div>
        </div>

        <!-- Actions -->
        <div
          class="flex items-center gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GlassButton
            color="success"
            variant="ghost"
            size="xs"
            class="text-xs"
            icon="i-heroicons-clipboard"
            @click="copyMessage"
          >
            <span class="hidden sm:inline">{{
              copied ? $t("common.copied") : $t("common.copy")
            }}</span>
          </GlassButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
    model?: string; // Dodane pole
  };
}>();

const copied = ref(false);

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Błąd kopiowania:", err);
  }
};
</script>
