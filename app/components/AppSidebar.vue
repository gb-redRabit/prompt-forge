<template>
  <!-- mobile toggle button (floating) -->
  <GlassButton
    v-if="!isSidebarOpen"
    @click="() => open()"
    icon="i-heroicons-bars-3"
    size="lg"
    color="primary"
    variant="solid"
    class="fixed top-4 right-4 lg:hidden glass-button shadow-lg"
    :style="zIndexStyle('SIDEBAR')"
    aria-label="Open menu"
  />

  <!-- mobile overlay -->
  <div
    v-show="isSidebarOpen"
    class="fixed inset-0 lg:hidden"
    :style="zIndexStyle('SIDEBAR')"
  >
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
    <aside
      class="fixed inset-y-0 left-0 w-full glass-panel overflow-hidden flex flex-col shadow-2xl"
    >
      <!-- mobile header with close button -->
      <div
        class="flex h-16 items-center justify-between px-4 border-b border-white/20 dark:border-gray-700/50"
      >
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div
            class="h-8 w-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform"
          >
            PF
          </div>
          <span class="text-lg font-semibold text-gray-900 dark:text-white">
            <span v-once>{{ $t("app.name") }}</span>
          </span>
        </NuxtLink>
        <GlassButton
          @click="() => close()"
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="ghost"
          aria-label="Close menu"
        />
      </div>

      <!-- mobile navigation -->
      <nav
        class="flex-1 overflow-y-auto custom-scrollbar px-2 py-4"
        style="contain: layout style"
      >
        <ul class="space-y-1">
          <li
            v-for="item in navigation"
            :key="item.href"
            v-memo="[isActive(item.href)]"
          >
            <NuxtLink
              :to="item.href"
              @click="close"
              class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
              :class="
                isActive(item.href)
                  ? 'glass-card text-primary-600 dark:text-primary-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:glass-button'
              "
            >
              <UIcon :name="item.icon" class="h-5 w-5" />
              <span class="text-sm font-medium">{{ $t(item.name) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- mobile footer -->
      <div class="px-4 py-3 border-t border-white/20 dark:border-gray-700/50">
        <!-- Theme toggle mobile -->
        <ClientOnly>
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <span v-once>{{ $t("nav.theme") }}</span>
            </div>
            <GlassButton
              @click="toggleTheme"
              :icon="themeIcon"
              color="neutral"
              variant="ghost"
              size="xs"
              :title="$t('nav.toggle_theme')"
            />
          </div>
        </ClientOnly>

        <!-- Language selector mobile -->
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span v-once>{{ $t("nav.language") }}</span>
          </div>
          <div class="flex gap-2">
            <GlassButton
              @click="selectLang('pl')"
              :color="locale === 'pl' ? 'primary' : 'neutral'"
              :variant="locale === 'pl' ? 'solid' : 'soft'"
              size="xs"
            >
              PL
            </GlassButton>
            <GlassButton
              @click="selectLang('en')"
              :color="locale === 'en' ? 'primary' : 'neutral'"
              :variant="locale === 'en' ? 'solid' : 'soft'"
              size="xs"
            >
              EN
            </GlassButton>
          </div>
        </div>
      </div>
    </aside>
  </div>

  <!-- desktop -->
  <aside
    :class="[
      'hidden fixed lg:inset-y-0 lg:flex lg:flex-col glass-panel shadow-2xl transition-all duration-300 overflow-hidden',
      !sidebarOpen ? 'lg:w-16' : 'lg:w-72',
    ]"
    :style="zIndexStyle('SIDEBAR')"
  >
    <!-- desktop header -->
    <div
      class="flex h-16 items-center border-b border-white/20 dark:border-gray-700/50"
      :class="!sidebarOpen ? 'justify-center px-2' : 'justify-between px-4'"
    >
      <NuxtLink v-if="sidebarOpen" to="/" class="flex items-center gap-2 group">
        <div
          class="h-8 w-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform"
        >
          PF
        </div>
        <span class="text-lg font-semibold text-gray-900 dark:text-white">
          <span v-once>{{ $t("app.name") }}</span>
        </span>
      </NuxtLink>

      <NuxtLink v-else to="/" class="flex items-center justify-center group">
        <div
          class="h-8 w-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform"
        >
          PF
        </div>
      </NuxtLink>

      <GlassButton
        v-if="sidebarOpen"
        @click="toggleCollapsed"
        icon="i-heroicons-chevron-left"
        color="neutral"
        variant="ghost"
        size="xs"
        title="Collapse sidebar"
      />
    </div>

    <!-- desktop navigation -->
    <nav
      class="flex-1 overflow-hidden px-2 py-4 custom-scrollbar"
      style="contain: layout style"
    >
      <ul class="space-y-1">
        <li
          v-for="item in navigation"
          :key="item.href"
          class="relative"
          v-memo="[isActive(item.href), sidebarOpen]"
        >
          <NuxtLink
            :to="item.href"
            class="group flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-all relative"
            :class="[
              !sidebarOpen ? 'justify-center' : 'gap-3',
              isActive(item.href)
                ? 'glass-card text-primary-600 dark:text-primary-400 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:glass-button',
            ]"
          >
            <div class="flex items-center justify-center w-6 h-6 flex-shrink-0">
              <UIcon :name="item.icon" class="h-5 w-5" />
            </div>

            <span v-if="sidebarOpen" class="truncate flex-1">{{
              $t(item.name)
            }}</span>

            <!-- tooltip when collapsed -->
            <div
              v-if="!sidebarOpen"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-lg glass-card text-sm px-3 py-2 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 shadow-lg"
              :style="{ zIndex: 60 }"
            >
              {{ $t(item.name) }}
            </div>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- desktop footer -->
    <div
      class="border-t border-white/20 dark:border-gray-700/50"
      :class="!sidebarOpen ? 'px-2 py-3' : 'px-4 py-3'"
    >
      <div v-if="!sidebarOpen" class="flex flex-col items-center gap-2">
        <GlassButton
          @click="toggleCollapsed"
          icon="i-heroicons-chevron-right"
          color="neutral"
          variant="ghost"
          size="xs"
          title="Expand sidebar"
        />

        <!-- Theme toggle collapsed -->
        <ClientOnly>
          <GlassButton
            @click="toggleTheme"
            :icon="themeIcon"
            color="neutral"
            variant="ghost"
            size="xs"
            :title="$t('nav.toggle_theme')"
          />
        </ClientOnly>

        <!-- Language buttons collapsed -->
        <div class="flex flex-col gap-1">
          <GlassButton
            @click="selectLang('pl')"
            :color="locale === 'pl' ? 'primary' : 'neutral'"
            :variant="locale === 'pl' ? 'solid' : 'ghost'"
            size="xs"
            class="w-8"
            title="Polski"
          >
            PL
          </GlassButton>
          <GlassButton
            @click="selectLang('en')"
            :color="locale === 'en' ? 'primary' : 'neutral'"
            :variant="locale === 'en' ? 'solid' : 'ghost'"
            size="xs"
            class="w-8"
            title="English"
          >
            EN
          </GlassButton>
        </div>
      </div>

      <div v-else class="space-y-3">
        <!-- Theme toggle expanded -->
        <ClientOnly>
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <span v-once>{{ $t("nav.theme") }}</span>
            </div>
            <GlassButton
              @click="toggleTheme"
              :icon="themeIcon"
              color="neutral"
              variant="ghost"
              size="xs"
              :title="$t('nav.toggle_theme')"
            >
              <template #trailing>
                <span class="text-xs">{{ themeLabel }}</span>
              </template>
            </GlassButton>
          </div>
        </ClientOnly>

        <!-- Language selector expanded -->
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span v-once>{{ $t("nav.language") }}</span>
          </div>
          <div class="flex gap-2">
            <GlassButton
              @click="selectLang('pl')"
              :color="locale === 'pl' ? 'primary' : 'neutral'"
              :variant="locale === 'pl' ? 'solid' : 'soft'"
              size="xs"
            >
              PL
            </GlassButton>
            <GlassButton
              @click="selectLang('en')"
              :color="locale === 'en' ? 'primary' : 'neutral'"
              :variant="locale === 'en' ? 'solid' : 'soft'"
              size="xs"
            >
              EN
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useSidebar } from "~/composables/useSidebar";
import { useI18n } from "vue-i18n";

