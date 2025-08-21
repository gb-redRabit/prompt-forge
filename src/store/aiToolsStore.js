import { ref } from "vue";
import aiToolsData from "../data/ai_tools.json";

export const useAiToolsStore = () => {
  const tools = ref(aiToolsData);
  return { tools };
};
