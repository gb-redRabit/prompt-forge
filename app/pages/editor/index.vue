<template>
  <div class="min-h-screen">
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar z kategoriami -->
      <aside
        :class="[
          'bg-white dark:bg-gray-800 border-r border-l border-gray-200 dark:border-gray-700 transition-all duration-200 relative gooey-sidebar',
          sidebarExpanded ? 'w-72' : 'w-16',
        ]"
      >
        <!-- Toggle Button with Gooey Effect -->
        <div
          v-if="buttonVisible"
          class="gooey-container"
          :style="{
            position: 'fixed',
            left: `${buttonLeft}px`,
            top: `${buttonTop}px`,

            pointerEvents: 'none',
          }"
        >
          <div
            class="gooey-blob blob-bg items-center justify-center hidden md:flex"
          >
            <UButton
              ref="toggleButtonRef"
              variant="ghost"
              size="md"
              @click="sidebarExpanded = !sidebarExpanded"
              class="gooey-button hover:bg-transparent focus:bg-transparent active:bg-transparent"
              :style="{ pointerEvents: 'auto' }"
            >
              <UIcon
                :name="
                  sidebarExpanded
                    ? 'i-heroicons-chevron-left'
                    : 'i-heroicons-chevron-right'
                "
                :style="{
                  display:
                    (!sidebarExpanded && buttonLeft >= 53) ||
                    (sidebarExpanded && buttonLeft >= 277)
                      ? 'block'
                      : 'none',
                }"
                class="w-4 h-4"
              />
            </UButton>
          </div>
        </div>

        <!-- Categories List -->
        <div class="overflow-y-auto h-full custom-scrollbar">
          <div
            :class="[
              'p-1 ',
              sidebarExpanded
                ? 'space-y-2'
                : 'space-y-2 flex flex-col items-center',
            ]"
          >
            <!-- Pogrupowane kategorie -->
            <div
              v-for="group in categoryGroupsUI"
              :key="group.key"
              class="space-y-1 w-full"
            >
              <!-- Nagłówek grupy -->
              <div
                v-if="sidebarExpanded"
                class="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                {{ group.title }}
              </div>
              <div
                v-else-if="group.key !== `basics`"
                class="px-2 border-b border-gray-700 w-3/4 mx-auto"
              ></div>
              <div v-else class="none"></div>

              <!-- Kategorie w grupie -->
              <button
                v-for="category in group.items"
                :key="category"
                @click="category && (currentStep = getIndexByLabel(category))"
                :class="[
                  'group w-full flex items-center p-2 rounded-xl transition-all',
                  category && currentStep === getIndexByLabel(category)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300',
                ]"
              >
                <div
                  :class="[
                    'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center relative',
                    category && currentStep === getIndexByLabel(category)
                      ? 'bg-primary-500 text-white group-hover:text-primary-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:text-primary-600',
                  ]"
                >
                  <UIcon
                    :name="getCategoryIcon(category ?? '') || 'i-heroicons-tag'"
                    class="w-7 h-7"
                  />
                  <div
                    v-if="
                      category &&
                      selectedTags[category]?.length &&
                      !sidebarExpanded
                    "
                    class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center border-3 border-gray-800"
                  >
                    {{ selectedTags[category].length }}
                  </div>
                </div>
                <div v-if="sidebarExpanded" class="flex-1 text-left">
                  <p
                    class="text-sm font-semibold group-hover:text-primary-600 ml-2"
                  >
                    {{ getCategoryNameByLabel(category || "") }}
                  </p>
                </div>
                <div
                  v-if="
                    category &&
                    selectedTags[category]?.length &&
                    sidebarExpanded
                  "
                  class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold"
                >
                  {{ selectedTags[category].length }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-hidden flex flex-col h-screen">
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="container p-6 mx-auto">
            <!-- Header -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h1
                    class="text-3xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"
                  >
                    {{ getCategoryNameByLabel(currentCategory || "") }}
                  </h1>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t("prompt_creator.step") }} {{ currentStep + 1 }} /
                    {{ totalSteps }}
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <!-- Stats -->
                  <div
                    class="bg-white dark:bg-gray-800 rounded-xs border border-gray-200 dark:border-gray-700 px-4 py-1 flex items-center gap-2"
                  >
                    <div
                      class="text-xl font-bold text-primary-600 dark:text-primary-400"
                    >
                      {{ Math.round(((currentStep + 1) / totalSteps) * 100) }}%
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ $t("prompt_creator.completed") }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div
                class="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              >
                <div
                  class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                  :style="{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }"
                >
                  <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div
              class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-170px)]"
            >
              <!-- Tags Selection -->
              <div
                class="lg:col-span-2 flex flex-col space-y-4 overflow-hidden"
              >
                <!-- Search & Filters -->
                <div
                  class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 flex-shrink-0"
                >
                  <div class="flex gap-3">
                    <UInput
                      v-model="categorySearch"
                      :placeholder="$t('prompt_creator.search_placeholder')"
                      icon="i-heroicons-magnifying-glass"
                      size="md"
                      class="flex-1"
                    />
                    <UButton
                      :color="showOnlyFavorites ? 'primary' : 'neutral'"
                      :variant="showOnlyFavorites ? 'solid' : 'outline'"
                      size="md"
                      @click="showOnlyFavorites = !showOnlyFavorites"
                    >
                      <UIcon name="i-heroicons-star-solid" class="mr-2" />
                      {{ $t("prompt_creator.favorites") }}
                    </UButton>
                    <UButton
                      color="primary"
                      variant="outline"
                      size="md"
                      @click="randomizeCategory"
                    >
                      <UIcon name="i-heroicons-arrows-right-left" class="p-1" />
                      {{ $t("prompt_creator.randomize") }}
                    </UButton>
                  </div>
                  <div class="mt-2 flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">
                      {{ filteredTagsForCategory.length }}
                      {{ $t("prompt_creator.results") }}
                    </span>
                    <button
                      v-if="selectedTagsForCurrentCategory.length > 0"
                      @click="clearCurrentCategory"
                      class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      {{ $t("common.clear") }} ({{
                        selectedTagsForCurrentCategory.length
                      }})
                    </button>
                  </div>
                </div>

                <!-- Selected Tags -->
                <div
                  v-if="selectedTagsForCurrentCategory.length > 0"
                  class="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border border-primary-200 dark:border-primary-800 p-3 flex-shrink-0"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-heroicons-check-circle"
                      class="w-4 h-4 text-primary-500"
                    />
                    <span
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {{ selectedTagsForCurrentCategory.length }}
                      {{ $t("prompt_creator.selected") }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="tagObj in selectedTagsForCurrentCategory"
                      :key="getTagText(tagObj)"
                      class="relative group"
                    >
                      <button
                        @click="toggleTag(tagObj)"
                        :class="tagClasses(tagObj)"
                      >
                        {{ getTagText(tagObj) }}
                        <span
                          v-if="tagObj.weight && tagObj.weight !== 1.0"
                          class="ml-1 text-xs opacity-70"
                        >
                          :{{ tagObj.weight.toFixed(1) }}
                        </span>
                        <span
                          v-if="tagObj.emphasis && tagObj.emphasis > 0"
                          class="ml-1 text-xs opacity-70"
                        >
                          {{ "(".repeat(tagObj.emphasis) }}
                        </span>
                      </button>

                      <!-- Popup controls -->
                      <div
                        class="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                      >
                        <div class="space-y-3 min-w-[220px]">
                          <!-- Weight slider -->
                          <div>
                            <div class="flex items-center justify-between mb-2">
                              <label
                                class="text-xs font-medium text-gray-700 dark:text-gray-300"
                              >
                                {{ $t("prompt_creator.weight") }}
                              </label>
                              <span
                                class="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded"
                              >
                                {{ (tagObj.weight || 1.0).toFixed(1) }}
                              </span>
                            </div>
                            <USlider
                              :model-value="tagObj.weight || 1.0"
                              @update:model-value="
                                (value) => updateWeight(tagObj, value as number)
                              "
                              :min="0"
                              :max="3"
                              :step="0.1"
                              color="primary"
                              size="md"
                            />
                            <div
                              class="flex justify-between text-xs text-gray-500 mt-1"
                            >
                              <span>0.0</span>
                              <span>1.5</span>
                              <span>3.0</span>
                            </div>
                          </div>

                          <!-- Emphasis buttons -->
                          <div>
                            <label
                              class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2"
                            >
                              {{ $t("prompt_creator.emphasis") }}
                            </label>
                            <div class="grid grid-cols-4 gap-1">
                              <button
                                v-for="n in [0, 1, 2, 3]"
                                :key="n"
                                @click.stop="updateEmphasis(tagObj, n)"
                                :class="[
                                  'px-2 py-1.5 text-xs rounded-lg font-medium transition-all',
                                  (tagObj.emphasis || 0) === n
                                    ? 'bg-primary-500 text-white shadow-md scale-105'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                                ]"
                              >
                                {{ n === 0 ? "None" : "(".repeat(n) }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tags Grid -->
                <div
                  class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 overflow-hidden"
                >
                  <div
                    v-if="filteredTagsForCategory.length > 0"
                    class="flex flex-wrap justify-start items-start gap-2 h-full overflow-y-auto pr-2 custom-scrollbar"
                  >
                    <button
                      v-for="tagObj in filteredTagsForCategory"
                      :key="getTagText(tagObj)"
                      @click="toggleTag(tagObj)"
                      :class="[
                        'group relative px-2 py-2 rounded-lg text-xs font-medium transition-all text-left h-fit',
                        'hover:scale-105',
                        tagObj.nsfw
                          ? ' bg-red-500/40'
                          : isTagSelected(tagObj)
                            ? tagObj.nsfw
                              ? 'bg-red-500 text-white shadow-md'
                              : 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                      ]"
                    >
                      <div class="flex items-center justify-between gap-1">
                        <span class="truncate flex-1">{{
                          getTagText(tagObj)
                        }}</span>
                        <button
                          @click.stop="toggleFavorite(tagObj)"
                          :class="[
                            'flex-shrink-0 p-0.5 rounded transition-all',
                            isFavorite(tagObj)
                              ? 'text-yellow-400'
                              : isTagSelected(tagObj)
                                ? 'text-white/50 hover:text-white'
                                : 'text-gray-400 hover:text-yellow-400',
                          ]"
                        >
                          <UIcon
                            :name="
                              isFavorite(tagObj)
                                ? 'i-heroicons-star-solid'
                                : 'i-heroicons-star'
                            "
                            class="w-3 h-3"
                          />
                        </button>
                      </div>
                    </button>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="flex items-center justify-center h-full">
                    <div class="text-center">
                      <div
                        class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                      >
                        <UIcon
                          name="i-heroicons-magnifying-glass"
                          class="w-8 h-8 text-gray-400"
                        />
                      </div>
                      <p
                        class="text-gray-600 dark:text-gray-400 font-medium text-sm"
                      >
                        {{ $t("prompt_creator.no_results") }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Navigation -->
                <div
                  class="flex justify-between items-center gap-3 flex-shrink-0"
                >
                  <UButton
                    size="lg"
                    color="neutral"
                    variant="outline"
                    :disabled="currentStep === 0"
                    @click="previousStep"
                    class="flex-1"
                  >
                    <UIcon name="i-heroicons-arrow-left" class="mr-2" />
                    {{ $t("common.previous") }}
                  </UButton>

                  <UButton
                    size="lg"
                    color="neutral"
                    variant="soft"
                    @click="skipCategory"
                    class="w-1/5 flex justify-center"
                  >
                    {{ $t("common.skip") }}
                  </UButton>

                  <UButton
                    size="lg"
                    color="primary"
                    @click="nextStep"
                    class="flex-1 shadow-lg shadow-primary-500/30 justify-end"
                  >
                    {{
                      currentStep === totalSteps - 1
                        ? $t("common.finish")
                        : $t("common.next")
                    }}
                    <UIcon name="i-heroicons-arrow-right" class="ml-2" />
                  </UButton>
                </div>
              </div>

              <!-- Sidebar - Summary -->
              <div
                class="lg:col-span-1 flex flex-col space-y-4 overflow-hidden"
              >
                <!-- Card Settings-->
                <div
                  class="flex items-center rounded-xl p-2 gap-2 flex-shrink-0 border-1 border-gray-700"
                >
                  <USwitch
                    v-model="showNsfw"
                    color="error"
                    size="xl"
                    :checked-icon="'i-heroicons-eye'"
                    :unchecked-icon="'i-heroicons-eye-slash'"
                  />
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    @click="showAddTagModal = true"
                    icon="i-heroicons-plus"
                  >
                    {{ $t("prompt_creator.add_custom_tag") }}
                  </UButton>
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    @click="showNegativeTemplatesModal = true"
                    icon="i-heroicons-exclamation-triangle"
                  >
                    {{ $t("prompt_creator.negative_templates") }}
                  </UButton>
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    @click="sharePrompt"
                    icon="i-heroicons-share"
                  >
                    Udostępnij
                  </UButton>
                </div>

                <!-- Selected Summary -->
                <div
                  class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex-1 overflow-hidden flex flex-col"
                >
                  <div
                    class="bg-gray-50 flex justify-between dark:bg-gray-900/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
                  >
                    <h3 class="font-bold text-gray-900 dark:text-white text-sm">
                      {{ $t("prompt_creator.selected_tags") }}
                    </h3>
                    <div class="flex gap-2">
                      <div class="flex justify-center items-center gap-1">
                        <span class="text-sm opacity-90"
                          >{{
                            $t("prompt_creator.categories_name").slice(0, 1)
                          }}:
                        </span>
                        <span class="text-sm font-bold">{{
                          Object.keys(selectedTags).length
                        }}</span>
                      </div>
                      <div class="flex justify-center items-center gap-1">
                        <span class="text-sm opacity-90"
                          >{{ $t("prompt_creator.total_tags") }}:
                        </span>
                        <span class="text-sm font-bold">{{
                          totalSelectedTags
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="p-3 overflow-y-auto flex-1 custom-scrollbar">
                    <div
                      v-if="Object.keys(selectedTags).length > 0"
                      class="space-y-2"
                    >
                      <div
                        v-for="(tagObjs, category) in selectedTags"
                        :key="category"
                      >
                        <div
                          class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1"
                        >
                          {{ getCategoryNameByLabel(category) }} ({{
                            tagObjs.length
                          }})
                        </div>
                        <div class="flex flex-wrap gap-1">
                          <button
                            v-for="tagObj in tagObjs"
                            :key="getTagText(tagObj)"
                            @click="removeTagFromSummary(category, tagObj)"
                            :class="[
                              'px-2 py-0.5 rounded text-xs font-medium transition-all hover:scale-105',
                              tagObj.nsfw
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700',
                            ]"
                          >
                            {{ getTagText(tagObj) }}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="flex items-center justify-center h-full">
                      <div class="text-center">
                        <UIcon
                          name="i-heroicons-inbox"
                          class="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600"
                        />
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ $t("prompt_creator.no_selections") }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Generated Prompts -->
                <div
                  class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex-shrink-0"
                >
                  <div
                    class="bg-green-50 dark:bg-green-900/20 px-4 py-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <h3
                      class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2"
                    >
                      <UIcon
                        name="i-heroicons-sparkles"
                        class="w-4 h-4 text-green-500"
                      />
                      {{ $t("prompt_creator.prompts") }}
                    </h3>
                  </div>
                  <div class="p-3 space-y-2">
                    <!-- Positive -->
                    <div v-if="generatedPrompt.positive">
                      <div class="flex items-center justify-between mb-1">
                        <span
                          class="text-xs font-bold text-green-600 dark:text-green-400"
                        >
                          {{ $t("prompt_creator.positive") }}
                        </span>
                        <button
                          @click="copyPrompt('positive')"
                          class="text-xs text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                        >
                          {{ copiedPositive ? "✓" : "📋" }}
                        </button>
                      </div>
                      <div
                        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2"
                      >
                        <p
                          class="text-xs font-mono text-gray-700 dark:text-gray-300 line-clamp-2"
                        >
                          {{ generatedPrompt.positive }}
                        </p>
                      </div>
                    </div>

                    <!-- Negative -->
                    <div v-if="generatedPrompt.negative">
                      <div class="flex items-center justify-between mb-1">
                        <span
                          class="text-xs font-bold text-red-600 dark:text-red-400"
                        >
                          {{ $t("prompt_creator.negative") }}
                        </span>
                        <button
                          @click="copyPrompt('negative')"
                          class="text-xs text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          {{ copiedNegative ? "✓" : "📋" }}
                        </button>
                      </div>
                      <div
                        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2"
                      >
                        <p
                          class="text-xs font-mono text-gray-700 dark:text-gray-300 line-clamp-2"
                        >
                          {{ generatedPrompt.negative }}
                        </p>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="pt-2 space-y-2">
                      <UButton
                        color="success"
                        size="md"
                        block
                        @click="savePrompt"
                      >
                        <UIcon name="i-heroicons-bookmark-solid" class="mr-2" />
                        {{ $t("common.save") }}
                      </UButton>
                      <UButton
                        color="primary"
                        size="md"
                        block
                        @click="usePrompt"
                      >
                        <UIcon name="i-heroicons-play-solid" class="mr-2" />
                        {{ $t("common.use") }}
                      </UButton>
                      <UButton
                        color="neutral"
                        variant="outline"
                        size="sm"
                        block
                        @click="clearAll"
                      >
                        <UIcon name="i-heroicons-trash" class="mr-2" />
                        {{ $t("common.clear_all") }}
                      </UButton>
                      <div class="flex gap-2">
                        <UButton
                          color="neutral"
                          variant="outline"
                          size="sm"
                          @click="undo"
                          :disabled="!canUndo"
                          icon="i-heroicons-arrow-uturn-left"
                        >
                          Cofnij
                        </UButton>
                        <UButton
                          color="neutral"
                          variant="outline"
                          size="sm"
                          @click="redo"
                          :disabled="!canRedo"
                          icon="i-heroicons-arrow-uturn-right"
                        >
                          Ponów
                        </UButton>
                        <UButton
                          color="neutral"
                          variant="outline"
                          size="sm"
                          @click="saveSnapshot"
                          icon="i-heroicons-clock"
                        >
                          Zapisz wersję
                        </UButton>
                        <UButton
                          color="neutral"
                          variant="outline"
                          size="sm"
                          @click="showHistoryModal = true"
                          icon="i-heroicons-queue-list"
                        >
                          Historia
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- SVG for Gooey Effect -->
    <svg class="hidden">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>

    <!-- Save Modal -->
    <SavePromptModal
      v-model:open="showSaveModal"
      :positive-prompt="generatedPrompt.positive"
      :negative-prompt="generatedPrompt.negative"
      :tags="allSelectedTagsList"
      @save="handleSavePrompt"
    />

    <!-- Add Custom Tag Modal -->
    <UModal
      v-model:open="showAddTagModal"
      :title="$t('prompt_creator.add_custom_tag')"
    >
      <template #description>{{
        $t("prompt_creator.add_custom_tag_description")
      }}</template>
      <template #body>
        <form @submit.prevent="addCustomTag" class="space-y-4 p-4">
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("prompt_creator.tag_name") }} (PL)
            </label>
            <UInput v-model="customTag.pl" size="lg" />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("prompt_creator.tag_name") }} (EN)
            </label>
            <UInput v-model="customTag.en" size="lg" />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("prompt_creator.negative_prompt") }} (PL)
            </label>
            <UInput v-model="customTag.neg_pl" size="lg" />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("prompt_creator.negative_prompt") }} (EN)
            </label>
            <UInput v-model="customTag.neg_en" size="lg" />
          </div>
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="customTag.nsfw"
              id="nsfw-check"
              class="rounded"
            />
            <label
              for="nsfw-check"
              class="text-sm text-gray-700 dark:text-gray-300"
            >
              NSFW
            </label>
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t">
            <UButton
              color="neutral"
              variant="outline"
              @click="showAddTagModal = false"
            >
              {{ $t("pages.common.cancel") }}
            </UButton>
            <UButton type="submit" color="primary">
              {{ $t("pages.common.add") }}
            </UButton>
          </div>
        </form>
      </template>
    </UModal>
    <!-- Negative Templates Modal -->
    <UModal
      v-model:open="showNegativeTemplatesModal"
      :title="$t('prompt_creator.negative_templates')"
    >
      <template #description>{{
        $t("prompt_creator.negative_templates_description")
      }}</template>
      <template #body>
        <div class="space-y-4">
          <div
            v-for="group in negativeTemplateGroups"
            :key="group.label"
            class="space-y-2"
          >
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ group.label }}
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <UButton
                v-for="template in group.templates"
                :key="template.label"
                color="neutral"
                variant="outline"
                size="xs"
                @click="addNegativeTemplate(template.text)"
                class="text-xs"
                :class="{
                  'bg-primary-500 text-white border-primary-600':
                    activeNegativeTemplates.includes(template.text),
                  'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200':
                    !activeNegativeTemplates.includes(template.text),
                }"
              >
                {{ template.label }}
                <span
                  v-if="activeNegativeTemplates.includes(template.text)"
                  class="ml-1"
                  >✓</span
                >
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
    <!-- Modal historii -->
    <UModal
      v-model:open="showHistoryModal"
      :title="$t('prompt_creator.history_title')"
    >
      <template #description>{{
        $t("prompt_creator.history_description")
      }}</template>
      <template #body>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(snapshot, index) in snapshots"
            :key="index"
            class="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            @click="restoreSnapshot(snapshot)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">{{ snapshot.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ new Date(snapshot.createdAt).toLocaleString() }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ snapshot.tagsCount }} tagów, krok {{ snapshot.step + 1 }}
                </p>
              </div>
              <UButton
                color="error"
                variant="ghost"
                size="xs"
                @click.stop="deleteSnapshot(index)"
                icon="i-heroicons-trash"
              />
            </div>
          </div>
          <div v-if="snapshots.length === 0" class="text-center py-8">
            <UIcon
              name="i-heroicons-clock"
              class="w-12 h-12 mx-auto mb-2 text-gray-300"
            />
            <p class="text-gray-500">{{ $t("prompt_creator.no_history") }}</p>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Modal alertu -->
    <UModal v-model:open="showAlertModal" :title="$t('common.error')">
      <template #description>{{
        $t("pages.common.error_description")
      }}</template>
      <template #body>
        <p>{{ alertMessage }}</p>
      </template>
      <template #footer>
        <UButton @click="showAlertModal = false">{{
          $t("common.save")
        }}</UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// Extend Window type for custom properties
