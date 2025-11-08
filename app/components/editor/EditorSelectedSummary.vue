<template>
  <div class="flex flex-col space-y-3 h-full w-full max-w-full overflow-hidden">
    <!-- Settings Bar -->
    <div
      class="glass-card p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full max-w-full"
    >
      <!-- NSFW Toggle -->
      <div class="flex items-center gap-2">
        <USwitch
          :model-value="showNsfw"
          @update:model-value="$emit('update:show-nsfw', $event)"
          color="error"
          size="sm"
        />
        <span class="text-xs text-gray-700 dark:text-gray-300">
          {{ $t("prompt_creator.show_nsfw") }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <GlassButton
          size="xs"
          color="primary"
          variant="soft"
          icon="i-heroicons-plus-circle"
          @click="$emit('add-custom-tag')"
          class="flex-1 sm:flex-none"
        >
          <span v-once class="hidden sm:inline">{{
            $t("prompt_creator.add_custom_tag")
          }}</span>
          <span v-once class="sm:hidden">{{ $t("common.add") }}</span>
        </GlassButton>
        <GlassButton
          size="xs"
          color="neutral"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          @click="$emit('show-negative-templates')"
          class="flex-1 sm:flex-none"
        >
          <span v-once class="hidden sm:inline">{{
            $t("prompt_creator.negative_templates")
          }}</span>
          <span v-once class="sm:hidden">{{ $t("common.templates") }}</span>
        </GlassButton>
      </div>
    </div>

    <!-- Main Summary Card -->
    <div class="glass-card flex-1 overflow-hidden flex flex-col shadow-lg">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-primary-500/10 to-purple-600/10 dark:from-primary-500/20 dark:to-purple-600/20 backdrop-blur-sm px-3 sm:px-5 py-3 border-b border-white/20 dark:border-gray-700/50 flex-shrink-0"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
        >
          <h3
            class="font-bold text-gray-900 dark:text-white text-sm sm:text-base flex items-center gap-2"
          >
            <span
              class="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 shadow-lg shadow-primary-500/50"
            ></span>
            <span v-once>{{ $t("prompt_creator.selected_tags") }}</span>
          </h3>
          <div class="flex gap-2 sm:gap-3 text-xs sm:text-sm">
            <!-- Categories Count -->
            <div class="flex items-center gap-1.5">
              <UIcon
                name="i-heroicons-folder"
                class="text-primary-500 dark:text-primary-400"
              />
              <span class="text-gray-700 dark:text-gray-300 font-medium">
                {{ Object.keys(selectedTags).length }}
                <span v-once class="text-gray-500 dark:text-gray-400 ml-0.5">{{
                  $t("prompt_creator.categories_name")
                }}</span>
              </span>
            </div>
            <!-- Tags Count -->
            <div class="flex items-center gap-1.5">
              <UIcon
                name="i-heroicons-tag"
                class="text-purple-500 dark:text-purple-400"
              />
              <span class="text-gray-700 dark:text-gray-300 font-medium">
                {{ totalTags }}
                <span v-once class="text-gray-500 dark:text-gray-400 ml-0.5">{{
                  $t("prompt_creator.tags_selected")
                }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Scrollable Area -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
        <!-- Selected Tags by Category -->
        <div v-if="totalTags > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <h4
              class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2"
            >
              <UIcon name="i-heroicons-squares-2x2" class="text-primary-500" />
              <span v-once>{{
                $t("prompt_creator.selected_by_category")
              }}</span>
            </h4>
            <GlassBadge color="neutral" variant="soft" size="xs">
              {{ Object.keys(selectedTags).length }}
              {{ $t("prompt_creator.categories_name") }}
            </GlassBadge>
          </div>

          <!-- Compact Category Icons Grid -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="[category, tags] in validCategories"
              :key="category"
              @click="openCategoryModal(category, tags)"
              class="group relative flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-800/40 hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30 rounded-xl backdrop-blur-sm border border-white/50 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <!-- Icon Container -->
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-sm shadow-primary-500/30"
                >
                  <UIcon
                    :name="getCategoryIcon(category)"
                    class="w-5 h-5 text-white"
                  />
                </div>
                <!-- Badge -->
                <GlassBadge
                  size="sm"
                  color="primary"
                  variant="solid"
                  class="absolute -bottom-2 -right-2"
                >
                  {{ tags.length }}
                </GlassBadge>
              </div>

              <!-- Clear Button (appears on hover) - using div instead of button to avoid nesting -->
              <div
                @click.stop="$emit('clear-category', category)"
                role="button"
                tabindex="0"
                @keydown.enter.stop="$emit('clear-category', category)"
                @keydown.space.prevent.stop="$emit('clear-category', category)"
                class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center shadow-lg cursor-pointer"
                aria-label="Wyczyść kategorię"
              >
                <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <UIcon
            name="i-heroicons-squares-plus"
            class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
          />
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            <span v-once>{{ $t("prompt_creator.no_tags_selected") }}</span>
          </p>
          <p class="text-gray-400 dark:text-gray-500 text-xs mt-2">
            <span v-once>{{ $t("prompt_creator.select_tags_hint") }}</span>
          </p>
        </div>

        <!-- Generated Prompts Preview -->
        <div v-if="totalTags > 0" class="space-y-3">
          <h4
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2"
          >
            <UIcon name="i-heroicons-sparkles" class="text-purple-500" />
            <span v-once>{{ $t("prompt_creator.generated_prompts") }}</span>
          </h4>

          <!-- Positive Prompt -->
          <div
            class="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-3 border border-green-200/30 dark:border-green-700/30"
          >
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2"
            >
              <span
                class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide flex items-center gap-1.5"
              >
                <UIcon
                  name="i-heroicons-plus-circle"
                  class="w-3 h-3 sm:w-4 sm:h-4"
                />
                <span v-once>{{ $t("prompt_creator.positive_prompt") }}</span>
                <GlassBadge
                  v-if="positivePrompt"
                  color="neutral"
                  variant="soft"
                  size="xs"
                >
                  {{ positivePrompt.length }}
                </GlassBadge>
              </span>
              <div class="flex gap-1 ml-auto sm:ml-0">
                <GlassButton
                  v-if="positivePrompt && positivePrompt.length > 200"
                  size="xs"
                  color="primary"
                  variant="ghost"
                  icon="i-heroicons-arrows-pointing-out"
                  @click="showPositiveModal = true"
                />
                <GlassButton
                  size="xs"
                  :color="copiedPositive ? 'success' : 'neutral'"
                  variant="ghost"
                  :icon="
                    copiedPositive
                      ? 'i-heroicons-check'
                      : 'i-heroicons-clipboard-document'
                  "
                  @click="$emit('copy-prompt', 'positive')"
                />
              </div>
            </div>
            <div class="relative">
              <p
                :class="[
                  'text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono transition-all',
                  positivePrompt.length > 200 ? 'line-clamp-3' : '',
                ]"
              >
                {{ positivePrompt || $t("prompt_creator.no_prompt_yet") }}
              </p>
              <div
                v-if="positivePrompt.length > 200"
                class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-50/90 to-transparent dark:from-green-900/30 pointer-events-none"
              ></div>
            </div>
            <button
              v-if="positivePrompt.length > 200"
              @click="showPositiveModal = true"
              class="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
            >
              <UIcon name="i-heroicons-chevron-down" class="w-3 h-3" />
              <span v-once>{{ $t("prompt_creator.show_full") }}</span>
            </button>
          </div>

          <!-- Negative Prompt -->
          <div
            class="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 rounded-lg p-3 border border-red-200/30 dark:border-red-700/30"
          >
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2"
            >
              <span
                class="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide flex items-center gap-1.5"
              >
                <UIcon
                  name="i-heroicons-minus-circle"
                  class="w-3 h-3 sm:w-4 sm:h-4"
                />
                <span v-once>{{ $t("prompt_creator.negative_prompt") }}</span>
                <GlassBadge
                  v-if="negativePrompt"
                  color="neutral"
                  variant="soft"
                  size="xs"
                >
                  {{ negativePrompt.length }}
                </GlassBadge>
              </span>
              <div class="flex gap-1 ml-auto sm:ml-0">
                <GlassButton
                  v-if="negativePrompt && negativePrompt.length > 200"
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-heroicons-arrows-pointing-out"
                  @click="showNegativeModal = true"
                />
                <GlassButton
                  size="xs"
                  :color="copiedNegative ? 'success' : 'neutral'"
                  variant="ghost"
                  :icon="
                    copiedNegative
                      ? 'i-heroicons-check'
                      : 'i-heroicons-clipboard-document'
                  "
                  @click="$emit('copy-prompt', 'negative')"
                />
              </div>
            </div>
            <div class="relative">
              <p
                :class="[
                  'text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono transition-all',
                  negativePrompt.length > 200 ? 'line-clamp-3' : '',
                ]"
              >
                {{
                  negativePrompt || $t("prompt_creator.no_negative_prompt_yet")
                }}
              </p>
              <div
                v-if="negativePrompt.length > 200"
                class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-50/90 to-transparent dark:from-red-900/30 pointer-events-none"
              ></div>
            </div>
            <button
              v-if="negativePrompt.length > 200"
              @click="showNegativeModal = true"
              class="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
            >
              <UIcon name="i-heroicons-chevron-down" class="w-3 h-3" />
              <span v-once>{{ $t("prompt_creator.show_full") }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons (Footer) -->
      <div
        v-if="totalTags > 0"
        class="flex-shrink-0 p-3 sm:p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/50"
      >
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3"
        >
          <div class="flex gap-2 flex-1 sm:flex-initial">
            <GlassButton
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-bookmark"
              @click="$emit('save-prompt')"
              class="flex-1 sm:flex-initial"
            >
              <span v-once class="hidden sm:inline">{{
                $t("prompt_creator.save")
              }}</span>
              <span v-once class="sm:hidden">{{ $t("common.save") }}</span>
            </GlassButton>
            <GlassButton
              color="primary"
              size="sm"
              icon="i-heroicons-play"
              @click="$emit('use-prompt')"
              class="flex-1 sm:flex-initial"
            >
              <span v-once class="hidden sm:inline">{{
                $t("prompt_creator.use")
              }}</span>
              <span v-once class="sm:hidden">{{ $t("common.use") }}</span>
            </GlassButton>
          </div>
          <GlassButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-heroicons-trash"
            @click="$emit('clear-all')"
            class="w-full sm:w-auto"
          >
            <span v-once>{{ $t("prompt_creator.clear_all") }}</span>
          </GlassButton>
        </div>
      </div>
    </div>

    <!-- Positive Prompt Full Modal -->
    <UModal
      v-model:open="showPositiveModal"
      :title="$t('prompt_creator.positive_prompt')"
      :description="$t('prompt_creator.positive_prompt_info')"
      :ui="{
        content: 'w-full sm:max-w-4xl mx-4 sm:mx-auto',
        body: 'max-h-[60vh] sm:max-h-[70vh] overflow-y-auto',
      }"
    >
      <template #body>
        <div class="space-y-4 p-4 sm:p-6">
          <!-- Stats -->
          <div
            class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700"
          >
            <GlassBadge color="primary" variant="soft" size="md">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              <span class="font-semibold">{{ positivePrompt.length }}</span>
              <span v-once>{{ $t("prompt_creator.characters") }}</span>
            </GlassBadge>
            <GlassBadge color="neutral" variant="soft" size="md">
              <UIcon name="i-heroicons-tag" class="w-4 h-4" />
              <span class="font-semibold">{{
                positivePrompt.split(",").length
              }}</span>
              <span v-once>{{ $t("prompt_creator.tags") }}</span>
            </GlassBadge>
          </div>

          <!-- Full Prompt -->
          <GlassCard variant="strong" padding="lg">
            <p
              class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono whitespace-pre-wrap break-words"
            >
              {{ positivePrompt }}
            </p>
          </GlassCard>

          <!-- Actions -->
          <div
            class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <GlassButton
              color="primary"
              variant="soft"
              icon="i-heroicons-clipboard-document"
              @click="
                $emit('copy-prompt', 'positive');
                showPositiveModal = false;
              "
            >
              <span v-once>{{ $t("prompt_creator.copy") }}</span>
            </GlassButton>
            <GlassButton
              color="neutral"
              variant="outline"
              @click="showPositiveModal = false"
            >
              <span v-once>{{ $t("common.close") }}</span>
            </GlassButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Negative Prompt Full Modal -->
    <UModal
      v-model:open="showNegativeModal"
      :title="$t('prompt_creator.negative_prompt')"
      :description="$t('prompt_creator.negative_prompt_info')"
      :ui="{
        content: 'w-full sm:max-w-4xl mx-4 sm:mx-auto',
        body: 'max-h-[60vh] sm:max-h-[70vh] overflow-y-auto',
      }"
    >
      <template #body>
        <div class="space-y-4 p-6">
          <!-- Stats -->
          <div
            class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700"
          >
            <GlassBadge color="error" variant="soft" size="md">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              <span class="font-semibold">{{ negativePrompt.length }}</span>
              <span v-once>{{ $t("prompt_creator.characters") }}</span>
            </GlassBadge>
            <GlassBadge color="neutral" variant="soft" size="md">
              <UIcon name="i-heroicons-tag" class="w-4 h-4" />
              <span class="font-semibold">{{
                negativePrompt.split(",").length
              }}</span>
              <span v-once>{{ $t("prompt_creator.tags") }}</span>
            </GlassBadge>
          </div>

          <!-- Full Prompt -->
          <GlassCard variant="strong" padding="lg">
            <p
              class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono whitespace-pre-wrap break-words"
            >
              {{ negativePrompt }}
            </p>
          </GlassCard>

          <!-- Actions -->
          <div
            class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <GlassButton
              color="error"
              variant="soft"
              icon="i-heroicons-clipboard-document"
              @click="
                $emit('copy-prompt', 'negative');
                showNegativeModal = false;
              "
            >
              <span v-once>{{ $t("prompt_creator.copy") }}</span>
            </GlassButton>
            <GlassButton
              color="neutral"
              variant="outline"
              @click="showNegativeModal = false"
            >
              <span v-once>{{ $t("common.close") }}</span>
            </GlassButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Category Tags Edit Modal -->
    <UModal
      v-model:open="showCategoryModal"
      :title="getCategoryName(selectedCategory)"
      :description="`${$t('prompt_creator.editing')} ${categoryTags.length} ${$t('prompt_creator.tags')}`"
      :ui="{
        content: 'w-full sm:max-w-3xl mx-4 sm:mx-auto',
        body: 'max-h-[60vh] sm:max-h-[70vh] overflow-y-auto',
      }"
    >
      <template #body>
        <div class="space-y-4 p-6">
          <!-- Header Stats -->
          <div
            class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-sm"
              >
                <UIcon
                  :name="getCategoryIcon(selectedCategory)"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ getCategoryName(selectedCategory) }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ categoryTags.length }} {{ $t("prompt_creator.tags") }}
                </p>
              </div>
            </div>
            <GlassButton
              color="error"
              variant="outline"
              size="sm"
              icon="i-heroicons-trash"
              @click="clearCategory"
            >
              <span v-once>{{ $t("prompt_creator.clear_all") }}</span>
            </GlassButton>
          </div>

          <!-- Tags List (Grid) -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <button
              v-for="(tag, idx) in categoryTags"
              :key="`modal-${selectedCategory}-${idx}`"
              @click="toggleTagEdit(idx)"
              :class="[
                'glass-card rounded-lg p-2 text-left transition-all hover:shadow-md relative group',
                editingTagIndex === idx
                  ? 'ring-2 ring-primary-500 shadow-lg bg-primary-50/50 dark:bg-primary-900/20'
                  : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600',
              ]"
            >
              <div class="flex flex-col gap-1">
                <div class="flex items-start justify-between gap-1">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 flex-1"
                  >
                    {{ getTagText(tag) }}
                  </span>
                  <button
                    @click.stop="removeTag(idx)"
                    class="opacity-0 group-hover:opacity-100 rounded-full transition-opacity p-1 size-5 hover:bg-red-100 dark:hover:bg-red-900/30 absolute -top-2 -right-2 flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-x-mark"
                      class="size-4 text-red-500"
                    />
                  </button>
                </div>
                <div class="flex items-center gap-1 flex-wrap">
                  <GlassBadge
                    v-if="tag.weight && tag.weight !== 1.0"
                    color="neutral"
                    variant="soft"
                    size="xs"
                  >
                    :{{ tag.weight.toFixed(1) }}
                  </GlassBadge>
                  <GlassBadge
                    v-if="tag.emphasis && tag.emphasis > 0"
                    color="neutral"
                    variant="soft"
                    size="xs"
                  >
                    {{ "(".repeat(tag.emphasis) }}
                  </GlassBadge>
                </div>
              </div>
            </button>
          </div>

          <!-- Edit Panel (shown below when tag selected) -->
          <div
            v-if="editingTag"
            class="glass-card rounded-xl p-4 space-y-4 border-2 border-primary-500"
          >
            <!-- Edit Header -->
            <div
              class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-pencil-square"
                  class="w-5 h-5 text-primary-500"
                />
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ $t("prompt_creator.editing") }}:
                </span>
                <GlassBadge color="primary" variant="soft" size="md">
                  {{ getTagText(editingTag) }}
                </GlassBadge>
              </div>
              <button
                @click="editingTagIndex = null"
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <UIcon
                  name="i-heroicons-x-mark"
                  class="w-5 h-5 text-gray-500"
                />
              </button>
            </div>

            <!-- Weight Slider -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {{ $t("prompt_creator.weight") }}
                </label>
                <span
                  class="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-lg"
                >
                  {{ (editingTag.weight || 1.0).toFixed(1) }}
                </span>
              </div>
              <USlider
                :model-value="editingTag.weight || 1.0"
                @update:model-value="
                  (value) => updateTagWeight(editingTagIndex, value as number)
                "
                :min="0"
                :max="3"
                :step="0.1"
                color="primary"
                size="md"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.0</span>
                <span>1.5</span>
                <span>3.0</span>
              </div>
            </div>

            <!-- Emphasis Buttons -->
            <div>
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
              >
                {{ $t("prompt_creator.emphasis") }}
              </label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="n in [0, 1, 2, 3]"
                  :key="n"
                  @click="updateTagEmphasis(editingTagIndex, n)"
                  :class="[
                    'px-3 py-2 text-sm rounded-lg font-medium transition-all',
                    (editingTag.emphasis || 0) === n
                      ? 'bg-primary-500 text-white shadow-lg ring-2 ring-primary-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md',
                  ]"
                >
                  {{ n === 0 ? "None" : "(".repeat(n) }}
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex justify-end items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <GlassButton
              color="neutral"
              variant="outline"
              @click="showCategoryModal = false"
            >
              <span v-once>{{ $t("common.close") }}</span>
            </GlassButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TagItem } from "~/types/content";

