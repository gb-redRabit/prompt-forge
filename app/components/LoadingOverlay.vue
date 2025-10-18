<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-6 animate-fade-in-up">
      <div class="relative flex items-center justify-center">
        <svg
          class="h-16 w-16 text-primary-600 dark:text-primary-400 animate-spin-slow drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 48 48"
        >
          <circle
            class="opacity-20"
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            stroke-width="6"
          />
          <path
            class="opacity-80"
            fill="currentColor"
            d="M24 4a20 20 0 0 1 20 20h-6a14 14 0 0 0-14-14V4z"
          />
        </svg>
        <span
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-primary-500 dark:text-primary-300 tracking-widest uppercase animate-pulse"
          >PF</span
        >
      </div>
      <span
        class="text-xl font-bold text-primary-700 dark:text-primary-200 animate-pulse tracking-wide shadow-sm"
      >
        Ładowanie danych...
      </span>
      <span
        class="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-200"
        >Proszę chwilę zaczekać, przygotowujemy Twój edytor promptów.</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ shown?: boolean }>();
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}
@keyframes spin-slow {
  100% {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 2.2s linear infinite;
}
.animate-pulse {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
