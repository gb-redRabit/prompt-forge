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
    "@vite-pwa/nuxt",
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

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Prompt Forge - Generator Promptów AI",
      short_name: "PromptForge",
      description:
        "Zaawansowany generator i biblioteka promptów AI z edytorem tagów, systemem wag i integracją czatu AI",
      lang: "pl",
      theme_color: "#6366f1",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/?standalone=true",
      scope: "/",
      orientation: "any",
      icons: [
        {
          src: "/icon-64x64.png",
          sizes: "64x64",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      // Tylko dla production - dev nie potrzebuje precache
      globPatterns:
        process.env.NODE_ENV === "production"
          ? ["**/*.{js,css,html,png,svg,ico}"]
          : [],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60, // 1 godzina
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dni
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "google-fonts-stylesheets",
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-webfonts",
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 rok
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: "module",
      navigateFallback: "/",
      // Note: Development warnings są normalne - zobacz PWA-DEV-WARNINGS.md
    },
    // Włącz generowanie manifestu w dev mode
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    writePlugin: true,
  },
});
