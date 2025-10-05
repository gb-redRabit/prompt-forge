<template>
  <section class="relative">
    <div class="text-center mb-16">
      <h2
        class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
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
      class="mb-8 p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
    >
      <div class="flex items-start gap-3">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
        />
        <div class="flex-1">
          <h3 class="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
            AI nie jest skonfigurowane
          </h3>
          <p class="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
            Aby używać interaktywnego demo, musisz najpierw skonfigurować
            połączenie z lokalnym LM Studio.
          </p>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Input Section -->
      <div class="glass-card p-6 space-y-4">
        <div>
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
          >
            {{ $t("app.demo.input_label") }}
          </label>
          <textarea
            v-model="inputText"
            rows="8"
            :disabled="isProcessing || !isConfigured"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :placeholder="
              isConfigured
                ? $t('app.demo.input_placeholder')
                : 'Skonfiguruj AI aby rozpocząć...'
            "
          />
        </div>

        <!-- Process button -->
        <UButton
          color="primary"
          block
          size="lg"
          :loading="isProcessing"
          :disabled="!canProcess"
          @click="processPrompt"
        >
          <UIcon
            :name="
              isProcessing ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'
            "
            class="mr-2"
            :class="{ 'animate-spin': isProcessing }"
          />
          {{ isProcessing ? "Optymalizuję..." : $t("app.demo.process_button") }}
        </UButton>

        <!-- Character count -->
        <div
          v-if="inputText.length > 0"
          class="text-xs text-gray-500 dark:text-gray-400 text-right"
        >
          {{ inputText.length }} znaków
        </div>
      </div>

      <!-- Output Section -->
      <div class="glass-card p-6">
        <div class="mb-4 flex items-center justify-between">
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 block"
          >
            {{ $t("app.demo.output_label") }}
          </label>

          <!-- Copy button -->
          <UButton
            v-if="outputText && !isProcessing"
            color="primary"
            variant="ghost"
            size="xs"
            @click="copyOutput"
          >
            <UIcon
              :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
              class="mr-1"
            />
            {{ copied ? "Skopiowano!" : "Kopiuj" }}
          </UButton>
        </div>

        <!-- Empty state -->
        <div
          v-if="!outputText && !isProcessing && !error"
          class="h-full min-h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-600"
        >
          <div class="text-center space-y-3">
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-12 h-12 mx-auto animate-pulse"
            />
            <p>{{ $t("app.demo.waiting") }}</p>
          </div>
        </div>

        <!-- Processing state -->
        <div
          v-else-if="isProcessing"
          class="h-full min-h-[300px] flex items-center justify-center"
        >
          <div class="text-center space-y-4">
            <div class="flex justify-center gap-2">
              <div
                class="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
                style="animation-delay: 0ms"
              />
              <div
                class="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
                style="animation-delay: 150ms"
              />
              <div
                class="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
                style="animation-delay: 300ms"
              />
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              AI analizuje Twój prompt...
            </p>
          </div>
        </div>

        <!-- Error state -->
        <div
          v-else-if="error"
          class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <div class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-exclamation-circle"
              class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            />
            <div class="flex-1">
              <h4 class="font-semibold text-red-900 dark:text-red-100 mb-1">
                Wystąpił błąd
              </h4>
              <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
              <UButton
                color="error"
                variant="soft"
                size="xs"
                class="mt-3"
                @click="retryProcess"
              >
                <UIcon name="i-heroicons-arrow-path" class="mr-1" />
                Spróbuj ponownie
              </UButton>
            </div>
          </div>
        </div>

        <!-- Success state with typing effect -->
        <div v-else-if="outputText" class="prose dark:prose-invert max-w-none">
          <div class="typing-effect whitespace-pre-wrap">
            {{ displayedOutput }}
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

const examples = ["marketing", "code", "email"];

const canProcess = computed(() => {
  return (
    inputText.value.trim().length > 0 &&
    !isProcessing.value &&
    isConfigured.value
  );
});

const loadExample = (example: string) => {
  const { t } = useI18n();
  inputText.value = t(`app.demo.example_${example}`);
};

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
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
}

.dark .glass-card {
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.typing-effect {
  font-family: "Courier New", monospace;
  line-height: 1.6;
}
</style>
