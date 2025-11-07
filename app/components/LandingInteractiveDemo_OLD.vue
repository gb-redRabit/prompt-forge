<template>
  <section class="relative py-20">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <div class="relative">
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 backdrop-blur-sm border border-primary-500/20 mb-6"
        >
          <UIcon
            name="i-heroicons-sparkles"
            class="w-5 h-5 text-primary-600 dark:text-primary-400"
          />
          <span
            class="text-sm font-semibold text-primary-600 dark:text-primary-400"
            >Wypróbuj AI na żywo</span
          >
        </div>
        <h2
          class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
        >
          {{ $t("app.demo.title") }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t("app.demo.subtitle") }}
        </p>
      </div>

      <!-- Alert: AI nie skonfigurowane -->
      <div
        v-if="!isConfigured"
        class="mb-8 glass-card p-6 ring-2 ring-yellow-500/50"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/30"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-6 h-6 text-white"
            />
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">
              AI nie jest skonfigurowane
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Aby używać interaktywnego demo, musisz najpierw skonfigurować
              połączenie z lokalnym LM Studio.
            </p>
            <UButton color="warning" variant="soft" size="sm">
              <UIcon name="i-heroicons-cog-6-tooth" class="mr-2" />
              Przejdź do konfiguracji
            </UButton>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div
          class="group glass-card p-6 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <div
                class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
              >
                <UIcon
                  name="i-heroicons-pencil-square"
                  class="w-4 h-4 text-white"
                />
              </div>
              Twój Prompt
            </h3>
            <div class="flex items-center gap-1.5">
              <div
                class="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 animate-pulse"
              ></div>
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400"
                >Na żywo</span
              >
            </div>
          </div>

          <!-- Example Prompts -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="example in examplePrompts"
              :key="example"
              @click="inputText = example"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-primary-500/10 to-purple-500/10 hover:from-primary-500/20 hover:to-purple-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/20 transition-all duration-200 hover:scale-105"
            >
              {{ example.slice(0, 30) }}...
            </button>
          </div>

          <textarea
            v-model="inputText"
            placeholder="Wpisz swój prompt tutaj lub wybierz przykład powyżej..."
            rows="8"
            class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none backdrop-blur-sm transition-all duration-200"
          />
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ inputText.length }} znaków
              </span>
              <div v-if="inputText.length > 0" class="flex items-center gap-1">
                <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span
                  class="text-xs text-green-600 dark:text-green-400 font-medium"
                  >Gotowe</span
                >
              </div>
            </div>
            <UButton
              color="primary"
              size="lg"
              :loading="isProcessing"
              :disabled="!inputText.trim() || !isConfigured"
              @click="processPrompt"
              class="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-200"
            >
              <UIcon
                v-if="!isProcessing"
                name="i-heroicons-sparkles"
                class="mr-2"
              />
              Optymalizuj
            </UButton>
          </div>
        </div>

        <!-- Output Section -->
        <div
          class="group glass-card p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <div
                class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <UIcon
                  name="i-heroicons-light-bulb"
                  class="w-4 h-4 text-white"
                />
              </div>
              Zoptymalizowany Prompt
            </h3>

            <!-- Copy button -->
            <UButton
              v-if="outputText && !isProcessing"
              color="primary"
              variant="soft"
              size="sm"
              @click="copyOutput"
              class="transition-all duration-200"
            >
              <UIcon
                :name="
                  copied
                    ? 'i-heroicons-check'
                    : 'i-heroicons-clipboard-document'
                "
                class="mr-2"
              />
              {{ copied ? "Skopiowano!" : "Kopiuj" }}
            </UButton>
          </div>

          <!-- Empty state -->
          <div
            v-if="!outputText && !isProcessing && !error"
            class="min-h-[300px] flex items-center justify-center"
          >
            <div class="text-center space-y-4">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-full blur-2xl"
                ></div>
                <div
                  class="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-lg"
                >
                  <UIcon
                    name="i-heroicons-arrow-left"
                    class="w-10 h-10 text-gray-400 dark:text-gray-500 animate-pulse"
                  />
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">
                Wprowadź prompt aby zobaczyć magię AI
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-500">
                Wybierz przykład lub wpisz własny tekst
              </p>
            </div>
          </div>

          <!-- Processing state -->
          <div
            v-else-if="isProcessing"
            class="min-h-[300px] flex items-center justify-center"
          >
            <div class="text-center space-y-6">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse"
                ></div>
                <div class="relative flex justify-center gap-2">
                  <div
                    class="w-4 h-4 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full animate-bounce shadow-lg shadow-primary-500/50"
                    style="animation-delay: 0ms"
                  />
                  <div
                    class="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg shadow-purple-500/50"
                    style="animation-delay: 150ms"
                  />
                  <div
                    class="w-4 h-4 bg-gradient-to-br from-pink-500 to-primary-500 rounded-full animate-bounce shadow-lg shadow-pink-500/50"
                    style="animation-delay: 300ms"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  AI analizuje Twój prompt...
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  To może potrwać kilka sekund
                </p>
              </div>
            </div>
          </div>

          <!-- Error state -->
          <div
            v-else-if="error"
            class="p-6 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30"
              >
                <UIcon
                  name="i-heroicons-exclamation-circle"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-red-900 dark:text-red-100 mb-2">
                  Wystąpił błąd
                </h4>
                <p class="text-sm text-red-800 dark:text-red-200 mb-3">
                  {{ error }}
                </p>
                <UButton
                  color="error"
                  variant="soft"
                  size="sm"
                  @click="retryProcess"
                >
                  <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                  Spróbuj ponownie
                </UButton>
              </div>
            </div>
          </div>

          <!-- Success state with typing effect -->
          <div v-else-if="outputText" class="space-y-4">
            <div
              class="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
            >
              <div class="flex items-center gap-2 mb-3">
                <div
                  class="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                >
                  <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
                </div>
                <span
                  class="text-sm font-semibold text-green-900 dark:text-green-100"
                  >Optymalizacja zakończona pomyślnie!</span
                >
              </div>
            </div>

            <div
              class="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 min-h-[200px]"
            >
              <div class="prose dark:prose-invert max-w-none">
                <div
                  class="typing-effect whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed"
                >
                  {{ displayedOutput }}
                  <span
                    class="inline-block w-0.5 h-5 bg-primary-500 animate-pulse ml-0.5"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePromptOptimizer } from "~/composables/usePromptOptimizer";

