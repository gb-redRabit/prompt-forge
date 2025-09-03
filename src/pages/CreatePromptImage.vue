<template>
  <div class="container mx-auto py-8 px-4">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-primary mb-2">
        {{ $t("imagePrompt.advancedCreator") }}
      </h1>
      <p class="text-base-content/70">
        {{ $t("imagePrompt.description") }}
      </p>
    </div>

    <!-- Top Controls -->
    <div class="flex flex-wrap gap-4 justify-center mb-6">
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="nsfw"
          v-model="nsfw"
          class="checkbox checkbox-primary"
          @change="onNsfwToggle"
        />
        <label for="nsfw" class="cursor-pointer font-semibold text-sm">
          {{ $t("imagePrompt.nsfw") }}
        </label>
      </div>

      <div class="join">
        <input
          v-model="tagSearch"
          type="text"
          class="input input-bordered join-item w-64"
          :placeholder="$t('ui.searchTagsPlaceholder')"
        />
        <button
          class="btn btn-ghost join-item"
          :disabled="!tagSearch"
          @click="tagSearch = ''"
          :title="$t('ui.clearSearch')"
        >
          ✕
        </button>
      </div>

      <button
        class="btn btn-outline btn-sm"
        @click="randomTagCurrent"
        :disabled="!currentCategoryOptions.length"
      >
        🎲 {{ $t("ui.randomTag") }}
      </button>

      <button
        class="btn btn-outline btn-sm"
        @click="exportPrompts"
        :disabled="!positivePrompt"
      >
        💾 {{ $t("ui.export") }}
      </button>

      <button
        class="btn btn-outline btn-sm"
        @click="dedupeAll"
        :disabled="!hasAnySelection"
      >
        🧹 {{ $t("ui.dedupe") }}
      </button>
    </div>

    <!-- Secondary controls -->
    <div class="w-full flex flex-wrap gap-3 justify-center mb-4">
      <button
        class="btn btn-sm btn-outline"
        @click="showAdvanced = !showAdvanced"
      >
        ⚙️ {{ showAdvanced ? $t("ui.hideAdvanced") : $t("ui.showAdvanced") }}
      </button>
      <button class="btn btn-sm btn-outline" @click="hideEmpty = !hideEmpty">
        {{ hideEmpty ? $t("ui.showEmpty") : $t("ui.hideEmpty") }}
      </button>
      <button
        class="btn btn-sm btn-outline"
        @click="multiSelectMode = !multiSelectMode"
        :class="multiSelectMode ? 'btn-primary' : ''"
      >
        🗂 {{ multiSelectMode ? $t("ui.multiOn") : $t("ui.multiOff") }}
      </button>
      <button class="btn btn-sm btn-outline" @click="undo" :disabled="!canUndo">
        ↶ {{ $t("ui.undo") }}
      </button>
      <button class="btn btn-sm btn-outline" @click="redo" :disabled="!canRedo">
        ↷ {{ $t("ui.redo") }}
      </button>
    </div>

    <!-- Advanced Panel -->
    <transition name="fade">
      <div v-if="showAdvanced" class="card bg-base-200/40 shadow-inner mb-6">
        <div class="card-body grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 class="font-semibold mb-2">{{ $t("ui.weights") }}</h4>
            <label class="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                class="toggle toggle-sm"
                v-model="enableWeights"
              />
              <span>{{
                enableWeights
                  ? $t("ui.weightsActive")
                  : $t("ui.weightsInactive")
              }}</span>
            </label>
            <p class="opacity-70 text-xs">
              {{ $t("ui.weightsHint") }}
            </p>
            <p class="opacity-70 text-xs mt-1">
              {{ $t("ui.emphasisHint") }}
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-2">{{ $t("ui.negativePresets") }}</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="p in negativePresets"
                :key="p.name"
                class="badge cursor-pointer"
                :class="
                  selectedNegativePresetNames.includes(p.name)
                    ? 'badge-primary'
                    : 'badge-outline'
                "
                @click="toggleNegativePreset(p.name)"
              >
                {{ p.name }}
              </button>
            </div>
            <div class="mt-2 flex gap-2">
              <button class="btn btn-xs" @click="clearNegativePresets">
                {{ $t("ui.reset") }}
              </button>
            </div>
          </div>
          <div>
            <h4 class="font-semibold mb-2">
              {{ $t("ui.savedSets") }}
            </h4>
            <div class="flex gap-2 mb-2">
              <input
                v-model="saveSetName"
                class="input input-bordered input-xs flex-1"
                :placeholder="$t('ui.namePlaceholder')"
              />
              <button
                class="btn btn-xs btn-primary"
                @click="saveCurrentSet"
                :disabled="!saveSetName.trim()"
                :title="$t('ui.saveSet')"
              >
                💾
              </button>
            </div>
            <div class="flex flex-wrap gap-2 max-h-24 overflow-auto">
              <div
                v-for="(s, i) in savedSets"
                :key="s.name + '_' + i"
                class="badge badge-outline gap-1 cursor-pointer"
                @click="loadSet(i)"
                :title="
                  $t('ui.savedAt') + ': ' + new Date(s.time).toLocaleString()
                "
              >
                {{ s.name }}
                <span
                  class="ml-1 text-error cursor-pointer"
                  @click.stop="deleteSet(i)"
                  :title="$t('ui.delete')"
                  >✕</span
                >
              </div>
            </div>
            <div class="mt-2 flex gap-2">
              <button
                class="btn btn-xs btn-outline"
                @click="exportSetJSON"
                :disabled="!savedSets.length"
                :title="$t('ui.exportJSON')"
              >
                ⇩ JSON
              </button>
              <label
                class="btn btn-xs btn-outline cursor-pointer"
                :title="$t('ui.importJSON')"
              >
                ⇧ JSON
                <input
                  type="file"
                  accept="application/json"
                  class="hidden"
                  @change="importSetJSON"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Progress / Groups Navigation (NOWY UI) -->
    <div class="mb-8 space-y-4" v-if="stepsFlattened.length">
      <!-- Pasek grup (scroll) -->
      <div class="relative">
        <div
          class="flex gap-2 overflow-x-auto pb-1 hide-scrollbar"
          ref="groupBar"
        >
          <button
            v-for="(g, gi) in visibleGroups"
            :key="g.key"
            class="group btn btn-xs rounded-full transition-all duration-200 relative"
            :class="gi === currentGroupIndex ? 'btn-primary' : 'btn-outline'"
            @click="goToGroup(gi)"
            :title="$t(g.labelKey)"
          >
            <span class="opacity-80 mr-1">{{ g.icon }}</span>
            {{ $t(g.labelKey) }}
            <span
              v-if="groupSelectionInfo.find((x) => x.key === g.key)"
              class="ml-1 text-[10px] font-medium rounded px-1 bg-base-100/40"
            >
              {{ groupSelectionInfo.find((x) => x.key === g.key).selected }}/{{
                groupSelectionInfo.find((x) => x.key === g.key).total
              }}
            </span>
          </button>
        </div>
      </div>

      <!-- Kategorie aktywnej grupy -->
      <div
        class="flex flex-wrap gap-2 items-center border border-base-300/60 rounded-xl p-3 bg-base-200/30"
      >
        <button
          v-for="ckey in visibleGroupCategories"
          :key="ckey"
          class="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition relative hover:shadow-sm focus:outline-none focus:ring"
          :class="[
            isActiveCategory(ckey)
              ? 'bg-primary text-primary-content'
              : selectedCount(ckey) > 0
                ? 'bg-base-300'
                : 'bg-base-100',
          ]"
          @click="goToCategory(ckey)"
        >
          <span>{{ $t("categories." + mapCategoryKey(ckey)) }}</span>
          <span
            v-if="selectedCount(ckey) > 0"
            class="ml-2 inline-flex items-center justify-center bg-primary-content/20 text-[10px] px-1 rounded"
          >
            {{ selectedCount(ckey) }}
          </span>
          <span
            v-if="isActiveCategory(ckey)"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-primary"
          ></span>
        </button>
      </div>

      <!-- Pasek globalny -->
      <div class="flex flex-col gap-2">
        <div
          class="flex justify-between text-[11px] uppercase tracking-wide opacity-70"
        >
          <span>{{ $t("ui.progressOverall") }}</span>
          <span>{{ overallProgressPercent }}%</span>
        </div>
        <div
          class="h-3 w-full bg-base-300/50 rounded-full overflow-hidden relative"
        >
          <div
            class="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
            :style="{ width: overallProgressPercent + '%' }"
          ></div>
          <div
            class="absolute inset-0 flex items-center justify-center text-[10px] font-semibold opacity-70"
          >
            {{ categoriesWithSelection }}/{{ totalCategories }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning text-sm">
      {{ $t("ui.noCategories") }}
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8" v-if="activeKey">
      <!-- Tag selection -->
      <div class="xl:col-span-2 space-y-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-start gap-4 flex-wrap">
              <h2 class="card-title text-xl">
                {{ activeStepLabel }}
                <span class="badge badge-sm badge-outline ml-2">
                  {{ filteredCategoryOptions.length }}/{{
                    currentCategoryOptions.length
                  }}
                </span>
              </h2>
              <div class="flex gap-2">
                <button
                  class="btn btn-xs btn-outline"
                  @click="clearCategory"
                  :disabled="!selected[activeKey]?.length"
                >
                  {{ $t("ui.clearCategory") }}
                </button>
                <button
                  class="btn btn-xs btn-outline"
                  @click="randomTagCurrent"
                  :disabled="!currentCategoryOptions.length"
                  :title="$t('ui.randomTag')"
                >
                  🎲
                </button>
              </div>
            </div>

            <!-- Tag Buttons -->
            <div
              class="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2 mb-4"
            >
              <button
                v-for="option in filteredCategoryOptions"
                :key="option.positive"
                class="btn btn-sm justify-between"
                :class="[
                  isSelected(activeKey, option.positive)
                    ? 'btn-primary'
                    : 'btn-outline',
                  option.nsfw ? 'border-error text-error' : '',
                ]"
                @click="toggleOption(activeKey, option.positive)"
              >
                <span
                  class="truncate"
                  v-html="highlight(option.positive)"
                ></span>
                <span class="flex items-center gap-1">
                  <button
                    type="button"
                    class="btn btn-xs btn-ghost px-1"
                    @click.stop="toggleFavorite(activeKey, option.positive)"
                    :title="
                      isFavorite(activeKey, option.positive)
                        ? $t('ui.unfavorite')
                        : $t('ui.favorite')
                    "
                  >
                    <span
                      :class="
                        isFavorite(activeKey, option.positive)
                          ? 'text-warning'
                          : 'text-base-content/40'
                      "
                      >★</span
                    >
                  </button>
                </span>
              </button>
            </div>

            <!-- Custom Tag -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{
                  $t("imagePrompt.customTag")
                }}</span>
              </label>
              <div class="join w-full">
                <input
                  v-model="customTag"
                  type="text"
                  class="input input-bordered join-item flex-1"
                  :placeholder="$t('ui.addCustomTagPlaceholder')"
                  @keyup.enter="addCustomTag"
                />
                <button class="btn btn-primary join-item" @click="addCustomTag">
                  {{ $t("common.add") }}
                </button>
              </div>
            </div>

            <!-- Selected preview (category) -->
            <div v-if="selected[activeKey]?.length" class="mt-4">
              <p class="font-semibold text-sm mb-2">
                {{ $t("ui.selectedInCategory") }}
              </p>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="tag in selected[activeKey]"
                  :key="tag"
                  class="badge badge-outline gap-1 items-center"
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
                      class="w-14 input input-xs input-bordered"
                      v-model.number="tagWeights[tag]"
                      @change="normalizeWeight(tag)"
                      :title="$t('ui.weight')"
                    />
                  </template>
                  <button
                    class="ml-1 text-xs"
                    @click="toggleOption(activeKey, tag)"
                    :title="$t('ui.remove')"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="card-actions justify-between mt-6">
              <button
                class="btn btn-outline"
                :disabled="currentStep === 0"
                @click="prevStep"
              >
                {{ $t("common.back") }}
              </button>
              <div class="flex gap-2">
                <button
                  class="btn btn-ghost"
                  :disabled="currentStep === stepsFlattened.length - 1"
                  @click="nextStep"
                >
                  {{ $t("common.next") }}
                </button>
                <button
                  class="btn btn-xs btn-outline"
                  @click="selectAllInCategory"
                  :disabled="!currentCategoryOptions.length"
                  :title="$t('ui.selectAll')"
                >
                  ✓*
                </button>
                <button
                  class="btn btn-xs btn-outline"
                  @click="unselectAllInCategory"
                  :disabled="!selected[activeKey]?.length"
                  :title="$t('ui.unselectAll')"
                >
                  ✕*
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Favorites -->
        <div v-if="favoriteList.length" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title text-lg">★ {{ $t("ui.favorites") }}</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="fav in favoriteList"
                :key="fav.key + '_' + fav.tag"
                class="badge badge-primary gap-1 hover:badge-secondary cursor-pointer"
                @click="applyFavorite(fav)"
                :title="fav.key"
              >
                {{ fav.tag }}
                <span
                  class="ml-1 cursor-pointer"
                  @click.stop="removeFavorite(fav.key, fav.tag)"
                  :title="$t('ui.removeFavorite')"
                  >✕</span
                >
              </button>
            </div>
            <div class="mt-3">
              <button class="btn btn-xs btn-outline" @click="clearFavorites">
                {{ $t("ui.clearFavorites") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Prompt preview -->
      <div class="xl:col-span-1 space-y-6">
        <div class="card bg-base-100 shadow-xl sticky top-4">
          <div class="card-body">
            <h2 class="card-title text-lg mb-2">
              {{ $t("imagePrompt.promptPreview") }}
            </h2>

            <!-- Positive -->
            <label class="label">
              <span class="label-text font-semibold">
                {{ $t("imagePrompt.positivePrompt") }}
              </span>
            </label>
            <div class="space-y-2">
              <ul
                class="flex flex-wrap gap-2 max-h-32 overflow-auto border rounded p-2 text-sm bg-base-200/40"
              >
                <li
                  v-for="(token, idx) in positiveTokens"
                  :key="token + '_' + idx"
                  class="badge badge-outline gap-1"
                >
                  <span
                    class="cursor-pointer"
                    @click="cycleEmphasis(token)"
                    :title="emphasisTooltip(token)"
                  >
                    {{
                      emphasisLevels[token]
                        ? "(".repeat(emphasisLevels[token]) +
                          token +
                          ")".repeat(emphasisLevels[token])
                        : token
                    }}
                  </span>
                  <div class="flex items-center gap-1">
                    <button
                      class="text-xs"
                      @click="moveToken(idx, -1)"
                      :disabled="idx === 0"
                      :title="$t('ui.moveUp')"
                    >
                      ↑
                    </button>
                    <button
                      class="text-xs"
                      @click="moveToken(idx, 1)"
                      :disabled="idx === positiveTokens.length - 1"
                      :title="$t('ui.moveDown')"
                    >
                      ↓
                    </button>
                    <button
                      class="text-xs"
                      @click="removeToken(token)"
                      :title="$t('ui.remove')"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <textarea
              v-model="positivePrompt"
              readonly
              class="textarea textarea-bordered w-full h-28 mt-3 text-xs"
            ></textarea>

            <div class="mt-2 text-xs opacity-70 flex flex-wrap gap-4">
              <span>{{ $t("ui.tags") }}: {{ positiveTokens.length }}</span>
              <span
                >{{ $t("ui.approxTokens") }}: {{ estimatedTokenCount }}</span
              >
              <span
                >{{ $t("ui.weightsActiveLabel") }}:
                {{ enableWeights ? "ON" : "OFF" }}</span
              >
            </div>

            <!-- Negative -->
            <label class="label mt-4">
              <span class="label-text font-semibold">
                {{ $t("imagePrompt.negativePrompt") }}
              </span>
            </label>
            <textarea
              v-model="negativePrompt"
              readonly
              class="textarea textarea-bordered w-full h-24 text-xs"
            ></textarea>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <button
                class="btn btn-success btn-sm"
                :disabled="!positivePrompt.trim()"
                @click="generatePrompt"
              >
                {{ $t("common.generate") }}
              </button>
              <button
                class="btn btn-accent btn-sm"
                :disabled="!hasAnySelection"
                @click="resetAll"
              >
                {{ $t("common.startOver") }}
              </button>
              <button
                class="btn btn-outline btn-xs col-span-1"
                :disabled="!positivePrompt"
                @click="copyPrompt(positivePrompt, 'positive')"
              >
                {{ $t("imagePrompt.copyPositive") }}
              </button>
              <button
                class="btn btn-outline btn-xs col-span-1"
                :disabled="!negativePrompt"
                @click="copyPrompt(negativePrompt, 'negative')"
              >
                {{ $t("imagePrompt.copyNegative") }}
              </button>
            </div>

            <p v-if="lastCopyInfo" class="text-xs mt-2 opacity-70">
              {{ lastCopyInfo }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Global selected overview -->
    <div v-if="hasAnySelection" class="mt-10 card bg-base-100 shadow">
      <div class="card-body">
        <h3 class="card-title text-lg">
          {{ $t("ui.selectedTagsOverview") }}
        </h3>
        <div class="space-y-3 max-h-60 overflow-auto pr-2">
          <div
            v-for="entry in stepsWithSelection"
            :key="entry.key"
            class="border-b pb-2"
          >
            <p class="font-semibold text-sm mb-1">
              {{ $t("categories." + mapCategoryKey(entry.key)) }}
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in selected[entry.key]"
                :key="tag"
                class="badge badge-outline gap-1"
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
                <button
                  class="ml-1 text-xs"
                  @click="toggleOption(entry.key, tag)"
                  :title="$t('ui.remove')"
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
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import promptTagsMapRaw from "../data/promptTagsMap.json";

const { locale, t } = useI18n();

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

// Emphasis (0..3)
const emphasisLevels = ref({});

const cycleEmphasis = (tag) => {
  if (!tag) return;
  const current = emphasisLevels.value[tag] || 0;
  const next = (current + 1) % 4;
  if (next === 0) delete emphasisLevels.value[tag];
  else emphasisLevels.value[tag] = next;
};

const formatEmphasis = (tag) => {
  const level = emphasisLevels.value[tag] || 0;
  if (level <= 0) return tag;
  return `${"(".repeat(level)}${tag}${")".repeat(level)}`;
};

const emphasisTooltip = (tag) =>
  t("ui.emphasisTooltip", {
    level: emphasisLevels.value[tag] || 0,
  });

// Undo / Redo
const undoStack = ref([]);
const redoStack = ref([]);

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

const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

const undo = () => {
  if (!canUndo.value) return;
  const prev = undoStack.value.pop();
  redoStack.value.push(snapshot());
  restoreSnapshot(prev);
};
const redo = () => {
  if (!canRedo.value) return;
  const next = redoStack.value.pop();
  undoStack.value.push(snapshot());
  restoreSnapshot(next);
};

const restoreSnapshot = (snap) => {
  selected.value = snap.selected || {};
  tagWeights.value = snap.weights || {};
  selectedNegativePresetNames.value = snap.presets || [];
  emphasisLevels.value = snap.emphasis || {};
};

// Tag category map -> JSON sections
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
};

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
    // NEW
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

const hideEmpty = ref(true);
const promptTagsMap = promptTagsMapRaw;

// Grouped steps (scalable)
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

// Helper: check if category has any usable options
const categoryHasOptions = (stepKey) => {
  const categoryName = tagCategoryMap[stepKey];
  if (!categoryName) return false;
  const section = promptTagsMapRaw[categoryName];
  if (!section) return false;
  const arr = section[locale.value] || [];
  return nsfw.value ? arr.length > 0 : arr.some((o) => !o.nsfw);
};

const showCategory = (k) =>
  !(k === "nsfw" && !nsfw.value) && (!hideEmpty.value || categoryHasOptions(k));

// Groups visible (respect filters)
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

const currentGroupIndex = ref(0);

// Active entry / key / label
const activeEntry = computed(
  () => stepsFlattened.value[currentStep.value] || null
);
const activeKey = computed(() => activeEntry.value?.key || "");
const activeStepLabel = computed(() =>
  activeKey.value ? t("categories." + mapCategoryKey(activeKey.value)) : ""
);

// Visible categories of current group
const visibleGroupCategories = computed(() => {
  const g = visibleGroups.value[currentGroupIndex.value];
  if (!g) return [];
  return g.steps.filter((k) => showCategory(k));
});

// Sync group index when step changes or filters change
watch([activeKey, stepsFlattened], () => {
  const idx = visibleGroups.value.findIndex((g) =>
    g.steps.includes(activeKey.value)
  );
  if (idx >= 0) currentGroupIndex.value = idx;
});

// Ensure currentStep fits after filters
watch([stepsFlattened, nsfw, locale], () => {
  if (!stepsFlattened.value.length) {
    currentStep.value = 0;
    return;
  }
  if (currentStep.value >= stepsFlattened.value.length) {
    currentStep.value = stepsFlattened.value.length - 1;
  }
});

// Navigation
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

// Options retrieval
const getOptions = (stepKey) => {
  if (!stepKey) return [];
  const categoryName = tagCategoryMap[stepKey];
  if (!categoryName) return [];
  const section = promptTagsMap[categoryName];
  if (!section) return [];
  const raw = section[locale.value];
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

const isSelected = (key, tag) => selected.value[key]?.includes(tag);

// Positive tokens
const positiveTokens = computed(() => {
  const tokens = [];
  for (const entry of stepsFlattened.value) {
    if (entry.key === "nsfw" && !nsfw.value) continue;
    const arr = selected.value[entry.key];
    if (arr?.length) tokens.push(...arr);
  }
  return tokens;
});

// Weight normalization
const normalizeWeight = (tag) => {
  if (tagWeights.value[tag] == null) tagWeights.value[tag] = 1;
  if (tagWeights.value[tag] <= 0) tagWeights.value[tag] = 0.1;
};

// Weighted tokens
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

// Negative
const toggleNegativePreset = (name) => {
  const idx = selectedNegativePresetNames.value.indexOf(name);
  if (idx > -1) selectedNegativePresetNames.value.splice(idx, 1);
  else selectedNegativePresetNames.value.push(name);
};
const clearNegativePresets = () => {
  selectedNegativePresetNames.value = [];
};

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

// Save / load sets
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
};
const deleteSet = (idx) => {
  savedSets.value.splice(idx, 1);
  localStorage.setItem("pf_sets", JSON.stringify(savedSets.value));
};
const exportSetJSON = () => {
  const blob = new Blob([JSON.stringify(savedSets.value, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "prompt_sets.json";
  a.click();
  URL.revokeObjectURL(a.href);
};
const importSetJSON = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (Array.isArray(parsed)) {
        savedSets.value = parsed;
        localStorage.setItem("pf_sets", JSON.stringify(savedSets.value));
      }
    } catch (err) {
      console.warn("Import error", err);
    }
  };
  reader.readAsText(f);
  e.target.value = "";
};

// Select all / unselect all
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
};
const unselectAllInCategory = () => {
  pushUndo();
  selected.value[activeKey.value] = [];
};

// Highlight search
const escapeHTML = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]
  );
