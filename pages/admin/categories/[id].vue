<script setup lang="ts">
import type { IAnimalCategory, IProduct } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_categories_detail", title: "$.admin.category_detail" });
const { t } = useLang();
const route = useRoute();
const localePath = useLocalePath();
const resourceId = useResourceId();
const { data: response, pending } = useAsyncData(
  () => `category-detail-${resourceId.value}`,
  () => useApi(`/api/admin/category/${resourceId.value}`),
  { watch: [resourceId] },
);
const { data: categoriesResponse } = useAsyncData("category-detail-categories", () =>
  useApi("/api/admin/category?limit=100"),
);
const { data: productsResponse } = useAsyncData("category-detail-products", () =>
  useApi("/api/admin/product?limit=100"),
);
const category = computed(() => (response.value as any)?.data as IAnimalCategory | undefined);
const parent = computed(() =>
  (((categoriesResponse.value as any)?.data || []) as IAnimalCategory[]).find(
    (item) => Number(item.id) === Number(category.value?.parent_id),
  ),
);
const products = computed(() =>
  (((productsResponse.value as any)?.data || []) as IProduct[]).filter((item) =>
    (item.category_ids || []).includes(resourceId.value),
  ),
);
const editPath = computed(() => localePath(`${route.path}/edit`));
useHead({ title: computed(() => category.value?.name || t("$.admin.category_detail")) });
</script>

<template>
  <div class="mx-auto w-full max-w-5xl space-y-5 px-5 pb-10">
    <div class="crm-page-heading flex-wrap">
      <div>
        <p class="text-sm font-semibold text-primary">{{ t("$.admin.category_detail") }}</p>
        <h1 class="crm-page-title">{{ category?.name || t("$.view.loading") }}</h1>
      </div>
      <div class="flex gap-2">
        <UButton :to="localePath('/admin/categories')" color="neutral" variant="outline" icon="i-heroicons-arrow-left">
          {{ t("$.btn.back_to_list") }}
        </UButton>
        <UButton :to="editPath" icon="i-heroicons-pencil-square">{{ t("$.btn.edit") }}</UButton>
      </div>
    </div>

    <UCard v-if="pending"><p class="py-8 text-center text-muted">{{ t("$.view.loading") }}</p></UCard>

    <template v-else-if="category">
      <UCard>
        <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div class="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UIcon name="i-lucide-paw-print" class="size-10" />
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="subtle">{{ category.syscode }}</UBadge>
              <UBadge color="neutral" variant="outline">{{ t("$.category.position") }}: {{ category.position ?? '—' }}</UBadge>
            </div>
            <p class="mt-4 text-lg leading-8">{{ category.description || t("$.category.description_missing") }}</p>
            <p v-if="parent" class="mt-4 text-sm text-muted">
              {{ t("$.category.parent") }}: <strong>{{ parent.name }}</strong>
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold">{{ t("$.category.assigned_products") }}</h2>
            <UBadge color="primary" variant="subtle">{{ products.length }}</UBadge>
          </div>
        </template>
        <div v-if="products.length" class="grid gap-3 sm:grid-cols-2">
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="localePath(product.gen_data?.url || `/admin/products/${product.id}`)"
            class="rounded-xl border border-default p-4 transition hover:border-primary hover:bg-primary/5"
          >
            <p class="font-bold">{{ product.name }}</p>
            <p class="text-sm text-muted">{{ product.sku }}</p>
          </NuxtLink>
        </div>
        <p v-else class="text-muted">{{ t("$.category.no_products") }}</p>
      </UCard>
    </template>
  </div>
</template>
