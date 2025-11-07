/**
 * Composable do zarządzania hierarchią z-index w aplikacji
 * Zapewnia spójne warstwy dla różnych elementów UI
 */

export const Z_INDEX = {
  // Tło i efekty wizualne
  BACKGROUND: 0,
  BACKGROUND_EFFECTS: 5,
  BACKGROUND_GRADIENT: 10,

  // Zawartość główna
  CONTENT: 20,
  CONTENT_OVERLAY: 30,
  CONTENT_STICKY: 40,

  // Nawigacja i sidebary
  SIDEBAR: 50,
  NAVIGATION: 50,
  HEADER: 50,

  // Dropdown i popovers
  DROPDOWN: 60,
  POPOVER: 65,

  // Modals i dialogi
  MODAL_BACKDROP: 70,
  MODAL: 75,
  MODAL_CONTENT: 80,

  // Loading i critical overlays
  LOADING: 90,
  TOAST: 95,
  TOOLTIP: 100,
} as const;

export const useZIndex = () => {
  /**
   * Pobiera z-index dla danego poziomu
   */
  const getZIndex = (level: keyof typeof Z_INDEX): number => {
    return Z_INDEX[level];
  };

  /**
   * Generuje style z odpowiednim z-index
   */
  const zIndexStyle = (level: keyof typeof Z_INDEX) => {
    return {
      zIndex: Z_INDEX[level],
    };
  };

  /**
   * Generuje klasę Tailwind z odpowiednim z-index
   * Uwaga: Tailwind domyślnie ma ograniczone wartości z-index
   * Używaj style object zamiast klas gdy potrzebujesz niestandardowych wartości
   */
  const zIndexClass = (level: keyof typeof Z_INDEX): string => {
    const value = Z_INDEX[level];
    if (value >= 100) return "z-[100]";
    if (value >= 90) return "z-[90]";
    if (value >= 80) return "z-[80]";
    if (value >= 70) return "z-[70]";
    if (value >= 60) return "z-[60]";
    if (value >= 50) return "z-50";
    if (value >= 40) return "z-40";
    if (value >= 30) return "z-30";
    if (value >= 20) return "z-20";
    if (value >= 10) return "z-10";
    return "z-0";
  };

  return {
    Z_INDEX,
    getZIndex,
    zIndexStyle,
    zIndexClass,
  };
};
