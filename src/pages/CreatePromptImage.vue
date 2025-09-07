<template>
  <div class="min-h-screen bg-base-200 mt-3">
    <!-- Header -->
    <div
      class="bg-base-100/80 backdrop-blur border-b border-base-300 sticky top-0 z-20"
    >
      <div
        class="container mx-auto py-3 px-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-primary/20 text-primary w-10 rounded-full">
              <oh-icon name="gi-anvil-impact" scale="2" />
            </div>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-primary">
              {{ $t("imagePrompt.advancedCreator") || "Image Prompt Creator" }}
            </h1>
            <p class="text-xs sm:text-sm text-base-content/70">
              {{
                $t("imagePrompt.description") ||
                "Twórz i zarządzaj promptami graficznymi."
              }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Help modal trigger -->
          <button
            class="btn btn-ghost btn-sm"
            @click="showHelp = true"
            :title="$t('common.help') || 'Pomoc'"
          >
            <VIcon name="bi-question-circle" class="text-base-content/80" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 pb-10 mt-3">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Main Content Area -->
        <div class="lg:w-2/3">
          <!-- Quick Controls -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-4">
              <div class="flex flex-wrap gap-2 items-center">
                <!-- NSFW -->
                <label class="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    class="toggle toggle-primary"
                    v-model="nsfw"
                    @change="handleNsfwToggle"
                  />
                  <span>{{ $t("imagePrompt.nsfw") || "NSFW" }}</span>
                </label>

                <!-- Search -->
                <div class="join grow max-w-xl">
                  <span class="btn join-item btn-ghost btn-sm">
                    <VIcon name="bi-search" />
                  </span>
                  <input
                    v-model="tagSearch"
                    type="text"
                    class="input input-sm input-bordered join-item grow"
                    :placeholder="
                      $t('ui.searchTagsPlaceholder') || 'Szukaj tagów...'
                    "
                  />
                  <button
                    class="btn join-item btn-sm"
                    :disabled="!tagSearch"
                    @click="clearSearch"
                  >
                    ✕
                  </button>
                </div>

                <!-- Multi / Hide empty -->
                <button
                  class="btn btn-sm"
                  :class="multiSelectMode ? 'btn-primary' : 'btn-outline'"
                  @click="multiSelectMode = !multiSelectMode"
                >
                  <VIcon name="bi-layers" class="mr-1" />
                  {{
                    multiSelectMode
                      ? $t("ui.multiOn") || "Multi ON"
                      : $t("ui.multiOff") || "Multi OFF"
                  }}
                </button>

                <button
                  class="btn btn-sm btn-outline"
                  @click="hideEmpty = !hideEmpty"
                >
                  {{
                    hideEmpty
                      ? $t("ui.showEmpty") || "Pokaż puste"
                      : $t("ui.hideEmpty") || "Ukryj puste"
                  }}
                </button>

                <!-- Random -->
                <button
                  class="btn btn-sm btn-outline"
                  @click="randomTag"
                  :disabled="!currentCategoryOptions.length"
                  :title="$t('ui.random') || 'Losuj'"
                >
                  <VIcon name="bi-shuffle" />
                </button>

                <!-- Advanced -->
                <button
                  class="btn btn-sm btn-ghost"
                  @click="showAdvanced = !showAdvanced"
                >
                  <VIcon name="bi-gear" class="mr-1" />
                  {{
                    showAdvanced
                      ? $t("ui.hideAdvanced") || "Ukryj zaawansowane"
                      : $t("ui.showAdvanced") || "Pokaż zaawansowane"
                  }}
                </button>

                <!-- Undo / Redo -->
                <button
                  class="btn btn-sm btn-outline"
                  @click="undo"
                  :disabled="!canUndo"
                  :title="$t('common.undo') || 'Cofnij'"
                >
                  ↶
                </button>
                <button
                  class="btn btn-sm btn-outline"
                  @click="redo"
                  :disabled="!canRedo"
                  :title="$t('common.redo') || 'Ponów'"
                >
                  ↷
                </button>
              </div>

              <!-- Advanced Panel -->
              <transition name="fade">
                <div
                  v-if="showAdvanced"
                  class="mt-4 pt-4 border-t border-base-300 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <!-- Weights -->
                  <div class="p-3 rounded-xl border border-base-300">
                    <h4 class="font-semibold mb-2 text-sm">
                      {{ $t("ui.weights") || "Wagi tagów" }}
                    </h4>
                    <label class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        class="toggle toggle-sm toggle-primary"
                        v-model="enableWeights"
                      />
                      <span class="text-sm">
                        {{
                          enableWeights
                            ? $t("ui.weightsActive") || "Wagi aktywne"
                            : $t("ui.weightsInactive") || "Wagi nieaktywne"
                        }}
                      </span>
                    </label>
                    <p class="text-xs text-base-content/70 mt-2">
                      {{
                        $t("ui.weightsHint") ||
                        "Nadaj wagę poszczególnym tagom (np. (tag:1.3))."
                      }}
                    </p>
                  </div>

                  <!-- Negative presets -->
                  <div class="p-3 rounded-xl border border-base-300">
                    <h4 class="font-semibold mb-2 text-sm">
                      {{ $t("ui.negativePresets") || "Negatywne presety" }}
                    </h4>
                    <div class="flex flex-wrap gap-1">
                      <button
                        v-for="preset in negativePresets"
                        :key="preset.name"
                        class="badge cursor-pointer select-none"
                        :class="
                          selectedNegativePresetNames.includes(preset.name)
                            ? 'badge-primary'
                            : 'badge-outline'
                        "
                        @click="toggleNegativePreset(preset.name)"
                      >
                        {{ preset.name }}
                      </button>
                      <button
                        class="badge badge-outline badge-sm"
                        @click="clearNegativePresets"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <!-- Saved sets -->
                  <div class="p-3 rounded-xl border border-base-300">
                    <h4 class="font-semibold mb-2 text-sm">
                      {{ $t("ui.savedSets") || "Zapisane zestawy" }}
                    </h4>
                    <div class="flex gap-2 mb-2">
                      <input
                        v-model="saveSetName"
                        class="input input-bordered input-sm flex-1"
                        :placeholder="
                          $t('ui.namePlaceholder') || 'Nazwa zestawu...'
                        "
                      />
                      <button
                        class="btn btn-sm btn-primary"
                        @click="saveCurrentSet"
                        :disabled="!saveSetName.trim()"
                      >
                        💾
                      </button>
                    </div>
                    <div
                      class="flex flex-wrap gap-1 max-h-24 overflow-auto hide-scrollbar"
                    >
                      <div
                        v-for="(set, index) in savedSets"
                        :key="set.name + '_' + index"
                        class="badge badge-outline gap-1 cursor-pointer"
                        @click="loadSet(index)"
                      >
                        {{ set.name }}
                        <span @click.stop="deleteSet(index)">✕</span>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="tabs bg-base-100 p-1 mt-4">
            <button
              v-for="(group, index) in visibleGroups"
              :key="group.key"
              class="tab tab-sm transition-all"
              :class="index === currentGroupIndex ? 'tab-active' : ''"
              @click="goToGroup(index)"
            >
              <span class="mr-1">{{ group.icon }}</span>
              <span class="hidden sm:inline">{{ $t(group.labelKey) }}</span>
              <span
                v-if="groupSelectionInfo.find((x) => x.key === group.key)"
                class="badge badge-sm ml-1"
              >
                {{
                  groupSelectionInfo.find((x) => x.key === group.key).selected
                }}/{{
                  groupSelectionInfo.find((x) => x.key === group.key).total
                }}
              </span>
            </button>
          </div>

          <!-- Category Chips -->
          <div class="flex flex-wrap gap-1 mt-3">
            <button
              v-for="category in visibleGroupCategories"
              :key="category"
              class="badge badge-lg cursor-pointer transition hover:scale-105"
              :class="
                isActiveCategory(category) ? 'badge-primary' : 'badge-outline'
              "
              @click="goToCategory(category)"
            >
              {{ $t("categories." + mapCategoryKey(category)) }}
              <span
                v-if="selectedCount(category) > 0"
                class="badge badge-sm ml-1"
                >{{ selectedCount(category) }}</span
              >
            </button>
          </div>

          <!-- Progress -->
          <div class="w-full bg-base-300 rounded-full h-2 mt-4 overflow-hidden">
            <div
              class="h-full transition-all bg-gradient-to-r from-primary to-accent"
              :style="{ width: overallProgressPercent + '%' }"
            ></div>
          </div>

          <!-- Tag Selection Area -->
          <div class="card bg-base-100 shadow-lg mt-4" v-if="activeKey">
            <div class="card-body">
              <div class="flex justify-between items-center mb-3">
                <h2 class="card-title text-lg">
                  {{ activeStepLabel }}
                  <span class="badge badge-sm">{{
                    filteredCategoryOptions.length
                  }}</span>
                </h2>
                <div class="flex gap-1">
                  <button
                    class="btn btn-xs btn-outline"
                    @click="clearCategory"
                    :disabled="!selected[activeKey]?.length"
                  >
                    {{ $t("ui.clearCategory") || "Wyczyść kategorię" }}
                  </button>
                  <button
                    class="btn btn-xs btn-outline"
                    @click="selectAllInCategory"
                    :disabled="!currentCategoryOptions.length"
                  >
                    {{ $t("ui.selectAll") || "Zaznacz wszystko" }}
                  </button>
                </div>
              </div>

              <!-- Tag Grid -->
              <div
                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4"
              >
                <button
                  v-for="option in filteredCategoryOptions"
                  :key="option.positive"
                  class="btn btn-sm justify-between normal-case h-auto py-1 transition hover:shadow"
                  :class="[
                    isSelected(activeKey, option.positive)
                      ? 'btn-primary'
                      : 'btn-outline',
                    option.nsfw ? 'border-error text-error' : '',
                  ]"
                  @click="toggleOption(activeKey, option.positive)"
                >
                  <span
                    class="truncate mr-1"
                    v-html="highlight(option.positive)"
                  ></span>
                  <div class="flex items-center">
                    <span v-if="option.nsfw" class="text-xs mr-1">🔞</span>
                    <button
                      class="btn btn-circle btn-ghost btn-xs"
                      @click.stop="toggleFavorite(activeKey, option.positive)"
                    >
                      <span
                        :class="
                          isFavorite(activeKey, option.positive)
                            ? 'text-warning'
                            : ''
                        "
                      >
                        <VIcon name="bi-star" />
                      </span>
                    </button>
                  </div>
                </button>
              </div>

              <!-- Custom Tag -->
              <div class="join w-full">
                <input
                  v-model="customTag"
                  type="text"
                  class="input input-bordered join-item w-full"
                  :placeholder="
                    $t('ui.addCustomTagPlaceholder') || 'Dodaj własny tag...'
                  "
                  @keyup.enter="addCustomTag"
                />
                <button class="btn join-item btn-primary" @click="addCustomTag">
                  {{ $t("common.add") || "Dodaj" }}
                </button>
              </div>

              <!-- Selected Tags -->
              <div v-if="selected[activeKey]?.length" class="mt-4">
                <h3 class="font-medium text-sm mb-2">
                  {{ $t("ui.selectedInCategory") || "Wybrane w kategorii" }}
                </h3>
                <div class="flex flex-wrap gap-1">
                  <div
                    v-for="tag in selected[activeKey]"
                    :key="tag"
                    class="badge badge-primary gap-1 items-center"
                  >
                    <span
                      class="cursor-pointer"
                      @click="cycleEmphasis(tag)"
                      :title="emphasisTooltip(tag)"
                    >
                      {{
                        emphasisLevels[tag]
                          ? "(".repeat(emphasisLevels[tag]) +
                            tag +
                            ")".repeat(emphasisLevels[tag])
                          : tag
                      }}
                    </span>
                    <template v-if="enableWeights">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        class="w-14 max-w-[4rem] input input-xs input-bordered input-primary bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                        v-model.number="tagWeights[tag]"
                        @change="normalizeWeight(tag)"
                        :title="$t('ui.weight') || 'Waga'"
                      />
                    </template>
                    <button
                      class="btn btn-ghost btn-xs"
                      @click="toggleOption(activeKey, tag)"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between mt-6">
                <button
                  class="btn btn-outline"
                  :disabled="currentStep === 0"
                  @click="prevStep"
                >
                  <VIcon name="bi-chevron-left" class="mr-1" />
                  {{ $t("common.back") || "Wstecz" }}
                </button>
                <button
                  class="btn btn-primary"
                  :disabled="currentStep === stepsFlattened.length - 1"
                  @click="nextStep"
                >
                  {{ $t("common.next") || "Dalej" }}
                  <VIcon name="bi-chevron-right" class="ml-1" />
                </button>
              </div>
            </div>
          </div>

          <!-- Favorites -->
          <div v-if="favoriteList.length" class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="card-title text-lg">
                ★ {{ $t("ui.favorites") || "Ulubione" }}
              </h3>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="fav in favoriteList"
                  :key="fav.key + '_' + fav.tag"
                  class="badge badge-outline badge-lg hover:badge-secondary cursor-pointer transition"
                  @click="applyFavorite(fav)"
                  :title="fav.key"
                >
                  {{ fav.tag }}
                  <span
                    class="ml-1"
                    @click.stop="removeFavorite(fav.key, fav.tag)"
                    >✕</span
                  >
                </button>
              </div>
              <button
                class="btn btn-xs btn-outline mt-2 w-fit"
                @click="clearFavorites"
              >
                {{ $t("ui.clearFavorites") || "Wyczyść ulubione" }}
              </button>
            </div>
          </div>

          <!-- Global Selected Overview -->
          <div v-if="hasAnySelection" class="card bg-base-100 shadow-lg mt-3">
            <div class="card-body">
              <h3 class="card-title">
                {{
                  $t("ui.selectedTagsOverview") || "Przegląd wybranych tagów"
                }}
              </h3>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"
              >
                <div
                  v-for="entry in stepsWithSelection"
                  :key="entry.key"
                  class="border border-base-300 rounded-lg p-3"
                >
                  <div class="font-medium text-sm mb-2">
                    {{ $t("categories." + mapCategoryKey(entry.key)) }}
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in selected[entry.key]"
                      :key="tag"
                      class="badge badge-sm"
                    >
                      <span>{{ tag }}</span>
                      <button
                        class="ml-1"
                        @click="toggleOption(entry.key, tag)"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:w-1/3">
          <div class="card bg-base-100 shadow-lg sticky top-4">
            <div class="card-body">
              <h2 class="card-title mb-2">
                {{ $t("imagePrompt.promptPreview") || "Podgląd promptu" }}
              </h2>

              <!-- Tokens Editor -->
              <div class="mb-4">
                <div class="font-medium text-sm mb-1">
                  {{ $t("ui.tokens") || "Tokeny" }}
                </div>
                <div
                  class="bg-base-200/60 p-2.5 rounded-xl max-h-36 overflow-auto ring-1 ring-base-300"
                >
                  <div class="flex flex-wrap gap-1">
                    <div
                      v-for="(token, index) in positiveTokens"
                      :key="token + '_' + index"
                      class="badge badge-outline border-base-300 hover:badge-primary transition"
                    >
                      <span
                        class="cursor-pointer"
                        @click="cycleEmphasis(token)"
                        >{{ token }}</span
                      >
                      <span class="flex items-center ml-1 gap-1">
                        <button
                          class="btn btn-ghost btn-xs"
                          @click="moveToken(index, -1)"
                          :disabled="index === 0"
                        >
                          ↑
                        </button>
                        <button
                          class="btn btn-ghost btn-xs"
                          @click="moveToken(index, 1)"
                          :disabled="index === positiveTokens.length - 1"
                        >
                          ↓
                        </button>
                        <button
                          class="btn btn-ghost btn-xs"
                          @click="removeToken(token)"
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Prompt Preview -->
              <div>
                <div class="font-medium text-sm mb-1">
                  {{ $t("imagePrompt.positivePrompt") || "Pozytywny prompt" }}
                </div>
                <textarea
                  v-model="positivePrompt"
                  readonly
                  class="textarea textarea-bordered w-full h-24 text-xs mb-4"
                ></textarea>

                <div class="font-medium text-sm mb-1">
                  {{ $t("imagePrompt.negativePrompt") || "Negatywny prompt" }}
                </div>
                <textarea
                  v-model="negativePrompt"
                  readonly
                  class="textarea textarea-bordered w-full h-20 text-xs"
                ></textarea>
              </div>

              <!-- Info -->
              <div
                class="text-xs mt-2 flex justify-between text-base-content/70"
              >
                <span
                  >{{ $t("ui.tags") || "Tagi" }}:
                  {{ positiveTokens.length }}</span
                >
                <span
                  >{{ $t("ui.approxTokens") || "Szac. tokeny" }}:
                  {{ estimatedTokenCount }}</span
                >
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-2 gap-2 mt-4">
                <button
                  class="btn btn-outline col-span-1"
                  @click="copyPrompt(positivePrompt, 'positive')"
                  :disabled="!positivePrompt"
                >
                  <VIcon name="bi-clipboard" class="mr-1" />
                  {{ $t("imagePrompt.copyPositive") || "Kopiuj pozytywny" }}
                </button>
                <button
                  class="btn btn-outline col-span-1"
                  @click="copyPrompt(negativePrompt, 'negative')"
                  :disabled="!negativePrompt"
                >
                  <VIcon name="bi-clipboard" class="mr-1" />
                  {{ $t("imagePrompt.copyNegative") || "Kopiuj negatywny" }}
                </button>
                <button
                  class="btn btn-success col-span-1"
                  :disabled="!positivePrompt.trim()"
                  @click="generatePrompt"
                >
                  {{ $t("common.generate") || "Generuj" }}
                </button>
                <button
                  class="btn btn-error col-span-1"
                  :disabled="!hasAnySelection"
                  @click="resetAll"
                >
                  {{ $t("common.startOver") || "Zacznij od nowa" }}
                </button>
                <button
                  class="btn btn-outline col-span-2 btn-accent"
                  @click="exportPrompts"
                  :disabled="!positivePrompt"
                >
                  <VIcon name="bi-download" class="mr-1" />
                  {{ $t("ui.export") || "Eksportuj" }}
                </button>
              </div>

              <p v-if="lastCopyInfo" class="text-xs mt-2 text-center">
                {{ lastCopyInfo }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Global Selected Overview -->
      <div v-if="hasAnySelection" class="card bg-base-100 shadow-lg mt-6">
        <div class="card-body">
          <h3 class="card-title">
            {{ $t("ui.selectedTagsOverview") || "Przegląd wybranych tagów" }}
          </h3>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"
          >
            <div
              v-for="entry in stepsWithSelection"
              :key="entry.key"
              class="border border-base-300 rounded-lg p-3"
            >
              <div class="font-medium text-sm mb-2">
                {{ $t("categories." + mapCategoryKey(entry.key)) }}
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in selected[entry.key]"
                  :key="tag"
                  class="badge badge-sm"
                >
                  <span>{{ tag }}</span>
                  <button class="ml-1" @click="toggleOption(entry.key, tag)">
                    ✕
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Modal -->
      <div :class="['modal', showHelp ? 'modal-open' : '']">
        <div class="modal-box max-w-2xl">
          <div class="flex items-start justify-between mb-3">
            <h3 class="font-bold text-lg flex items-center gap-2">
              <VIcon name="bi-info-circle" class="text-primary" />
              {{ $t("common.help") || "Pomoc i skrócony opis" }}
            </h3>
            <button class="btn btn-sm btn-ghost" @click="showHelp = false">
              ✕
            </button>
          </div>
          <div class="space-y-3 text-sm leading-relaxed">
            <p>
              Ten kreator pomaga budować prompt do obrazów, grupując tagi w
              kategorie i kroki.
            </p>
            <ul class="list-disc pl-5 space-y-1">
              <li>
                <strong>Wyszukiwanie</strong>
                <VIcon name="bi-search" class="inline-block" /> — filtruje
                dostępne tagi w bieżącej kategorii.
              </li>
              <li>
                <strong>Multi-wybór</strong>
                <VIcon name="bi-layers" class="inline-block" /> — łatwiejsze
                zaznaczanie wielu tagów.
              </li>
              <li>
                <strong>Wagi</strong> — aktywuj w panelu zaawansowanym, by
                ustawiać np. (tag:1.3).
              </li>
              <li>
                <strong>Emfaza</strong> — kliknij na wybrany tag, by dodać
                nawiasy (()) podbijające znaczenie.
              </li>
              <li>
                <strong>Presety negatywne</strong> — szybkie dodanie często
                używanych negatywnych opisów.
              </li>
              <li>
                <strong>Ulubione</strong>
                <VIcon name="bi-star" class="inline-block" /> — przypinaj często
                używane tagi, aby szybko je dodać.
              </li>
              <li>
                <strong>Zestawy</strong> — zapisuj/ładuj konfiguracje wyborów
                (menu Zaawansowane).
              </li>
              <li>
                <strong>Tokeny</strong> — edytuj kolejność, usuwaj i modyfikuj
                akcent tokenów w panelu bocznym.
              </li>
              <li>
                <strong>Kopiowanie/Eksport</strong>
                <VIcon name="bi-clipboard" class="inline-block" /> — kopiuj
                prompt lub eksportuj do pliku .txt.
              </li>
              <li>
                <strong>Skróty</strong> — Ctrl+S (zapis zestawu), Ctrl+C (kopiuj
                pozytywny), Strzałki ←/→ (nawigacja kroków).
              </li>
            </ul>
          </div>
          <div class="modal-action">
            <button class="btn" @click="showHelp = false">
              {{ $t("common.ok") || "OK" }}
            </button>
          </div>
        </div>
        <div class="modal-backdrop" @click="showHelp = false"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { usePromptTagsMapStore } from "../store/promptTagsMap.js";

// Icons (oh-vue-icons)
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  BiInfoCircle,
  BiQuestionCircle,
  BiSearch,
  BiShuffle,
  BiClipboard,
  BiDownload,
  BiChevronLeft,
  BiChevronRight,
  BiGear,
  BiStar,
  BiLayers,
} from "oh-vue-icons/icons";
addIcons(
  BiInfoCircle,
  BiQuestionCircle,
  BiSearch,
  BiShuffle,
  BiClipboard,
  BiDownload,
  BiChevronLeft,
  BiChevronRight,
  BiGear,
  BiStar,
  BiLayers
);
const VIcon = OhVueIcon;
import { toast } from "vue-sonner";
const { locale, t } = useI18n();
const promptTagsMapStore = usePromptTagsMapStore();

