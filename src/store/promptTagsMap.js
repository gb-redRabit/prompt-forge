import { defineStore } from "pinia";
import promptTagsMapRaw from "../data/promptTagsMap.json";

export const usePromptTagsMapStore = defineStore("promptTagsMap", {
  state: () => ({
    data: promptTagsMapRaw,
  }),
  getters: {
    getSection: (state) => (sectionName, locale) => {
      const section = state.data[sectionName];
      return section ? section[locale] || section.en || [] : [];
    },
    allSections: (state) => state.data,
  },
  actions: {
    // Możesz dodać akcje do aktualizacji danych, jeśli potrzebne
    updateSection(sectionName, newData) {
      this.data[sectionName] = newData;
    },
  },
});
