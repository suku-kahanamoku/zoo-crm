<script setup lang="ts">
import configSource from "@/assets/configs/category-create.json";
import type { IAnimalCategory } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_categories_create", title: "$.admin.new_category" });
const { t } = useLang();
const { config, loading, onSave, goToList } = useAdminResource<IAnimalCategory>(configSource, "admin_categories");
async function submit(body: Record<string, any>) {
  if ((await onSave(body))?.data) goToList();
}
useHead({ title: computed(() => t("$.admin.new_category")) });
</script>

<template>
  <div v-if="config" class="mx-auto w-full max-w-4xl px-5 pb-10">
    <UPageHeader :title="t('$.admin.new_category')" class="border-none" />
    <CmpForm
      :fields="config.fields"
      :loading="loading"
      :actions="{ no: { link: { path: '/admin/categories' } } }"
      :ui="{ body: 'grid gap-4' }"
      @submit="submit"
    />
  </div>
</template>