// UI state
const showHelp = ref(false);

// Reactive state (logika zachowana)
const nsfw = ref(false);
const currentStep = ref(0);
const selected = ref({});
const customTag = ref("");
const tagSearch = ref("");
const lastCopyInfo = ref("");
const favorites = ref(JSON.parse(localStorage.getItem("pf_favorites") || "{}"));
const showAdvanced = ref(false);
const enableWeights = ref(true);
const tagWeights = ref({});
const negativePresets = ref([
  { name: "Artifacts", value: "blurry, low quality, jpeg artifacts" },
  { name: "Anatomy", value: "bad anatomy, extra limbs, disfigured" },
  { name: "Watermark", value: "text, watermark, logo" },
  { name: "Distort", value: "tiling, deformed, mutated" },
]);
const selectedNegativePresetNames = ref([]);
const saveSetName = ref("");
const savedSets = ref(JSON.parse(localStorage.getItem("pf_sets") || "[]"));
const multiSelectMode = ref(false);
const emphasisLevels = ref({});
const undoStack = ref([]);
const redoStack = ref([]);
const hideEmpty = ref(true);
const currentGroupIndex = ref(0);

// Mapy kategorii i grupy (zachowane)
const tagCategoryMap = {
  subject: "Subject",
  character_traits: "Character Traits",
  hair: "Hair",
  eyes: "Eyes",
  clothing: "Clothing",
  accessories: "Accessories",
  body_features: "Body Features",
  setting: "Setting",
  quality: "Quality",
  expression_pose: "Expression/Pose",
  nsfw: "NSFW",
  lighting_effects: "Lighting/Effects",
  characters: "Characters",
  themes_moods: "Themes/Moods",
  technology_objects: "Technology/Objects",
  camera_angles: "Camera Angles",
  perspectives: "Perspectives",
  color_palettes: "Color Palettes",
  art_style: "Art Style",
  medium: "Medium",
  lighting_direction: "Lighting Direction",
  time_of_day: "Time of Day",
  weather: "Weather",
  environment_details: "Environment Details",
  camera_settings: "Camera Settings",
  lens_type: "Lens Type",
  focal_length: "Focal Length",
  depth_of_field: "Depth of Field",
  composition_rules: "Composition Rules",
  color_grading: "Color Grading",
  texture_materials: "Texture Materials",
  post_processing: "Post Processing",
  rendering_engine: "Rendering Engine",
  anatomy_details: "Anatomy Details",
  facial_features: "Facial Features",
  hand_details: "Hand Details",
  background_elements: "Background Elements",
  motion_effects: "Motion Effects",
};

