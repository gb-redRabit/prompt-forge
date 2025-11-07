<template>
  <div class="grid lg:grid-cols-2 gap-6">
    <!-- LEFT COLUMN: Configuration Form -->
    <div class="space-y-4">
      <!-- Alert Messages -->
      <UAlert
        v-if="connectionStatus"
        :color="connectionStatus.type === 'success' ? 'primary' : 'error'"
        variant="soft"
        :description="connectionStatus.message"
        :icon="
          connectionStatus.type === 'success'
            ? 'i-heroicons-check-circle'
            : 'i-heroicons-exclamation-circle'
        "
        closable
        @close="connectionStatus = null"
      />

      <!-- Configuration Form Card -->
      <GlassCard padding="md">
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="w-4 h-4 text-purple-500"
          />
          <span v-once>{{ $t("ai.config.title") }}</span>
        </h3>

        <!-- Server Endpoint -->
        <div class="space-y-2">
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
          >
            <UIcon
              name="i-heroicons-server"
              class="w-3.5 h-3.5 text-purple-500"
            />
            <span v-once>{{ $t("ai.config.endpoint") }}</span>
          </label>
          <UInput
            v-model="config.endpoint"
            :placeholder="$t('ai.config.endpoint_hint')"
            size="md"
            icon="i-heroicons-link"
          >
            <template #trailing>
              <GlassButton
                v-if="
                  config.endpoint !==
                  'http://localhost:1234/v1/chat/completions'
                "
                color="primary"
                variant="ghost"
                icon="i-heroicons-x-mark"
                :padded="false"
                size="xs"
                @click="
                  config.endpoint = 'http://localhost:1234/v1/chat/completions'
                "
              />
            </template>
          </UInput>
        </div>

        <!-- Model Selection -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label
              class="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
            >
              <UIcon
                name="i-heroicons-cpu-chip"
                class="w-3.5 h-3.5 text-purple-500"
              />
              <span v-once>{{ $t("ai.config.model_name") }}</span>
            </label>
            <GlassButton
              v-if="config.endpoint"
              color="primary"
              variant="ghost"
              size="xs"
              :loading="loadingModels"
              @click="fetchModels"
            >
              <template #leading>
                <UIcon
                  name="i-heroicons-arrow-path"
                  :class="{ 'animate-spin': loadingModels }"
                  class="w-3.5 h-3.5"
                />
              </template>
            </GlassButton>
          </div>

          <USelectMenu
            v-if="availableModels.length > 0"
            v-model="config.modelId"
            :items="availableModels"
            :placeholder="$t('ai.config.model_name_placeholder')"
            size="md"
            searchable
            :searchable-placeholder="$t('pages.prompts.search')"
          >
            <template #leading>
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
            </template>
          </USelectMenu>

          <UInput
            v-else
            v-model="config.modelId"
            :placeholder="$t('ai.config.model_name_placeholder')"
            icon="i-heroicons-sparkles"
            size="md"
            disabled
          >
            <template #trailing>
              <UTooltip text="Kliknij 'Odśwież' aby pobrać modele">
                <UIcon
                  name="i-heroicons-information-circle"
                  class="w-4 h-4 text-gray-400"
                />
              </UTooltip>
            </template>
          </UInput>

          <p
            v-if="availableModels.length > 0"
            class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="w-3 h-3 text-green-500"
            />
            {{ availableModels.length }}
            {{
              availableModels.length === 1
                ? $t("pages.shared.model_singular")
                : $t("pages.shared.model_plural")
            }}
          </p>
          <p
            v-else
            class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-information-circle"
              class="w-3 h-3 text-blue-500"
            />
            <span v-once>{{ $t("ai.config.model_name_hint") }}</span>
          </p>
        </div>
      </GlassCard>

      <!-- Action Buttons Card -->
      <GlassCard padding="md">
        <div class="flex gap-3">
          <GlassButton
            color="primary"
            variant="soft"
            full-width
            size="lg"
            :loading="isTesting"
            :disabled="!isConfigValid"
            @click="testConnection"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-beaker"
                :class="{ 'animate-bounce': isTesting }"
              />
            </template>
            <span v-once>{{
              isTesting
                ? $t("ai.actions.testing")
                : $t("ai.actions.test_connection")
            }}</span>
          </GlassButton>

          <GlassButton
            color="primary"
            full-width
            size="lg"
            :loading="isSaving"
            :disabled="!isConfigValid"
            @click="saveConfig"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-check"
                :class="{ 'animate-pulse': isSaving }"
              />
            </template>
            <span v-once>{{
              isSaving ? $t("ai.actions.saving") : $t("ai.actions.save")
            }}</span>
          </GlassButton>
        </div>

        <!-- Last Connection Footer -->
        <div
          v-if="isConfigured && lastConnectionTime"
          class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700"
        >
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
            <span v-once>{{ $t("ai.actions.last_connection") }}:</span>
            {{ formatDate(lastConnectionTime) }}
          </span>
          <GlassButton
            color="primary"
            variant="ghost"
            size="xs"
            @click="clearConfig"
          >
            <span v-once>{{ $t("ai.actions.clear") }}</span>
          </GlassButton>
        </div>
      </GlassCard>
    </div>

    <!-- RIGHT COLUMN: Information & Help -->
    <div class="space-y-4">
      <!-- Quick Stats Card -->
      <GlassCard
        padding="md"
        gradient
        class="space-y-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
      >
        <div class="flex items-center gap-2 mb-3">
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-white" />
          </div>
          <h3 class="font-semibold text-sm text-gray-900 dark:text-white">
            <span v-once>{{ $t("ai.status_card.title") }}</span>
          </h3>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div
            class="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span v-once>{{ $t("ai.status_card.endpoint") }}</span>
            </div>
            <div
              class="text-sm font-semibold text-gray-900 dark:text-white truncate"
            >
              {{
                config.endpoint
                  ? $t("ai.status_card.endpoint_set")
                  : $t("ai.status_card.endpoint_missing")
              }}
            </div>
          </div>

          <div
            class="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span v-once>{{ $t("ai.status_card.model") }}</span>
            </div>
            <div
              class="text-sm font-semibold text-gray-900 dark:text-white truncate"
              :title="config.modelId"
            >
              {{
                config.modelId || $t("pages.shared.model_plural", { count: 0 })
              }}
            </div>
          </div>

          <div
            class="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span v-once>{{ $t("ai.status_card.models_available") }}</span>
            </div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ availableModels.length || 0 }}
            </div>
          </div>

          <div
            class="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span v-once>{{ $t("ai.status_card.status") }}</span>
            </div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">
              {{
                isConfigured
                  ? $t("ai.status_card.online")
                  : $t("ai.status_card.offline")
              }}
            </div>
          </div>
        </div>
      </GlassCard>

      <!-- Quick Guide -->
      <UAlert color="info" variant="soft" icon="i-heroicons-light-bulb">
        <template #title>
          <span class="text-sm font-medium" v-once>{{
            $t("ai.quick_guide_title")
          }}</span>
        </template>
        <template #description>
          <ol class="text-xs space-y-1.5 mt-2 list-decimal list-inside">
            <li>
              <span v-once>{{ $t("ai.config.endpoint_hint") }}</span>
            </li>
            <li>
              <span v-once>{{ $t("ai.config.model_name_hint") }}</span>
            </li>
            <li>
              <span v-once>{{ $t("ai.config.model_name_end") }}</span>
            </li>
          </ol>
        </template>
      </UAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAI } from "~/composables/useAI";
