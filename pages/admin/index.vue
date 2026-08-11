<script setup lang="ts">
definePageMeta({ layout: "admin", syscode: "admin", title: "$.admin.title" });
const { t } = useLang();
const localePath = useLocalePath();

const { data: stats, pending } = useAsyncData("dashboard-stats", async () => {
  const [clients, products, categories] = await Promise.all([
    useApi("/api/admin/client?limit=1"),
    useApi("/api/admin/product?limit=1"),
    useApi("/api/admin/category?limit=1"),
  ]);
  return {
    clients: Number((clients as any)?.meta?.total || (clients as any)?.data?.length || 0),
    products: Number((products as any)?.meta?.total || (products as any)?.data?.length || 0),
    categories: Number((categories as any)?.meta?.total || (categories as any)?.data?.length || 0),
  };
});

const cards = computed(() => [
  { label: t("$.admin.clients"), value: stats.value?.clients ?? 0, to: "/admin/clients", icon: "i-heroicons-users", color: "primary" },
  { label: t("$.admin.products"), value: stats.value?.products ?? 0, to: "/admin/products", icon: "i-heroicons-shopping-bag", color: "secondary" },
  { label: t("$.admin.categories"), value: stats.value?.categories ?? 0, to: "/admin/categories", icon: "i-lucide-paw-print", color: "primary" },
]);

useHead({ title: computed(() => t("$.admin.title")) });
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-5 pb-12">
    <UPageHeader :title="t('$.admin.title')" :description="t('$.admin.subtitle')" class="border-none" />
    <div class="grid gap-5 md:grid-cols-3">
      <NuxtLink
        v-for="card in cards"
        :key="card.to"
        :to="localePath(card.to)"
        class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-start justify-between">
          <span class="grid size-12 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            <UIcon :name="card.icon" class="size-6" />
          </span>
          <UIcon name="i-heroicons-arrow-up-right" class="size-5 text-slate-400 transition group-hover:text-primary-600" />
        </div>
        <USkeleton v-if="pending" class="mt-8 h-10 w-24" />
        <p v-else class="mt-8 text-4xl font-extrabold tracking-tight">{{ card.value }}</p>
        <p class="mt-1 font-semibold text-slate-500">{{ card.label }}</p>
      </NuxtLink>
    </div>

    <UCard class="mt-6">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-bolt" class="size-5 text-secondary-500" />
          <h2 class="font-bold">Rychlé akce</h2>
        </div>
      </template>
      <div class="flex flex-wrap gap-3">
        <UButton :to="localePath('/admin/clients/create')" icon="i-heroicons-user-plus">{{ t("$.admin.new_client") }}</UButton>
        <UButton :to="localePath('/admin/products/create')" color="secondary" icon="i-heroicons-plus-circle">{{ t("$.admin.new_product") }}</UButton>
        <UButton :to="localePath('/admin/categories/create')" color="neutral" variant="outline" icon="i-lucide-paw-print">{{ t("$.admin.new_category") }}</UButton>
      </div>
    </UCard>
  </div>
</template>
