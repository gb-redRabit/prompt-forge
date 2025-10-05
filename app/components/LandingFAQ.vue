<template>
  <section class="relative">
    <div class="text-center mb-16">
      <h2
        class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {{ $t("app.faq.title") }}
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ $t("app.faq.subtitle") }}
      </p>
    </div>

    <div class="max-w-3xl mx-auto space-y-4">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="glass-card overflow-hidden"
      >
        <button
          @click="toggle(index)"
          class="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span class="font-semibold text-gray-900 dark:text-white pr-4">
            {{ $t(item.question) }}
          </span>
          <UIcon
            name="i-heroicons-chevron-down"
            class="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform flex-shrink-0"
            :class="{ 'rotate-180': openIndex === index }"
          />
        </button>

        <div
          v-show="openIndex === index"
          class="px-6 pb-6 text-gray-600 dark:text-gray-400 animate-fade-in-up"
        >
          {{ $t(item.answer) }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(null);

const faqs = [
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
</style>
