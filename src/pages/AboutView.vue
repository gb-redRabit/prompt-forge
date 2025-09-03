<template>
  <div class="relative">
    <!-- Pasek postępu scrolla -->
    <div class="fixed top-0 left-0 h-1 z-40 w-full bg-base-300/40">
      <div
        class="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-[width] duration-150"
        :style="{ width: scrollProgress + '%' }"
      ></div>
    </div>

    <div class="w-full max-w-7xl mx-auto py-12 px-4 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Nawigacja -->
        <aside class="lg:w-64 flex-shrink-0">
          <nav
            class="sticky top-20 bg-base-100/70 backdrop-blur rounded-2xl border border-base-300/60 p-5 flex flex-col gap-2 shadow-sm"
          >
            <h3 class="text-[11px] font-bold uppercase opacity-60 tracking-wide mb-1">
              {{ $t('about.nav.title') }}
            </h3>
            <button
              v-for="item in navItems"
              :key="item.id"
              @click="scrollTo(item.id)"
              class="group relative text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition"
              :class="activeSection === item.id ? 'bg-primary text-primary-content shadow-sm' : 'hover:bg-base-200'"
            >
              <span class="text-base opacity-80">{{ item.icon }}</span>
              <span>{{ $t(item.label) }}</span>
              <span
                v-if="activeSection === item.id"
                class="absolute -right-2 top-1/2 -translate-y-1/2 h-6 w-1 rounded bg-primary"
              ></span>
            </button>
            <div class="mt-4 pt-3 border-t border-base-300/50 text-[10px] opacity-60 leading-relaxed">
              {{ categoriesCompleted }} / {{ navItems.length }} {{ $t('about.nav.sectionsDone') }}
            </div>
          </nav>
        </aside>

        <!-- Treść -->
        <div class="flex-1 space-y-16">
          <section id="mission" class="about-section">
            <AboutMission />
          </section>

            <section id="features" class="about-section">
              <SectionHeader icon="🧩" :title="$t('about.features.title')" />
              <AboutFeatures />
            </section>

          <section id="technologies" class="about-section">
            <SectionHeader icon="🛠" :title="$t('about.technologies.title')" />
            <AboutTechnologies />
          </section>

          <section id="roadmap" class="about-section">
            <AboutRoadmap />
          </section>

          <section id="contribute" class="about-section">
            <AboutContribute />
          </section>

          <section id="faq" class="about-section">
            <AboutFaq />
          </section>

          <section id="contact" class="about-section">
            <AboutContact />
          </section>

          <div class="text-[11px] opacity-60 pt-4">
            {{ $t('about.footerNote') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import AboutFeatures from '../components/about/AboutFeatures.vue';
import AboutTechnologies from '../components/about/AboutTechnologies.vue';
import AboutMission from '../components/about/AboutMission.vue';
import AboutRoadmap from '../components/about/AboutRoadmap.vue';
import AboutContribute from '../components/about/AboutContribute.vue';
import AboutFaq from '../components/about/AboutFaq.vue';
import AboutContact from '../components/about/AboutContact.vue';
import SectionHeader from '../components/about/SectionHeader.vue';

const navItems = [
  { id: 'mission', icon: '🎯', label: 'about.mission.title' },
  { id: 'features', icon: '🧩', label: 'about.features.title' },
  { id: 'technologies', icon: '🛠', label: 'about.technologies.title' },
  { id: 'roadmap', icon: '🧭', label: 'about.roadmap.title' },
  { id: 'contribute', icon: '🤝', label: 'about.contribute.title' },
  { id: 'faq', icon: '❓', label: 'about.faq.title' },
  { id: 'contact', icon: '📬', label: 'about.contact.title' }
];

const activeSection = ref('mission');
const scrollProgress = ref(0);

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function detectActive() {
  const fromTop = window.scrollY + 140;
  let current = navItems[0].id;
  navItems.forEach(item => {
    const sec = document.getElementById(item.id);
    if (sec && sec.offsetTop <= fromTop) current = item.id;
  });
  activeSection.value = current;

  // progress
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  scrollProgress.value = height ? Math.min(100, Math.round((scrollTop / height) * 100)) : 0;
}

const categoriesCompleted = ref(1);
function calcCompleted() {
  let count = 0;
  navItems.forEach(item => {
    const sec = document.getElementById(item.id);
    if (sec && window.scrollY + 200 >= sec.offsetTop) count++;
  });
  categoriesCompleted.value = Math.max(1, count);
}

function onScroll() {
  detectActive();
  calcCompleted();
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  detectActive();
  calcCompleted();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.about-section {
  scroll-margin-top: 120px;
  padding: 0.25rem 0 0;
  position: relative;
}
.about-section::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 140%;
  background: linear-gradient(to bottom, transparent 0%, var(--fallback-b1, hsl(var(--b1))) 140%);
  opacity: 0.03;
  pointer-events: none;
}
</style>
