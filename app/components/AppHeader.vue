<template>
  <header
    class="sticky top-0 z-40 w-full glass-panel border-b border-white/20 dark:border-slate-700/50 backdrop-blur-md transition-all duration-300"
    :style="zIndexStyle('HEADER')"
  >
    <div class="h-16 px-4 flex items-center justify-end gap-4">
      <!-- Left: Mobile menu toggle + Page Title -->
      <div class="flex items-center gap-3">
        <GlassButton
          v-if="!isSidebarOpen"
          @click="() => open()"
          icon="i-heroicons-bars-3"
          size="sm"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          aria-label="Open menu"
        />
        
        <div class="flex flex-col">
          <h1 class="text-sm font-bold text-slate-900 dark:text-white truncate">
            {{ pageTitle }}
          </h1>
          <div class="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>{{ $t("ai.status.connected") }}</span>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-2">
        <!-- Search bar (desktop) -->
        <div class="hidden md:block relative">
          <UInput
            icon="i-heroicons-magnifying-glass"
            size="sm"
            :placeholder="$t('pages.common.search')"
            class="w-64"
            variant="none"
            input-class="bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div class="h-6 w-[1px] bg-white/20 dark:bg-slate-700/50 mx-1 hidden sm:block" />

        <!-- Theme Toggle -->
        <ClientOnly>
          <GlassButton
            @click="toggleTheme"
            :icon="themeIcon"
            size="sm"
            color="neutral"
            variant="ghost"
            :title="$t('nav.toggle_theme')"
          />
        </ClientOnly>

        <!-- User Avatar / Profile -->
        <div class="flex items-center gap-2 pl-1">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-xs font-semibold text-slate-900 dark:text-white leading-tight">Guest User</span>
            <span class="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Pro Account</span>
          </div>
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 p-[1px] shadow-lg group cursor-pointer hover:scale-105 transition-transform">
            <div class="h-full w-full rounded-[10px] bg-slate-900 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSidebar } from "~/composables/useSidebar";

const { isSidebarOpen, open } = useSidebar();
const { zIndexStyle } = useZIndex();
const { toggleTheme, themeIcon } = useTheme();
const route = useRoute();
const { t } = useI18n();

const pageTitle = computed(() => {
  // Próbujemy pobrać tytuł z meta lub z nazwy routingu
  const metaTitle = route.meta.title as string;
  if (metaTitle) return metaTitle;

  // Mapowanie ścieżek na klucze tłumaczeń
  const pathMap: Record<string, string> = {
    "/": t("nav.dashboard"),
    "/prompts": t("nav.prompts"),
    "/library": t("nav.library"),
    "/templates": t("nav.templates"),
    "/settings": t("nav.settings"),
    "/chat": t("chat.title"),
    "/editor": t("nav.prompt_editor"),
  };

  return pathMap[route.path] || t("app.name");
});
</script>
