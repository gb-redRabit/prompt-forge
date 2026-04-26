<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('prompt_creator.negative_templates')"
    :description="$t('prompt_creator.negative_templates_description')"
    :ui="{
      wrapper: 'z-[60]',
      overlay: 'z-[60]',
      content: 'w-full h-full sm:h-auto sm:max-w-4xl m-0 sm:m-4 rounded-none sm:rounded-xl z-[60]',
      body: 'overflow-y-auto max-h-[calc(100vh-8rem)]',
    }"
  >
    <template #body>
      <div class="space-y-6 p-6">
        <!-- Header with counter -->
        <div class="space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <GlassBadge
                :color="activeTemplates.length > 0 ? 'primary' : 'neutral'"
                variant="soft"
                size="md"
              >
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                <span class="font-semibold ml-1">{{ activeTemplates.length }}</span>
                <span class="ml-1">{{ $t("prompt_creator.selected") }}</span>
              </GlassBadge>
            </div>

            <GlassButton
              v-if="activeTemplates.length > 0"
              color="error"
              variant="outline"
              size="sm"
              @click="activeTemplates = []"
              icon="i-heroicons-x-circle"
            >
              {{ $t("prompt_creator.clear_all") }}
            </GlassButton>
          </div>

          <div class="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p class="text-sm text-blue-700 dark:text-blue-300">
              {{ $t("prompt_creator.negative_templates_info") }}
            </p>
          </div>
        </div>

        <!-- Template Groups -->
        <div class="space-y-6">
          <div
            v-for="group in groups"
            :key="group.label"
            class="space-y-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
          >
            <!-- Group Header -->
            <div class="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <UIcon name="i-heroicons-folder" class="w-5 h-5 text-primary-500" />
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
                {{ group.label }}
              </h4>
              <GlassBadge color="neutral" variant="soft" size="xs">
                {{ group.templates.length }}
              </GlassBadge>
            </div>

            <!-- Templates Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <GlassButton
                v-for="template in group.templates"
                :key="template.label"
                :color="activeTemplates.includes(template.text) ? 'primary' : 'neutral'"
                :variant="activeTemplates.includes(template.text) ? 'solid' : 'outline'"
                size="sm"
                @click="toggleTemplate(template.text)"
                class="justify-between group relative overflow-hidden"
              >
                <span class="flex-1 text-left truncate">{{ template.label }}</span>
                <UIcon
                  v-if="activeTemplates.includes(template.text)"
                  name="i-heroicons-check-circle-solid"
                  class="w-4 h-4 flex-shrink-0 ml-2"
                />
                <UIcon
                  v-else
                  name="i-heroicons-plus-circle"
                  class="w-4 h-4 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </GlassButton>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="activeTemplates.length > 0" class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">
            <UIcon name="i-heroicons-eye" class="w-5 h-5 text-purple-500" />
            <span>{{ $t("prompt_creator.preview") }}</span>
          </div>

          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p class="text-sm text-slate-300 font-mono leading-relaxed">
              {{ activeTemplates.join(", ") }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ $t("prompt_creator.templates_auto_apply") }}
          </p>
          <GlassButton
            color="neutral"
            variant="outline"
            @click="isOpen = false"
            icon="i-heroicons-check"
          >
            {{ $t("common.done") }}
          </GlassButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false });

interface Template {
  label: string;
  text: string;
}

interface TemplateGroup {
  label: string;
  templates: Template[];
}

defineProps<{
  groups: TemplateGroup[]
}>();

const activeTemplates = defineModel<string[]>('activeTemplates', { default: [] });

const toggleTemplate = (text: string) => {
  const index = activeTemplates.value.indexOf(text);
  if (index > -1) {
    activeTemplates.value.splice(index, 1);
  } else {
    activeTemplates.value.push(text);
  }
};
</script>