declare global {
  interface Window {
    mouseX?: number;
    mouseY?: number;
  }
}
interface TagObject {
  pl: string;
  en: string;
  neg_pl: string;
  neg_en: string;
  category: string;
  nsfw: boolean;
  custom?: boolean;
  weight?: number; // 0.0 - 3.0
  emphasis?: number; // 0-3 (nawiasy)
}
const toast = useToast();
const showNegativeTemplatesModal = ref(false);
const showAlertModal = ref(false);
const alertMessage = ref("");
const activeNegativeTemplates = ref<string[]>([]);
const addNegativeTemplate = (text: string) => {
  // Rozbij szablon na frazy (np. "blurry, low quality, ugly" → ["blurry", "low quality", "ugly"])
  const templateParts = text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (activeNegativeTemplates.value.includes(text)) {
    // Usuń z aktywnych
    activeNegativeTemplates.value = activeNegativeTemplates.value.filter(
      (t) => t !== text
    );

    // Usuń WSZYSTKIE frazy szablonu z additionalNegative
    const currentParts = (additionalNegative.value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !templateParts.includes(s));
    additionalNegative.value = currentParts.join(", ");
  } else {
    // Dodaj do aktywnych
    activeNegativeTemplates.value.push(text);

    // Dodaj frazy szablonu do additionalNegative (unikaj duplikatów)
    const currentParts = (additionalNegative.value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Dodaj tylko te, których jeszcze nie ma
    templateParts.forEach((part) => {
      if (!currentParts.includes(part)) {
        currentParts.push(part);
      }
    });
    additionalNegative.value = currentParts.join(", ");
  }
};
import SavePromptModal from "~/components/editor/SavePromptModal.vue";

definePageMeta({
  layout: "dashboard",
});

const { t, locale } = useI18n();
const router = useRouter();

// Preloaded content
const { tags, isLoaded: isContentLoaded } = usePreloadedContent();
let autoSaveInterval: NodeJS.Timeout | null = null;
// Mapowanie: klucz i18n -> obecna etykieta kategorii (z content/tagów)
const categoryKeyMap: Record<string, string> = {
  subject: "Subject",
  art_style: "Art Style",
  medium: "Medium",
  quality: "Quality",
  characters: "Characters",
  character_traits: "Character Traits",
  facial_features: "Facial Features",
  eyes: "Eyes",
  hair: "Hair",
  body_features: "Body Features",
  breasts: "Breasts",
  genitals: "Genitals",
  anatomy_details: "Anatomy Details",
  hand_details: "Hand Details",
  expression_pose: "Expression/Pose",
  posture: "Posture",
  clothing: "Clothing",
  accessories: "Accessories",
  setting: "Setting",
  environment_details: "Environment Details",
  background_elements: "Background Elements",
  time_of_day: "Time of Day",
  weather: "Weather",
  lighting_effects: "Lighting/Effects",
  themes_moods: "Themes/Moods",
  color_palettes: "Color Palettes",
  camera_angles: "Camera Angles",
  perspectives: "Perspectives",
  camera_settings: "Camera Settings",
  lens_type: "Lens Type",
  composition_rules: "Composition Rules",
  motion_effects: "Motion Effects",
  rendering_engine: "Rendering Engine",
  post_processing: "Post Processing",
  texture_materials: "Texture Materials",
  technology_objects: "Technology/Objects",
  other: "Other",
};

// Odwrotna mapa: etykieta -> klucz i18n (do tłumaczenia UI)
const labelToKey: Record<string, string> = Object.entries(
  categoryKeyMap
).reduce(
  (acc, [key, label]) => {
    acc[label] = key;
    return acc;
  },
  {} as Record<string, string>
);

// Kolejność logiczna kategorii (klucze i18n)
const categoryOrderKeys: string[] = [
  // 🎯 Podstawy
  "subject",
  "quality",

  // 👤 Postać
  "characters",
  "character_traits",
  "facial_features",
  "eyes",
  "hair",
  "body_features",
  "breasts",
  "genitals",
  "anatomy_details",
  "hand_details",

  // 💃 Poza
  "expression_pose",
  "posture",

  // 👗 Ubranie
  "clothing",
  "accessories",

  // 🎨 Styl
  "art_style",
  "medium",

  // 📷 Kamera
  "camera_angles",
  "perspectives",
  "camera_settings",
  "lens_type",
  "composition_rules",
  "motion_effects",

  // 🌍 Środowisko
  "setting",
  "environment_details",
  "background_elements",
  "time_of_day",
  "weather",

  // ✨ Atmosfera
  "lighting_effects",
  "themes_moods",
  "color_palettes",

  // ⚙️ Techniczne
  "rendering_engine",
  "post_processing",
  "texture_materials",
  "technology_objects",

  // 📦 Inne
  "other",
];

// HELPERY UI: tłumaczenie nazwy kategorii po etykiecie
const getI18nKeyFromLabel = (label: string) => labelToKey[label] || null;
const getCategoryNameByLabel = (label: string) => {
  const key = getI18nKeyFromLabel(label);
  return key ? t(`prompt_creator.categories.${key}`) : label;
};

// Category Icons Map
const categoryIcons: Record<string, string> = {
  Subject: "i-heroicons-user",
  "Art Style": "i-heroicons-paint-brush",
  Medium: "i-heroicons-photo",
  Quality: "i-heroicons-star",
  Characters: "i-heroicons-users",
  "Character Traits": "i-heroicons-identification",
  "Facial Features": "i-heroicons-face-smile",
  Eyes: "i-heroicons-eye",
  Hair: "i-heroicons-scissors",
  "Body Features": "i-heroicons-user-circle",
  Breasts: "i-heroicons-heart",
  Genitals: "i-heroicons-shield-exclamation",
  "Anatomy Details": "i-heroicons-finger-print",
  "Hand Details": "i-heroicons-hand-raised",
  "Expression/Pose": "i-heroicons-face-smile",
  Posture: "i-heroicons-arrow-trending-up",
  Clothing: "i-heroicons-shopping-bag",
  Accessories: "i-heroicons-sparkles",
  Setting: "i-heroicons-map-pin",
  "Environment Details": "i-heroicons-building-office",
  "Background Elements": "i-heroicons-square-3-stack-3d",
  "Time of Day": "i-heroicons-clock",
  Weather: "i-heroicons-cloud",
  "Lighting/Effects": "i-heroicons-light-bulb",
  "Themes/Moods": "i-heroicons-face-frown",
  "Color Palettes": "i-heroicons-swatch",
  "Camera Angles": "i-heroicons-camera",
  Perspectives: "i-heroicons-cube",
  "Camera Settings": "i-heroicons-cog-6-tooth",
  "Lens Type": "i-heroicons-magnifying-glass-circle",
  "Composition Rules": "i-heroicons-squares-2x2",
  "Motion Effects": "i-heroicons-arrow-path",
  "Rendering Engine": "i-heroicons-cpu-chip",
  "Post Processing": "i-heroicons-adjustments-horizontal",
  "Texture Materials": "i-heroicons-cube-transparent",
  "Technology/Objects": "i-heroicons-rocket-launch",
  Other: "i-heroicons-ellipsis-horizontal-circle",
};

const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || "i-heroicons-tag";
};

