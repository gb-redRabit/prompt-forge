<template>
  <div class="card bg-base-100 shadow border border-base-300/50">
    <div class="card-body">
      <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
        🤝 {{ $t('about.contribute.title') }}
      </h2>
      <p class="text-sm opacity-80 mb-4">
        {{ $t('about.contribute.desc') }}
      </p>
      <div class="flex flex-wrap gap-2">
        <a
          class="btn btn-sm btn-primary"
          :href="$t('about.contribute.links.repo')"
          target="_blank"
        >
          {{ $t('about.contribute.actions.source') }}
        </a>
        <button class="btn btn-sm btn-outline" @click="openIssue">
          {{ $t('about.contribute.actions.issue') }}
        </button>
        <button class="btn btn-sm btn-outline" @click="copyConfig">
          {{ $t('about.contribute.actions.exportConfig') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
function openIssue() {
  window.open('https://github.com/your/repo/issues/new', '_blank');
}
function copyConfig() {
  const snapshot = {
    sets: localStorage.getItem('pf_sets'),
    favorites: localStorage.getItem('pf_favorites')
  };
  navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
}
</script>