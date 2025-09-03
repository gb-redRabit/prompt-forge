<template>
  <div class="card bg-base-100 shadow border border-base-300/50">
    <div class="card-body">
      <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
        📬 {{ $t("about.contact.title") }}
      </h2>
      <p class="text-sm opacity-80 mb-4">
        {{ $t("about.contact.info", { email: "bejtan.grzegorz@gmail.com" }) }}
      </p>
      <form class="grid gap-3 w-full" @submit.prevent="submit">
        <input
          v-model="form.email"
          type="email"
          required
          class="input input-bordered input-sm w-full"
          :placeholder="$t('about.contact.form.email')"
        />
        <textarea
          v-model="form.message"
          rows="4"
          required
          class="textarea textarea-bordered textarea-lg w-full"
          :placeholder="$t('about.contact.form.message')"
        ></textarea>
        <button class="btn btn-primary btn-sm w-fit">
          {{ $t("about.contact.form.send") }}
        </button>
        <p v-if="sent" class="text-success text-xs">
          {{ $t("about.contact.sent") }}
        </p>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const form = ref({ email: "", message: "" });
const sent = ref(false);
function submit() {
  sent.value = true;
  setTimeout(() => (sent.value = false), 4000);
  form.value = { email: "", message: "" };
}
</script>
