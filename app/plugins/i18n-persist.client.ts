export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  const restoreLocale = () => {
    const savedLocal = localStorage.getItem("locale");
    const savedCookie = useCookie("locale").value;
    const saved = savedLocal || savedCookie;

    if (!saved) return;

    try {
      const i18n = nuxtApp.$i18n;
      if (i18n.locale.value !== saved) {
        i18n.setLocale(saved);
      }
    } catch (e) {
      // silent fail
    }
  };

  nuxtApp.hook("app:created", restoreLocale);
  nuxtApp.hook("page:transition:finish", restoreLocale);
});
