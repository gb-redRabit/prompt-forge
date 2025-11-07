<template>
  <div class="space-y-4 mt-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        <span v-once>{{ $t("library.collections.organize") }}</span>
      </p>
      <GlassButton color="primary" size="sm" @click="$emit('create')">
        <UIcon name="i-heroicons-plus" class="mr-1" />
        <span v-once>{{ $t("library.collections.new") }}</span>
      </GlassButton>
    </div>

    <div
      v-if="collections.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <GlassCard
        v-for="collection in collections"
        :key="collection.id"
        class="hover:shadow-lg transition-all cursor-pointer"
        @click="$emit('view', collection)"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-folder"
                class="w-5 h-5 text-primary-600"
              />
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ collection.name }}
              </h3>
            </div>
            <div class="flex items-center gap-1">
              <GlassButton
                color="primary"
                variant="ghost"
                size="xs"
                icon="i-heroicons-plus"
                @click.stop="$emit('add-prompts', collection)"
              />
              <GlassButton
                color="error"
                variant="ghost"
                size="xs"
                icon="i-heroicons-trash"
                @click.stop="$emit('delete', collection.id)"
              />
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <p
            v-if="collection.description"
            class="text-sm text-gray-600 dark:text-gray-400"
          >
            {{ collection.description }}
          </p>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
            {{
              $t("library.collections.promptCount", {
                count: collection.promptIds.length,
              })
            }}
          </div>

          <!-- Prompty w kolekcji -->
          <div
            v-if="getCollectionPrompts(collection.id).length > 0"
            class="mt-3 space-y-2"
          >
            <div
              v-for="prompt in getCollectionPrompts(collection.id).slice(0, 3)"
              :key="prompt.savedId"
              class="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
            >
              <span class="truncate flex-1" :title="getPromptName(prompt)">
                {{ getPromptName(prompt) }}
              </span>
              <div class="flex items-center gap-1 flex-shrink-0">
                <GlassButton
                  color="primary"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-arrow-right"
                  :title="$t('library.actions.use')"
                  @click.stop="$emit('use-prompt', prompt)"
                />
                <GlassButton
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  :title="$t('library.actions.removeFromCollection')"
                  @click.stop="
                    $emit('remove-prompt', collection.id, prompt.savedId)
                  "
                />
              </div>
            </div>
            <p
              v-if="getCollectionPrompts(collection.id).length > 3"
              class="text-xs text-gray-500 text-center"
            >
              {{
                $t("library.collections.more", {
                  count: getCollectionPrompts(collection.id).length - 3,
                })
              }}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>

    <div v-else class="text-center py-12">
      <UIcon
        name="i-heroicons-folder"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      />
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t("library.collections.empty") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PromptCollection, SavedPrompt } from "~/composables/useLibrary";

const props = defineProps<{
  collections: PromptCollection[];
  allPrompts: SavedPrompt[];
}>();

defineEmits<{
  create: [];
  view: [collection: PromptCollection];
  delete: [id: string];
  "add-prompts": [collection: PromptCollection];
  "use-prompt": [prompt: SavedPrompt];
  "remove-prompt": [collectionId: string, promptId: string];
}>();

const { locale } = useI18n();
const { prompts: templates } = usePreloadedContent();

const getPromptName = (prompt: SavedPrompt): string => {
  // 1. Jeśli prompt ma bezpośrednio nazwę (custom prompty)
  if (prompt.name) {
    if (typeof prompt.name === "string") return prompt.name;
    return locale.value === "pl"
      ? prompt.name.pl || prompt.name.en || "Bez nazwy"
      : prompt.name.en || prompt.name.pl || "Untitled";
  }

  // 2. Jeśli to zapisany prompt z biblioteki - znajdź w templates
  if (prompt.promptId && templates.value) {
    const template = templates.value.find(
      (t) => t.id?.toString() === prompt.promptId
    );

    if (template?.name) {
      if (typeof template.name === "string") return template.name;
      return locale.value === "pl"
        ? template.name.pl || template.name.en || "Bez nazwy"
        : template.name.en || template.name.pl || "Untitled";
    }
  }

  // 3. Fallback - pierwsze 50 znaków z result
  if (prompt.result) {
    let text = "";
    if (typeof prompt.result === "string") {
      text = prompt.result;
    } else if (typeof prompt.result === "object" && prompt.result !== null) {
      const localizedResult = prompt.result as { pl?: string; en?: string };
      text = localizedResult.pl || localizedResult.en || "";
    }

    return text.length > 50
      ? text.substring(0, 50) + "..."
      : text || "Bez nazwy";
  }

  // 4. Ostateczny fallback
  return locale.value === "pl" ? "Bez nazwy" : "Untitled";
};

const getCollectionPrompts = (collectionId: string) => {
  const collection = props.collections.find((c) => c.id === collectionId);
  if (!collection) return [];
  return props.allPrompts.filter((p) =>
    collection.promptIds.includes(p.savedId)
  );
};
</script>
