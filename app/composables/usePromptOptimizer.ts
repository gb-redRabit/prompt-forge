import { useAI } from "./useAI";

export const usePromptOptimizer = () => {
  const { generate, isConfigured } = useAI();

  const optimizePrompt = async (userPrompt: string) => {
    if (!isConfigured.value) {
      throw new Error(
        "AI nie jest skonfigurowane. Proszę skonfigurować połączenie w ustawieniach."
      );
    }

    const systemPrompt = `Jesteś ekspertem od optymalizacji promptów AI. Twoim zadaniem jest analiza i ulepszanie promptów, aby były bardziej efektywne, jasne i dawały lepsze rezultaty.

Dla każdego promptu:
1. Zidentyfikuj główny cel
2. Oceń jasność i specyficzność
3. Zaproponuj ulepszoną wersję
4. Dodaj sugestie kontekstu i formatowania

Format odpowiedzi:
✨ **Zoptymalizowany Prompt:**
[ulepszona wersja promptu]

📊 **Analiza:**
- Cel: [co użytkownik chce osiągnąć]
- Problemy: [co można poprawić]

💡 **Sugestie:**
- [konkretna sugestia 1]
- [konkretna sugestia 2]
- [konkretna sugestia 3]`;

    try {
      const result = await generate(userPrompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 2000,
      });

      return result.content;
    } catch (error: any) {
      throw new Error(`Błąd optymalizacji: ${error.message}`);
    }
  };

  return {
    optimizePrompt,
    isConfigured,
  };
};