const stepGroups = [
  {
    key: "concept",
    labelKey: "categoryGroups.concept",
    icon: "🧠",
    steps: ["subject", "themes_moods", "art_style", "medium"],
  },
  {
    key: "character",
    labelKey: "categoryGroups.character",
    icon: "👤",
    steps: ["character_traits", "characters"],
  },
  {
    key: "appearance",
    labelKey: "categoryGroups.appearance",
    icon: "🎨",
    steps: [
      "hair",
      "eyes",
      "anatomy_details",
      "facial_features",
      "hand_details",
      "body_features",
      "clothing",
      "accessories",
      "nsfw",
    ],
  },
  {
    key: "scene",
    labelKey: "categoryGroups.scene",
    icon: "🌆",
    steps: [
      "setting",
      "environment_details",
      "background_elements",
      "weather",
      "time_of_day",
      "lighting_effects",
      "lighting_direction",
      "motion_effects",
    ],
  },
  {
    key: "composition",
    labelKey: "categoryGroups.composition",
    icon: "🧩",
    steps: [
      "composition_rules",
      "perspectives",
      "camera_angles",
      "focal_length",
      "lens_type",
      "depth_of_field",
    ],
  },
  {
    key: "colorMood",
    labelKey: "categoryGroups.colorMood",
    icon: "🌈",
    steps: ["color_palettes", "color_grading"],
  },
  {
    key: "technical",
    labelKey: "categoryGroups.technical",
    icon: "🛠",
    steps: [
      "quality",
      "technology_objects",
      "texture_materials",
      "rendering_engine",
      "post_processing",
      "camera_settings",
    ],
  },
  {
    key: "extras",
    labelKey: "categoryGroups.extras",
    icon: "➕",
    steps: [],
  },
];

