<template>
  <div class="max-w-6xl mx-auto w-full px-4">
    <h2 class="text-2xl font-bold mb-4">{{ $t("home.featuresTitle") }}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="f in items"
        :key="f.key"
        class="card bg-base-100 shadow hover:shadow-lg transition border border-base-300/40"
      >
        <div class="card-body p-4">
          <div class="text-3xl mb-2">{{ f.icon }}</div>
          <h3 class="font-semibold text-sm tracking-wide uppercase opacity-80">
            {{ $t("home.features." + f.key + ".title") }}
          </h3>
          <p class="text-sm opacity-70">
            {{ $t("home.features." + f.key + ".desc") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
});
</script>