// Wszystkie kategorie
const categories = categoryOrderKeys
  .map((key) => categoryKeyMap[key])
  .filter((label) => !!label && !!categoryIcons[label as string]);

// Definicja grup (klucze i18n zgodne z categoryOrderKeys)
const categoryGroupsDef = [
  { key: "basics", items: ["subject", "quality"] },
  {
    key: "character",
    items: [
      "characters",
      "character_traits",
      "facial_features",
      "eyes",
      "hair",
      "body_features",
      "breasts",
      "genitals",
      "anatomy_details",
      "hand_details",
    ],
  },
  { key: "pose", items: ["expression_pose", "posture"] },
  { key: "clothing", items: ["clothing", "accessories"] },
  { key: "style", items: ["art_style", "medium"] },
  {
    key: "camera",
    items: [
      "camera_angles",
      "perspectives",
      "camera_settings",
      "lens_type",
      "composition_rules",
      "motion_effects",
    ],
  },
  {
    key: "environment",
    items: [
      "setting",
      "environment_details",
      "background_elements",
      "time_of_day",
      "weather",
    ],
  },
  {
    key: "atmosphere",
    items: ["lighting_effects", "themes_moods", "color_palettes"],
  },
  {
    key: "technical",
    items: [
      "rendering_engine",
      "post_processing",
      "texture_materials",
      "technology_objects",
    ],
  },
  { key: "other", items: ["other"] },
];

