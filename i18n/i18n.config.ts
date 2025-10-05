export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: "pl",
  fallbackLocale: "pl",
  detectBrowserLanguage: false,
  lazy: true,
  langDir: "locales",
  locales: [
    {
      code: "pl",
      file: "pl.json",
    },
    {
      code: "en",
      file: "en.json",
    },
  ],
}));