// Computed
const mapCategoryKey = (k) =>
  ({
    subject: "subject",
    character_traits: "characterTraits",
    hair: "hair",
    eyes: "eyes",
    clothing: "clothing",
    accessories: "accessories",
    body_features: "bodyFeatures",
    setting: "setting",
    quality: "quality",
    expression_pose: "expressionPose",
    nsfw: "nsfw",
    lighting_effects: "lightingEffects",
    characters: "characters",
    themes_moods: "themesMoods",
    technology_objects: "technologyObjects",
    camera_angles: "cameraAngles",
    perspectives: "perspectives",
    color_palettes: "colorPalettes",
    art_style: "artStyle",
    medium: "medium",
    lighting_direction: "lightingDirection",
    time_of_day: "timeOfDay",
    weather: "weather",
    environment_details: "environmentDetails",
    camera_settings: "cameraSettings",
    lens_type: "lensType",
    focal_length: "focalLength",
    depth_of_field: "depthOfField",
    composition_rules: "compositionRules",
    color_grading: "colorGrading",
    texture_materials: "textureMaterials",
    post_processing: "postProcessing",
    rendering_engine: "renderingEngine",
    anatomy_details: "anatomyDetails",
    facial_features: "facialFeatures",
    hand_details: "handDetails",
    background_elements: "backgroundElements",
    motion_effects: "motionEffects",
  })[k] || k;

