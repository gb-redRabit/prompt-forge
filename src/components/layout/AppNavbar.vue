<template>
  <!-- Jeden przycisk, który animuje pozycję i kolor -->
  <button
    class="fixed z-50 btn btn-square transition-all duration-400 top-3 lg:hidden"
    :class="showMenu ? 'left-22 btn-error' : 'left-3 btn-primary'"
    @click="showMenu = !showMenu"
    aria-label="Menu"
  >
    <oh-icon :name="showMenu ? 'fa-times' : 'fa-bars'" scale="1.2" />
  </button>

  <!-- Nawigacja boczna -->
  <transition name="slide-menu">
    <nav
      v-show="showMenu || isDesktop"
      class="z-40 bg-base-200 text-base-content flex flex-col items-center p-2 w-20 h-screen fixed lg:translate-x-0"
      :class="[
        showMenu || isDesktop ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
        'transition-transform',
      ]"
      style="will-change: transform"
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
              class="flex items-center w-full px-0 justify-center"
              @click="showMenu = false"
              :class="{ 'text-primary': isNavActive(item.to) }"
            >
              <oh-icon
                :name="item.icon"
                :fill="
                  isNavActive(item.to) ? 'var(--color-primary)' : 'currentColor'
                "
              />
            </router-link>
          </div>
        </li>

        <div class="divider my-3 w-full"></div>

        <li v-for="item in navItemsPrompts" :key="item.to" class="w-full flex">
          <div
            class="tooltip tooltip-right w-full flex justify-center"
            :data-tip="$t(item.label)"
          >
            <router-link
              :to="item.to"
              class="flex items-center w-full px-0 justify-center"
              @click="showMenu = false"
              :class="{ 'text-primary': isNavActive(item.to) }"
            >
              <oh-icon
                :name="item.icon"
                :style="{
                  color: isNavActive(item.to)
                    ? 'var(--color-primary)'
                    : 'currentColor',
                }"
              />
            </router-link>
          </div>
        </li>
      </ul>
      <!-- Language Switcher -->
      <div class="my-4 flex justify-center items-center w-full">
        <LanguageSwitcher />
      </div>
    </nav>
  </transition>
</template>

<script setup>
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { useRoute } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";

const showMenu = ref(false);
const route = useRoute();

function isNavActive(itemTo) {
  return route.path.toLowerCase() === itemTo.toLowerCase();
}

const navItems = [
  { to: "/", icon: "fa-home", label: "home.title" },
  { to: "/prompts", icon: "fa-th-list", label: "prompts.title" },
  { to: "/about", icon: "fa-info-circle", label: "about.title" },
  { to: "/ai-tools", icon: "fa-bolt", label: "aiTools.title" },
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

// Detekcja desktop/mobile (dla poprawnego pokazywania menu)
const isDesktop = ref(window.innerWidth >= 1024);
function handleResize() {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) showMenu.value = true;
  else showMenu.value = false;
}
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.menu li {
  margin-bottom: 0.5rem;
}
.bg-base-300 {
  background-color: var(--b3, #d1d5db) !important;
}
nav {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-menu-enter-active,
.slide-menu-leave-active {
  transition:
    opacity 0.3s,
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-menu-enter-from,
.slide-menu-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-menu-enter-to,
.slide-menu-leave-from {
  opacity: 1;
  transform: translateX(0);
}
/* Animacja przycisku hamburgera/X */
.btn.btn-square {
  transition:
    left 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s,
    color 0.3s;
}
</style>
