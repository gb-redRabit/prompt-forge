<template>
  <div class="flex justify-center items-center min-h-[94vh]">
    <div
      class="card w-full max-w-3xl bg-base-100 shadow-2xl border border-base-300"
    >
      <div class="card-body">
        <div class="flex flex-col items-center">
          <oh-icon name="gi-anvil-impact" scale="2" class="mb-2 text-primary" />
          <h1 class="card-title text-4xl font-bold mb-2 text-primary">
            {{ $t("about.title") }}
          </h1>
          <p class="text-base-content/80 text-center max-w-2xl">
            {{ $t("about.description") }}
          </p>
        </div>
        <div class="divider">{{ $t("about.features.title") }}</div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <li
            class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
          >
            <span class="badge badge-info badge-lg"
              ><oh-icon name="fa-pen" scale="1"
            /></span>
            <span>{{ $t("about.features.promptCreation") }}</span>
          </li>
          <li
            class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
          >
            <span class="badge badge-success badge-lg"
              ><oh-icon name="fa-language" scale="1"
            /></span>
            <span>{{ $t("about.features.languageSupport") }}</span>
          </li>
          <li
            class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
          >
            <span class="badge badge-primary badge-lg"
              ><oh-icon name="fa-users" scale="1"
            /></span>
            <span>{{ $t("about.features.userFriendly") }}</span>
          </li>
          <li
            class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
          >
            <span class="badge badge-accent badge-lg"
              ><oh-icon name="fa-bolt" scale="1"
            /></span>
            <span>{{ $t("about.features.fastAndModern") }}</span>
          </li>
        </ul>
        <div class="divider">{{ $t("about.technologies.title") }}</div>
        <div class="flex flex-wrap gap-2 justify-center">
          <span class="badge badge-outline">Vue 3</span>
          <span class="badge badge-outline">DaisyUI</span>
          <span class="badge badge-outline">Tailwind CSS</span>
          <span class="badge badge-outline">Open Source</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
