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
            <span v-once>{{ $t("library.modals.collection.name") }}</span>
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
            <span v-once>{{
              $t("library.modals.collection.description")
            }}</span>
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
      <GlassButton color="neutral" variant="ghost" @click="close">
        <span v-once>{{ $t("library.modals.collection.cancel") }}</span>
      </GlassButton>
      <GlassButton color="primary" :disabled="!name" @click="handleCreate">
        <span v-once>{{ $t("library.modals.collection.create") }}</span>
      </GlassButton>
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