const highlight = (text) => {
  if (!tagSearch.value.trim()) return escapeHTML(text);
  const q = tagSearch.value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${q})`, "ig");
  return escapeHTML(text).replace(re, "<mark>$1</mark>");
};

const estimatedTokenCount = computed(() =>
  Math.ceil(positivePrompt.value.length / 4)
);

// Keyboard shortcuts
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

// Steps with selection
const stepsWithSelection = computed(() =>
  stepsFlattened.value.filter((e) => selected.value[e.key]?.length)
);

// Toggle option
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
};

const onNsfwToggle = () => {
  if (!nsfw.value && activeKey.value === "nsfw") currentStep.value = 0;
};

const generatePrompt = () => {
  console.log("Positive:", positivePrompt.value);
  console.log("Negative:", negativePrompt.value);
};

const copyPrompt = (prompt, type) => {
  if (!prompt) return;
  navigator.clipboard.writeText(prompt).then(() => {
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
  });
};

const resetAll = () => {
  selected.value = {};
  currentStep.value = 0;
  nsfw.value = false;
  customTag.value = "";
  tagSearch.value = "";
  emphasisLevels.value = {};
  tagWeights.value = {};
};

const clearCategory = () => {
  if (activeKey.value) selected.value[activeKey.value] = [];
};

const hasAnySelection = computed(() =>
  Object.values(selected.value).some((v) => v?.length)
);

const dedupeAll = () => {
  for (const k in selected.value) {
    if (Array.isArray(selected.value[k])) {
      selected.value[k] = [...new Set(selected.value[k])];
    }
  }
};

const moveToken = (index, dir) => {
  const arr = positiveTokens.value.slice();
  const newIndex = index + dir;
  if (newIndex < 0 || newIndex >= arr.length) return;
  const tmp = arr[index];
  arr[index] = arr[newIndex];
  arr[newIndex] = tmp;

  // reconstruct per category
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

const randomTagCurrent = () => {
  if (!currentCategoryOptions.value.length) return;
  const pool = currentCategoryOptions.value.filter(
    (o) => !isSelected(activeKey.value, o.positive)
  );
  const source = pool.length ? pool : currentCategoryOptions.value;
  const pick = source[Math.floor(Math.random() * source.length)];
  toggleOption(activeKey.value, pick.positive);
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
};

// Favorites
const favoriteList = computed(() => {
  const out = [];
  for (const k in favorites.value) {
    favorites.value[k].forEach((tag) => out.push({ key: k, tag }));
  }
  return out;
});

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
};

// Progress counters and percentages
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
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
