<template>
  <div class="absolute top-3 right-3">
    <button
      class="flex items-center gap-2 px-3 py-1 rounded-lg bg-base-200 hover:bg-base-300 border border-base-300 shadow transition"
      @click="showModal = true"
      :title="statusText"
    >
      <span
        :class="[
          'w-2.5 h-2.5 rounded-full inline-block',
          isConnected === true
            ? 'bg-green-500'
            : isConnected === false
              ? 'bg-red-500'
              : 'bg-yellow-400',
        ]"
      ></span>
      <span class="text-xs font-semibold tracking-wide">
        <span v-if="isConnected === true">{{
          $t("openaiStatus.connected")
        }}</span>
        <span v-else-if="isConnected === false">{{
          $t("openaiStatus.notConnected")
        }}</span>
        <span v-else>{{ $t("openaiStatus.checking") }}</span>
      </span>
    </button>
  </div>

  <!-- Modal konfiguracji AI -->
  <dialog v-if="showModal" class="modal modal-open">
    <div class="modal-box max-w-xs">
      <h3 class="font-bold text-base mb-4">
        {{ $t("openaiStatus.connectionTitle") }}
      </h3>
      <div class="mb-3">
        <label class="block mb-1 text-sm font-medium">{{
          $t("openaiStatus.source")
        }}</label>
        <select
          v-model="aiSource"
          class="select select-bordered w-full text-sm"
        >
          <option value="openai">{{ $t("openaiStatus.openaiCloud") }}</option>
          <option value="local">{{ $t("openaiStatus.localServer") }}</option>
        </select>
      </div>
      <div v-if="aiSource === 'openai'" class="mb-3">
        <label class="block mb-1 text-sm">{{
          $t("openaiStatus.apiKey")
        }}</label>
        <div class="relative">
          <input
            v-model="openaiKey"
            :type="showKey ? 'text' : 'password'"
            class="input input-bordered w-full pr-10 text-sm"
            :placeholder="$t('openaiStatus.apiKeyPlaceholder')"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
            @click="showKey = !showKey"
            tabindex="-1"
          >
            <oh-icon :name="showKey ? 'fa-eye-slash' : 'fa-eye'" scale="1.1" />
          </button>
        </div>
      </div>
      <div v-else class="mb-3">
        <label class="block mb-1 text-sm">{{
          $t("openaiStatus.localAddress")
        }}</label>
        <input
          v-model="localAddress"
          type="text"
          class="input input-bordered w-full text-sm"
          :placeholder="$t('openaiStatus.localAddressPlaceholder')"
        />
      </div>
      <div class="flex gap-2 justify-end mt-4">
        <button
          class="btn btn-primary btn-sm"
          @click="saveConfig"
          :disabled="checking"
        >
          {{ $t("openaiStatus.save") }}
        </button>
        <button
          class="btn btn-ghost btn-sm"
          @click="closeModal"
          :disabled="checking"
        >
          {{ $t("openaiStatus.cancel") }}
        </button>
      </div>
      <div
        v-if="checking"
        class="text-xs text-gray-500 mt-2 flex items-center gap-1"
      >
        <span class="loading loading-spinner loading-xs"></span>
        {{ $t("openaiStatus.checkingConnection") }}
      </div>
      <div v-if="checkError" class="text-xs text-error mt-2">
        {{ checkError }}
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal" aria-label="Zamknij"></button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { askOpenAI } from "../../api/openai";

const { t } = useI18n();

const showModal = ref(false);
const aiSource = ref(localStorage.getItem("aiSource") || "openai");
const openaiKey = ref(localStorage.getItem("openaiKey") || "");
const localAddress = ref(
  localStorage.getItem("localAddress") || "http://localhost:5000"
);
const showKey = ref(false);

const isConnected = ref(null); // true/false/null
const statusText = ref("");
const checking = ref(false);
const checkError = ref("");

async function checkConnection() {
  checking.value = true;
  checkError.value = "";
  isConnected.value = null;
  statusText.value = t("openaiStatus.checking");

  try {
    if (aiSource.value === "openai") {
      if (!openaiKey.value) {
        isConnected.value = false;
        statusText.value = t("openaiStatus.noApiKey");
        checking.value = false;
        return;
      }
      await askOpenAI("ping", openaiKey.value, { endpoint: "openai" });
      isConnected.value = true;
      statusText.value = t("openaiStatus.connectedOpenAI");
    } else {
      if (!localAddress.value) {
        isConnected.value = false;
        statusText.value = t("openaiStatus.noLocalAddress");
        checking.value = false;
        return;
      }
      await askOpenAI("ping", null, {
        endpoint: "local",
        localAddress: localAddress.value,
      });
      isConnected.value = true;
      statusText.value = t("openaiStatus.connectedLocal");
    }
  } catch (err) {
    isConnected.value = false;
    statusText.value = t("openaiStatus.notConnected");
    checkError.value = err?.message || t("openaiStatus.connectionError");
  } finally {
    checking.value = false;
  }
}

function saveConfig() {
  localStorage.setItem("aiSource", aiSource.value);
  if (aiSource.value === "openai") {
    localStorage.setItem("openaiKey", openaiKey.value);
  } else {
    localStorage.setItem("localAddress", localAddress.value);
  }
  checkConnection();
  showModal.value = false;
}

function closeModal() {
  showModal.value = false;
}

watch([aiSource, openaiKey, localAddress], () => {
  checkConnection();
});

onMounted(() => {
  checkConnection();
});
</script>
