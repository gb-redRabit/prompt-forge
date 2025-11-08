<template>
  <section class="relative">
    <!-- Header -->
    <div class="text-center mb-8 md:mb-12 lg:mb-16 animate-fade-in-up">
      <h2
        v-once
        class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4"
      >
        {{ $t("app.faq.title") }}
      </h2>
      <p
        v-once
        class="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
      >
        {{ $t("app.faq.subtitle") }}
      </p>
    </div>

    <!-- FAQ Accordion -->
    <div class="max-w-3xl mx-auto space-y-3 md:space-y-4">
      <GlassCard
        v-for="(item, index) in faqs"
        :key="index"
        variant="default"
        padding="none"
        hover
        shadow
        class="overflow-hidden transition-all duration-300"
        :class="[
          openIndex === index ? 'ring-2 ring-primary-500/30' : '',
          `animate-fade-in-up animation-delay-${(index + 1) * 100}`,
        ]"
      >
        <!-- Question Button -->
        <button
          @click="toggle(index)"
          class="w-full p-4 md:p-5 lg:p-6 flex items-center justify-between text-left transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
          :aria-expanded="openIndex === index"
          :aria-controls="`faq-answer-${index}`"
        >
          <!-- Icon -->
          <div class="flex items-center gap-2 md:gap-3 lg:gap-4 flex-1">
            <div
              class="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg transition-all duration-300"
              :class="openIndex === index ? 'scale-110 rotate-6' : ''"
            >
              {{ index + 1 }}
            </div>
            <span
              class="font-semibold text-base md:text-lg text-gray-900 dark:text-white pr-2 md:pr-4"
            >
              {{ $t(item.question) }}
            </span>
          </div>

          <!-- Chevron -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300"
            :class="openIndex === index ? 'bg-primary-500/20' : ''"
          >
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300"
              :class="{ 'rotate-180 text-primary-500': openIndex === index }"
            />
          </div>
        </button>

        <!-- Answer (with smooth height transition) -->
        <Transition
          name="expand"
          @enter="onEnter"
          @after-enter="onAfterEnter"
          @leave="onLeave"
        >
          <div
            v-show="openIndex === index"
            :id="`faq-answer-${index}`"
            class="overflow-hidden"
          >
            <div class="px-6 pb-6 pt-2">
              <div
                class="pl-14 text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {{ $t(item.answer) }}
              </div>
            </div>
          </div>
        </Transition>
      </GlassCard>
    </div>

    <!-- Help CTA -->
    <div class="text-center mt-12 animate-fade-in-up animation-delay-600">
      <p v-once class="text-gray-600 dark:text-gray-400 mb-4">
        {{ $t("app.faq.more_questions") || "Masz więcej pytań?" }}
      </p>
      <GlassButton
        variant="outline"
        size="lg"
        color="primary"
        icon="i-heroicons-chat-bubble-left-right"
        @click="$emit('contact')"
      >
        {{ $t("app.faq.contact_us") || "Skontaktuj się z nami" }}
      </GlassButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FAQItem } from "~/types/landing";

const openIndex = ref<number | null>(null);

const faqs: FAQItem[] = [
  {
    question: "app.faq.q1",
    answer: "app.faq.a1",
  },
  {
    question: "app.faq.q2",
    answer: "app.faq.a2",
  },
  {
    question: "app.faq.q3",
    answer: "app.faq.a3",
  },
  {
    question: "app.faq.q4",
    answer: "app.faq.a4",
  },
  {
    question: "app.faq.q5",
    answer: "app.faq.a5",
  },
];

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

// Smooth height transitions
const onEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "0";
  element.offsetHeight; // Force reflow
  element.style.height = element.scrollHeight + "px";
};

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "auto";
};

const onLeave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = element.scrollHeight + "px";
  element.offsetHeight; // Force reflow
  element.style.height = "0";
};

defineEmits<{
  contact: [];
}>();
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
}
</style>
