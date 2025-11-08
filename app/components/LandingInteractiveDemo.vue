<template>
  <section class="relative py-0 md:py-8 lg:py-12 xl:py-20">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <div class="relative">
      <!-- Header -->
      <div class="text-center mb-3 md:mb-6 lg:mb-8 xl:mb-12">
        <GlassBadge
          variant="soft"
          size="sm"
          class="text-xs md:text-sm mb-2 md:mb-4 lg:mb-6"
          icon="i-heroicons-sparkles"
          pill
        >
          {{ $t("app.demo.badge") }}
        </GlassBadge>
        <h2
          v-once
          class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 md:mb-3 lg:mb-4"
        >
          {{ $t("app.demo.title") }}
        </h2>
        <p
          v-once
          class="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto hidden md:block"
        >
          {{ $t("app.demo.subtitle") }}
        </p>
      </div>

      <!-- Alert: AI nie skonfigurowane -->
      <GlassCard
        v-if="!isConfigured"
        padding="sm"
        class="mb-3 md:mb-6 lg:mb-8 ring-2 ring-yellow-500/50"
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
            <h4 class="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
              {{ $t("app.demo.warning_title") }}
            </h4>
            <p class="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              {{ $t("app.demo.warning_description") }}
            </p>
            <NuxtLink to="/settings">
              <GlassButton
                color="warning"
                size="sm"
                icon="i-heroicons-cog-6-tooth"
                icon-position="left"
              >
                {{ $t("app.demo.configure_button") }}
              </GlassButton>
            </NuxtLink>
          </div>
        </div>
      </GlassCard>

      <!-- Demo Grid -->
      <div class="grid lg:grid-cols-2 gap-3 md:gap-6 lg:gap-8">
        <!-- Input Section -->
        <DemoInputSection
          v-model="inputText"
          :examples="examplePrompts"
          :processing="isProcessing"
          :can-process="canProcess"
          @process="processPrompt"
        />

        <!-- Output Section -->
        <DemoOutputSection
          :output-text="outputText"
          :show-copy="!!outputText && !isProcessing"
          :copied="copied"
          @copy="copyOutput"
        >
          <DemoStateEmpty v-if="!outputText && !isProcessing && !error" />
          <DemoStateProcessing v-else-if="isProcessing" />
          <DemoStateError
            v-else-if="error"
            :error="error"
            @retry="retryProcess"
          />
          <DemoStateSuccess v-else-if="outputText" :text="outputText" />
        </DemoOutputSection>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePromptOptimizer } from "~/composables/usePromptOptimizer";

const { optimizePrompt, isConfigured } = usePromptOptimizer();

const inputText = ref("");
const outputText = ref("");
const isProcessing = ref(false);
const error = ref("");
const copied = ref(false);

// Example prompts for quick testing (AI Art related)
const examplePrompts = [
  "portrait of a woman, detailed face, blue eyes",
  "fantasy landscape, mountains, sunset, cinematic lighting",
  "cyberpunk city, neon lights, futuristic, highly detailed",
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
  error.value = "";

  try {
    const result = await optimizePrompt(inputText.value);
    outputText.value = result;
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
