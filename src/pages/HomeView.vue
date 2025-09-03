<template>
  <section class="flex flex-col items-center min-h-[90vh] w-full gap-12 py-10">
    <HomeHero />
    <HomeQuickSearch />

    <FeatureCards :items="featureCards" />

    <RecentSets @open-set="openCreateWithSet" @clear-sets="clearRecent" />

    <CtaStripe @go="goToCreatePrompt" />

    <HomeTypeButtons @goToCreatePrompt="goToCreatePrompt" class="mb-6" />
    <HomeFooter />
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";

import HomeHero from "../components/home/HomeHero.vue";
import HomeQuickSearch from "../components/home/HomeQuickSearch.vue";
import HomeTypeButtons from "../components/home/HomeTypeButtons.vue";
import HomeFooter from "../components/home/HomeFooter.vue";

import FeatureCards from "../components/home/FeatureCards.vue";
import RecentSets from "../components/home/RecentSets.vue";
import CtaStripe from "../components/home/CtaStripe.vue";

const router = useRouter();

function goToCreatePrompt(type) {
  router.push({ name: "CreatePrompt", params: { type } });
}

const featureCards = [
  { key: "structured", icon: "🧱" },
  { key: "weights", icon: "⚖️" },
  { key: "emphasis", icon: "🎯" },
  { key: "sets", icon: "💾" },
  { key: "search", icon: "🔍" },
  { key: "favorites", icon: "⭐" },
  { key: "export", icon: "📤" },
  { key: "scalable", icon: "🧬" },
];

const openCreateWithSet = (s) => {
  localStorage.setItem("pf_last_auto_load_set", JSON.stringify(s));
  goToCreatePrompt("image");
};

const clearRecent = () => {
  localStorage.removeItem("pf_sets");
  location.reload();
};
</script>

<style scoped>
/* drobne wygładzenie */
</style>
