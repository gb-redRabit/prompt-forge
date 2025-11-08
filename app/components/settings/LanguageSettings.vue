<template>
  <div class="space-y-3 sm:space-y-4">
    <div class="grid grid-cols-2 gap-2 sm:gap-3">
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="p-3 sm:p-4 rounded-lg border-2 transition-all hover:scale-105 active:scale-95"
        :class="[
          locale === lang.code
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
        ]"
      >
        <div class="flex flex-col items-center gap-1.5 sm:gap-2">
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl"
            :class="[
              locale === lang.code
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800',
            ]"
          >
            <span>{{ lang.flag }}</span>
          </div>
          <div class="text-center">
            <div
              class="font-semibold text-sm sm:text-base text-gray-900 dark:text-white"
            >
              {{ lang.name }}
            </div>
            <div
              class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400"
            >
              {{ lang.nativeName }}
            </div>
          </div>
          <UIcon
            v-if="locale === lang.code"
            name="i-heroicons-check-circle"
            class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500"
          />
        </div>
      </button>
    </div>

    <div
      class="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
    >
      <p
        class="text-[10px] sm:text-xs text-blue-800 dark:text-blue-200 leading-relaxed"
      >
        <UIcon
          name="i-heroicons-information-circle"
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1"
        />
        <span v-once>{{ $t("settings.language.change_notice") }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n();

const languages = [
  {
    code: "pl",
    name: "Polski",
    nativeName: "Polish",
    flag: "PL",
  },
  {
    code: "en",
    name: "English",
    nativeName: "Angielski",
    flag: "GB",
  },
];

const changeLanguage = (code: string) => {
  setLocale(code as "pl" | "en");
  if (import.meta.client) {
    localStorage.setItem("locale", code);
    useCookie("locale").value = code;
  }
};
</script>