interface Props {
  selectedTags: Record<string, TagItem[]>;
  positivePrompt: string;
  negativePrompt: string;
  showNsfw: boolean;
  copiedPositive: boolean;
  copiedNegative: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedTags: () => ({}),
  positivePrompt: "",
  negativePrompt: "",
  showNsfw: false,
  copiedPositive: false,
  copiedNegative: false,
});

const emit = defineEmits<{
  "update:show-nsfw": [value: boolean];
  "add-custom-tag": [];
  "show-negative-templates": [];
  "clear-category": [category: string];
  "remove-tag": [category: string, tagIndex: number];
  "update-tag": [category: string, tagIndex: number, tag: TagItem];
  "copy-prompt": [type: "positive" | "negative"];
  "save-prompt": [];
  "use-prompt": [];
  "clear-all": [];
}>();

const { t } = useI18n();

// Modal states
const showPositiveModal = ref(false);
const showNegativeModal = ref(false);
const showCategoryModal = ref(false);
const selectedCategory = ref("");
const categoryTags = ref<TagItem[]>([]);
const editingTagIndex = ref<number | null>(null);

// Category Modal Functions
const openCategoryModal = (category: string, tags: TagItem[]) => {
  selectedCategory.value = category;
  categoryTags.value = JSON.parse(JSON.stringify(tags)); // Deep clone
  editingTagIndex.value = null; // Reset editing state
  showCategoryModal.value = true;
};

