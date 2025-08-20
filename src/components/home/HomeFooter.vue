<template>
  <div class="mt-12 text-center text-base-content/60 text-sm max-w-2xl">
    <p>{{ $t("home.footer") }}</p>
    <div class="mt-4 flex flex-wrap gap-2 justify-center">
      <span class="badge badge-outline">{{
        $t("home.badges.openSource")
      }}</span>
      <span class="badge badge-outline">{{ $t("home.badges.vueDaisy") }}</span>
      <span class="badge badge-outline">{{ $t("home.badges.year") }}</span>
    </div>
  </div>
</template>
