<template>
  <section
    class="flex flex-col items-center justify-center min-h-[90vh] w-full"
  >
    <HomeHero />
    <HomeQuickSearch />

    <HomeTypeButtons @goToCreatePrompt="goToCreatePrompt" />
    <HomeFooter />
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import HomeHero from "../components/home/HomeHero.vue";
import HomeQuickSearch from "../components/home/HomeQuickSearch.vue";
import HomeTypeButtons from "../components/home/HomeTypeButtons.vue";
import HomeFooter from "../components/home/HomeFooter.vue";

const router = useRouter();

function goToCreatePrompt(type) {
  router.push({ name: "CreatePrompt", params: { type } });
}
</script>
