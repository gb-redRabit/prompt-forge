import { defineStore } from "pinia";
import selectorOptions from "../prompts/selector_options.json";

export const useSelectorOptionsStore = defineStore("selectorOptions", {
  state: () => ({
    options: selectorOptions,
  }),
  getters: {
    /**
     * Zwraca opcje dla danego klucza (np. "emotion", "color").
     * Obsługuje fallback na liczbę mnogą i zamianę snake_case <-> camelCase.
     */
    getByKey: (state) => (key) => {
      if (!key) return [];
      // Najpierw dokładny klucz
      if (state.options[key]) return state.options[key];
      // Fallback: liczba mnoga
      if (state.options[key + "s"]) return state.options[key + "s"];
      // Fallback: camelCase <-> snake_case
      const snake = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
      if (state.options[snake]) return state.options[snake];
      const camel = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      if (state.options[camel]) return state.options[camel];
      // Brak opcji
      return [];
    },
    /**
     * Zwraca wszystkie klucze dostępnych opcji.
     */
    allKeys: (state) => Object.keys(state.options),
    /**
     * Zwraca wszystkie opcje jako obiekt.
     */
    allOptions: (state) => state.options,
  },
});
