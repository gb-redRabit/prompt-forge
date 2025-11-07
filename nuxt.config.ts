// Nuxt główna konfiguracja
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Globalny CSS (upewnij się, że plik istnieje)
  css: ["@/assets/css/main.css"],

  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/i18n",
  ],

  // @nuxt/ui
  ui: {
    fonts: false,
  },
  // Color mode configuration
  colorMode: {
    preference: "system", // domyślnie system
    fallback: "light", // fallback gdy nie można wykryć
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },

  // i18n (proste PL/EN)
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "pl",
    langDir: "./locales",
    locales: [
      { code: "pl", iso: "pl-PL", file: "pl.json", name: "Polski" },
      { code: "en", iso: "en-US", file: "en.json", name: "English" },
    ],
    vueI18n: "./i18n/i18n.config.ts",
    detectBrowserLanguage: false, // WAŻNE
  },

  // @nuxt/image
  image: {
    domains: ["images.unsplash.com", "cdn.jsdelivr.net"],
    format: ["webp", "avif", "png", "jpeg"],
    screens: {
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },

  // @nuxt/eslint (flat config – najczęściej bez dodatkowych opcji tutaj)
  eslint: {
    checker: false,
  },

  // Components auto-import configuration
  components: [
    {
      path: "~/components",
      pathPrefix: false, // Wyłącz prefix dla zagnieżdżonych folderów (ui/GlassCard.vue → GlassCard zamiast UiGlassCard)
    },
  ],

  // Vite / eksperymenty
  vite: {
    build: { target: "esnext" },
  },

  nitro: {
    compressPublicAssets: true,
  },
});