// UI: grupy zamienione na etykiety (logika nadal używa categories = flat labels)
const categoryGroupsUI = computed(() =>
  categoryGroupsDef.map((g) => ({
    key: g.key,
    title: t(`prompt_creator.groups.${g.key}`),
    // items jako LABELS (np. "Subject"), zgodne z selectedTags i resztą logiki
    items: g.items.map((k) => categoryKeyMap[k]).filter((label) => !!label),
  }))
);

// Globalny indeks na podstawie etykiety
const getIndexByLabel = (label: string) => categories.indexOf(label);

// State
const currentStep = ref(0);
const categorySearch = ref("");
const selectedTags = ref<Record<string, TagObject[]>>({});
const showSaveModal = ref(false);
const showAddTagModal = ref(false);
const copiedPositive = ref(false);
const copiedNegative = ref(false);
const sidebarExpanded = ref(false);
const showOnlyFavorites = ref(false);
const favorites = ref<Set<string>>(new Set());
const customTags = ref<TagObject[]>([]);
const showNsfw = ref(false);
const additionalNegative = ref("");

const customTag = ref({
  pl: "",
  en: "",
  neg_pl: "",
  neg_en: "",
  nsfw: false,
});

// Negative templates grouped
const negativeTemplateGroups = [
  {
    label: "Common Issues",
    templates: [
      { label: "Blurry", text: "blurry, low quality, deformed, ugly" },
      { label: "Anatomy", text: "extra limbs, malformed hands, bad anatomy" },
      { label: "Artifacts", text: "artifacts, watermark, signature, text" },
    ],
  },
  {
    label: "Art Style",
    templates: [
      { label: "Realistic", text: "cartoon, anime, illustration, painting" },
      { label: "Anime", text: "realistic, photograph, 3d render" },
      { label: "Painting", text: "photograph, realistic, 3d render" },
    ],
  },
  {
    label: "Composition",
    templates: [
      { label: "Centered", text: "asymmetric, off-center, cropped" },
      { label: "Multiple", text: "solo, single subject" },
      { label: "Background", text: "busy background, cluttered" },
    ],
  },
];

