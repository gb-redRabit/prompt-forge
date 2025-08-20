<template>
  <div class="w-full max-w-2xl mb-8">
    <form @submit.prevent="goToSearch" class="flex gap-2">
      <input
        v-model="quickSearch"
        type="search"
        class="input input-bordered w-full"
        :placeholder="$t('prompts.searchPlaceholder')"
      />
      <button class="btn btn-primary" type="submit">
        {{ $t("home.quickSearchBtn") || "Szukaj" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const quickSearch = ref("");
const router = useRouter();
function goToSearch() {
  router.push({
    name: "PromptList",
    query: { search: quickSearch.value },
  });
}
</script>