const categoryHasOptions = (stepKey) => {
  const categoryName = tagCategoryMap[stepKey];
  if (!categoryName) return false;
  const section = promptTagsMapStore.getSection(categoryName, locale.value);
  if (!section) return false;
  const arr = section || [];
  return nsfw.value ? arr.length > 0 : arr.some((o) => !o.nsfw);
};

const showCategory = (k) =>
  !(k === "nsfw" && !nsfw.value) && (!hideEmpty.value || categoryHasOptions(k));

const visibleGroups = computed(() =>
  stepGroups.filter((g) => g.steps.some((k) => showCategory(k)))
);

const stepsFlattened = computed(() =>
  visibleGroups.value.flatMap((g) =>
    g.steps
      .filter((k) => showCategory(k))
      .map((k) => ({ key: k, group: g.key }))
  )
);

const activeEntry = computed(
  () => stepsFlattened.value[currentStep.value] || null
);
const activeKey = computed(() => activeEntry.value?.key || "");
const activeStepLabel = computed(() =>
  activeKey.value ? t("categories." + mapCategoryKey(activeKey.value)) : ""
);

const visibleGroupCategories = computed(() => {
  const g = visibleGroups.value[currentGroupIndex.value];
  if (!g) return [];
  return g.steps.filter((k) => showCategory(k));
});