// Load favorites and custom tags from localStorage
onMounted(() => {
  const savedFavorites = localStorage.getItem("tag_favorites");
  if (savedFavorites) {
    favorites.value = new Set(JSON.parse(savedFavorites));
  }

  const savedCustomTags = localStorage.getItem("custom_tags");
  if (savedCustomTags) {
    customTags.value = JSON.parse(savedCustomTags);
  }
});

// Computed
const totalSteps = computed(() => categories.length);
const currentCategory = computed(() => categories[currentStep.value]);

// Helper functions
const getTagText = (tagObj: TagObject): string => {
  return locale.value === "pl" ? tagObj.pl : tagObj.en;
};

const getNegativeTagText = (tagObj: TagObject): string => {
  return locale.value === "pl" ? tagObj.neg_pl : tagObj.neg_en;
};

const getTagId = (tagObj: TagObject): string => {
  return `${tagObj.category}_${tagObj.pl}_${tagObj.en}`;
};

const isFavorite = (tagObj: TagObject): boolean => {
  return favorites.value.has(getTagId(tagObj));
};

const toggleFavorite = (tagObj: TagObject) => {
  const id = getTagId(tagObj);
  if (favorites.value.has(id)) {
    favorites.value.delete(id);
  } else {
    favorites.value.add(id);
  }
  localStorage.setItem("tag_favorites", JSON.stringify([...favorites.value]));
};

// Extract all tags
const allTagsFlatCache = ref<TagObject[]>([]);
let allTagsFlatCacheKey = "";

const allTagsFlat = computed(() => {
  if (!tags.value) return [];

  const cacheKey = JSON.stringify(tags.value) + customTags.value.length;
  if (allTagsFlatCacheKey !== cacheKey) {
    const allTags: TagObject[] = [];

    const extractTags = (obj: any) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => {
          if (item && typeof item === "object") {
            if (item.category && (item.pl || item.en)) {
              allTags.push(item as TagObject);
            } else {
              extractTags(item);
            }
          }
        });
      } else if (obj && typeof obj === "object") {
        Object.values(obj).forEach((value) => extractTags(value));
      }
    };

    extractTags(tags.value);
    customTags.value.forEach((tag) => {
      allTags.push(tag);
    });

    allTagsFlatCache.value = allTags;
    allTagsFlatCacheKey = cacheKey;
  }

  return allTagsFlatCache.value;
});

// Tags for current category
const tagsForCurrentCategory = computed(() => {
  if (!currentCategory.value) return [];

  let categoryTags = allTagsFlat.value.filter(
    (tag) => tag.category === currentCategory.value
  );

  // Sort: favorites first, then alphabetically
  return categoryTags.sort((a, b) => {
    const aFav = isFavorite(a);
    const bFav = isFavorite(b);

    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;

    const textA = getTagText(a).toLowerCase();
    const textB = getTagText(b).toLowerCase();
    return textA.localeCompare(textB);
  });
});

// Filtered tags
const filteredTagsForCategory = shallowRef<TagObject[]>([]);

