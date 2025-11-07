<template>
  <div class="min-h-screen">
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar Component -->
      <EditorSidebar
        v-model:expanded="editorState.sidebarExpanded.value"
        :current-category="currentCategory || ''"
        :selected-tags="selectedTags"
        :category-groups="categoryGroupsUI"
        @select-category="handleCategorySelect"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-hidden flex flex-col h-screen">
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="container p-6 mx-auto">
            <!-- Header with Progress -->
            <EditorProgressBar
              :current-step="currentStep + 1"
              :total-steps="totalSteps"
              :category-name="getCategoryNameByLabel(currentCategory || '')"
              class="mb-3"
            >
              <template #stats>
                <EditorStatsCard
                  :current-step="currentStep + 1"
                  :total-steps="totalSteps"
                />
              </template>
            </EditorProgressBar>

            <div
              class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-170px)]"
            >
              <!-- Tags Selection -->
              <div
                class="lg:col-span-2 flex flex-col space-y-4 overflow-hidden"
              >
                <!-- Search & Filters Component -->
                <EditorSearchFilters
                  v-model:search="categorySearch"
                  v-model:show-favorites="showOnlyFavorites"
                  :results-count="filteredTagsForCategory.length"
                  :selected-count="selectedTagsForCurrentCategory.length"
                  @randomize="randomizeCategory"
                  @clear="clearCurrentCategory"
                />

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

                      <!-- Popup controls with Glass Effect -->
                      <div
                        class="absolute top-full mt-2 left-0 glass-card rounded-xl shadow-2xl ring-2 ring-primary-500/20 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-xl"
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
                                    ? 'bg-primary-500 text-white shadow-lg ring-2 ring-primary-400'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md',
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

                <!-- Tags Grid with Glass Effect -->
                <div class="glass-card p-5 overflow-hidden shadow-lg">
                  <div
                    v-if="filteredTagsForCategory.length > 0"
                    class="flex flex-wrap justify-start items-start gap-2.5 h-full overflow-y-auto pr-2 custom-scrollbar"
                  >
                    <button
                      v-for="tagObj in filteredTagsForCategory"
                      :key="getTagText(tagObj)"
                      @click="toggleTag(tagObj)"
                      :class="[
                        'group relative px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 text-left h-fit backdrop-blur-sm',
                        'hover:brightness-110 hover:shadow-xl',
                        tagObj.nsfw
                          ? ' bg-red-500/40 ring-2 ring-red-500/50'
                          : isTagSelected(tagObj)
                            ? tagObj.nsfw
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-500/50'
                              : 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-500/50'
                            : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70 ring-1 ring-gray-200/50 dark:ring-gray-700/50',
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
                  <GlassButton
                    size="lg"
                    color="neutral"
                    variant="outline"
                    :disabled="currentStep === 0"
                    @click="previousStep"
                    class="flex-1"
                    icon="i-heroicons-arrow-left"
                  >
                    <span v-once>{{ $t("common.previous") }}</span>
                  </GlassButton>

                  <GlassButton
                    size="lg"
                    color="neutral"
                    variant="soft"
                    @click="skipCategory"
                    class="w-1/5 flex justify-center"
                  >
                    <span v-once>{{ $t("common.skip") }}</span>
                  </GlassButton>

                  <GlassButton
                    size="lg"
                    color="primary"
                    @click="nextStep"
                    class="flex-1 shadow-lg shadow-primary-500/30 justify-end"
                    :icon="
                      currentStep === totalSteps - 1
                        ? undefined
                        : 'i-heroicons-arrow-right'
                    "
                    icon-position="right"
                  >
                    {{
                      currentStep === totalSteps - 1
                        ? $t("common.finish")
                        : $t("common.next")
                    }}
                  </GlassButton>
                </div>
              </div>

              <!-- Sidebar - Summary Component -->
              <EditorSelectedSummary
                :selected-tags="selectedTags"
                :positive-prompt="generatedPrompt.positive"
                :negative-prompt="generatedPrompt.negative"
                :show-nsfw="showNsfw"
                :copied-positive="copiedPositive"
                :copied-negative="copiedNegative"
                @update:show-nsfw="showNsfw = $event"
                @add-custom-tag="showAddTagModal = true"
                @show-negative-templates="showNegativeTemplatesModal = true"
                @clear-category="clearCategoryFromSummary"
                @remove-tag="removeTagFromSummary"
                @update-tag="updateTagFromSummary"
                @copy-prompt="copyPrompt"
                @save-prompt="savePrompt"
                @use-prompt="usePrompt"
                @clear-all="clearAll"
              />
            </div>
          </div>
        </div>
      </main>
    </div>

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
      :description="$t('prompt_creator.add_custom_tag_description')"
      :ui="{
        content: 'max-w-3xl',
        body: 'overflow-y-auto max-h-[calc(100vh-6rem)]',
      }"
    >
      <template #body>
        <form @submit.prevent="addCustomTag" class="space-y-6 p-6">
          <!-- Sekcja: Podstawowe informacje -->
          <div class="space-y-4">
            <div
              class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
            >
              <UIcon name="i-heroicons-tag" class="w-5 h-5 text-primary-500" />
              <span v-once>{{ $t("prompt_creator.tag_names") }}</span>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <!-- Nazwa PL -->
              <div class="space-y-2">
                <label
                  class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <UIcon name="i-heroicons-language" class="w-4 h-4" />
                  <span v-once>{{ $t("prompt_creator.tag_name") }}</span>
                  <GlassBadge color="primary" variant="soft" size="xs">
                    <span v-once>PL</span>
                  </GlassBadge>
                  <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="customTag.pl"
                  :placeholder="$t('prompt_creator.tag_name_placeholder_pl')"
                  size="lg"
                  leading-icon="i-heroicons-pencil"
                  class="w-full"
                  required
                />
                <p
                  v-if="!customTag.pl.trim()"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  <span v-once>{{
                    $t("prompt_creator.tag_name_hint_pl")
                  }}</span>
                </p>
              </div>

              <!-- Nazwa EN -->
              <div class="space-y-2">
                <label
                  class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <UIcon name="i-heroicons-language" class="w-4 h-4" />
                  <span v-once>{{ $t("prompt_creator.tag_name") }}</span>
                  <GlassBadge color="secondary" variant="soft" size="xs">
                    <span v-once>EN</span>
                  </GlassBadge>
                  <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="customTag.en"
                  :placeholder="$t('prompt_creator.tag_name_placeholder_en')"
                  size="lg"
                  leading-icon="i-heroicons-pencil"
                  class="w-full"
                  required
                />
                <p
                  v-if="!customTag.en.trim()"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  <span v-once>{{
                    $t("prompt_creator.tag_name_hint_en")
                  }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Sekcja: Negative Prompts (opcjonalne) -->
          <div class="space-y-4">
            <div
              class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
            >
              <UIcon
                name="i-heroicons-exclamation-circle"
                class="w-5 h-5 text-red-500"
              />
              <span v-once>{{
                $t("prompt_creator.negative_prompts_optional")
              }}</span>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <!-- Negative PL -->
              <div class="space-y-2">
                <label
                  class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                  <span v-once>{{ $t("prompt_creator.negative_prompt") }}</span>
                  <GlassBadge color="primary" variant="soft" size="xs">
                    <span v-once>PL</span>
                  </GlassBadge>
                </label>
                <UInput
                  v-model="customTag.neg_pl"
                  :placeholder="
                    $t('prompt_creator.negative_prompt_placeholder_pl')
                  "
                  size="lg"
                  leading-icon="i-heroicons-minus-circle"
                  class="w-full"
                />
              </div>

              <!-- Negative EN -->
              <div class="space-y-2">
                <label
                  class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                  <span v-once>{{ $t("prompt_creator.negative_prompt") }}</span>
                  <GlassBadge color="secondary" variant="soft" size="xs">
                    <span v-once>EN</span>
                  </GlassBadge>
                </label>
                <UInput
                  v-model="customTag.neg_en"
                  :placeholder="
                    $t('prompt_creator.negative_prompt_placeholder_en')
                  "
                  size="lg"
                  leading-icon="i-heroicons-minus-circle"
                  class="w-full"
                />
              </div>
            </div>

            <div
              class="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <UIcon
                name="i-heroicons-information-circle"
                class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
              />
              <p class="text-sm text-blue-700 dark:text-blue-300">
                <span v-once>{{
                  $t("prompt_creator.negative_prompt_info")
                }}</span>
              </p>
            </div>
          </div>

          <!-- Sekcja: Ustawienia dodatkowe -->
          <div class="space-y-4">
            <div
              class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
            >
              <UIcon
                name="i-heroicons-cog-6-tooth"
                class="w-5 h-5 text-gray-500"
              />
              <span v-once>{{ $t("prompt_creator.additional_settings") }}</span>
            </div>

            <GlassCard variant="subtle" class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-eye-slash"
                    class="w-5 h-5 text-red-500"
                  />
                  <div>
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span v-once>{{
                        $t("prompt_creator.mark_as_nsfw")
                      }}</span>
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      <span v-once>{{
                        $t("prompt_creator.nsfw_description")
                      }}</span>
                    </p>
                  </div>
                </div>
                <!-- Custom Toggle Switch -->
                <button
                  type="button"
                  @click="customTag.nsfw = !customTag.nsfw"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    customTag.nsfw
                      ? 'bg-red-500'
                      : 'bg-gray-200 dark:bg-gray-700',
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      customTag.nsfw ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>
            </GlassCard>
          </div>

          <!-- Actions -->
          <div
            class="flex justify-between items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400">
              <span v-once>{{
                $t("prompt_creator.required_fields_note")
              }}</span>
            </p>
            <div class="flex gap-3">
              <GlassButton
                color="neutral"
                variant="outline"
                @click="showAddTagModal = false"
                icon="i-heroicons-x-mark"
              >
                <span v-once>{{ $t("pages.shared.cancel") }}</span>
              </GlassButton>
              <GlassButton
                type="submit"
                color="primary"
                :disabled="!customTag.pl.trim() || !customTag.en.trim()"
                icon="i-heroicons-plus-circle"
              >
                <span v-once>{{ $t("pages.shared.add") }}</span>
              </GlassButton>
            </div>
          </div>
        </form>
      </template>
    </UModal>
    <!-- Negative Templates Modal -->
    <UModal
      v-model:open="showNegativeTemplatesModal"
      :title="$t('prompt_creator.negative_templates')"
      :description="$t('prompt_creator.negative_templates_description')"
      :ui="{
        content: 'max-w-4xl',
        body: 'overflow-y-auto max-h-[calc(100vh-8rem)]',
      }"
    >
      <template #body>
        <div class="space-y-6 p-6">
          <!-- Header z licznikiem i search -->
          <div class="space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-3">
              <!-- Licznik wybranych -->
              <div class="flex items-center gap-2">
                <GlassBadge
                  :color="
                    activeNegativeTemplates.length > 0 ? 'primary' : 'neutral'
                  "
                  variant="soft"
                  size="md"
                >
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                  <span class="font-semibold">
                    {{ activeNegativeTemplates.length }}
                  </span>
                  <span v-once>{{ $t("prompt_creator.selected") }}</span>
                </GlassBadge>
              </div>

              <!-- Clear all button -->
              <GlassButton
                v-if="activeNegativeTemplates.length > 0"
                color="error"
                variant="outline"
                size="sm"
                @click="activeNegativeTemplates = []"
                icon="i-heroicons-x-circle"
              >
                <span v-once>{{ $t("prompt_creator.clear_all") }}</span>
              </GlassButton>
            </div>

            <!-- Info box -->
            <div
              class="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <UIcon
                name="i-heroicons-information-circle"
                class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
              />
              <p class="text-sm text-blue-700 dark:text-blue-300">
                <span v-once>{{
                  $t("prompt_creator.negative_templates_info")
                }}</span>
              </p>
            </div>
          </div>

          <!-- Template Groups -->
          <div class="space-y-6">
            <GlassCard
              v-for="group in negativeTemplateGroups"
              :key="group.label"
              variant="subtle"
              padding="md"
              class="space-y-4"
            >
              <!-- Group Header -->
              <div
                class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
              >
                <UIcon
                  name="i-heroicons-folder"
                  class="w-5 h-5 text-primary-500"
                />
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ group.label }}
                </h4>
                <GlassBadge color="neutral" variant="soft" size="xs">
                  {{ group.templates.length }}
                </GlassBadge>
              </div>

              <!-- Templates Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <GlassButton
                  v-for="template in group.templates"
                  :key="template.label"
                  :color="
                    activeNegativeTemplates.includes(template.text)
                      ? 'primary'
                      : 'neutral'
                  "
                  :variant="
                    activeNegativeTemplates.includes(template.text)
                      ? 'solid'
                      : 'outline'
                  "
                  size="sm"
                  @click="addNegativeTemplate(template.text)"
                  class="justify-between group relative overflow-hidden"
                >
                  <span class="flex-1 text-left truncate">
                    {{ template.label }}
                  </span>
                  <UIcon
                    v-if="activeNegativeTemplates.includes(template.text)"
                    name="i-heroicons-check-circle-solid"
                    class="w-4 h-4 flex-shrink-0 ml-2"
                  />
                  <UIcon
                    v-else
                    name="i-heroicons-plus-circle"
                    class="w-4 h-4 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </GlassButton>
              </div>

              <!-- Selected templates from this group -->
              <div
                v-if="
                  group.templates.some((t) =>
                    activeNegativeTemplates.includes(t.text)
                  )
                "
                class="pt-3 border-t border-gray-200 dark:border-gray-700"
              >
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span v-once
                    >{{ $t("prompt_creator.selected_from_group") }}:</span
                  >
                </p>
                <div class="flex flex-wrap gap-2">
                  <GlassBadge
                    v-for="template in group.templates.filter((t) =>
                      activeNegativeTemplates.includes(t.text)
                    )"
                    :key="template.text"
                    color="primary"
                    variant="soft"
                    size="sm"
                  >
                    {{ template.label }}
                  </GlassBadge>
                </div>
              </div>
            </GlassCard>
          </div>

          <!-- Preview wybranych szablonów -->
          <div v-if="activeNegativeTemplates.length > 0" class="space-y-3">
            <div
              class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
            >
              <UIcon name="i-heroicons-eye" class="w-5 h-5 text-purple-500" />
              <span v-once>{{ $t("prompt_creator.preview") }}</span>
            </div>

            <GlassCard variant="strong" padding="md">
              <p
                class="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed"
              >
                {{ activeNegativeTemplates.join(", ") }}
              </p>
            </GlassCard>

            <div
              class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
            >
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              <span>
                {{ activeNegativeTemplates.join(", ").length }}
                <span v-once>{{ $t("prompt_creator.characters") }}</span>
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex justify-between items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400">
              <span v-once>{{
                $t("prompt_creator.templates_auto_apply")
              }}</span>
            </p>
            <GlassButton
              color="neutral"
              variant="outline"
              @click="showNegativeTemplatesModal = false"
              icon="i-heroicons-check"
            >
              <span v-once>{{ $t("common.done") }}</span>
            </GlassButton>
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
              <GlassButton
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
        $t("pages.shared.error_description")
      }}</template>
      <template #body>
        <p>{{ alertMessage }}</p>
      </template>
      <template #footer>
        <GlassButton @click="showAlertModal = false">
          <span v-once>{{ $t("common.save") }}</span>
        </GlassButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// Import components
