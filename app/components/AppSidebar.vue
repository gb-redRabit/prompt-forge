<template>
  <!-- mobile toggle button (floating) - PRZENIEŚ POZA OVERLAY -->
  <button
    v-if="!isSidebarOpen"
    @click="open"
    class="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
    aria-label="Open menu"
  >
    <UIcon
      name="i-heroicons-bars-3"
      class="h-6 w-6 text-gray-600 dark:text-gray-300"
    />
  </button>

  <!-- mobile overlay -->
  <div v-if="isSidebarOpen" class="fixed inset-0 z-40 lg:hidden">
    <div class="fixed inset-0 bg-black/50" @click="close" />
    <aside
      class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 overflow-hidden flex flex-col"
    >
      <!-- mobile header with close button -->
      <div
        class="flex h-16 items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700"
      >
        <NuxtLink to="/" class="flex items-center gap-2">
          <div
            class="h-8 w-8 bg-primary-600 rounded flex items-center justify-center text-white font-bold"
          >
            PF
          </div>
          <span class="text-lg font-semibold text-gray-900 dark:text-white">{{
            $t("app.name")
          }}</span>
        </NuxtLink>
        <button
          @click="close"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close menu"
        >
          <UIcon
            name="i-heroicons-x-mark"
            class="h-6 w-6 text-gray-600 dark:text-gray-300"
          />
        </button>
      </div>

      <!-- mobile navigation -->
      <nav class="flex-1 overflow-y-auto px-2 py-4">
        <ul class="space-y-1">
          <li v-for="item in navigation" :key="item.href">
            <NuxtLink
              :to="item.href"
              @click="close"
              class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isActive(item.href)
                  ? 'bg-gray-100 dark:bg-gray-700 text-primary-600'
                  : 'text-gray-700 dark:text-gray-300'
              "
            >
              <UIcon :name="item.icon" class="h-5 w-5" />
              <span class="text-sm font-medium">{{ $t(item.name) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- mobile footer -->
      <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <!-- Theme toggle mobile - wrapped in ClientOnly -->
        <ClientOnly>
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-gray-500">{{ $t("nav.theme") }}</div>
            <button
              @click="toggleTheme"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="$t('nav.toggle_theme')"
            >
              <UIcon
                :name="themeIcon"
                class="h-5 w-5 text-gray-600 dark:text-gray-300"
              />
            </button>
          </div>
        </ClientOnly>

        <!-- Language selector mobile -->
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-500">{{ $t("nav.language") }}</div>
          <div class="flex gap-2">
            <button
              @click="selectLang('pl')"
              :class="btnClass('pl')"
              class="px-2 py-1 rounded text-xs"
            >
              PL
            </button>
            <button
              @click="selectLang('en')"
              :class="btnClass('en')"
              class="px-2 py-1 rounded text-xs"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </aside>
  </div>

  <!-- desktop -->
  <aside
    :class="[
      'hidden fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col bg-white dark:bg-gray-800 shadow transition-all duration-200 overflow-hidden',
      collapsed ? 'lg:w-16' : 'lg:w-72',
    ]"
  >
    <!-- desktop header -->
    <div
      class="flex h-16 items-center border-b border-gray-100 dark:border-gray-700"
      :class="collapsed ? 'justify-center px-2' : 'justify-between px-4'"
    >
      <NuxtLink v-if="!collapsed" to="/" class="flex items-center gap-2">
        <div
          class="h-8 w-8 bg-primary-600 rounded flex items-center justify-center text-white font-bold"
        >
          PF
        </div>
        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{
          $t("app.name")
        }}</span>
      </NuxtLink>

      <NuxtLink v-else to="/" class="flex items-center justify-center">
        <div
          class="h-8 w-8 bg-primary-600 rounded flex items-center justify-center text-white font-bold"
        >
          PF
        </div>
      </NuxtLink>

      <button
        v-if="!collapsed"
        @click="toggleCollapsed"
        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Collapse sidebar"
      >
        <UIcon
          name="i-heroicons-chevron-left"
          class="h-5 w-5 text-gray-600 dark:text-gray-300"
        />
      </button>
    </div>

    <!-- desktop navigation -->
    <nav class="flex-1 overflow-hidden px-2 py-4">
      <ul class="space-y-1">
        <li v-for="item in navigation" :key="item.href" class="relative">
          <NuxtLink
            :to="item.href"
            class="group flex items-center rounded px-2 py-2 text-sm font-medium transition-colors relative"
            :class="[
              collapsed ? 'justify-center' : 'gap-3',
              isActive(item.href)
                ? 'bg-gray-100 dark:bg-gray-700 text-primary-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600',
            ]"
          >
            <div class="flex items-center justify-center w-6 h-6 flex-shrink-0">
              <UIcon :name="item.icon" class="h-5 w-5" />
            </div>

            <span v-if="!collapsed" class="truncate flex-1">{{
              $t(item.name)
            }}</span>

            <!-- tooltip when collapsed -->
            <div
              v-if="collapsed"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100"
            >
              {{ $t(item.name) }}
            </div>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- desktop footer -->
    <div
      class="border-t border-gray-100 dark:border-gray-700"
      :class="collapsed ? 'px-2 py-3' : 'px-4 py-3'"
    >
      <div v-if="collapsed" class="flex flex-col items-center gap-2">
        <button
          @click="toggleCollapsed"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Expand sidebar"
        >
          <UIcon
            name="i-heroicons-chevron-right"
            class="h-5 w-5 text-gray-600 dark:text-gray-300"
          />
        </button>

        <!-- Theme toggle collapsed - wrapped in ClientOnly -->
        <ClientOnly>
          <button
            @click="toggleTheme"
            class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            :title="$t('nav.toggle_theme')"
          >
            <UIcon
              :name="themeIcon"
              class="h-5 w-5 text-gray-600 dark:text-gray-300"
            />
          </button>
        </ClientOnly>

        <!-- Language buttons collapsed -->
        <div class="flex flex-col gap-1">
          <button
            @click="selectLang('pl')"
            :class="btnClass('pl')"
            class="w-8 h-6 rounded text-xs flex items-center justify-center"
            title="Polski"
          >
            PL
          </button>
          <button
            @click="selectLang('en')"
            :class="btnClass('en')"
            class="w-8 h-6 rounded text-xs flex items-center justify-center"
            title="English"
          >
            EN
          </button>
        </div>
      </div>

      <div v-else class="space-y-3">
        <!-- Theme toggle expanded - wrapped in ClientOnly -->
        <ClientOnly>
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500">{{ $t("nav.theme") }}</div>
            <button
              @click="toggleTheme"
              class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
              :title="$t('nav.toggle_theme')"
            >
              <UIcon
                :name="themeIcon"
                class="h-4 w-4 text-gray-600 dark:text-gray-300"
              />
              <span class="text-gray-600 dark:text-gray-300">{{
                themeLabel
              }}</span>
            </button>
          </div>
        </ClientOnly>

        <!-- Language selector expanded -->
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-500">{{ $t("nav.language") }}</div>
          <div class="flex gap-2">
            <button
              @click="selectLang('pl')"
              :class="btnClass('pl')"
              class="px-2 py-1 rounded text-xs"
            >
              PL
            </button>
            <button
              @click="selectLang('en')"
              :class="btnClass('en')"
              class="px-2 py-1 rounded text-xs"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useSidebar } from "~/composables/useSidebar";