const getOptions = (stepKey) => {
  if (!stepKey) return [];
  const categoryName = tagCategoryMap[stepKey];
  if (!categoryName) return [];
  const raw = promptTagsMapStore.getSection(categoryName, locale.value);
  if (!Array.isArray(raw)) return [];
  return nsfw.value ? raw : raw.filter((o) => !o.nsfw);
};

const currentCategoryOptions = computed(() => getOptions(activeKey.value));

const filteredCategoryOptions = computed(() => {
  if (!tagSearch.value.trim()) return currentCategoryOptions.value;
  const q = tagSearch.value.toLowerCase();
  return currentCategoryOptions.value.filter((o) =>
    o.positive.toLowerCase().includes(q)
  );
});

const positiveTokens = computed(() => {
  const tokens = [];
  for (const entry of stepsFlattened.value) {
    if (entry.key === "nsfw" && !nsfw.value) continue;
    const arr = selected.value[entry.key];
    if (arr?.length) tokens.push(...arr);
  }
  return tokens;
});

const formatEmphasis = (tag) => {
  const level = emphasisLevels.value[tag] || 0;
  if (level <= 0) return tag;
  return `${"(".repeat(level)}${tag}${")".repeat(level)}`;
};

const weightedPositiveTokens = computed(() => {
  if (!enableWeights.value) {
    return positiveTokens.value.map((t) => formatEmphasis(t));
  }
  return positiveTokens.value.map((t) => {
    const w = tagWeights.value[t];
    if (w && w !== 1) {
      return `(${t}:${w.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")})`;
    }
    return formatEmphasis(t);
  });
});

const positivePrompt = computed(() => weightedPositiveTokens.value.join(", "));

const negativePrompt = computed(() => {
  const base = [];
  for (const entry of stepsFlattened.value) {
    if (entry.key === "nsfw" && !nsfw.value) continue;
    const arr = selected.value[entry.key];
    if (!arr?.length) continue;
    const opts = getOptions(entry.key);
    arr.forEach((t) => {
      const found = opts.find((o) => o.positive === t);
      if (found?.negative) base.push(found.negative);
    });
  }
  const presetsJoined = selectedNegativePresetNames.value
    .map((n) => negativePresets.value.find((p) => p.name === n)?.value)
    .filter(Boolean)
    .join(", ");
  return [...base, presetsJoined].filter(Boolean).join(", ");
});

const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

const stepsWithSelection = computed(() =>
  stepsFlattened.value.filter((e) => selected.value[e.key]?.length)
);

const hasAnySelection = computed(() =>
  Object.values(selected.value).some((v) => v?.length)
);

const favoriteList = computed(() => {
  const out = [];
  for (const k in favorites.value) {
    favorites.value[k].forEach((tag) => out.push({ key: k, tag }));
  }
  return out;
});

const selectedCount = (key) => selected.value[key]?.length || 0;
const totalCategories = computed(() => stepsFlattened.value.length);
const categoriesWithSelection = computed(
  () => stepsFlattened.value.filter((e) => selectedCount(e.key) > 0).length
);
const overallProgressPercent = computed(() =>
  totalCategories.value
    ? Math.round((categoriesWithSelection.value / totalCategories.value) * 100)
    : 0
);
const groupSelectionInfo = computed(() =>
  visibleGroups.value.map((g) => {
    const cats = g.steps.filter((k) => showCategory(k));
    const sel = cats.filter((k) => selectedCount(k) > 0).length;
    return { key: g.key, total: cats.length, selected: sel };
  })
);

const estimatedTokenCount = computed(() =>
  Math.ceil(positivePrompt.value.length / 4)
);

// Actions / logic
const cycleEmphasis = (tag) => {
  if (!tag) return;
  const current = emphasisLevels.value[tag] || 0;
  const next = (current + 1) % 4;
  if (next === 0) delete emphasisLevels.value[tag];
  else emphasisLevels.value[tag] = next;
};

const emphasisTooltip = (tag) =>
  t("ui.emphasisTooltip", {
    level: emphasisLevels.value[tag] || 0,
  });

