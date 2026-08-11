<script setup lang="ts">
import configSource from "@/assets/configs/product-create.json";
import type { IProduct } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_products_create", title: "$.admin.new_product" });
const { t } = useLang();
const { config, loading, onSave, goToList } = useAdminResource<IProduct>(configSource, "admin_products");
async function submit(body: Record<string, any>) {
  if ((await onSave(body))?.data) goToList();
}
useHead({ title: computed(() => t("$.admin.new_product")) });
</script>

<template>
  <div v-if="config" class="mx-auto w-full max-w-5xl px-5 pb-10">
    <UPageHeader :title="t('$.admin.new_product')" class="border-none" />
    <UAlert class="mb-5" color="info" variant="subtle" icon="i-heroicons-photo" :description="t('$.product.images_after_create')" />
    <CmpForm
      :fields="config.fields"
      :loading="loading"
      :actions="{ no: { link: { path: '/admin/products' } } }"
      :ui="{ body: 'grid gap-4 md:grid-cols-2' }"
      @submit="submit"
    />
  </div>
</template>
