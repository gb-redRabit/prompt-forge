<template>
  <div class="absolute top-3 right-3 flex items-center gap-2">
    <span
      :class="[
        'w-3 h-3 rounded-full inline-block',
        isSet ? (isQuotaOk ? 'bg-green-500' : 'bg-yellow-400') : 'bg-red-500',
      ]"
      :title="statusText"
    ></span>
    <span class="text-sm">
      {{ statusText }}
    </span>
    <button
      class="btn btn-xs btn-outline ml-2"
      @click="editKey"
      :title="isSet ? 'Zmień lub usuń klucz' : 'Dodaj klucz OpenAI'"
    >
      {{ isSet ? "Zmień klucz" : "Dodaj klucz" }}
    </button>
  </div>

  <!-- Modal do wprowadzenia/usunięcia klucza -->
  <dialog v-if="showModal" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">
        {{ isSet ? "Zmień klucz OpenAI" : "Dodaj klucz OpenAI" }}
      </h3>
      <div class="relative">
        <input
          v-model="newKey"
          :type="showKey ? 'text' : 'password'"
          class="input input-bordered w-full mb-4 pr-10"
          placeholder="Wklej swój OpenAI API Key"
          autocomplete="new-password"
        />
        <button
          type="button"
          class="absolute right-2 top-2 text-base-content/60 hover:text-base-content"
          @click="showKey = !showKey"
          tabindex="-1"
        >
          <oh-icon :name="showKey ? 'fa-eye-slash' : 'fa-eye'" scale="1.2" />
        </button>
      </div>
      <div class="flex gap-2 justify-end">
        <button class="btn btn-primary" @click="saveKey" :disabled="!newKey">
          Zapisz
        </button>
        <button class="btn btn-outline" @click="closeModal">Anuluj</button>
        <button v-if="isSet" class="btn btn-error" @click="removeKey">
          Usuń klucz
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";

const openaiKey = ref(localStorage.getItem("openaiKey") || "");
const isSet = ref(!!openaiKey.value);
const isQuotaOk = ref(true);
const statusText = ref("");
const showModal = ref(false);
const newKey = ref(openaiKey.value);
const showKey = ref(false);

async function checkQuota() {
  if (!isSet.value) {
    statusText.value = "Brak klucza OpenAI";
    return;
  }
  // OpenAI nie udostępnia publicznego endpointu do sprawdzania quota przez frontend!
  statusText.value = "Klucz OpenAI ustawiony";
  isQuotaOk.value = true;
}

function editKey() {
  newKey.value = openaiKey.value;
  showModal.value = true;
  showKey.value = false;
}
function closeModal() {
  showModal.value = false;
  showKey.value = false;
}
function saveKey() {
  localStorage.setItem("openaiKey", newKey.value);
  openaiKey.value = newKey.value;
  isSet.value = !!newKey.value;
  showModal.value = false;
  showKey.value = false;
  checkQuota();
}
function removeKey() {
  localStorage.removeItem("openaiKey");
  openaiKey.value = "";
  newKey.value = "";
  isSet.value = false;
  showModal.value = false;
  showKey.value = false;
  checkQuota();
}

onMounted(checkQuota);
</script>
