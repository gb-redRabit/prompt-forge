<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('prompt_creator.add_custom_tag')"
    :description="$t('prompt_creator.add_custom_tag_description')"
    :ui="{
      wrapper: 'z-[60]',
      overlay: 'z-[60]',
      content: 'w-full h-full sm:h-auto sm:max-w-3xl m-0 sm:m-4 rounded-none sm:rounded-xl z-[60]',
      body: 'overflow-y-auto max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-6rem)]',
    }"
  >
    <template #body>
      <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
        <!-- Section: Basic Info -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">
            <UIcon name="i-heroicons-tag" class="w-5 h-5 text-primary-500" />
            <span>{{ $t("prompt_creator.tag_names") }}</span>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <!-- Name PL -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <UIcon name="i-heroicons-language" class="w-4 h-4" />
                <span>{{ $t("prompt_creator.tag_name") }}</span>
                <GlassBadge color="primary" variant="soft" size="xs">PL</GlassBadge>
                <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="model.pl"
                :placeholder="$t('prompt_creator.tag_name_placeholder_pl')"
                size="lg"
                leading-icon="i-heroicons-pencil"
                class="w-full"
                required
              />
            </div>

            <!-- Name EN -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <UIcon name="i-heroicons-language" class="w-4 h-4" />
                <span>{{ $t("prompt_creator.tag_name") }}</span>
                <GlassBadge color="secondary" variant="soft" size="xs">EN</GlassBadge>
                <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="model.en"
                :placeholder="$t('prompt_creator.tag_name_placeholder_en')"
                size="lg"
                leading-icon="i-heroicons-pencil"
                class="w-full"
                required
              />
            </div>
          </div>
        </div>

        <!-- Section: Negative Prompts -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">
            <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-500" />
            <span>{{ $t("prompt_creator.negative_prompts_optional") }}</span>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                <span>{{ $t("prompt_creator.negative_prompt") }}</span>
                <GlassBadge color="primary" variant="soft" size="xs">PL</GlassBadge>
              </label>
              <UInput
                v-model="model.neg_pl"
                :placeholder="$t('prompt_creator.negative_prompt_placeholder_pl')"
                size="lg"
                leading-icon="i-heroicons-minus-circle"
                class="w-full"
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                <span>{{ $t("prompt_creator.negative_prompt") }}</span>
                <GlassBadge color="secondary" variant="soft" size="xs">EN</GlassBadge>
              </label>
              <UInput
                v-model="model.neg_en"
                :placeholder="$t('prompt_creator.negative_prompt_placeholder_en')"
                size="lg"
                leading-icon="i-heroicons-minus-circle"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Section: Settings -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-slate-500" />
            <span>{{ $t("prompt_creator.additional_settings") }}</span>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-eye-slash" class="w-5 h-5 text-red-500" />
              <div>
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ $t("prompt_creator.mark_as_nsfw") }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ $t("prompt_creator.nsfw_description") }}
                </p>
              </div>
            </div>
            <USwitch v-model="model.nsfw" color="error" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ $t("prompt_creator.required_fields_note") }}
          </p>
            <div class="flex gap-3">
            <GlassButton
              color="neutral"
              variant="outline"
              @click="isOpen = false"
              icon="i-heroicons-x-mark"
            >
              {{ $t("pages.shared.cancel") }}
            </GlassButton>
            <GlassButton
              type="submit"
              color="primary"
              :disabled="!model.pl.trim() || !model.en.trim()"
              icon="i-heroicons-plus-circle"
            >
              {{ $t("pages.shared.add") }}
            </GlassButton>
          </div>
        </div>
      </form>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false });

const props = defineProps<{
  initialData?: {
    pl: string;
    en: string;
    neg_pl: string;
    neg_en: string;
    nsfw: boolean;
  }
}>();

const emit = defineEmits(['submit']);

const model = ref({
  pl: '',
  en: '',
  neg_pl: '',
  neg_en: '',
  nsfw: false,
  ...props.initialData
});

// Reset form when opening
watch(isOpen, (val) => {
  if (val && !props.initialData) {
    model.value = {
      pl: '',
      en: '',
      neg_pl: '',
      neg_en: '',
      nsfw: false
    };
  }
});

const handleSubmit = () => {
  emit('submit', { ...model.value });
  isOpen.value = false;
};
</script>