const snapshot = () =>
  JSON.parse(
    JSON.stringify({
      selected: selected.value,
      weights: tagWeights.value,
      presets: selectedNegativePresetNames.value,
      emphasis: emphasisLevels.value,
    })
  );

const pushUndo = () => {
  undoStack.value.push(snapshot());
  if (undoStack.value.length > 50) undoStack.value.shift();
  redoStack.value = [];
};

const undo = () => {
  if (!canUndo.value) return;
  const prev = undoStack.value.pop();
  redoStack.value.push(snapshot());
  restoreSnapshot(prev);
  toast.info(t("common.undo") || "Cofnięto");
};

const redo = () => {
  if (!canRedo.value) return;
  const next = redoStack.value.pop();
  undoStack.value.push(snapshot());
  restoreSnapshot(next);
  toast.info(t("common.redo") || "Przywrócono");
};

const restoreSnapshot = (snap) => {
  selected.value = snap.selected || {};
  tagWeights.value = snap.weights || {};
  selectedNegativePresetNames.value = snap.presets || [];
  emphasisLevels.value = snap.emphasis || {};
};

const nextStep = () => {
  if (currentStep.value < stepsFlattened.value.length - 1) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};

const goToGroup = (gi) => {
  const g = visibleGroups.value[gi];
  if (!g) return;
  const first = g.steps.find((k) => showCategory(k));
  if (!first) return;
  const flatIndex = stepsFlattened.value.findIndex((e) => e.key === first);
  if (flatIndex >= 0) currentStep.value = flatIndex;
};

const goToCategory = (ckey) => {
  const flatIndex = stepsFlattened.value.findIndex((e) => e.key === ckey);
  if (flatIndex >= 0) currentStep.value = flatIndex;
};

const isActiveCategory = (ckey) => activeKey.value === ckey;

const isSelected = (key, tag) => selected.value[key]?.includes(tag);

const normalizeWeight = (tag) => {
  if (tagWeights.value[tag] == null) tagWeights.value[tag] = 1;
  if (tagWeights.value[tag] <= 0) tagWeights.value[tag] = 0.1;
};

const toggleNegativePreset = (name) => {
  const idx = selectedNegativePresetNames.value.indexOf(name);
  if (idx > -1) selectedNegativePresetNames.value.splice(idx, 1);
  else selectedNegativePresetNames.value.push(name);
};

const clearNegativePresets = () => {
  selectedNegativePresetNames.value = [];
};

const saveCurrentSet = () => {
  const name = saveSetName.value.trim();
  if (!name) return;
  savedSets.value.push({
    name,
    time: Date.now(),
    payload: {
      selected: selected.value,
      tagWeights: tagWeights.value,
      negativePresets: selectedNegativePresetNames.value,
      emphasis: emphasisLevels.value,
    },
  });
  localStorage.setItem("pf_sets", JSON.stringify(savedSets.value));
  saveSetName.value = "";
  toast.success(t("ui.setSaved") || "Zestaw zapisany");
};

const loadSet = (idx) => {
  const s = savedSets.value[idx];
  if (!s) return;
  pushUndo();
  selected.value = JSON.parse(JSON.stringify(s.payload.selected || {}));
  tagWeights.value = JSON.parse(JSON.stringify(s.payload.tagWeights || {}));
  selectedNegativePresetNames.value = JSON.parse(
    JSON.stringify(s.payload.negativePresets || [])
  );
  emphasisLevels.value = JSON.parse(JSON.stringify(s.payload.emphasis || {}));
  toast.success(t("ui.setLoaded") || "Zestaw wczytany");
};

const deleteSet = (idx) => {
  savedSets.value.splice(idx, 1);
  localStorage.setItem("pf_sets", JSON.stringify(savedSets.value));
  toast.info(t("ui.setDeleted") || "Zestaw usunięty");
};

const selectAllInCategory = () => {
  pushUndo();
  const opts = currentCategoryOptions.value.map((o) => o.positive);
  selected.value[activeKey.value] = [
    ...new Set([...(selected.value[activeKey.value] || []), ...opts]),
  ];
  if (enableWeights.value)
    opts.forEach((t) => {
      if (tagWeights.value[t] == null) tagWeights.value[t] = 1;
    });
  toast.success(t("ui.selectedAll") || "Zaznaczono wszystkie");
};

const escapeHTML = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]
  );

