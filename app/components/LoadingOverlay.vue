<template>
    <div
      class="fixed inset-0 flex items-center justify-center backdrop-blur-xl transition-all duration-500 z-[9999]"
      :class="[
        shown ? 'opacity-100' : 'opacity-0 pointer-events-none',
        'dark:bg-slate-900 bg-slate-100',
      ]"
    >
      <div class="flex flex-col items-center gap-8 animate-fade-in-up">
        <!-- Logo animation -->
        <div class="relative flex items-center justify-center">
          <div class="relative w-24 h-24 flex items-center justify-center">
            <!-- Pulsing outer rings -->
            <div class="absolute inset-0 border-[3px] border-primary-500/20 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div class="absolute inset-2 border-2 border-purple-500/30 rounded-full animate-[spin_3s_linear_infinite] border-t-purple-400"></div>
            <div class="absolute inset-4 border border-pink-500/40 rounded-full animate-[spin_4s_linear_infinite_reverse] border-b-pink-400"></div>
            
            <!-- Core glowing center -->
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.7)] animate-pulse flex items-center justify-center transform rotate-12">
              <span class="text-white font-black text-xl -rotate-12 tracking-tighter shadow-sm">PF</span>
            </div>
          </div>
        </div>

        <!-- Loading Text -->
        <div class="text-center space-y-3">
          <h2
            class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-pink-400 tracking-wide drop-shadow-sm"
          >
            {{ $t("common.loading") }}
          </h2>
          <p
            class="text-sm text-slate-300/80 font-medium tracking-wide max-w-[250px] mx-auto animate-pulse"
          >
            {{ $t("common.loading_desc") || "Inicjalizacja..." }}
          </p>
        </div>

        <!-- Progress Indicator -->
        <div
          class="w-48 h-1.5 bg-slate-800/80 rounded-full overflow-hidden shadow-inner"
        >
          <div
            class="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"
            style="animation: loader-shimmer 2s ease-in-out infinite"
          ></div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    shown?: boolean;
  }>(),
  {
    shown: true,
  }
);
</script>

<style scoped>
@keyframes loader-shimmer {
  0% { transform: translateX(-100%); width: 40%; }
  50% { transform: translateX(200%); width: 80%; }
  100% { transform: translateX(-100%); width: 40%; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
