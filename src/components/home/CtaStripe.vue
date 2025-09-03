<template>
  <div
    class="bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 py-10"
  >
    <div class="mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
      <div class="flex-1">
        <h3 class="text-2xl font-bold mb-2">
          {{ $t("home.cta.title") }}
        </h3>
        <p class="opacity-70 text-sm mb-4">
          {{ $t("home.cta.desc") }}
        </p>
        <button class="btn btn-primary btn-sm" @click="$emit('go', 'image')">
          {{ $t("home.cta.button") }}
        </button>
      </div>
      <div class="w-full md:w-72">
        <ul class="text-sm space-y-2 opacity-80">
          <li v-for="b in bullets" :key="b">{{ b }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const bullets = computed(() => [
  t("home.bullets.0"),
  t("home.bullets.1"),
  t("home.bullets.2"),
  t("home.bullets.3"),
]);
</script>