const { optimizePrompt, isConfigured } = usePromptOptimizer();

const inputText = ref("");
const outputText = ref("");
const displayedOutput = ref("");
const isProcessing = ref(false);
const error = ref("");
const copied = ref(false);

// Example prompts for quick testing
const examplePrompts = [
  "Napisz email sprzedażowy dla nowego produktu SaaS",
  "Stwórz prompt do generowania opisów produktów e-commerce",
  "Pomóż mi napisać post na LinkedIn o AI",
];

const canProcess = computed(() => {
  return (
    inputText.value.trim().length > 0 &&
    !isProcessing.value &&
    isConfigured.value
  );
});

const processPrompt = async () => {
  if (!canProcess.value) return;

  isProcessing.value = true;
  outputText.value = "";
  displayedOutput.value = "";
  error.value = "";

  try {
    // Wywołaj AI do optymalizacji
    const result = await optimizePrompt(inputText.value);
    outputText.value = result;

    // Efekt pisania
    await typeWriter(result);
  } catch (err: any) {
    error.value = err.message || "Wystąpił nieznany błąd";
    console.error("❌ Błąd optymalizacji promptu:", err);
  } finally {
    isProcessing.value = false;
  }
};

const retryProcess = () => {
  error.value = "";
  processPrompt();
};

// Efekt pisania maszynowego
const typeWriter = async (text: string) => {
  displayedOutput.value = "";
  const delay = 15; // ms między znakami

  for (let i = 0; i < text.length; i++) {
    displayedOutput.value += text[i];
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Błąd kopiowania:", err);
  }
};
</script>

<style scoped>
.typing-effect {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  line-height: 1.7;
  font-size: 0.9375rem;
}

/* Smooth animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover {
  animation: fade-in-up 0.3s ease-out;
}
</style>