// Funkcja do aktualizacji filtrowanych tagów
const updateFilteredTags = () => {
  let tags = tagsForCurrentCategory.value;

  // Filter NSFW if toggle is off
  if (!showNsfw.value) {
    tags = tags.filter((tag) => !tag.nsfw);
  }

  if (showOnlyFavorites.value) {
    tags = tags.filter((tag) => isFavorite(tag));
  }

  const search = categorySearch.value.toLowerCase().trim();
  if (search) {
    tags = tags.filter((tagObj) => {
      const text = getTagText(tagObj).toLowerCase();
      return text.includes(search);
    });
  }

  filteredTagsForCategory.value = tags;
};

// Wywołaj przy zmianach
watch(
  [tagsForCurrentCategory, showNsfw, showOnlyFavorites, categorySearch],
  updateFilteredTags,
  { immediate: true }
);

const selectedTagsForCurrentCategory = computed(() => {
  const category = currentCategory.value;
  if (!category) return [];
  return selectedTags.value[category] || [];
});

const totalSelectedTags = computed(() => {
  return Object.values(selectedTags.value).reduce(
    (sum, tagObjs) => sum + tagObjs.length,
    0
  );
});

const allSelectedTagsList = computed(() => {
  const allTags: string[] = [];
  Object.values(selectedTags.value).forEach((tagObjs) => {
    tagObjs.forEach((tagObj) => {
      allTags.push(getTagText(tagObj));
    });
  });
  return allTags;
});

const generatedPrompt = computed(() => {
  if (Object.keys(selectedTags.value).length === 0) {
    return { positive: "", negative: "" };
  }

  const positiveParts: string[] = [];
  const negativeParts: string[] = [];

  categories.forEach((category) => {
    if (!category) return;
    const tagObjs = selectedTags.value[category];
    if (tagObjs && tagObjs.length > 0) {
      const positiveTexts = tagObjs.map((tagObj: TagObject) => {
        let text = getTagText(tagObj);

        // Add emphasis (parentheses)
        if (tagObj.emphasis && tagObj.emphasis > 0) {
          text =
            "(".repeat(tagObj.emphasis) + text + ")".repeat(tagObj.emphasis);
        }

        // Add weight
        if (tagObj.weight && tagObj.weight !== 1.0) {
          text = `(${text}:${tagObj.weight.toFixed(1)})`;
        }

        return text;
      });

      const negativeTexts = tagObjs
        .map((tagObj: TagObject) => {
          const negText = getNegativeTagText(tagObj);
          if (!negText) return "";

          let text = negText;

          // Add emphasis for negative too
          if (tagObj.emphasis && tagObj.emphasis > 0) {
            text =
              "(".repeat(tagObj.emphasis) + text + ")".repeat(tagObj.emphasis);
          }

          // Add weight for negative
          if (tagObj.weight && tagObj.weight !== 1.0) {
            text = `(${text}:${tagObj.weight.toFixed(1)})`;
          }

          return text;
        })
        .filter((t) => t);

      if (positiveTexts.length > 0) {
        positiveParts.push(positiveTexts.join(", "));
      }
      if (negativeTexts.length > 0) {
        negativeParts.push(negativeTexts.join(", "));
      }
    }
  });

  let negative = negativeParts.join(", ");
  if (additionalNegative.value) {
    negative = negative
      ? negative + ", " + additionalNegative.value
      : additionalNegative.value;
  }

  return {
    positive: positiveParts.join(", "),
    negative,
  };
});

// Actions
const isTagSelected = (tagObj: TagObject) => {
  return selectedTagsForCurrentCategory.value.some(
    (selected) => getTagId(selected) === getTagId(tagObj)
  );
};

// Optymalizacja: Debounce dla ciężkich funkcji
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Optymalizuj toggleTag z debounce
const toggleTagDebounced = debounce((tagObj: TagObject) => {
  const category = currentCategory.value;
  if (!category) return;
  if (!selectedTags.value[category]) {
    selectedTags.value[category] = [];
  }

  const index = selectedTags.value[category].findIndex(
    (selected) => getTagText(selected) === getTagText(tagObj)
  );

  if (index > -1) {
    selectedTags.value[category].splice(index, 1);
    if (selectedTags.value[category].length === 0) {
      delete selectedTags.value[category];
    }
  } else {
    // Initialize with default values
    const newTag = {
      ...tagObj,
      weight: 1.0,
      emphasis: 0,
    };
    selectedTags.value[category].push(newTag);
  }
  pushToHistory();
}, 100); // 100ms debounce

// Zastąp toggleTag
const toggleTag = (tagObj: TagObject) => {
  toggleTagDebounced(tagObj);
};

const removeTagFromSummary = (category: string, tagObj: TagObject) => {
  if (!selectedTags.value[category]) return;

  const index = selectedTags.value[category].findIndex(
    (selected) => getTagText(selected) === getTagText(tagObj)
  );

  if (index > -1) {
    selectedTags.value[category].splice(index, 1);
    if (selectedTags.value[category].length === 0) {
      delete selectedTags.value[category];
    }
  }
};

const addCustomTag = () => {
  if (!customTag.value.pl || !customTag.value.en) {
    alertMessage.value = t("prompt_creator.fill_required_fields");
    showAlertModal.value = true;
    return;
  }

  if (!currentCategory.value) {
    return;
  }

  const newTag: TagObject = {
    ...customTag.value,
    category: currentCategory.value,
    custom: true,
  };

  customTags.value.push(newTag);
  localStorage.setItem("custom_tags", JSON.stringify(customTags.value));

  customTag.value = { pl: "", en: "", neg_pl: "", neg_en: "", nsfw: false };
  showAddTagModal.value = false;
};

const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++;
    categorySearch.value = "";
  } else {
    if (generatedPrompt.value.positive) {
      showSaveModal.value = true;
    }
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    categorySearch.value = "";
  }
};

const skipCategory = () => {
  nextStep();
};

const clearCurrentCategory = () => {
  const category = currentCategory.value;
  if (category && selectedTags.value[category]) {
    delete selectedTags.value[category];
  }
  pushToHistory();
};

const clearAll = () => {
  if (confirm(t("prompt_creator.confirm_clear_all"))) {
    selectedTags.value = {};
    additionalNegative.value = "";
    currentStep.value = 0;
  }
  pushToHistory();
};

