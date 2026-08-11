<script setup lang="ts">
import configSource from "@/assets/configs/category-update.json";
import type { IAnimalCategory } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_categories_detail", title: "$.admin.edit_category" });
const { t } = useLang();
const { config, response, loading, onSave, goToList } = useAdminResource<IAnimalCategory>(configSource, "admin_categories");
const category = computed(() => (response.value as any)?.data as IAnimalCategory | undefined);
async function submit(body: Record<string, any>) {
  if (category.value && (await onSave(body, category.value))?.data) goToList();
}
useHead({ title: computed(() => t("$.admin.edit_category")) });
</script>

<template>
  <div v-if="config" class="mx-auto w-full max-w-4xl px-5 pb-10">
    <UPageHeader :title="t('$.admin.edit_category')" class="border-none" />
    <CmpForm
      v-if="category"
      :fields="config.fields"
      :item="category"
      :loading="loading"
      :actions="{ no: { link: { path: '/admin/categories' } } }"
      :ui="{ body: 'grid gap-4' }"
      @submit="submit"
    />
  </div>
</template>