const { t } = useI18n();

interface AIConfig {
  endpoint: string;
  modelId: string;
}

const { getModels } = useAI();

const isTesting = ref(false);
const isSaving = ref(false);
const loadingModels = ref(false);
const availableModels = ref<string[]>([]);
const lastConnectionTime = ref<number | null>(null);

const connectionStatus = ref<{
  type: "success" | "error";
  message: string;
} | null>(null);

const config = ref<AIConfig>({
  endpoint: "http://localhost:1234/v1/chat/completions",
  modelId: "",
});

const isConfigured = computed(() => {
  return !!(config.value.endpoint && config.value.modelId);
});

const isConfigValid = computed(() => {
  return !!(config.value.endpoint && config.value.modelId);
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "przed chwilą";
  if (diffMinutes < 60) return `${diffMinutes} min temu`;
  if (diffHours < 24) return `${diffHours} godz. temu`;
  return `${diffDays} dni temu`;
};

// Load saved config
onMounted(() => {
  if (process.client && typeof localStorage !== "undefined") {
    const savedConfig = localStorage.getItem("ai_config");
    const savedTime = localStorage.getItem("ai_last_connection");

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        config.value = { ...config.value, ...parsed };

        if (savedTime) {
          lastConnectionTime.value = parseInt(savedTime);
        }

        if (config.value.endpoint) {
          fetchModels();
        }
      } catch (e) {
        console.error("Failed to load AI config:", e);
      }
    }
  }
});