const toggleTagEdit = (tagIndex: number) => {
  editingTagIndex.value = editingTagIndex.value === tagIndex ? null : tagIndex;
};

const editingTag = computed(() => {
  if (
    editingTagIndex.value !== null &&
    categoryTags.value[editingTagIndex.value]
  ) {
    return categoryTags.value[editingTagIndex.value];
  }
  return null;
});

const validCategories = computed(() => {
  return Object.entries(props.selectedTags).filter(
    ([category, tags]) =>
      category && category.trim() !== "" && tags && tags.length > 0
  );
});

const updateTagWeight = (tagIndex: number | null, value: number) => {
  if (tagIndex === null) return;
  if (categoryTags.value[tagIndex]) {
    categoryTags.value[tagIndex].weight = value;
    // Update parent with modified tag
    emit(
      "update-tag",
      selectedCategory.value,
      tagIndex,
      categoryTags.value[tagIndex]
    );
  }
};

const updateTagEmphasis = (tagIndex: number | null, emphasis: number) => {
  if (tagIndex === null) return;
  if (categoryTags.value[tagIndex]) {
    categoryTags.value[tagIndex].emphasis = emphasis;
    // Update parent with modified tag
    emit(
      "update-tag",
      selectedCategory.value,
      tagIndex,
      categoryTags.value[tagIndex]
    );
  }
};

