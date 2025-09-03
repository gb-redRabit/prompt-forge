<template>
  <div
    class="container max-w-4xl flex flex-col items-center justify-start py-8"
  >
    <h1 class="text-3xl font-bold mb-4 text-center text-primary">
      {{ $t("prompts.create") }}:
      <span class="capitalize">{{ promptType }}</span>
    </h1>

    <!-- Wybór promptu -->
    <Form @submit="() => {}" class="mb-8 w-full flex flex-col gap-2">
      <label class="font-semibold mb-1">{{ $t("prompts.choosePrompt") }}</label>
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

    <!-- NOWY: Pasek akcji -->
    <div
      v-if="prompt"
      class="w-full flex flex-wrap gap-2 mb-6 items-center justify-between bg-base-200/60 border border-base-300/40 rounded-xl p-3"
    >
      <div class="flex flex-wrap gap-2">
        <button
          class="btn btn-xs"
          @click="copyTemplateRaw"
          :disabled="!template"
          :title="$t('prompts.copyTemplate')"
        >
          {{ $t('prompts.copyTemplate') }}
        </button>
        <button
          class="btn btn-xs btn-outline"
          @click="copyFilledTemplate"
          :disabled="!filledCurrentTemplate"
        >
          {{ $t('prompts.copyFilled') }}
        </button>
        <button
          class="btn btn-xs btn-warning"
          @click="resetPlaceholders"
          :disabled="!parsedTemplate.length"
        >
          {{ $t('prompts.resetPlaceholders') }}
        </button>
        <button
          class="btn btn-xs btn-accent"
          @click="randomizePlaceholders"
          :disabled="!parsedTemplate.length"
        >
          {{ $t('prompts.randomize') }}
        </button>
        <button
          class="btn btn-xs btn-info"
          @click="toggleRaw"
        >
          {{ showRaw ? $t('prompts.hideRawTemplate') : $t('prompts.showRawTemplate') }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="btn btn-xs btn-outline"
          @click="shareLink"
          :disabled="!prompt"
        >
          {{ $t('prompts.shareLink') }}
        </button>
      </div>
    </div>
    <!-- /NOWY -->

    <!-- Szczegóły promptu -->
    <div
      v-if="prompt"
      class="mb-8 w-full bg-base-200 rounded-xl p-6 shadow flex flex-col gap-2"
    >
      <h2 class="text-xl font-semibold mb-1 text-primary">
        {{ prompt.name?.[locale] || prompt.name?.en }}
      </h2>
      <p class="mb-2 text-base-content/80">
        {{ prompt.description?.[locale] || prompt.description?.en }}
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in prompt.tags || prompt.tags_ids"
          :key="tag"
          class="badge badge-outline"
        >
          {{ tag }}
        </span>
        <span
          v-for="cat in prompt.categories || []"
          :key="cat"
          class="badge badge-info"
        >
          {{ cat }}
        </span>
      </div>
    </div>

    <!-- Podgląd szablonu -->
    <Form
      @submit="sendToOpenAI"
      class="w-full mt-2"
      v-if="parsedTemplate.length"
    >
      <h2 class="text-lg font-semibold mb-2">
        {{ $t("prompts.templatePreview") }}
      </h2>

      <!-- NOWY: Filtr placeholderów + tabela -->
      <div
        v-if="placeholderEntries.length"
        class="mb-4 p-3 rounded-lg bg-base-200/50 border border-base-300/40 space-y-3"
      >
        <div class="flex flex-wrap gap-3 items-end">
          <label class="form-control w-56">
            <span class="label-text text-xs font-semibold mb-1">
              {{ $t('prompts.placeholderFilter') }}
            </span>
            <input
              v-model="placeholderFilter"
              type="text"
              class="input input-sm input-bordered"
              :placeholder="$t('prompts.searchPlaceholder')"
            />
          </label>
          <div class="text-[11px] opacity-60">
            {{ filteredPlaceholderKeys.length }} /
            {{ placeholderEntries.length }}
            {{ $t('prompts.placeholders') }}
          </div>
        </div>

        <div
          class="overflow-x-auto max-h-52 rounded border border-base-300/40"
          v-if="filteredPlaceholderKeys.length"
        >
          <table class="table table-xs">
            <thead>
              <tr>
                <th class="w-40">{{ $t('prompts.placeholderKey') }}</th>
                <th>{{ $t('prompts.value') }}</th>
                <th class="w-24 text-right">
                  {{ $t('prompts.actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="key in filteredPlaceholderKeys"
                :key="key"
                class="align-top"
              >
                <td class="font-mono text-[11px]">{{ key }}</td>
                <td>
                  <div v-if="placeholderValues[key] === '__custom__'" class="flex items-center gap-2">
                    <input
                      v-model="customValues[key]"
                      type="text"
                      class="input input-xs input-bordered w-full"
                      @input="onCustomInput(key)"
                      :placeholder="$t('prompts.enterCustomValue')"
                    />
                    <button
                      type="button"
                      class="btn btn-ghost btn-xs"
                      @click="resetToSelect(key)"
                      title="Reset"
                    >
                      ✕
                    </button>
                  </div>
                  <div v-else>
                    <select
                      class="select select-xs w-full"
                      v-model="placeholderValues[key]"
                      @change="updateEditor"
                    >
                      <option
                        v-for="(opt, oi) in selectorOptions[key] || []"
                        :key="opt.value + '-' + oi"
                        :value="opt.label?.[locale] || opt.value"
                      >
                        {{ opt.label?.[locale] || opt.value }}
                      </option>
                      <option value="__custom__">
                        {{ $t('prompts.customValue') }}
                      </option>
                    </select>
                  </div>
                </td>
                <td class="text-right">
                  <button
                    class="btn btn-ghost btn-xs"
                    @click="copySinglePlaceholder(key)"
                    :title="$t('prompts.copy')"
                  >
                    ⧉
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else
          class="text-xs opacity-60 italic"
        >
          {{ $t('prompts.noPlaceholders') }}
        </div>
      </div>
      <!-- /NOWY -->

      <!-- RAW TEMPLATE -->
      <pre
        v-if="showRaw"
        class="mb-4 p-3 rounded bg-base-300/40 text-[11px] overflow-x-auto"
      >{{ template }}</pre>
      <!-- /RAW TEMPLATE -->

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
    <transition name="fade">
      <div
        v-if="aiResponse"
        class="w-full flex flex-col mt-8 bg-base-200 p-4 rounded-xl shadow"
      >
        <b class="mb-2 text-base-content/80">{{
          $t("prompts.aiResponse") || "Odpowiedź AI:"
        }}</b>
        <pre class="whitespace-pre-wrap break-words text-base-content mb-2">{{
          aiResponse
        }}</pre>
        <button class="btn btn-accent btn-sm self-end" @click="copyAiResponse">
          {{ $t("prompts.copyAiResponse") || "Kopiuj odpowiedź" }}
        </button>
      </div>
    </transition>
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

// NOWE: stany pomocnicze
const showRaw = ref(false);
function toggleRaw() {
  showRaw.value = !showRaw.value;
}

const placeholderFilter = ref("");

// Lista placeholderów (unikalne klucze)
const placeholderEntries = computed(() =>
  Array.from(
    new Set(
      parsedTemplate.value
        .filter((p) => p.type === "placeholder")
        .map((p) => p.key)
    )
  )
);

// Filtrowanie
const filteredPlaceholderKeys = computed(() => {
  if (!placeholderFilter.value.trim()) return placeholderEntries.value;
  const q = placeholderFilter.value.toLowerCase();
  return placeholderEntries.value.filter((k) => k.toLowerCase().includes(q));
});

// Kopiowanie surowego szablonu
function copyTemplateRaw() {
  if (!template.value) return;
  navigator.clipboard.writeText(template.value);
  toast.success(t("prompts.copiedTemplate"), { autoClose: 1500 });
}

// Aktualny wypełniony (tekstowy) template
const filledCurrentTemplate = computed(() => {
  let s = "";
  parsedTemplate.value.forEach((part) => {
    if (part.type === "text") s += part.value;
    else {
      const raw = placeholderValues.value[part.key];
      s +=
        raw === "__custom__"
          ? customValues.value[part.key] || `[${part.key}]`
          : raw;
    }
  });
  return s.trim();
});

function copyFilledTemplate() {
  if (!filledCurrentTemplate.value) return;
  navigator.clipboard.writeText(filledCurrentTemplate.value);
  toast.success(t("copied"), { autoClose: 1500 });
}

// Reset placeholderów
function resetPlaceholders() {
  const obj = {};
  parsedTemplate.value.forEach((p) => {
    if (p.type === "placeholder") {
      const opts = selectorOptions[p.key] || [];
      obj[p.key] =
        opts && opts[0]
          ? opts[0].label?.[locale.value] || opts[0].value
          : `[${p.key}]`;
    }
  });
  placeholderValues.value = obj;
  customValues.value = {};
  updateEditor();
}

// Losowanie placeholderów
function randomizePlaceholders() {
  const obj = { ...placeholderValues.value };
  parsedTemplate.value.forEach((p) => {
    if (p.type !== "placeholder") return;
    const opts = selectorOptions[p.key] || [];
    if (opts.length > 1) {
      const rand = opts[Math.floor(Math.random() * opts.length)];
      obj[p.key] = rand.label?.[locale.value] || rand.value;
    }
  });
  placeholderValues.value = obj;
  updateEditor();
}

// Udostępnianie linku
function shareLink() {
  if (!prompt.value) return;
  const url = new URL(window.location.href);
  url.searchParams.set("id", prompt.value.id);
  navigator.clipboard.writeText(url.toString());
  toast.success(t("prompts.linkCopied"), { autoClose: 1500 });
}

// Kopiowanie pojedynczego placeholdera
function copySinglePlaceholder(key) {
  const v =
    placeholderValues.value[key] === "__custom__"
      ? customValues.value[key] || ""
      : placeholderValues.value[key];
  if (!v) return;
  navigator.clipboard.writeText(v);
  toast.success(t("copied"), { autoClose: 1200 });
}
</script>
