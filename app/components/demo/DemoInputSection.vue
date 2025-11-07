<template>
  <GlassCard
    variant="default"
    padding="lg"
    hover
    shadow
    class="group transition-all duration-300"
  >
    <div class="flex items-center justify-between mb-4">
      <h3
        class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30"
        >
          <UIcon name="i-heroicons-pencil" class="w-4 h-4 text-white" />
        </div>
        {{ $t("app.demo.input_title") }}
      </h3>
      <span
        v-if="modelValue.length > 0"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        {{ modelValue.length }} {{ $t("app.demo.characters") }}
      </span>
    </div>

    <!-- Example Prompts as GlassBadges -->
    <div class="flex flex-wrap gap-2 mb-4">
      <GlassBadge
        v-for="(example, index) in examples"
        :key="index"
        variant="soft"
        size="sm"
        class="cursor-pointer hover:scale-105 transition-transform"
        @click="$emit('update:model-value', example)"
      >
        {{ example.slice(0, 30) }}...
      </GlassBadge>
    </div>

    <!-- Textarea -->
    <textarea
      :value="modelValue"
      @input="
        $emit(
          'update:model-value',
          ($event.target as HTMLTextAreaElement).value
        )
      "
      :placeholder="$t('app.demo.input_placeholder')"
      rows="8"
      class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none backdrop-blur-sm transition-all duration-200"
    />

    <!-- Footer -->
    <div class="flex items-center justify-between mt-4">
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ modelValue.length }} {{ $t("app.demo.characters") }}
        </span>
        <div v-if="modelValue.length > 0" class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span class="text-xs text-green-600 dark:text-green-400 font-medium">
            {{ $t("app.demo.ready") }}
          </span>
        </div>
      </div>
      <GlassButton
        color="primary"
        size="lg"
        :loading="processing"
        :disabled="!modelValue.trim() || !canProcess"
        icon="i-heroicons-sparkles"
        icon-position="left"
        glow
        @click="$emit('process')"
      >
        {{ $t("app.demo.optimize_button") }}
      </GlassButton>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  examples: string[];
  processing: boolean;
  canProcess: boolean;
}

defineProps<Props>();

defineEmits<{
  "update:model-value": [value: string];
  process: [];
}>();
</script>
