<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex text-sm breadcrumb">
      <li>
        <router-link to="/" class="link link-hover text-primary font-semibold">
          {{ $t("breadcrumbs.home") }}
        </router-link>
      </li>
      <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
        <li class="mx-2 text-base-content/60">/</li>
        <li>
          <router-link
            v-if="crumb.to"
            :to="crumb.to"
            class="link link-hover text-primary"
          >
            {{ crumb.label }}
          </router-link>
          <span v-else class="text-base-content/80">{{ crumb.label }}</span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();

const breadcrumbs = computed(() => {
  const pathArray = route.path.split("/").filter(Boolean);
  const crumbs = [];
  // Obsługa /create-prompt/:type
  if (pathArray[0] === "create-prompt") {
    crumbs.push({
      label: t("breadcrumbs.createPrompt"),
      to: "/create-prompt",
    });
    if (pathArray[1]) {
      // Próbujemy tłumaczyć typ promptu
      const typeKey = pathArray[1].toLowerCase();
      crumbs.push({
        label: t(`breadcrumbs.types.${typeKey}`, pathArray[1]),
        to: null,
      });
    }
    return crumbs;
  }
  // Inne trasy
  let path = "";
  pathArray.forEach((segment, idx) => {
    path += "/" + segment;
    let label = t(`breadcrumbs.${segment}`, segment);
    crumbs.push({
      label,
      to: idx < pathArray.length - 1 ? path : null,
    });
  });
  return crumbs;
});
</script>
