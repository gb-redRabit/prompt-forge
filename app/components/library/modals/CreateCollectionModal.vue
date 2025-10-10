<template>
  <UModal
    v-model:open="isOpen"
    :title="$t('library.modals.collection.title')"
    :description="$t('library.modals.collection.description')"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-4">
        <div>
          <label for="collection-name" class="block text-sm font-medium mb-2">
            {{ $t("library.modals.collection.name") }}
          </label>
          <UInput
            id="collection-name"
            class="w-full"
            v-model="name"
            :placeholder="$t('library.modals.collection.namePlaceholder')"
          />
        </div>
        <div>
          <label for="collection-desc" class="block text-sm font-medium mb-2">
            {{ $t("library.modals.collection.description") }}
          </label>
          <UTextarea
            id="collection-desc"
            class="w-full"
            v-model="description"
            :placeholder="
              $t('library.modals.collection.descriptionPlaceholder')
            "
            :rows="3"
          />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton color="neutral" variant="ghost" @click="close">
        {{ $t("library.modals.collection.cancel") }}
      </UButton>
      <UButton color="primary" :disabled="!name" @click="handleCreate">
        {{ $t("library.modals.collection.create") }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>("open");

const emit = defineEmits<{
  create: [data: { name: string; description: string }];
}>();

const name = ref("");
const description = ref("");

const handleCreate = () => {
  if (!name.value) return;
  emit("create", { name: name.value, description: description.value });
  name.value = "";
  description.value = "";
  isOpen.value = false;
};
</script>