const highlight = (text) => {
  if (!tagSearch.value.trim()) return escapeHTML(text);
  const q = tagSearch.value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${q})`, "ig");
  return escapeHTML(text).replace(re, "<mark>$1</mark>");
};

const toggleOption = (key, tag) => {
  if (!key || !tag) return;
  pushUndo();
  if (!selected.value[key]) selected.value[key] = [];
  const idx = selected.value[key].indexOf(tag);
  if (idx > -1) {
    selected.value[key].splice(idx, 1);
    delete emphasisLevels.value[tag];
  } else {
    selected.value[key].push(tag);
    if (enableWeights.value && tagWeights.value[tag] == null) {
      tagWeights.value[tag] = 1;
    }
  }
};

const addCustomTag = () => {
  if (!customTag.value.trim()) return;
  const k = activeKey.value;
  if (!k) return;
  if (!selected.value[k]) selected.value[k] = [];
  const prepared = `[custom] ${customTag.value.trim()}`;
  if (!selected.value[k].includes(prepared)) {
    selected.value[k].push(prepared);
  }
  customTag.value = "";
  toast.success(t("ui.customTagAdded") || "Dodano własny tag");
};

const handleNsfwToggle = () => {
  if (!nsfw.value && activeKey.value === "nsfw") currentStep.value = 0;
};

const generatePrompt = () => {
  console.log("Positive:", positivePrompt.value);
  console.log("Negative:", negativePrompt.value);
  toast.success(t("common.generated") || "Wygenerowano prompt");
};

const copyPrompt = (prompt, type) => {
  if (!prompt) return;
  navigator.clipboard
    .writeText(prompt)
    .then(() => {
      lastCopyInfo.value =
        (locale.value === "pl" ? "Skopiowano: " : "Copied: ") +
        (type === "positive"
          ? locale.value === "pl"
            ? "Pozytywny"
            : "Positive"
          : locale.value === "pl"
            ? "Negatywny"
            : "Negative") +
        " (" +
        new Date().toLocaleTimeString() +
        ")";
      toast.success(
        type === "positive"
          ? t("imagePrompt.copyPositive") || "Skopiowano pozytywny"
          : t("imagePrompt.copyNegative") || "Skopiowano negatywny"
      );
    })
    .catch(() => toast.error(t("ui.copyFailed") || "Nie udało się skopiować"));
};

const resetAll = () => {
  selected.value = {};
  currentStep.value = 0;
  nsfw.value = false;
  customTag.value = "";
  tagSearch.value = "";
  emphasisLevels.value = {};
  tagWeights.value = {};
  toast.info(t("common.reset") || "Zresetowano");
};

const clearCategory = () => {
  if (activeKey.value) {
    selected.value[activeKey.value] = [];
    toast.info(t("ui.categoryCleared") || "Kategoria wyczyszczona");
  }
};

const moveToken = (index, dir) => {
  const arr = positiveTokens.value.slice();
  const newIndex = index + dir;
  if (newIndex < 0 || newIndex >= arr.length) return;
  const tmp = arr[index];
  arr[index] = arr[newIndex];
  arr[newIndex] = tmp;

  // Reconstruct per category
  const flatKeys = stepsFlattened.value.map((e) => e.key);
  const counts = {};
  flatKeys.forEach((k) => {
    if (k === "nsfw" && !nsfw.value) return;
    counts[k] = selected.value[k]?.length || 0;
  });
  const reconstructed = {};
  let cursor = 0;
  flatKeys.forEach((k) => {
    if (k === "nsfw" && !nsfw.value) return;
    const c = counts[k];
    if (c > 0) {
      reconstructed[k] = arr.slice(cursor, cursor + c);
      cursor += c;
    }
  });
  selected.value = { ...selected.value, ...reconstructed };
};

const removeToken = (token) => {
  for (const k in selected.value) {
    const idx = selected.value[k]?.indexOf(token);
    if (idx > -1) {
      selected.value[k].splice(idx, 1);
      delete emphasisLevels.value[token];
    }
  }
};

const randomTag = () => {
  if (!currentCategoryOptions.value.length) return;
  const pool = currentCategoryOptions.value.filter(
    (o) => !isSelected(activeKey.value, o.positive)
  );
  const source = pool.length ? pool : currentCategoryOptions.value;
  const pick = source[Math.floor(Math.random() * source.length)];
  toggleOption(activeKey.value, pick.positive);
  toast(t("ui.addedRandom") || "Dodano losowy tag");
};

const exportPrompts = () => {
  const blob = new Blob(
    [
      `Positive:\n${positivePrompt.value}\n\nNegative:\n${negativePrompt.value}\n`,
    ],
    { type: "text/plain" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "prompts.txt";
  a.click();
  URL.revokeObjectURL(a.href);
  toast.success(t("ui.exported") || "Wyeksportowano do pliku");
};

const isFavorite = (key, tag) => favorites.value[key]?.includes(tag);

const toggleFavorite = (key, tag) => {
  if (!favorites.value[key]) favorites.value[key] = [];
  const idx = favorites.value[key].indexOf(tag);
  if (idx > -1) favorites.value[key].splice(idx, 1);
  else favorites.value[key].push(tag);
  persistFavorites();
};

const applyFavorite = (fav) => {
  if (!selected.value[fav.key]) selected.value[fav.key] = [];
  if (!selected.value[fav.key].includes(fav.tag))
    selected.value[fav.key].push(fav.tag);
};

const removeFavorite = (key, tag) => {
  if (!favorites.value[key]) return;
  favorites.value[key] = favorites.value[key].filter((t) => t !== tag);
  persistFavorites();
};

const clearFavorites = () => {
  favorites.value = {};
  persistFavorites();
};

const persistFavorites = () => {
  localStorage.setItem("pf_favorites", JSON.stringify(favorites.value));
  toast.info(t("ui.favoritesSaved") || "Zapisano ulubione");
};

const clearSearch = () => {
  tagSearch.value = "";
};

// Watchers
watch([activeKey, stepsFlattened], () => {
  const idx = visibleGroups.value.findIndex((g) =>
    g.steps.includes(activeKey.value)
  );
  if (idx >= 0) currentGroupIndex.value = idx;
});

watch([stepsFlattened, nsfw, locale], () => {
  if (!stepsFlattened.value.length) {
    currentStep.value = 0;
    return;
  }
  if (currentStep.value >= stepsFlattened.value.length) {
    currentStep.value = stepsFlattened.value.length - 1;
  }
});

// Keyboard shortcuts
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveCurrentSet();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      copyPrompt(positivePrompt.value, "positive");
    }
    if (e.key === "ArrowRight") nextStep();
    if (e.key === "ArrowLeft") prevStep();
  });

  // Initial snapshot
  pushUndo();
});
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Animacja panelu zaawansowanego */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Podświetlenie wyszukiwanej frazy */
:deep(mark) {
  background: hsl(var(--a) / 0.3);
  color: inherit;
  border-radius: 0.25rem;
  padding: 0 2px;
}
</style>