import { useI18n } from "vue-i18n";
import { useColorMode } from "#imports";
const { isSidebarOpen, close, open } = useSidebar();
const isOpen = defineModel<boolean>("open", { default: true });
// persisted collapsed state
const collapsed = useState<boolean>("sidebarCollapsed", () => false);

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  isOpen.value = !isOpen.value;
};

// Theme management - tylko po stronie klienta
const colorMode = process.client ? useColorMode() : null;

const toggleTheme = () => {
  if (colorMode) {
    colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
  }
};

const themeIcon = computed(() => {
  if (!colorMode) return "i-heroicons-moon";
  return colorMode.preference === "dark"
    ? "i-heroicons-sun"
    : "i-heroicons-moon";
});

const themeLabel = computed(() => {
  if (!colorMode) return "Dark";
  return colorMode.preference === "dark" ? "Light" : "Dark";
});

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
    href: "/fukcje/options",
    icon: "i-heroicons-h1",
  },
  {
    name: "chat.title",
    href: "/fukcje/prompt",
    icon: "i-heroicons-h2",
  },
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

const { locale, setLocale } = useI18n();

const btnClass = (code: string) =>
  locale.value === code
    ? "bg-primary-600 text-white"
    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200";

const selectLang = (code: string) => {
  setLocale(code as "pl" | "en");
  if (import.meta.client) {
    localStorage.setItem("locale", code);
    useCookie("locale").value = code;
  }
};
</script>

<style scoped>
/* Zapobieganie scroll-owi gdy collapsed */
.overflow-hidden {
  overflow: hidden;
}

/* Tooltip z wyższym z-index */
.group:hover .opacity-0 {
  opacity: 1;
  z-index: 60;
}

/* Smooth transitions */
.transition-all {
  transition-property: width, padding, margin;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ensure no horizontal scroll */
aside {
  min-width: 0;
}

/* Mobile floating button positioning */
@media (max-width: 1023px) {
  .fixed.top-4.left-4 {
    top: 1rem;
    left: 1rem;
  }
}
</style>