const { isSidebarOpen, close, open } = useSidebar();
const isOpen = defineModel<boolean>("open", { default: true });
const { zIndexStyle } = useZIndex();

// Używamy centralnego composable dla motywu
const { toggleTheme, themeIcon, themeLabel } = useTheme();

// Stan sidebara z localStorage
const sidebarOpen = ref(true);

watch(sidebarOpen, (value) => {
  if (process.client) {
    localStorage.setItem("sidebar-open", JSON.stringify(value));
  }
});

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      sidebarOpen.value = JSON.parse(saved);
    }
  }
});

const toggleCollapsed = () => {
  sidebarOpen.value = !sidebarOpen.value;
  isOpen.value = !isOpen.value;
};

// navigation items
const navigation = [
  { name: "nav.dashboard", href: "/", icon: "i-heroicons-home" },
  { name: "nav.prompts", href: "/prompts", icon: "i-heroicons-document-text" },
  { name: "nav.library", href: "/library", icon: "i-heroicons-folder" },
  {
    name: "nav.templates",
    href: "/templates",
    icon: "i-heroicons-squares-2x2",
  },
  { name: "nav.settings", href: "/settings", icon: "i-heroicons-cog-6-tooth" },
  {
    name: "chat.title",
    href: "/chat",
    icon: "i-heroicons-cpu-chip",
  },
  {
    name: "prompt_creator.title",
    href: "/editor",
    icon: "i-heroicons-pencil-square",
  },
];

const route = useRoute();

const isActive = (href: string) => {
  if (href === "/") return route.path === "/";
  return route.path.startsWith(href);
};

// Automatyczne zamykanie menu mobilnego przy zmianie route
watch(
  () => route.path,
  () => {
    if (isSidebarOpen.value) {
      close();
    }
  }
);

const { locale, setLocale } = useI18n();

const selectLang = (code: string) => {
  setLocale(code as "pl" | "en");
  if (import.meta.client) {
    localStorage.setItem("locale", code);
    useCookie("locale").value = code;
  }
};
</script>

<style scoped>
/* Ensure no horizontal scroll */
aside {
  min-width: 0;
}
</style>