const removeTag = (tagIndex: number) => {
  emit("remove-tag", selectedCategory.value, tagIndex);
  categoryTags.value.splice(tagIndex, 1);
};

const clearCategory = () => {
  emit("clear-category", selectedCategory.value);
  showCategoryModal.value = false;
  categoryTags.value = [];
};

// Watch for changes in selectedTags to update modal
watch(
  () => props.selectedTags[selectedCategory.value],
  (newTags) => {
    if (showCategoryModal.value && newTags) {
      categoryTags.value = JSON.parse(JSON.stringify(newTags));
    }
  },
  { deep: true }
);

// Computed
const totalTags = computed(() => {
  return Object.values(props.selectedTags).reduce(
    (sum, tags) => sum + tags.length,
    0
  );
});

// Label to i18n key mapping (same as EditorSidebar)
const labelToKeyMap: Record<string, string> = {
  Subject: "subject",
  Style: "style",
  Lighting: "lighting",
  Colors: "colors",
  Composition: "composition",
  Camera: "camera",
  "Shot Type": "shot_type",
  Mood: "mood",
  "Time Period": "time_period",
  Location: "location",
  Weather: "weather",
  Season: "season",
  Detail: "detail",
  Quality: "quality",
  Artists: "artists",
  Medium: "medium",
  Technique: "technique",
  "Art Movement": "art_movement",
  "Negative Prompts": "negative_prompts",
  Photography: "photography",
  "Digital Art": "digital_art",
  "Traditional Art": "traditional_art",
  "3D Rendering": "3d_rendering",
  Fantasy: "fantasy",
  Scifi: "scifi",
  Horror: "horror",
  Anime: "anime",
  Character: "character",
  Background: "background",
  Effects: "effects",
  Modifiers: "modifiers",
  Framing: "framing",
  Texture: "texture",
  Perspective: "perspective",
  "Depth Of Field": "depth_of_field",
  Focus: "focus",
  Atmosphere: "atmosphere",
  "Clothing Style": "clothing_style",
  Body: "body",
  Expression: "expression",
  Age: "age",
  Ethnicity: "ethnicity",
};

