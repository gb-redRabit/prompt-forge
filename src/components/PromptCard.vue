<template>
  <div
    class="card justify-between bg-base-100 shadow-md border border-base-200 p-2 h-full flex flex-col gap-2"
  >
    <div class="flex items-center justify-between">
      <span class="font-semibold text-lg">
        {{ prompt.name[locale] || prompt.name.en }}
      </span>
      <button
        class="btn btn-xs btn-circle btn-primary shadow-md"
        @click="showModal = true"
        :title="$t('prompts.showTemplate')"
      >
        <oh-icon name="fa-regular-eye" scale="1.2" />
      </button>
    </div>
    <div class="text-xs text-base-content/60 mt-1">
      {{ prompt.description[locale] || prompt.description.en }}
    </div>
    <div v-if="prompt.template" class="mt-2">
      <span class="font-bold">{{ $t("prompts.template") }}:</span>
      <pre class="bg-base-200 rounded p-2 text-xs whitespace-pre-wrap"
        >{{
          typeof prompt.template === "object"
            ? prompt.template[locale] || prompt.template.en
            : prompt.template
        }}
      </pre>
    </div>
    <div
      v-if="prompt.placeholder_keys && prompt.placeholder_keys.length"
      class="mt-2"
    >
      <span class="font-bold">{{ $t("prompts.placeholders") }}:</span>
      <ul class="list-disc list-inside text-xs">
        <li v-for="ph in prompt.placeholder_keys" :key="ph">
          {{ ph }}
        </li>
      </ul>
    </div>
    <div v-if="prompt.tags_ids && prompt.tags_ids.length" class="mt-2">
      <span class="font-bold">{{ $t("prompts.tags") }}:</span>
      <ul class="flex flex-wrap gap-1 mt-1">
        <li v-for="tag in prompt.tags_ids" :key="tag">
          <span class="badge badge-outline badge-sm">{{ tag }}</span>
        </li>
      </ul>
    </div>

    <!-- Modal -->
    <dialog v-if="showModal" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-2xl mb-4">
          {{ $t("prompts.templatePreview") }}
        </h3>
        <pre class="bg-base-200 rounded p-2 text-md whitespace-pre-wrap mb-4"
          >{{ filledTemplate }}
        </pre>
        <div class="flex justify-end gap-2">
          <button class="btn btn-success btn-md" @click="copyTemplate">
            {{ $t("copy") }}
          </button>
          <button class="btn btn-primary btn-md" @click="editPrompt">
            {{ $t("edit") }}
          </button>
          <button class="btn btn-outline btn-md" @click="showModal = false">
            {{ $t("close") }}
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useSelectorOptionsStore } from "../store/selectorOptions";

const { locale, t } = useI18n();
const router = useRouter();
const selectorOptionsStore = useSelectorOptionsStore();
const props = defineProps({
  prompt: Object,
});

const showModal = ref(false);

// Zamiana [placeholder] na pierwszą wartość z selector_options
const filledTemplate = computed(() => {
  let template =
    typeof props.prompt.template === "object"
      ? props.prompt.template[locale.value] || props.prompt.template.en
      : props.prompt.template;

  if (!template) return "";

  // Zamień wszystkie [placeholder] na wartość z selector_options
  return template.replace(/\[([^\]]+)\]/g, (match, key) => {
    const options = selectorOptionsStore.getByKey(key);
    if (!options || !options[0]) return match;
    return options[0].label?.[locale.value] || options[0].value || match;
  });
});

function copyTemplate() {
  navigator.clipboard.writeText(filledTemplate.value);
  toast.success(t("copied"), {
    theme: "dark",
    position: "top-right",

    type: "default",
  });
}

function editPrompt() {
  router.push({
    name: "CreatePrompt",
    params: {
      type: props.prompt.type, // wymagany parametr!
    },
    query: {
      template: props.prompt.template[locale.value] || props.prompt.template.en,
    },
  });
  showModal.value = false;
}
</script>
