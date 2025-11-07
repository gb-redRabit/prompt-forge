<template>
  <GlassCard
    variant="default"
    padding="lg"
    hover
    shadow
    class="group transition-all duration-300"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3
        class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
        >
          <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 text-white" />
        </div>
        {{ $t("app.demo.output_title") }}
      </h3>

      <!-- Copy button -->
      <GlassButton
        v-if="showCopy && outputText"
        color="primary"
        variant="soft"
        size="sm"
        :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
        icon-position="left"
        @click="$emit('copy')"
      >
        {{ copied ? $t("app.demo.copied") : $t("app.demo.copy") }}
      </GlassButton>
    </div>

    <!-- State Content -->
    <slot />
  </GlassCard>
</template>

<script setup lang="ts">
interface Props {
  outputText?: string;
  showCopy?: boolean;
  copied?: boolean;
}

withDefaults(defineProps<Props>(), {
  outputText: "",
  showCopy: false,
  copied: false,
});

defineEmits<{
  copy: [];
}>();
</script>
