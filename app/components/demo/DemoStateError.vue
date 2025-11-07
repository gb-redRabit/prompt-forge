<template>
  <div class="min-h-[300px] flex items-center justify-center">
    <div class="text-center space-y-4">
      <div class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-2xl"
        ></div>
        <div
          class="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-lg"
        >
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-10 h-10 text-red-600 dark:text-red-400"
          />
        </div>
      </div>
      <div>
        <p class="text-red-600 dark:text-red-400 font-semibold">
          {{ $t("app.demo.error") }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md">
          {{ error }}
        </p>
      </div>
      <UButton color="neutral" variant="soft" size="sm" @click="$emit('retry')">
        <UIcon name="i-heroicons-arrow-path" class="mr-2" />
        {{ $t("app.demo.retry") }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string;
}

defineProps<Props>();
defineEmits<{
  retry: [];
}>();
</script>
