<script setup lang="ts">
import type { IClient, IProduct } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_clients_detail", title: "$.admin.client_detail" });
const { t } = useLang();
const route = useRoute();
const localePath = useLocalePath();
const resourceId = useResourceId();
const { data: response, pending } = useAsyncData(
  () => `client-detail-${resourceId.value}`,
  () => useApi(`/api/admin/client/${resourceId.value}`),
  { watch: [resourceId] },
);
const { data: productsResponse } = useAsyncData("client-detail-products", () =>
  useApi("/api/admin/product?limit=100"),
);
const client = computed(() => (response.value as any)?.data as IClient | undefined);
const recommendedProducts = computed(() => {
  const skus = client.value?.profile?.recommended_product_skus || [];
  return (((productsResponse.value as any)?.data || []) as IProduct[]).filter((product) =>
    skus.includes(product.sku || ""),
  );
});
const fullName = computed(() =>
  client.value ? `${client.value.first_name} ${client.value.last_name}` : t("$.admin.client_detail"),
);
const editPath = computed(() => localePath(`${route.path}/edit`));
const money = (value: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK" }).format(value);

useHead({ title: fullName });
</script>

<template>
  <div class="mx-auto w-full max-w-6xl space-y-5 px-5 pb-10">
    <div class="crm-page-heading flex-wrap">
      <div>
        <p class="text-sm font-semibold text-primary">{{ t("$.admin.client_detail") }}</p>
        <h1 class="crm-page-title">{{ fullName }}</h1>
      </div>
      <div class="flex gap-2">
        <UButton :to="localePath('/admin/clients')" color="neutral" variant="outline" icon="i-heroicons-arrow-left">
          {{ t("$.btn.back_to_list") }}
        </UButton>
        <UButton :to="editPath" icon="i-heroicons-pencil-square">{{ t("$.btn.edit") }}</UButton>
      </div>
    </div>

    <UCard v-if="pending"><p class="py-8 text-center text-muted">{{ t("$.view.loading") }}</p></UCard>

    <template v-else-if="client">
      <UCard>
        <div class="grid gap-6 md:grid-cols-[1.2fr_2fr]">
          <div class="rounded-xl bg-elevated p-5">
            <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-black text-primary">
              {{ client.first_name.charAt(0) }}{{ client.last_name.charAt(0) }}
            </div>
            <h2 class="text-xl font-bold">{{ fullName }}</h2>
            <p class="text-muted">{{ client.email }}</p>
            <p v-if="client.phone" class="mt-1 text-muted">{{ client.phone }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <UBadge color="primary" variant="subtle">{{ client.client_type?.label || t("$.client.type_unassigned") }}</UBadge>
              <UBadge color="neutral" variant="subtle">{{ t(`$.status.${client.status || 'active'}`) }}</UBadge>
            </div>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-muted">{{ t("$.client.profile_summary") }}</p>
            <p class="mt-2 text-lg leading-8">{{ client.profile?.summary || t("$.client.profile_missing") }}</p>
            <div v-if="client.profile?.aura" class="mt-5 rounded-xl border-l-4 border-primary bg-primary/5 p-4 italic">
              „{{ client.profile.aura }}“
            </div>
          </div>
        </div>
      </UCard>

      <div class="grid gap-5 lg:grid-cols-2">
        <UCard>
          <template #header><h2 class="text-lg font-bold">{{ t("$.client.behavior_profile") }}</h2></template>
          <dl class="space-y-5">
            <div v-if="client.profile?.visual">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">{{ t("$.client.visual") }}</dt>
              <dd class="mt-1">{{ client.profile.visual }}</dd>
            </div>
            <div v-if="client.profile?.behavior">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">{{ t("$.client.behavior") }}</dt>
              <dd class="mt-1">{{ client.profile.behavior }}</dd>
            </div>
            <div v-if="client.profile?.typical_quote">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">{{ t("$.client.typical_quote") }}</dt>
              <dd class="mt-1 italic">„{{ client.profile.typical_quote }}“</dd>
            </div>
          </dl>
        </UCard>

        <UCard>
          <template #header><h2 class="text-lg font-bold">{{ t("$.client.commercial_profile") }}</h2></template>
          <dl class="space-y-5">
            <div v-if="client.profile?.business_potential">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">{{ t("$.client.business_potential") }}</dt>
              <dd class="mt-1">{{ client.profile.business_potential }}</dd>
            </div>
            <div v-if="client.profile?.average_basket">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">{{ t("$.client.average_basket") }}</dt>
              <dd class="mt-1 text-2xl font-extrabold text-primary">{{ money(client.profile.average_basket) }}</dd>
            </div>
            <div v-if="client.profile?.marketing_note">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">{{ t("$.client.marketing_note") }}</dt>
              <dd class="mt-1">{{ client.profile.marketing_note }}</dd>
            </div>
          </dl>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold">{{ t("$.client.recommended_products") }}</h2>
            <UBadge color="primary" variant="subtle">{{ recommendedProducts.length }}</UBadge>
          </div>
        </template>
        <div v-if="recommendedProducts.length" class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="product in recommendedProducts"
            :key="product.id"
            :to="localePath(product.gen_data?.url || `/admin/products/${product.id}`)"
            class="rounded-xl border border-default p-4 transition hover:border-primary hover:bg-primary/5"
          >
            <p class="font-bold">{{ product.name }}</p>
            <p class="mt-1 text-sm text-muted">{{ product.sku }}</p>
            <p class="mt-3 font-extrabold text-primary">{{ money(Number(product.price)) }}</p>
          </NuxtLink>
        </div>
        <p v-else class="text-muted">{{ t("$.client.no_recommendations") }}</p>
      </UCard>
    </template>
  </div>
</template>
