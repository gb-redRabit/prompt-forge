// filepath: d:\git nowe\prompt-forge\src\store\index.js
import { defineStore } from 'pinia';

export const usePromptStore = defineStore('prompt', {
  state: () => ({
    prompts: [],
    userPreferences: {
      language: 'en',
    },
  }),
  actions: {
    addPrompt(prompt) {
      this.prompts.push(prompt);
    },
    setLanguage(language) {
      this.userPreferences.language = language;
    },
  },
  getters: {
    getPrompts: (state) => state.prompts,
    getLanguage: (state) => state.userPreferences.language,
  },
});