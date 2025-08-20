import { defineStore } from "pinia";
import promptsText from "../prompts/promptsText.json";
import promptsVideo from "../prompts/promptsVideo.json";
import promptsAudio from "../prompts/promptsAudio.json";
import promptsImage from "../prompts/promptsImage.json";

export const usePromptsStore = defineStore("prompts", {
  state: () => ({
    promptsByType: {
      text: promptsText,
      video: promptsVideo,
      audio: promptsAudio,
      image: promptsImage,
    },
  }),
  getters: {
    allPrompts(state) {
      return [
        ...state.promptsByType.text,
        ...state.promptsByType.video,
        ...state.promptsByType.audio,
        ...state.promptsByType.image,
      ];
    },
    getPromptsByType: (state) => (type) => state.promptsByType[type] || [],
    allTags(state) {
      const tags = new Set();
      Object.values(state.promptsByType)
        .flat()
        .forEach((p) => {
          (p.tags_ids || []).forEach((tag) => tags.add(tag));
        });
      return Array.from(tags).sort();
    },
    allPlaceholderKeys(state) {
      const keys = new Set();
      Object.values(state.promptsByType)
        .flat()
        .forEach((p) => {
          (p.placeholder_keys || []).forEach((k) => keys.add(k));
        });
      return Array.from(keys).sort();
    },
  },
});
