<template>
  <section class="flex flex-col items-center justify-center min-h-full w-full">
    <!-- HERO -->
    <div class="hero bg-base-200 rounded-xl p-8 w-full max-w-3xl mb-10">
      <div class="hero-content flex-col text-center">
        <h1 class="text-5xl font-extrabold mb-4 text-primary">
          {{ $t("home.title") }}
        </h1>
        <p class="mb-6 text-lg text-base-content/80">{{ $t("home.hero") }}</p>
        <div class="flex flex-wrap justify-center mb-4 join">
          <div class="badge badge-primary badge-lg rounded-r-none rounded-l-lg">
            {{ $t("home.features.speed") }}
          </div>
          <div class="badge badge-secondary badge-lg rounded-none">
            {{ $t("home.features.multitopic") }}
          </div>
          <div class="badge badge-accent badge-lg rounded-none">
            {{ $t("home.features.intuitive") }}
          </div>
          <div class="badge badge-info badge-lg rounded-l-none rounded-r-lg">
            {{ $t("home.features.aiReady") }}
          </div>
        </div>
        <p class="text-base-content/60 text-sm">{{ $t("home.chooseType") }}</p>
      </div>
    </div>
    <!-- BUTTONS -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl"
    >
      <button
        class="btn btn-primary btn-xl flex flex-col items-center shadow-md hover:scale-105 transition"
        @click="goToCreatePrompt('Text')"
      >
        <span class="text-xs text-base-content">{{
          $t("home.textBtnDesc")
        }}</span>
      </button>
      <button
        class="btn btn-secondary btn-xl flex flex-col items-center shadow-md hover:scale-105 transition"
        @click="goToCreatePrompt('Video')"
      >
        <span class="text-xs text-base-content">{{
          $t("home.videoBtnDesc")
        }}</span>
      </button>
      <button
        class="btn btn-accent btn-xl flex flex-col items-center shadow-md hover:scale-105 transition"
        @click="goToCreatePrompt('Audio')"
      >
        <span class="text-xs text-base-content">{{
          $t("home.audioBtnDesc")
        }}</span>
      </button>
      <button
        class="btn btn-info btn-xl flex flex-col items-center shadow-md hover:scale-105 transition"
        @click="goToCreatePrompt('Image')"
      >
        <span class="text-xs text-base-content">{{
          $t("home.imageBtnDesc")
        }}</span>
      </button>
    </div>
    <!-- FOOTER INFO -->
    <div class="mt-12 text-center text-base-content/60 text-sm max-w-2xl">
      <p>{{ $t("home.footer") }}</p>
      <div class="mt-4 flex flex-wrap gap-2 justify-center">
        <span class="badge badge-outline">{{
          $t("home.badges.openSource")
        }}</span>
        <span class="badge badge-outline">{{
          $t("home.badges.vueDaisy")
        }}</span>
        <span class="badge badge-outline">{{ $t("home.badges.year") }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goToCreatePrompt(type) {
  router.push({ name: "CreatePrompt", params: { type } });
}
</script>
