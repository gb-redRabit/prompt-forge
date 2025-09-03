<template>
  <div class="card bg-base-100 shadow border border-base-300/50">
    <div class="card-body">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        🧭 {{ $t('about.roadmap.title') }}
      </h2>
      <ul class="timeline timeline-vertical timeline-compact">
        <li v-for="(item, i) in roadmap" :key="i">
          <div :class="['timeline-middle', item.iconColor]">{{ item.icon }}</div>
          <div
            class="timeline-start md:text-end mb-4 max-w-sm"
            :class="i % 2 ? 'md:text-start timeline-end' : ''"
          >
            <div class="font-bold text-sm">
              {{ $t('about.roadmap.items.' + item.key + '.title') }}
            </div>
            <div class="text-xs opacity-70">
              {{ $t('about.roadmap.items.' + item.key + '.desc') }}
            </div>
            <div class="mt-1 text-[10px] uppercase tracking-wide badge badge-outline">
              {{ item.quarter }}
            </div>
          </div>
          <hr />
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
const roadmap = [
  { key: 'weights', icon: '⚖️', quarter: 'Q1', iconColor: 'text-primary' },
  { key: 'emphasis', icon: '🎯', quarter: 'Q1', iconColor: 'text-secondary' },
  { key: 'multiLang', icon: '🌐', quarter: 'Q2', iconColor: 'text-accent' },
  { key: 'exportFormats', icon: '📦', quarter: 'Q2', iconColor: 'text-info' },
  { key: 'plugins', icon: '🧩', quarter: 'Q3', iconColor: 'text-warning' },
  { key: 'community', icon: '🤝', quarter: 'Q4', iconColor: 'text-success' }
];
</script>