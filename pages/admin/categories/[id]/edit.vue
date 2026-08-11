<script setup lang="ts">
import configSource from "@/assets/configs/category-update.json";
import type { IAnimalCategory } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_categories_edit", title: "$.admin.edit_category" });
const { t } = useLang();
const route = useRoute();
const resourceId = parseResourceId(route.params.id);
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
    <div class="crm-page-heading"><div><p class="crm-eyebrow">Taxonomie sortimentu</p><h1 class="crm-page-title">{{ t('$.admin.edit_category') }}</h1></div></div>
    <div class="crm-form-shell p-2">
      <CmpForm
        v-if="category"
        :fields="config.fields"
        :item="category"
        :loading="loading"
        :actions="{ no: { link: { path: route.path.replace(/\/edit$/, '') } } }"
        :ui="{ root: 'border-0 bg-transparent shadow-none', body: 'grid gap-5' }"
        @submit="submit"
      />
    </div>
  </div>
</template>
