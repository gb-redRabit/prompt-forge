<template>
  <div
    class="container max-w-5xl flex flex-col items-center justify-start py-6"
  >
    <h1 class="text-3xl font-bold mb-2 text-center">
      {{ $t("prompts.create") }}:
      <span class="capitalize">{{ promptType }}</span>
    </h1>

    <!-- Wybór promptu -->
    <Form @submit="() => {}" class="mb-6 w-full flex flex-col gap-2">
      <label class="font-semibold">{{ $t("prompts.choosePrompt") }}</label>
      <Field
        as="select"
        name="prompt"
        class="select select-bordered w-full"
        v-model="selectedPromptId"
        @change="onPromptChange"
        :disabled="promptsByType.length === 0"
        rules="required"
      >
        <option v-for="p in promptsByType" :key="p.id" :value="p.id">
          {{ p.name?.[locale] || p.name?.en || "Prompt #" + p.id }}
        </option>
      </Field>
      <ErrorMessage name="prompt" class="text-error text-xs" />
    </Form>

    <!-- Szczegóły promptu -->
    <div v-if="prompt" class="mb-6 w-full bg-base-200 rounded-xl p-5 shadow">
      <h2 class="text-xl font-semibold mb-1">
        {{ prompt.name?.[locale] || prompt.name?.en }}
      </h2>
      <p class="mb-2 text-base-content/80">
        {{ prompt.description?.[locale] || prompt.description?.en }}
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in prompt.tags_ids"
          :key="tag"
          class="badge badge-outline"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Podgląd szablonu -->
    <Form
      @submit="sendToOpenAI"
      class="w-full mt-4"
      v-if="parsedTemplate.length"
    >
      <h2 class="text-lg font-semibold mb-2">
        {{ $t("prompts.templatePreview") }}
      </h2>
      <div
        class="border rounded-xl bg-base-200 p-4 font-mono text-sm min-h-[120px] mb-4"
      >
        <template v-for="(part, idx) in parsedTemplate" :key="idx">
          <template v-if="part.type === 'text'">
            {{ part.value }}
          </template>
          <template v-else>
            <div class="inline-flex items-center gap-1">
              <template v-if="placeholderValues[part.key] === '__custom__'">
                <input
                  type="text"
                  class="input input-sm w-auto mx-1 inline"
                  :placeholder="
                    $t('prompts.enterCustomValue') || 'Wpisz własną wartość...'
                  "
                  v-model="customValues[part.key]"
                  @input="onCustomInput(part.key)"
                  autofocus
                />
                <button
                  type="button"
                  class="btn btn-xs btn-circle btn-ghost"
                  @click="resetToSelect(part.key)"
                  title="Wróć do wyboru"
                >
                  ✕
                </button>
              </template>
              <template v-else>
                <select
                  class="select select-sm w-auto mx-1 inline"
                  v-model="placeholderValues[part.key]"
                >
                  <option
                    v-for="(opt, optIdx) in selectorOptions[part.key] ?? []"
                    :key="opt.value + '-' + optIdx"
                    :value="opt.label?.[locale] || opt.value"
                  >
                    {{ opt.label?.[locale] || opt.value }}
                  </option>
                  <option value="__custom__">
                    {{ $t("prompts.customValue") || "Własna wartość..." }}
                  </option>
                </select>
              </template>
            </div>
            <ErrorMessage
              :name="`placeholder_${part.key}`"
              class="text-error text-xs"
            />
          </template>
        </template>
      </div>
      <button class="btn btn-primary w-full" type="submit" :disabled="loading">
        <span
          v-if="loading"
          class="loading loading-spinner loading-xs mr-2"
        ></span>
        {{ $t("prompts.optimizeAi") || "Optymalizacja AI" }}
      </button>
    </Form>

    <!-- Odpowiedź AI -->
    <div
      v-if="aiResponse"
      class="w-full flex flex-col mt-6 bg-base-200 p-4 rounded-xl shadow"
    >
      <b class="mb-2 text-base-content/80">Odpowiedź AI:</b>
      <pre class="whitespace-pre-wrap break-words text-base-content mb-2">{{
        aiResponse
      }}</pre>
      <button class="btn btn-accent btn-sm self-end" @click="copyAiResponse">
        {{ $t("prompts.copyAiResponse") || "Kopiuj odpowiedź" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch, nextTick, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { usePromptsStore } from "../store/index";
import selectorOptions from "../prompts/selector_options.json";
import { askOpenAI } from "../api/openai";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { Form, Field, ErrorMessage } from "vee-validate";

const { locale, t } = useI18n();
const route = useRoute();
const router = useRouter();
const promptType = computed(() => (route.params.type || "").toLowerCase());
const promptsStore = usePromptsStore();
const customValues = ref({});
const promptsByType = computed(
  () => promptsStore.getPromptsByType(promptType.value) || []
);

const selectedPromptId = ref(null);

watch(
  [promptsByType, () => route.query.id],
  ([prompts, id]) => {
    if (!prompts.length) {
      selectedPromptId.value = null;
      return;
    }
    if (id && prompts.some((p) => p.id === Number(id))) {
      selectedPromptId.value = Number(id);
    } else if (prompts.length > 0) {
      if (selectedPromptId.value !== prompts[0].id) {
        selectedPromptId.value = prompts[0].id;
        nextTick(() => {
          router.replace({
            query: { ...route.query, id: prompts[0].id },
          });
        });
      }
    }
  },
  { immediate: true }
);

function onPromptChange() {
  aiResponse.value = ""; // czyść odpowiedź AI
  if (Number(route.query.id) !== Number(selectedPromptId.value)) {
    router.replace({
      query: { ...route.query, id: selectedPromptId.value },
    });
  }
}

const prompt = computed(
  () => promptsByType.value.find((p) => p.id === selectedPromptId.value) || null
);

const template = computed(() => prompt.value?.template?.[locale.value] || "");

const placeholderValues = ref({});
const parsedTemplate = computed(() => {
  const tpl = template.value || "";
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

watch(
  parsedTemplate,
  (parts) => {
    const obj = { ...placeholderValues.value };
    parts.forEach((part) => {
      if (part.type === "placeholder" && !obj[part.key]) {
        const opts = selectorOptions[part.key] || [];
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

function onCustomInput() {
  updateEditor();
}

function resetToSelect(key) {
  customValues.value[key] = "";
  // Ustaw na pierwszą opcję z selecta lub pusty string
  const opts = selectorOptions[key] || [];
  placeholderValues.value[key] =
    opts && opts[0] ? opts[0].label?.[locale.value] || opts[0].value : "";
  updateEditor();
}

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

watch([parsedTemplate, placeholderValues, locale], updateEditor, {
  immediate: true,
});

const openaiKey = ref(localStorage.getItem("openaiKey") || "");
const aiResponse = ref("");
const loading = ref(false);

const aiSource = ref(localStorage.getItem("aiSource") || "openai");
watchEffect(() => {
  aiSource.value = localStorage.getItem("aiSource") || "openai";
});

watch([selectedPromptId, promptType], () => {
  aiResponse.value = "";
});

async function sendToOpenAI() {
  loading.value = true;
  try {
    let filledTemplate = "";
    parsedTemplate.value.forEach((part) => {
      if (part.type === "text") {
        filledTemplate += part.value;
      } else {
        filledTemplate +=
          placeholderValues.value[part.key] === "__custom__"
            ? customValues.value[part.key] || `[${part.key}]`
            : (placeholderValues.value[part.key] ?? `[${part.key}]`);
      }
    });

    const tags = prompt.value?.tags_ids?.join(", ") || "";
    const description =
      prompt.value?.description?.[locale.value] ||
      prompt.value?.description?.en ||
      "";

    const aiInstruction = `
Działasz jako zaawansowany optymalizator promptów AI. Twoim zadaniem jest ulepszenie poniższego promptu, aby był bardziej efektywny, precyzyjny i dostosowany do zamierzonego celu.

Kryteria optymalizacji:

* Precyzja: Upewnij się, że prompt jest jasny i jednoznaczny. Usuń wszelkie niejasności i ogólnikowe sformułowania.
* Kontekst: Dodaj lub zasugeruj dodanie kluczowych informacji kontekstowych, które pomogą AI w generowaniu lepszych odpowiedzi (np. role, format, odbiorcy, cel).
* Zwięzłość: Skróć prompt, usuwając zbędne słowa i sformułowania, ale bez utraty sensu.
* Skuteczność: Zadbaj o to, aby prompt kierował AI do generowania dokładnie takich odpowiedzi, jakich oczekuje użytkownik.

Oryginalny prompt:

${filledTemplate}

Dodatkowe instrukcje i kontekst (opcjonalne):

Udziel odpowiedzi w jezyku ${locale.value}.
${tags}
${description}

Twoja odpowiedź powinna zawierać:

* Nowy, zoptymalizowany prompt: Nowa wersja promptu gotowa do użycia zgodna z powyższymi kryteriami oraz ${filledTemplate}.
`.trim();

    // --- obsługa lokalnego serwera lub OpenAI ---
    let response;
    if (aiSource.value === "local") {
      const localAddress =
        localStorage.getItem("localAddress") || "http://localhost:5000";
      response = await askOpenAI(aiInstruction, null, {
        endpoint: "local",
        localAddress,
      });
    } else {
      response = await askOpenAI(aiInstruction, openaiKey.value, {
        endpoint: "openai",
      });
    }
    aiResponse.value = response;
  } catch (e) {
    aiResponse.value = "Błąd: " + e.message;
    console.error(e);
  }
  loading.value = false;
}

// Kopiowanie odpowiedzi AI
function copyAiResponse() {
  if (!aiResponse.value) return;
  navigator.clipboard.writeText(aiResponse.value);
  toast.success(t("copied"), {
    position: "top-right",
    type: "default",
    autoClose: 2000,
  });
}
</script>
