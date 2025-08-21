<template>
  <div class="flex justify-center items-center min-h-[94vh]">
    <div class="w-full max-w-7xl px-2">
      <h1 class="text-3xl font-bold mb-4 text-primary text-center">
        {{ $t("aiTools.title") }}
      </h1>
      <p class="mb-8 text-base-content/80 text-center">
        {{ $t("aiTools.description") }}
      </p>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="tool in tools"
          :key="tool.name"
          class="card bg-base-200 shadow-xl border border-base-300 hover:scale-[1.025] transition"
        >
          <figure class="px-6 pt-6">
            <img
              :src="tool.logo"
              :alt="tool.name + ' logo'"
              class="rounded-xl h-16 w-16 object-contain mx-auto"
              loading="lazy"
            />
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title text-primary mb-2">{{ tool.name }}</h2>
            <p class="text-base-content/80 text-sm mb-4">
              {{ tool.description[locale] || tool.description.en }}
            </p>
            <div class="flex flex-wrap justify-center gap-2 mb-4">
              <span
                v-for="tag in tool.tags"
                :key="tag"
                class="badge px-3 py-1 text-xs font-semibold"
                :class="tagClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
            <div class="card-actions">
              <a
                :href="tool.url"
                target="_blank"
                rel="noopener"
                class="btn btn-accent btn-sm"
              >
                {{ $t("aiTools.visit") }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAiToolsStore } from "../store/aiToolsStore";
import { useI18n } from "vue-i18n";

const { tools } = useAiToolsStore();
const { locale } = useI18n();

// Funkcja doboru koloru badge na podstawie tagu
function tagClass(tag) {
  if (tag.toLowerCase().includes("free")) return "badge-success";
  if (tag.toLowerCase().includes("trial")) return "badge-warning";
  if (
    tag.toLowerCase().includes("płatne") ||
    tag.toLowerCase().includes("paid")
  )
    return "badge-error";
  if (tag.toLowerCase().includes("open source")) return "badge-info";
  if (tag.toLowerCase().includes("konto")) return "badge-secondary";
  return "badge-neutral";
}
</script>