import SavePromptModal from "~/components/editor/SavePromptModal.vue";
import EditorSidebar from "~/components/editor/EditorSidebar.vue";
import EditorProgressBar from "~/components/editor/EditorProgressBar.vue";
import EditorStatsCard from "~/components/editor/EditorStatsCard.vue";
import EditorSearchFilters from "~/components/editor/EditorSearchFilters.vue";
import EditorSelectedSummary from "~/components/editor/EditorSelectedSummary.vue";

// Extend Window type for custom properties
declare global {
  interface Window {
    mouseX?: number;
    mouseY?: number;
  }
}

// Initialize editor state
const editorState = useEditorState();

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

// Handler for category selection from sidebar
const handleCategorySelect = (categoryLabel: string) => {
  // Convert label to key (e.g., "Subject" → "subject")
  const key = labelToKey[categoryLabel];
  if (!key) {
    console.warn(`No key found for category label: ${categoryLabel}`);
    return;
  }

  // Find index in categoryOrderKeys
  const index = categoryOrderKeys.indexOf(key);
  if (index !== -1) {
    currentStep.value = index;
  } else {
    console.warn(`Category key not found in order: ${key}`);
  }
};

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

// Wszystkie kategorie (etykiety angielskie z content/tags)
const categories = categoryOrderKeys
  .map((key) => categoryKeyMap[key])
  .filter((label): label is string => !!label);

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
    items: g.items
      .map((k) => categoryKeyMap[k])
      .filter((label): label is string => !!label),
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
  return `${tagObj.category}__${tagObj.pl}__${tagObj.en}`;
};

const isFavorite = (tagObj: TagObject): boolean => {
  return favorites.value.has(getTagId(tagObj));
};

const toggleFavorite = (tagObj: TagObject) => {
  const id = getTagId(tagObj);
  console.log("asdid", id);
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

const removeTagFromSummary = (category: string, tagIndex: number) => {
  if (!selectedTags.value[category]) return;

  selectedTags.value[category].splice(tagIndex, 1);
  if (selectedTags.value[category].length === 0) {
    delete selectedTags.value[category];
  }
};

const updateTagFromSummary = (
  category: string,
  tagIndex: number,
  updatedTag: TagObject
) => {
  if (!selectedTags.value[category] || !selectedTags.value[category][tagIndex])
    return;

  // Update the tag with new weight/emphasis
  selectedTags.value[category][tagIndex] = {
    ...selectedTags.value[category][tagIndex],
    weight: updatedTag.weight,
    emphasis: updatedTag.emphasis,
  };
};

const clearCategoryFromSummary = (category: string) => {
  if (selectedTags.value[category]) {
    delete selectedTags.value[category];
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
    "border-2 hover:shadow-lg hover:brightness-110",
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
</style>
