<template>
  <div v-if="prompts.length > 0">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
      <div
        v-for="prompt in displayedPrompts"
        :key="prompt.savedId"
        class="flex flex-col p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all group animate-fade-in-up"
      >
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">
              {{
                prompt.name
                  ? locale === "pl"
                    ? prompt.name.pl
                    : prompt.name.en
                  : prompt.result || "Prompt"
              }}
            </h3>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
            {{
              prompt.description
                ? locale === "pl"
                  ? prompt.description.pl
                  : prompt.description.en
                : prompt.result || ""
            }}
          </p>
        </div>

        <div
          class="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-3"
        >
          <span class="text-xs text-slate-500">{{ formattedDateFor(prompt) }}</span>
          <div
            class="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity"
          >
            <GlassButton
              size="xs"
              color="primary"
              variant="soft"
              icon="i-heroicons-play"
              @click="$emit('use', prompt)"
            >
              <span v-once>{{ $t("common.use") }}</span>
            </GlassButton>
            <GlassButton
              size="xs"
              color="neutral"
              variant="outline"
              @click="$emit('share', prompt.link)"
            >
              <span v-once>{{ $t("common.share") }}</span>
            </GlassButton>
            <GlassButton
              size="xs"
              color="neutral"
              variant="ghost"
              @click="$emit('preview', prompt)"
            >
              <span v-once>{{ $t("common.preview") }}</span>
            </GlassButton>
            <GlassButton
              size="xs"
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="$emit('delete', prompt.savedId)"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Infinite scroll trigger -->
    <div ref="loadMoreTrigger" class="w-full h-4 mt-4"></div>
  </div>
  <div v-else class="text-center py-12">
    <UIcon name="i-heroicons-sparkles" class="w-16 h-16 mx-auto text-slate-400 mb-4" />
    <p class="text-slate-500">{{ $t("library.custom.no_prompts") || "Brak promptów z edytora." }}</p>
  </div>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";
import { ref, computed, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps<{
  prompts: SavedPrompt[];
}>();

const { locale } = useI18n();

defineEmits<{
  use: [prompt: SavedPrompt];
  share: [link: string | undefined];
  preview: [prompt: SavedPrompt];
  delete: [id: string];
}>();

const displayLimit = ref(15);
const loadMoreTrigger = ref<HTMLElement | null>(null);

watch(() => props.prompts, () => {
  displayLimit.value = 15;
});

const displayedPrompts = computed(() => {
  return props.prompts.slice(0, displayLimit.value);
});

useIntersectionObserver(loadMoreTrigger, (entries) => {
  const entry = entries[0];
  if (entry?.isIntersecting && displayLimit.value < props.prompts.length) {
    displayLimit.value += 15;
  }
});

const formattedDateFor = (prompt: any) => {
  if (!prompt.createdAt) return "";
  return new Date(prompt.createdAt).toLocaleDateString();
};
</script>