// Label to icon mapping (same as EditorSidebar)
const labelIconMap: Record<string, string> = {
  Subject: "i-heroicons-user-circle",
  Style: "i-heroicons-paint-brush",
  Lighting: "i-heroicons-light-bulb",
  Colors: "i-heroicons-swatch",
  Composition: "i-heroicons-view-columns",
  Camera: "i-heroicons-camera",
  "Shot Type": "i-heroicons-photo",
  Mood: "i-heroicons-face-smile",
  "Time Period": "i-heroicons-clock",
  Location: "i-heroicons-map-pin",
  Weather: "i-heroicons-cloud",
  Season: "i-heroicons-calendar",
  Detail: "i-heroicons-magnifying-glass-plus",
  Quality: "i-heroicons-star",
  Artists: "i-heroicons-user-group",
  Medium: "i-heroicons-cube",
  Technique: "i-heroicons-wrench-screwdriver",
  "Art Movement": "i-heroicons-academic-cap",
  "Negative Prompts": "i-heroicons-x-circle",
  Photography: "i-heroicons-camera",
  "Digital Art": "i-heroicons-computer-desktop",
  "Traditional Art": "i-heroicons-paint-brush",
  "3D Rendering": "i-heroicons-cube-transparent",
  Fantasy: "i-heroicons-sparkles",
  Scifi: "i-heroicons-rocket-launch",
  Horror: "i-heroicons-fire",
  Anime: "i-heroicons-heart",
  Character: "i-heroicons-user",
  Background: "i-heroicons-rectangle-stack",
  Effects: "i-heroicons-bolt",
  Modifiers: "i-heroicons-adjustments-horizontal",
  Framing: "i-heroicons-square-2-stack",
  Texture: "i-heroicons-squares-2x2",
  Perspective: "i-heroicons-arrows-pointing-out",
  "Depth Of Field": "i-heroicons-eye",
  Focus: "i-heroicons-magnifying-glass",
  Atmosphere: "i-heroicons-cloud",
  "Clothing Style": "i-heroicons-shopping-bag",
  Body: "i-heroicons-hand-raised",
  Expression: "i-heroicons-face-smile",
  Age: "i-heroicons-calendar-days",
  Ethnicity: "i-heroicons-globe-alt",
};

// Helper functions
const getCategoryIcon = (category: string): string => {
  return (
    labelIconMap[category] || "i-heroicons-tag" // Default fallback icon
  );
};

const getCategoryName = (category: string): string => {
  if (!category || category.trim() === "") {
    return "";
  }
  const i18nKey =
    labelToKeyMap[category] || category.toLowerCase().replace(/\s+/g, "_");
  return t(`prompt_creator.categories.${i18nKey}`, category); // Fallback to original if not found
};

const getTagText = (tag: TagItem): string => {
  const { locale } = useI18n();
  const text = locale.value === "pl" ? tag.pl : tag.en;
  if (tag.weight && tag.weight !== 1.0) {
    return `${text} (${tag.weight.toFixed(1)}x)`;
  }
  if (tag.emphasis) {
    return `${text} (!!)`;
  }
  return text;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>
