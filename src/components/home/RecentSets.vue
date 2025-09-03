<template>
  <div v-if="recentSets.length" class="max-w-5xl mx-auto w-full px-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold">{{ $t("home.recentSets") }}</h2>
      <button class="btn btn-xs btn-outline" @click="$emit('clear-sets')">
        {{ $t("home.clear") }}
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="s in recentSets"
        :key="s.name + '_' + s.time"
        class="badge badge-outline gap-2 px-3 py-3 cursor-pointer hover:badge-primary"
        @click="$emit('open-set', s)"
        :title="new Date(s.time).toLocaleString()"
      >
        <span class="font-semibold text-xs">{{ s.name }}</span>
        <span class="text-[10px] opacity-60">
          {{ $t("home.tags") }}:
          {{
            Object.values(s.payload.selected || {}).reduce(
              (a, b) => a + b.length,
              0
            )
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const recentSets = computed(() => {
  try {
    const raw = JSON.parse(localStorage.getItem("pf_sets") || "[]");
    return raw.slice(-10).reverse();
  } catch {
    return [];
  }
});
</script>