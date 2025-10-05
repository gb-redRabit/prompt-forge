<template>
  <section class="relative">
    <UCard
      class="overflow-hidden border-2 border-primary-500/20"
      :ui="{
        body: 'p-12 lg:p-16 ring-0',
      }"
    >
      <div class="relative z-10 text-center space-y-6">
        <h2
          class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
        >
          {{ $t("app.cta_title") }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t("app.footer_note") }}
        </p>
        <div class="flex gap-4 justify-center pt-4">
          <UButton
            color="primary"
            size="xl"
            @click="$emit('get-started')"
            class="shadow-lg hover:shadow-xl"
          >
            {{ $t("app.cta_primary") }}
            <UIcon name="i-heroicons-arrow-right" class="ml-2" />
          </UButton>
        </div>
      </div>

      <!-- Background decoration -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5"
      />
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
      />
      <div
        class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      />
    </UCard>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  "get-started": [];
}>();
</script>
