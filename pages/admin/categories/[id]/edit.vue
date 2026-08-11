<script setup lang="ts">
import configSource from "@/assets/configs/category-update.json";
import type { IAnimalCategory } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_categories_edit", title: "$.admin.edit_category" });
const { t } = useLang();
const route = useRoute();
const resourceId = Number(String(route.params.id).split("--").pop());
const formConfig = {
  ...configSource,
  restUrl: `/api/admin/category/${resourceId}`,
  patchUrl: `/api/admin/category/${resourceId}`,
};
const { config, response, loading, onSave } = useAdminResource<IAnimalCategory>(formConfig, "admin_categories");
const category = computed(() => (response.value as any)?.data as IAnimalCategory | undefined);
async function submit(body: Record<string, any>) {
  if (category.value && (await onSave(body, category.value))?.data) await navigateTo(route.path.replace(/\/edit$/, ""));
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
      :actions="{ no: { link: { path: route.path.replace(/\/edit$/, '') } } }"
      :ui="{ body: 'grid gap-4' }"
      @submit="submit"
    />
  </div>
</template>
