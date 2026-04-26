<template>
  <ClientOnly>
    <div v-if="needRefresh" class="pwa-update-toast">
      <UCard
        class="border-primary-500/50 bg-white/90 shadow-2xl backdrop-blur-xl dark:bg-slate-900/90"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="h-6 w-6 animate-spin-slow text-primary-600 dark:text-primary-400"
            />
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-slate-900 dark:text-white">
              {{ $t("pwa.update.title") }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ $t("pwa.update.description") }}
            </p>
          </div>
          <UButton
            color="primary"
            variant="solid"
            icon="i-heroicons-arrow-up-circle"
            @click="handleUpdate"
          >
            {{ $t("pwa.update.button") }}
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="close"
          />
        </div>
      </UCard>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const needRefresh = ref(false);
const updateServiceWorker = ref<any>(null);

onMounted(() => {
  if (process.client) {
    const { $pwa } = useNuxtApp();
    if ($pwa) {
      // @ts-ignore
      watch(() => $pwa.needRefresh, (val) => {
        needRefresh.value = val;
      }, { immediate: true });
      
      // @ts-ignore
      updateServiceWorker.value = $pwa.updateServiceWorker;
    }
  }
});

const close = () => {
  needRefresh.value = false;
};

const handleUpdate = async () => {
  if (updateServiceWorker.value) {
    await updateServiceWorker.value();
  } else {
    window.location.reload();
  }
};
</script>

<style scoped>
.pwa-update-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  max-width: 450px;
  animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
