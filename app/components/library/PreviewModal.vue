<template>
  <transition name="scale-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="close"
      ></div>

      <GlassCard class="z-50 max-w-3xl w-full p-0 overflow-hidden">
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800"
        >
          <div>
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ subtitle }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <GlassButton
              size="xs"
              variant="outline"
              :title="$t('common.share')"
              @click="shareLink(prompt?.link)"
            >
              <UIcon name="i-heroicons-arrow-up-tray" class="w-4 h-4 mr-1" />
              <span class="sr-only" v-once>{{ $t("common.share") }}</span>
            </GlassButton>
            <GlassButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-x-mark"
              :title="$t('common.close')"
              @click="close"
            />
          </div>
        </div>

        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium mb-2">
              <span v-once>{{
                $t("library.modals.preview.template") || "Template"
              }}</span>
            </h4>
            <div
              class="max-h-64 overflow-auto bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm whitespace-pre-wrap"
            >
              {{
                prompt?.template?.[locale] ||
                prompt?.template ||
                prompt?.result ||
                ""
              }}
            </div>
            <div class="mt-3">
              <div class="flex flex-wrap gap-2">
                <template v-for="tag in prompt?.tags || []" :key="tag">
                  <span
                    class="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    >{{ tag }}</span
                  >
                </template>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium mb-2">
              <span v-once>{{
                $t("library.modals.preview.result") || "Result"
              }}</span>
            </h4>
            <div class="relative">
              <pre
                class="max-h-64 overflow-auto bg-white dark:bg-gray-900 p-3 rounded text-sm whitespace-pre-wrap border border-gray-100 dark:border-gray-800"
                >{{ prompt?.result || "" }}</pre
              >
              <div class="absolute top-2 right-2">
                <GlassButton
                  size="xs"
                  variant="outline"
                  icon="i-heroicons-clipboard"
                  :title="$t('common.copy')"
                  @click="copyResult"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2"
        >
          <GlassButton
            size="sm"
            color="primary"
            @click="openExternal(prompt?.link)"
          >
            <UIcon
              name="i-heroicons-arrow-top-right-on-square"
              class="w-4 h-4 mr-2"
            />
            <span v-once>{{ $t("common.open") || "Otwórz" }}</span>
          </GlassButton>
          <GlassButton size="sm" variant="ghost" @click="close">
            <span v-once>{{ $t("common.close") || "Zamknij" }}</span>
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { SavedPrompt } from "~/composables/useLibrary";
const props = defineProps<{ open: boolean; prompt: SavedPrompt | null }>();
const emit = defineEmits(["update:open"]);
const { t, locale } = useI18n();
const toast = useToast ? useToast() : { add: () => {} };

const title = computed(
  () =>
    getLocalized(props.prompt?.name) ||
    t("library.modals.preview.title") ||
    "Preview"
);
const subtitle = computed(() => getLocalized(props.prompt?.description));

function getLocalized(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return locale.value === "pl"
    ? value.pl || value.en || ""
    : value.en || value.pl || "";
}

const close = () => emit("update:open", false);

const copyResult = async () => {
  const text = props.prompt?.result;
  if (!text) {
    toast.add &&
      toast.add({
        title: t("common.no_link") || "Brak treści",
        color: "warning",
      });
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.add &&
      toast.add({
        title: t("common.copied") || "Skopiowano!",
        color: "success",
      });
  } catch (e) {
    console.error("Copy failed:", e);
    toast.add &&
      toast.add({
        title: t("common.copy_failed") || "Nie udało się skopiować",
        color: "error",
      });
  }
};

const shareLink = async (link?: string) => {
  if (!link) {
    toast.add && toast.add({ title: t("common.no_link"), color: "warning" });
    return;
  }
  try {
    await navigator.clipboard.writeText(link);
    toast.add && toast.add({ title: t("common.copied"), color: "success" });
  } catch (e) {
    toast.add && toast.add({ title: t("common.copy_failed"), color: "error" });
  }
};

const openExternal = (link?: string) => {
  if (!link) return;
  try {
    window.open(link, "_blank");
  } catch (e) {
    window.location.href = link;
  }
};
</script>
