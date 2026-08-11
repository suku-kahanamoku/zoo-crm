<script setup lang="ts">
import type { IAnimalCategory, IProduct } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_products_detail", title: "$.admin.product_detail" });
const { t } = useLang();
const route = useRoute();
const localePath = useLocalePath();
const resourceId = useResourceId();
const { data: response, pending } = useAsyncData(
  () => `product-detail-${resourceId.value}`,
  () => useApi(`/api/admin/product/${resourceId.value}`),
  { watch: [resourceId] },
);
const { data: categoriesResponse } = useAsyncData("product-detail-categories", () =>
  useApi("/api/admin/category?limit=100"),
);
const { data: clientTypesResponse } = useAsyncData("product-detail-client-types", () =>
  useApi(
    "/api/admin/enumeration?limit=100&q=%7B%22type%22%3A%7B%22value%22%3A%22client_type%22%7D%7D",
  ),
);
const product = computed(() => (response.value as any)?.data as IProduct | undefined);
const categories = computed(() => {
  const ids = product.value?.category_ids || [];
  return (((categoriesResponse.value as any)?.data || []) as IAnimalCategory[]).filter((item) =>
    ids.includes(Number(item.id)),
  );
});
const targetSegments = computed(() => {
  const codes = product.value?.data?.target_segments || [];
  return (((clientTypesResponse.value as any)?.data || []) as Record<string, any>[]).filter((item) =>
    codes.includes(item.syscode),
  );
});
const editPath = computed(() => localePath(`${route.path}/edit`));
const money = (value: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK" }).format(value);

useHead({ title: computed(() => product.value?.name || t("$.admin.product_detail")) });
</script>

<template>
  <div class="mx-auto w-full max-w-6xl space-y-5 px-5 pb-10">
    <div class="crm-page-heading flex-wrap">
      <div>
        <p class="text-sm font-semibold text-primary">{{ t("$.admin.product_detail") }}</p>
        <h1 class="crm-page-title">{{ product?.name || t("$.view.loading") }}</h1>
      </div>
      <div class="flex gap-2">
        <UButton :to="localePath('/admin/products')" color="neutral" variant="outline" icon="i-heroicons-arrow-left">
          {{ t("$.btn.back_to_list") }}
        </UButton>
        <UButton :to="editPath" icon="i-heroicons-pencil-square">{{ t("$.btn.edit") }}</UButton>
      </div>
    </div>

    <UCard v-if="pending"><p class="py-8 text-center text-muted">{{ t("$.view.loading") }}</p></UCard>

    <template v-else-if="product">
      <UCard>
        <div class="grid gap-6 md:grid-cols-[minmax(220px,0.8fr)_2fr]">
          <div class="overflow-hidden rounded-xl bg-elevated">
            <img
              v-if="product.files?.[0]"
              :src="`/api/${product.files[0].path}`"
              :alt="product.files[0].name"
              class="h-64 w-full object-cover"
            />
            <div v-else class="flex h-64 items-center justify-center text-muted">
              <UIcon name="i-lucide-package-open" class="size-20" />
            </div>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <UBadge color="secondary" variant="subtle">{{ t(`$.product.kinds.${product.kind || 'other'}`) }}</UBadge>
              <UBadge :color="product.published ? 'success' : 'neutral'" variant="subtle">
                {{ product.published ? t("$.product.is_published") : t("$.product.is_hidden") }}
              </UBadge>
            </div>
            <p class="mt-4 text-3xl font-extrabold text-primary">{{ money(Number(product.price)) }}</p>
            <p class="mt-4 leading-7 text-muted">{{ product.description || t("$.product.description_missing") }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <UBadge v-for="category in categories" :key="category.id" color="neutral" variant="outline">
                {{ category.name }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>

      <div class="grid gap-5 lg:grid-cols-2">
        <UCard>
          <template #header><h2 class="text-lg font-bold">{{ t("$.product.catalog_data") }}</h2></template>
          <dl class="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <div><dt class="text-xs font-bold uppercase text-muted">{{ t("$.product.sku") }}</dt><dd class="mt-1 font-semibold">{{ product.sku }}</dd></div>
            <div><dt class="text-xs font-bold uppercase text-muted">{{ t("$.product.ean") }}</dt><dd class="mt-1 font-semibold">{{ product.data?.ean || '—' }}</dd></div>
            <div><dt class="text-xs font-bold uppercase text-muted">{{ t("$.product.brand") }}</dt><dd class="mt-1 font-semibold">{{ product.data?.brand || '—' }}</dd></div>
            <div><dt class="text-xs font-bold uppercase text-muted">{{ t("$.product.variant") }}</dt><dd class="mt-1 font-semibold">{{ product.variant || '—' }}</dd></div>
            <div><dt class="text-xs font-bold uppercase text-muted">{{ t("$.product.stock") }}</dt><dd class="mt-1 font-semibold">{{ product.stock_quantity }} ks</dd></div>
            <div><dt class="text-xs font-bold uppercase text-muted">{{ t("$.product.weight") }}</dt><dd class="mt-1 font-semibold">{{ product.data?.weight ? `${product.data.weight} ${product.data.unit || ''}` : '—' }}</dd></div>
          </dl>
        </UCard>

        <UCard>
          <template #header><h2 class="text-lg font-bold">{{ t("$.product.target_segments") }}</h2></template>
          <p class="mb-4 text-sm text-muted">{{ t("$.product.target_segments_help") }}</p>
          <div v-if="targetSegments.length" class="flex flex-wrap gap-2">
            <UBadge v-for="segment in targetSegments" :key="segment.id" color="primary" variant="subtle">
              {{ segment.label }}
            </UBadge>
          </div>
          <p v-else class="text-muted">{{ t("$.product.no_target_segments") }}</p>
        </UCard>
      </div>

      <UCard v-if="product.files?.length">
        <template #header><h2 class="text-lg font-bold">{{ t("$.product.images") }}</h2></template>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <a
            v-for="file in product.files"
            :key="file.id"
            :href="`/api/${file.path}`"
            target="_blank"
            rel="noopener noreferrer"
            class="overflow-hidden rounded-xl border border-default"
          >
            <img :src="`/api/${file.path}`" :alt="file.name" class="h-40 w-full object-cover" />
          </a>
        </div>
      </UCard>
    </template>
  </div>
</template>
