<template>
  <div class="card bg-base-100 shadow border border-base-300/50">
    <div class="card-body">
      <SectionHeader icon="🎯" :title="$t('about.mission.title')" />
      <p class="opacity-80 text-sm leading-relaxed mb-6">
        {{ $t('about.mission.body') }}
      </p>
      <div class="grid sm:grid-cols-3 gap-4 text-sm">
        <div
          v-for="kpi in kpis"
          :key="kpi.key"
          class="p-4 rounded-xl bg-base-200/60 border border-base-300/40 flex flex-col"
        >
          <p class="text-2xl font-bold mb-1">{{ kpi.value }}</p>
          <p class="opacity-70 text-[11px] tracking-wide uppercase">
            {{ $t('about.mission.kpis.' + kpi.key) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import SectionHeader from './SectionHeader.vue';
const kpis = [
  { key: 'categories', value: '60+' },
  { key: 'placeholders', value: '120+' },
  { key: 'localization', value: '2' }
];
</script>