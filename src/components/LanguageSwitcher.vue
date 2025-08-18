<template>
  <label class="swap swap-rotate">
    <input
      type="checkbox"
      class="hidden"
      :checked="currentLanguage === 'pl'"
      @change="toggleLanguage"
    />
    <span class="swap-on flex items-center space-x-1">
      <oh-icon name="md-language" class="text-xl" />
      <span>PL</span>
    </span>
    <span class="swap-off flex items-center space-x-1">
      <oh-icon name="md-language" class="text-xl" />
      <span>EN</span>
    </span>
  </label>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const currentLanguage = ref(locale.value);

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === "pl" ? "en" : "pl";
  locale.value = currentLanguage.value;
};
</script>
