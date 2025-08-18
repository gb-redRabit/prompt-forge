<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-base-200"
  >
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h1 class="text-4xl font-bold text-error mb-4">
          {{ $t("notFound.title") }}
        </h1>
        <p class="text-lg mb-8">{{ $t("notFound.message") }}</p>
        <router-link to="/" class="btn btn-primary">{{
          $t("home.title")
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
