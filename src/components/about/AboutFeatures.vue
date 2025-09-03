<template>
  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-info badge-lg"
        ><oh-icon name="fa-pen" scale="1"
      /></span>
      <span>{{ $t("about.features.promptCreation") }}</span>
    </li>
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-success badge-lg"
        ><oh-icon name="fa-language" scale="1"
      /></span>
      <span>{{ $t("about.features.languageSupport") }}</span>
    </li>
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-primary badge-lg"
        ><oh-icon name="fa-users" scale="1"
      /></span>
      <span>{{ $t("about.features.userFriendly") }}</span>
    </li>
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-accent badge-lg"
        ><oh-icon name="fa-bolt" scale="1"
      /></span>
      <span>{{ $t("about.features.fastAndModern") }}</span>
    </li>
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-warning badge-lg"
        ><oh-icon name="fa-robot" scale="1"
      /></span>
      <span>{{ $t("about.features.aiToolsDirectory") }}</span>
    </li>
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-secondary badge-lg"
        ><oh-icon name="fa-filter" scale="1"
      /></span>
      <span>{{ $t("about.features.advancedFiltering") }}</span>
    </li>
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-error badge-lg"
        ><oh-icon name="fa-copy" scale="1"
      /></span>
      <span>{{ $t("about.features.promptPreview") }}</span>
    </li>
    <li
      class="flex items-center gap-3 bg-base-200 rounded-lg p-3 shadow hover:scale-105 transition"
    >
      <span class="badge badge-info badge-lg"
        ><oh-icon name="fa-database" scale="1"
      /></span>
      <span>{{ $t("about.features.localModelsSupport") }}</span>
    </li>
  </ul>
</template>
