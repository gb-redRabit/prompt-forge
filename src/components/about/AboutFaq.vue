<template>
  <div class="card bg-base-100 shadow border border-base-300/50">
    <div class="card-body">
      <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
        ❓ {{ $t('about.faq.title') }}
      </h2>
      <div class="join join-vertical w-full">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="collapse collapse-arrow border border-base-300/50 bg-base-200/40"
        >
          <input type="checkbox" />
            <div class="collapse-title text-sm font-medium">
              {{ $t('about.faq.items.' + item + '.q') }}
            </div>
            <div class="collapse-content text-xs opacity-80 leading-relaxed">
              {{ $t('about.faq.items.' + item + '.a') }}
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const items = ['what', 'local', 'weights', 'emphasis', 'export'];
</script>