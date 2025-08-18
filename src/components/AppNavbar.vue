<template>
  <nav
    class="z-40 bg-base-200 text-base-content transition-all duration-300 flex flex-col items-center p-2 w-20 h-screen fixed"
  >
    <!-- Logo -->
    <div class="my-3 w-full flex justify-center items-center">
      <oh-icon name="gi-anvil-impact" scale="2" />
    </div>
    <div class="divider mb-3 w-full"></div>
    <!-- Menu -->
    <ul class="menu menu-vertical gap-2 flex-1 w-full items-center">
      <li v-for="item in navItems" :key="item.to" class="w-full flex">
        <div
          class="tooltip tooltip-right w-full flex justify-center"
          :data-tip="$t(item.label)"
        >
          <router-link
            :to="item.to"
            custom
            v-slot="{ isActive, navigate, href }"
          >
            <a
              :href="href"
              @click="navigate"
              class="flex items-center w-full px-0 justify-center"
            >
              <oh-icon
                :name="item.icon"
                :fill="isActive ? 'var(--color-primary)' : 'currentColor'"
              />
            </a>
          </router-link>
        </div>
      </li>

      <div class="divider my-3 w-full"></div>

      <li v-for="item in navItemsPrompts" :key="item.to" class="w-full flex">
        <div
          class="tooltip tooltip-right w-full flex justify-center"
          :data-tip="$t(item.label)"
        >
          <router-link :to="item.to" custom v-slot="{ navigate, href }">
            <a
              :href="href"
              @click="navigate"
              class="flex items-center w-full px-0 justify-center"
            >
              <oh-icon
                :name="item.icon"
                :style="{
                  color: isNavActive(item.to)
                    ? 'var(--color-primary)'
                    : 'currentColor',
                }"
              />
            </a>
          </router-link>
        </div>
      </li>
    </ul>
    <!-- Language Switcher -->
    <div class="my-4 flex justify-center items-center w-full">
      <LanguageSwitcher />
    </div>
  </nav>
</template>

<script setup>
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { useRoute } from "vue-router";

const route = useRoute();

function isNavActive(itemTo) {
  return route.path.toLowerCase() === itemTo.toLowerCase();
}

const navItems = [
  { to: "/", icon: "fa-home", label: "home.title" },
  { to: "/prompts", icon: "fa-th-list", label: "prompts.title" },
  { to: "/about", icon: "fa-info-circle", label: "about.title" },
];
const navItemsPrompts = [
  {
    to: "/create-prompt/Text",
    icon: "co-text",
    label: "createPrompt.textDescription",
  },
  {
    to: "/create-prompt/Audio",
    icon: "co-audio-spectrum",
    label: "createPrompt.audioDescription",
  },
  {
    to: "/create-prompt/Video",
    icon: "co-video",
    label: "createPrompt.videoDescription",
  },
  {
    to: "/create-prompt/Image",
    icon: "co-image",
    label: "createPrompt.imageDescription",
  },
];
</script>

<style scoped>
.menu li {
  margin-bottom: 0.5rem;
}
.bg-base-300 {
  background-color: var(--b3, #d1d5db) !important;
}
</style>
