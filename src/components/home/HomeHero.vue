<template>
  <div class="hero bg-base-200 rounded-xl p-8 w-full max-w-3xl mb-10">
    <div class="hero-content flex-col text-center">
      <h1 class="text-5xl font-extrabold mb-4 text-primary">
        {{ $t("home.title") }}
      </h1>
      <p class="mb-6 text-lg text-base-content/80">{{ $t("home.hero") }}</p>
      <div class="flex flex-wrap justify-center mb-4 join">
        <div class="badge badge-primary badge-lg rounded-none">
          {{ $t("home.features.speed") }}
        </div>
        <div class="badge badge-secondary badge-lg rounded-none">
          {{ $t("home.features.multitopic") }}
        </div>
        <div class="badge badge-accent badge-lg rounded-none">
          {{ $t("home.features.intuitive") }}
        </div>
        <div class="badge badge-info badge-lg rounded-none">
          {{ $t("home.features.aiReady") }}
        </div>
      </div>
      <p class="text-base-content/60 text-sm">{{ $t("home.chooseType") }}</p>
    </div>
  </div>
</template>