const fetchModels = async () => {
  if (!config.value.endpoint) return;

  loadingModels.value = true;
  connectionStatus.value = null;

  try {
    if (process.client && typeof localStorage !== "undefined") {
      localStorage.setItem("ai_config", JSON.stringify(config.value));
    }

    const models = await getModels();
    availableModels.value = models;

    if (models.length > 0 && !config.value.modelId) {
      config.value.modelId = models[0];
    }

    connectionStatus.value = {
      type: "success",
      message: t("ai.messages.found_models", { count: models.length }),
    };

    setTimeout(() => {
      if (connectionStatus.value?.type === "success") {
        connectionStatus.value = null;
      }
    }, 3000);
  } catch (error: any) {
    connectionStatus.value = {
      type: "error",
      message: error?.message
        ? `${t("ai.messages.cannot_connect")}: ${error.message}`
        : t("ai.messages.cannot_connect"),
    };
  } finally {
    loadingModels.value = false;
  }
};

const testConnection = async () => {
  if (!isConfigValid.value) return;

  isTesting.value = true;
  connectionStatus.value = null;

  try {
    const response = await fetch(config.value.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer lm-studio",
      },
      body: JSON.stringify({
        model: config.value.modelId,
        messages: [{ role: "user", content: "Hello" }],
        temperature: 0.7,
        max_tokens: 10,
        stream: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "OK";

      connectionStatus.value = {
        type: "success",
        message: t("ai.messages.connection_ok", {
          reply: content.substring(0, 30) + "...",
        }),
      };

      setTimeout(() => {
        if (connectionStatus.value?.type === "success") {
          connectionStatus.value = null;
        }
      }, 5000);
    } else {
      connectionStatus.value = {
        type: "error",
        message: `${t("ai.messages.error_connection", { err: `${response.status}: ${response.statusText}` })}`,
      };
    }
  } catch (error: any) {
    connectionStatus.value = {
      type: "error",
      message: t("ai.messages.error_connection", { err: error.message || "" }),
    };
  } finally {
    isTesting.value = false;
  }
};

const saveConfig = async () => {
  isSaving.value = true;

  try {
    if (process.client && typeof localStorage !== "undefined") {
      localStorage.setItem("ai_config", JSON.stringify(config.value));
      const now = Date.now();
      localStorage.setItem("ai_last_connection", now.toString());
      lastConnectionTime.value = now;
    }

    connectionStatus.value = {
      type: "success",
      message: t("ai.messages.saved_config"),
    };

    setTimeout(() => {
      connectionStatus.value = null;
    }, 2000);
  } catch (error) {
    connectionStatus.value = {
      type: "error",
      message: t("ai.messages.error_saving"),
    };
  } finally {
    isSaving.value = false;
  }
};

const clearConfig = () => {
  if (confirm(t("ai.actions.clear") + "?")) {
    config.value = {
      endpoint: "http://localhost:1234/v1/chat/completions",
      modelId: "",
    };
    availableModels.value = [];
    lastConnectionTime.value = null;

    if (process.client && typeof localStorage !== "undefined") {
      localStorage.removeItem("ai_config");
      localStorage.removeItem("ai_last_connection");
    }

    connectionStatus.value = {
      type: "success",
      message: t("ai.messages.cleared_config"),
    };

    setTimeout(() => {
      connectionStatus.value = null;
    }, 2000);
  }
};
</script>
