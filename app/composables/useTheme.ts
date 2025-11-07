/**
 * Centralny composable do zarządzania motywem aplikacji
 * Używa @nuxt/color-mode i synchronizuje z localStorage
 */
export const useTheme = () => {
  const colorMode = useColorMode();

  // Ikony dla różnych motywów
  const themeIcon = computed(() => {
    const icons = {
      light: "i-heroicons-sun",
      dark: "i-heroicons-moon",
      system: "i-heroicons-computer-desktop",
    };
    return icons[colorMode.preference as keyof typeof icons] || icons.system;
  });

  // Etykiety dla różnych motywów
  const themeLabel = computed(() => {
    const labels = {
      light: "Light",
      dark: "Dark",
      system: "System",
    };
    return labels[colorMode.preference as keyof typeof labels] || labels.system;
  });

  // Lista dostępnych motywów
  const themes = [
    {
      value: "light",
      labelKey: "settings.theme.light",
      descKey: "settings.theme.light_desc",
      icon: "i-heroicons-sun",
    },
    {
      value: "dark",
      labelKey: "settings.theme.dark",
      descKey: "settings.theme.dark_desc",
      icon: "i-heroicons-moon",
    },
    {
      value: "system",
      labelKey: "settings.theme.system",
      descKey: "settings.theme.system_desc",
      icon: "i-heroicons-computer-desktop",
    },
  ];

  // Toggle między light i dark (pomija system)
  const toggleTheme = () => {
    colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
  };

  // Ustaw konkretny motyw
  const setTheme = (theme: "light" | "dark" | "system") => {
    colorMode.preference = theme;
  };

  // Czy aktualnie jest ciemny motyw
  const isDark = computed(() => colorMode.value === "dark");

  return {
    colorMode,
    themeIcon,
    themeLabel,
    themes,
    toggleTheme,
    setTheme,
    isDark,
    currentTheme: computed(() => colorMode.preference),
  };
};