const copyPrompt = async (type: "positive" | "negative") => {
  const text =
    type === "positive"
      ? generatedPrompt.value.positive
      : generatedPrompt.value.negative;

  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    if (type === "positive") {
      copiedPositive.value = true;
      setTimeout(() => {
        copiedPositive.value = false;
      }, 2000);
    } else {
      copiedNegative.value = true;
      setTimeout(() => {
        copiedNegative.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};

const savePrompt = () => {
  showSaveModal.value = true;
};

const handleSavePrompt = (data: { name: string; description: string }) => {
  const customPrompt = {
    id: `custom_${Date.now()}`,
    name: data.name,
    description: data.description,
    positivePrompt: generatedPrompt.value.positive,
    negativePrompt: generatedPrompt.value.negative,
    tags: allSelectedTagsList.value,
    // Dodaj link do prompta (shared URL)
    link: generateSharedUrl({
      prompt: generatedPrompt.value,
      tags: selectedTags.value,
      step: currentStep.value,
      additionalNegative: additionalNegative.value,
    }),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const saved = localStorage.getItem("custom_prompts");
  const prompts = saved ? JSON.parse(saved) : [];
  prompts.unshift(customPrompt);
  localStorage.setItem("custom_prompts", JSON.stringify(prompts));

  showSaveModal.value = false;

  // Zastąp alert toastem
  toast.add({
    title: t("prompt_creator.saved_successfully"),
    color: "success",
  });
};

const usePrompt = () => {
  router.push({
    path: "/chat",
    query: {
      prompt: generatedPrompt.value.positive,
      negativePrompt: generatedPrompt.value.negative,
    },
  });
};
const randomizeCategory = () => {
  const category = currentCategory.value;
  if (!category) return;

  // Pobierz dostępne tagi (filtrowane, bez już wybranych)
  const availableTags = filteredTagsForCategory.value.filter(
    (tag) => !isTagSelected(tag)
  );
  if (availableTags.length === 0) return;

  // Wybierz losowo 1-3 tagi
  const numToSelect = Math.min(3, availableTags.length);
  const selectedIndices = new Set<number>();
  while (selectedIndices.size < numToSelect) {
    selectedIndices.add(Math.floor(Math.random() * availableTags.length));
  }

  // Dodaj wybrane tagi
  selectedIndices.forEach((index) => {
    const tag = availableTags[index];
    if (tag) {
      toggleTag(tag);
    }
  });
};
// Weight and Emphasis management
const updateWeight = (tagObj: TagObject, value: number | number[]) => {
  const category = currentCategory.value;
  if (!category || !selectedTags.value[category]) return;

  // Handle array (for multiple thumbs) or single value
  const weightValue = Array.isArray(value) ? value[0] : value;

  const index = selectedTags.value[category].findIndex(
    (selected) => getTagText(selected) === getTagText(tagObj)
  );

  if (index > -1 && selectedTags.value[category]?.[index]) {
    selectedTags.value[category][index].weight = weightValue;
  }
  pushToHistory();
};

const updateEmphasis = (tagObj: TagObject, emphasis: number) => {
  const category = currentCategory.value;
  if (!category || !selectedTags.value[category]) return;

  const index = selectedTags.value[category].findIndex(
    (selected) => getTagText(selected) === getTagText(tagObj)
  );

  if (index > -1 && selectedTags.value[category]?.[index]) {
    selectedTags.value[category][index].emphasis = emphasis;
  }
  pushToHistory();
};

// Update tagClasses computed
const tagClasses = computed(() => {
  return (tagObj: TagObject) => [
    "px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
    "border-2 hover:scale-105",
    tagObj.nsfw
      ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300"
      : "bg-white dark:bg-gray-800 border-primary-500 text-gray-900 dark:text-white",
  ];
});

// SEO
useHead({
  title: t("prompt_creator.page_title"),
  meta: [
    {
      name: "description",
      content: t("prompt_creator.page_description"),
    },
  ],
});

// Helper: generate shared URL for a given payload
const generateSharedUrl = (data: any) => {
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    return `${window.location.origin}/editor?shared=${encoded}`;
  } catch (e) {
    console.error("Error generating shared URL:", e);
    return "";
  }
};

// W funkcji sharePrompt
const sharePrompt = () => {
  const data = {
    prompt: generatedPrompt.value,
    tags: selectedTags.value,
    step: currentStep.value,
    additionalNegative: additionalNegative.value,
  };
  const url = generateSharedUrl(data);
  if (url) {
    navigator.clipboard.writeText(url);

    // Zastąp komentarz toastem
    toast.add({
      title: t("prompt_creator.link_copied"),
      color: "success",
    });
  } else {
    toast.add({
      title: t("common.error"),
      color: "error",
    });
  }
};

// Ładowanie z query
onMounted(() => {
  const query = new URLSearchParams(window.location.search);
  const shared = query.get("shared");

  if (shared) {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(shared))));

      console.log("📦 Załadowane dane z linku:", data);

      // KROK 1: Poczekaj na załadowanie tagów z usePreloadedContent
      const waitForTags = () => {
        if (!isContentLoaded.value || allTagsFlat.value.length === 0) {
          console.log("⏳ Oczekiwanie na załadowanie tagów...");
          setTimeout(waitForTags, 50); // Sprawdzaj co 50ms
          return;
        }

        console.log("✅ Tagi załadowane:", allTagsFlat.value.length);

        // KROK 2: Dodaj brakujące tagi do customTags
        const tagsToAdd: TagObject[] = [];

        Object.values(data.tags || {}).forEach((tagObjs) => {
          (tagObjs as TagObject[]).forEach((tagObj) => {
            const tagId = `${tagObj.category}_${tagObj.pl}_${tagObj.en}`;

            // Sprawdź czy tag istnieje w allTagsFlat
            const existsInFlat = allTagsFlat.value.some(
              (existing) =>
                `${existing.category}_${existing.pl}_${existing.en}` === tagId
            );

            // Sprawdź czy już jest w customTags
            const existsInCustom = customTags.value.some(
              (existing) =>
                `${existing.category}_${existing.pl}_${existing.en}` === tagId
            );

            // Dodaj tylko jeśli nie istnieje nigdzie
            if (!existsInFlat && !existsInCustom) {
              tagsToAdd.push({ ...tagObj, custom: true });
            }
          });
        });

        // Dodaj nowe tagi do customTags
        if (tagsToAdd.length > 0) {
          customTags.value.push(...tagsToAdd);
          localStorage.setItem("custom_tags", JSON.stringify(customTags.value));
          console.log("✅ Dodano nowe tagi do customTags:", tagsToAdd.length);
        }

        // KROK 3: Poczekaj na aktualizację allTagsFlat po dodaniu customTags
        nextTick(() => {
          console.log(
            "🔄 Po nextTick - allTagsFlat zawiera:",
            allTagsFlat.value.length,
            "tagów"
          );

          // KROK 4: Ustaw selectedTags z REFERENCJAMI do tagów z allTagsFlat
          const validatedTags: Record<string, TagObject[]> = {};

          Object.entries(data.tags || {}).forEach(([category, tagObjs]) => {
            if (!validatedTags[category]) {
              validatedTags[category] = [];
            }

            (tagObjs as TagObject[]).forEach((tagObj) => {
              // Znajdź tag w allTagsFlat
              const foundTag = allTagsFlat.value.find(
                (t) =>
                  t.category === tagObj.category &&
                  t.pl === tagObj.pl &&
                  t.en === tagObj.en
              );

              if (foundTag) {
                // Modyfikuj referencję (bez spread)
                foundTag.weight = tagObj.weight ?? 1.0;
                foundTag.emphasis = tagObj.emphasis ?? 0;
                if (!validatedTags[category]) {
                  validatedTags[category] = [];
                }
                validatedTags[category].push(foundTag);
              } else {
                console.warn("⚠️ Nie znaleziono tagu w allTagsFlat:", tagObj);
              }
            });

            // Usuń puste kategorie
            if (
              validatedTags[category] &&
              validatedTags[category].length === 0
            ) {
              delete validatedTags[category];
            }
          });

          console.log("✅ Załadowano selectedTags:", validatedTags);

          selectedTags.value = validatedTags;
          currentStep.value = data.step || 0;
          additionalNegative.value = data.additionalNegative || "";

          // Usuń query z URL
          router.replace({ path: "/editor" });
        });
      };

      // Uruchom oczekiwanie
      waitForTags();
    } catch (error) {
      console.error("❌ Błąd ładowania shared prompt:", error);
    }
    return; // Nie ładuj postępu jeśli jest shared link
  }

  // Przywracanie postępu (tylko jeśli NIE ma shared query)
  const savedProgress = localStorage.getItem("editor_progress");
  if (savedProgress) {
    try {
      const progress = JSON.parse(savedProgress);
      selectedTags.value = progress.tags || {};
      currentStep.value = progress.step || 0;
      additionalNegative.value = progress.additionalNegative || "";
    } catch (error) {
      console.error("Błąd ładowania postępu:", error);
    }
  }

  // Start auto-save
  autoSaveInterval = setInterval(() => {
    const progress = {
      tags: selectedTags.value,
      step: currentStep.value,
      additionalNegative: additionalNegative.value,
    };
    localStorage.setItem("editor_progress", JSON.stringify(progress));
  }, 30000);
});

onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});

const historyStack = ref<
  {
    tags: Record<string, TagObject[]>;
    step: number;
    additionalNegative: string;
  }[]
>([]);
const historyIndex = ref(-1);
const snapshots = ref<
  {
    name: string;
    tags: Record<string, TagObject[]>;
    step: number;
    additionalNegative: string;
    createdAt: number;
    tagsCount: number;
  }[]
>([]);
const showHistoryModal = ref(false);

// Załaduj snapshoty z localStorage
onMounted(() => {
  // ... istniejący kod ...
  const savedSnapshots = localStorage.getItem("prompt_snapshots");
  if (savedSnapshots) {
    snapshots.value = JSON.parse(savedSnapshots);
  }
});

// Funkcje undo/redo
const pushToHistory = () => {
  // Usuń przyszłe stany jeśli jesteśmy w środku historii
  historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);

  // Dodaj aktualny stan
  historyStack.value.push({
    tags: JSON.parse(JSON.stringify(selectedTags.value)), // Deep copy
    step: currentStep.value,
    additionalNegative: additionalNegative.value,
  });

  historyIndex.value = historyStack.value.length - 1;

  // Limit historii do 50 wpisów
  if (historyStack.value.length > 50) {
    historyStack.value.shift();
    historyIndex.value--;
  }
};

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(
  () => historyIndex.value < historyStack.value.length - 1
);

const undo = () => {
  if (!canUndo.value) return;
  historyIndex.value--;
  const state = historyStack.value[historyIndex.value];
  if (!state) return;
  selectedTags.value = JSON.parse(JSON.stringify(state.tags));
  currentStep.value = state.step;
  additionalNegative.value = state.additionalNegative;
};
const redo = () => {
  if (!canRedo.value) return;
  historyIndex.value++;
  const state = historyStack.value[historyIndex.value];
  if (!state) return;
  selectedTags.value = JSON.parse(JSON.stringify(state.tags));
  currentStep.value = state.step;
  additionalNegative.value = state.additionalNegative;
};

// W funkcji saveSnapshot
const saveSnapshot = () => {
  const name = prompt($t("prompt_creator.snapshot_name_prompt"));
  if (!name) return;

  const snapshot = {
    name,
    tags: JSON.parse(JSON.stringify(selectedTags.value)),
    step: currentStep.value,
    additionalNegative: additionalNegative.value,
    createdAt: Date.now(),
    tagsCount: totalSelectedTags.value,
  };

  snapshots.value.unshift(snapshot);
  localStorage.setItem("prompt_snapshots", JSON.stringify(snapshots.value));

  // Zastąp komentarz toastem
  toast.add({
    title: t("prompt_creator.snapshot_saved"),
    color: "success",
  });
};

const restoreSnapshot = (snapshot: any) => {
  selectedTags.value = JSON.parse(JSON.stringify(snapshot.tags));
  currentStep.value = snapshot.step;
  additionalNegative.value = snapshot.additionalNegative;
  showHistoryModal.value = false;
  pushToHistory(); // Dodaj do historii undo
};

const deleteSnapshot = (index: number) => {
  snapshots.value.splice(index, 1);
  localStorage.setItem("prompt_snapshots", JSON.stringify(snapshots.value));
};

// Inicjalizuj historię przy pierwszym ładowaniu
onMounted(() => {
  // ... istniejący kod ...
  pushToHistory(); // Dodaj początkowy stan
});

// Dragging functionality for toggle button
const toggleButtonRef = ref<HTMLElement | null>(null);
const buttonVisible = ref(false);
const buttonTop = ref(0);
const buttonLeft = ref(0);
const mouseY = ref(0);
const buttonOffset = ref(-30); // domyślny offset

const handleMouseMove = (e: MouseEvent) => {
  mouseY.value = e.clientY;
  const sidebarWidth = sidebarExpanded.value ? 288 : 64;
  const distance = e.clientX - sidebarWidth;

  // Konfiguracja dla lg i mobile
  const config = isLg.value
    ? {
        min: 0,
        max: 170,
        steps: [
          { to: 60, offset: -30 },
          { to: 70, offset: -10 },
          { to: 90, offset: 4 },
        ],
        smooth: { from: 100, to: 170, minOffset: 7, maxOffset: 80, extra: 12 },
      }
    : {
        min: -10,
        max: 120,
        steps: [
          { to: 0, offset: -10 },
          { to: 25, offset: 4 },
        ],
        smooth: { from: 25, to: 120, minOffset: 7, maxOffset: 80, extra: 25 },
      };

  if (distance >= config.min && distance < config.max) {
    buttonVisible.value = true;
    buttonTop.value = e.clientY;

    // Sprawdź progi
    let foundStep = false;
    for (const step of config.steps) {
      if (distance < step.to) {
        buttonOffset.value = step.offset;
        foundStep = true;
        break;
      }
    }

    // Jeśli nie znaleziono progu, płynny offset
    if (!foundStep) {
      const { from, to, minOffset, maxOffset, extra } = config.smooth;
      const percent = Math.min(Math.max((distance - from) / (to - from), 0), 1);
      buttonOffset.value =
        minOffset + percent * (maxOffset - minOffset) + (extra || 0);
    }

    buttonLeft.value = sidebarWidth + buttonOffset.value;
  } else {
    buttonVisible.value = false;
    buttonOffset.value = -30;
  }
};
watch(sidebarExpanded, () => {
  // Symuluj ruch myszki w ostatniej pozycji
  handleMouseMove({
    clientX: window.mouseX ?? 0,
    clientY: window.mouseY ?? 0,
  } as MouseEvent);
});
// Event listeners
onMounted(() => {
  window.addEventListener("mousemove", (e) => {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
    handleMouseMove(e);
  });
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});

const isLg = ref(false);

onMounted(() => {
  isLg.value = window.innerWidth >= 1024;
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  isLg.value = window.innerWidth >= 1024;
};

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 1px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom range slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--color-primary-600));
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--color-primary-600));
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}

/* Gooey Effect - uproszczone */
.gooey-sidebar {
  filter: url(#goo);
  z-index: 40;
  position: relative;
}

.gooey-container {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-out;
  z-index: -50;
}

.gooey-button {
  position: relative;
  background: rgb(9, 57, 134); /* primary-500 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease-out;
  color: white;
}

/* Gooey blob - tło */
.gooey-blob {
  position: absolute;
  background: #1e2939;
  border-radius: 50%;
  opacity: 1;
}

.blob-bg {
  width: 35px;
  height: 35px;
  left: -7px;
}
</style>
