<template>
  <UModal v-model:open="isOpen" :title="$t('prompt_creator.save_prompt')">
    <template #body>
      <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
        <!-- Name -->
        <div class="space-y-2">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ $t("prompt_creator.prompt_name") }}
            <span class="text-red-500">*</span>
          </label>
          <UInput
            v-model="form.name"
            :placeholder="$t('prompt_creator.prompt_name_placeholder')"
            size="lg"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ $t("prompt_creator.description") }}
          </label>
          <UTextarea
            v-model="form.description"
            :placeholder="$t('prompt_creator.description_placeholder')"
            :rows="3"
          />
        </div>

        <!-- Positive Prompt Preview -->
        <div v-if="positivePrompt" class="space-y-2">
          <label
            class="block text-sm font-medium text-green-700 dark:text-green-400"
          >
            {{ $t("prompt_creator.positive_prompt") }}
          </label>
          <div
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
          >
            <p class="text-sm text-gray-700 dark:text-gray-300 font-mono">
              {{ positivePrompt.substring(0, 150)
              }}{{ positivePrompt.length > 150 ? "..." : "" }}
            </p>
          </div>
        </div>

        <!-- Negative Prompt Preview -->
        <div v-if="negativePrompt" class="space-y-2">
          <label
            class="block text-sm font-medium text-red-700 dark:text-red-400"
          >
            {{ $t("prompt_creator.negative_prompt") }}
          </label>
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <p class="text-sm text-gray-700 dark:text-gray-300 font-mono">
              {{ negativePrompt.substring(0, 150)
              }}{{ negativePrompt.length > 150 ? "..." : "" }}
            </p>
          </div>
        </div>

        <!-- Tags count -->
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-tag" class="w-4 h-4 text-gray-500" />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ tags.length }} {{ $t("prompt_creator.tags_included") }}
          </span>
        </div>

        <!-- Actions -->
        <div
          class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <UButton color="neutral" variant="outline" @click="handleCancel">
            {{ $t("common.cancel") }}
          </UButton>
          <UButton type="submit" color="primary" :disabled="!form.name.trim()">
            <UIcon name="i-heroicons-bookmark" class="mr-2" />
            {{ $t("common.save") }}
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  positivePrompt: string;
  negativePrompt: string;
  tags: string[];
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  save: [data: { name: string; description: string }];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const form = ref({
  name: "",
  description: "",
});

const handleSubmit = () => {
  if (!form.value.name.trim()) return;

  emit("save", {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
  });

  // Reset form
  form.value = { name: "", description: "" };
};

const handleCancel = () => {
  form.value = { name: "", description: "" };
  isOpen.value = false;
};

// Reset form when modal closes
watch(isOpen, (newVal) => {
  if (!newVal) {
    form.value = { name: "", description: "" };
  }
});
</script>
