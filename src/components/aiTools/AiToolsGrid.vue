<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
  >
    <div
      v-for="tool in tools"
      :key="tool.name"
      class="card bg-base-200 shadow-xl border border-base-300 hover:scale-[1.025] transition cursor-pointer"
    >
      <a
        :href="tool.url"
        target="_blank"
        rel="noopener"
        class="block h-full w-full"
        style="text-decoration: none; color: inherit"
      >
        <figure class="px-6 pt-6">
          <img
            :src="tool.logo"
            :alt="tool.name + ' logo'"
            class="rounded-xl h-16 w-16 object-contain mx-auto"
            loading="lazy"
          />
        </figure>
        <div class="card-body items-center text-center">
          <h2 class="card-title text-primary mb-2">{{ tool.name }}</h2>
          <div class="flex flex-wrap justify-center gap-2 mb-2">
            <span
              v-for="cat in tool.category"
              :key="cat"
              class="badge badge-outline badge-info px-3 py-1 text-xs font-semibold"
            >
              {{ cat }}
            </span>
          </div>
          <p class="text-base-content/80 text-sm mb-4">
            {{ tool.description[locale] || tool.description.en }}
          </p>
          <div class="flex flex-wrap justify-center gap-2 mb-4">
            <span
              v-for="tag in tool.tags"
              :key="tag"
              class="badge px-3 py-1 text-xs font-semibold"
              :class="tagClass(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
<script setup>
defineProps({
  tools: Array,
  locale: String,
  tagClass: Function,
});
</script>
