<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh]">
    <h1 class="text-3xl font-bold mb-4">
      {{ $t("prompts.create") }}:
      <span class="capitalize">{{ promptType }}</span>
    </h1>
    <template v-if="parsedTemplate.length === 0">
      <div v-if="promptType.toUpperCase() === 'VIDEO'">
        <p>{{ $t("createPrompt.videoDescription") }}</p>
      </div>
      <div v-else-if="promptType.toUpperCase() === 'TEXT'">
        <p>{{ $t("createPrompt.textDescription") }}</p>
      </div>
      <div v-else-if="promptType.toUpperCase() === 'AUDIO'">
        <p>{{ $t("createPrompt.audioDescription") }}</p>
      </div>
      <div v-else-if="promptType.toUpperCase() === 'IMAGE'">
        <p>{{ $t("createPrompt.imageDescription") }}</p>
      </div>
      <div v-else>
        <p>{{ $t("createPrompt.unknownType") }}</p>
      </div>
    </template>
    <div v-if="parsedTemplate.length" class="w-full max-w-5xl mt-8">
      <h2 class="text-xl font-semibold mb-2">
        {{ $t("prompts.templatePreview") }}
      </h2>

      <!-- Edytor z interaktywnymi placeholderami -->
      <div
        class="border rounded bg-base-200 p-2 font-mono text-sm min-h-[120px]"
        contenteditable="true"
        spellcheck="false"
        @input="onEdit"
        ref="editor"
      >
        <template v-for="(part, idx) in parsedTemplate" :key="idx">
          <template v-if="part.type === 'text'">
            {{ part.value }}
          </template>
          <template v-else>
            <select
              :value="placeholderValues[part.key]"
              @change="onSelectChange($event, part.key)"
              class="select select-sm w-auto mx-1 inline"
            >
              <option
                v-for="opt in selectorOptions[part.key] ?? []"
                :key="opt.value"
                :value="opt.label?.[locale] || opt.value"
              >
                {{ opt.label?.[locale] || opt.value }}
              </option>
            </select>
          </template>
        </template>
      </div>
    </div>
  </div>
  <div>
    <textarea
      v-model="userPrompt"
      class="textarea textarea-bordered w-full"
      placeholder="Wpisz prompt..."
    ></textarea>
    <button
      class="btn btn-primary mt-2"
      @click="sendToOpenAI"
      :disabled="loading"
    >
      Wyślij do ChatGPT
    </button>
    <div v-if="aiResponse" class="mt-4 bg-base-200 p-2 rounded">
      <b>Odpowiedź AI:</b>
      <pre>{{ aiResponse }}</pre>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import selectorOptions from "../prompts/selector_options.json";
import { useSelectorOptionsStore } from "../store/selectorOptions";
import { askOpenAI } from "../api/openai";

const selectorOptionsStore = useSelectorOptionsStore();
const { locale } = useI18n();
const route = useRoute();
const promptType = computed(() => route.params.type);
const template = computed(() => route.query.template || "");

// Wyciągnij placeholdery i teksty z szablonu
const placeholderValues = ref({});
const parsedTemplate = computed(() => {
  const tpl = template.value || "";
  // Podziel tekst na fragmenty tekstowe i placeholdery
  const regex = /\[([^\]]+)]/g;
  let lastIndex = 0;
  let match;
  const parts = [];
  while ((match = regex.exec(tpl)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: tpl.slice(lastIndex, match.index) });
    }
    const key = match[1];
    parts.push({ type: "placeholder", key });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < tpl.length) {
    parts.push({ type: "text", value: tpl.slice(lastIndex) });
  }
  return parts;
});

// Ustaw domyślne wartości placeholderów
watch(
  parsedTemplate,
  (parts) => {
    const obj = { ...placeholderValues.value };
    parts.forEach((part) => {
      if (part.type === "placeholder" && !obj[part.key]) {
        const opts = selectorOptionsStore.getByKey(part.key);
        obj[part.key] =
          opts && opts[0]
            ? opts[0].label?.[locale.value] || opts[0].value
            : `[${part.key}]`;
      }
    });
    placeholderValues.value = obj;
  },
  { immediate: true }
);

// Aktualizuj tekst po zmianie selecta
function onSelectChange(e, key) {
  placeholderValues.value[key] = e.target.value;
  updateEditor();
}

// Synchronizuj contenteditable z danymi
const editor = ref(null);
function updateEditor() {
  if (!editor.value) return;
  let html = "";
  parsedTemplate.value.forEach((part) => {
    if (part.type === "text") {
      html += part.value.replace(/ /g, "&nbsp;");
    } else {
      const opts = selectorOptions[part.key] || [];
      html += `<select data-key="${part.key}" class="select  select-sm w-auto mx-1 inline">`;
      opts.forEach((opt) => {
        const val = opt.label?.[locale.value] || opt.value;
        const selected =
          val === placeholderValues.value[part.key] ? "selected" : "";
        html += `<option value="${val}" ${selected}>${val}</option>`;
      });
      html += "</select>";
    }
  });
  editor.value.innerHTML = html;
}

// Obsługa edycji tekstu (opcjonalnie: można rozbudować o synchronizację zmian tekstowych)
function onEdit() {
  // Możesz dodać obsługę edycji tekstu, jeśli chcesz pozwolić na pełną edycję
}

watch([parsedTemplate, placeholderValues, locale], updateEditor, {
  immediate: true,
});

const openaiKey = ref(localStorage.getItem("openaiKey") || "");
const userPrompt = ref("");
const aiResponse = ref("");
const loading = ref(false);

async function sendToOpenAI() {
  loading.value = true;
  try {
    aiResponse.value = await askOpenAI(userPrompt.value, openaiKey.value);
  } catch (e) {
    aiResponse.value = "Błąd: " + e.message;
  }
  loading.value = false;
}
</script>
