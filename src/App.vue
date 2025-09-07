<template>
  <div class="flex flex-row min-h-screen" data-theme="synthwave">
    <Toaster
      rich-colors
      position="top-right"
      :duration="1000"
      :toastOptions="{
        style: { background: toastBg, color: toastText, border: 'none' },
      }"
      :teleport="false"
    />
    <AppNavbar />
    <OpenAIStatus />
    <main
      class="flex-1 flex flex-col justify-start items-center transition-all p-4 duration-300 lg:ml-20"
    >
      <AppBreadcrumbs class="w-full container" />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AppNavbar from "./components/layout/AppNavbar.vue";
import AppBreadcrumbs from "./components/layout/AppBreadcrumbs.vue";
import OpenAIStatus from "./components/layout/OpenAIStatus.vue";
import { logThemeVar, logThemeVars } from "./utils/inspectTheme.js";
import "vue-sonner/style.css";
import { Toaster } from "vue-sonner";
import { checkMissingTranslations } from "./i18n/index.js";

checkMissingTranslations();

const toastBg = ref("");
const toastText = ref("");
onMounted(() => {
  // logThemeVars(); // wypisze wszystkie zdefiniowane zmienne tematu
  // pobierz wartość i zapisz w ref
  const val = logThemeVar("--color-base-300") || ""; // logThemeVar zwraca wartość lub null
  const val2 = logThemeVar("--color-primary") || ""; // logThemeVar zwraca wartość lub null
  toastBg.value = val;
  toastText.value = val2;
});
</script>

<style>
.my-toast,
.sonner-toast.my-toast,
[data-theme] .my-toast {
  background-color: var(--color-base-100) !important;
  color: var(--color-base-content) !important;
  border: 1px solid var(--color-base-300) !important;
  border-radius: var(--radius-box, 0.5rem);
}
</style>
