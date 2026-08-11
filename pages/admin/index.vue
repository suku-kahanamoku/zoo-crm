<script setup lang="ts">
definePageMeta({ layout: "admin", syscode: "admin", title: "$.admin.title" });
const { t } = useLang();
const localePath = useLocalePath();
const { user } = useUserSession();

const { data: stats, pending } = useAsyncData("dashboard-stats", async () => {
  const [clients, products, categories] = await Promise.all([
    useApi("/api/admin/client?limit=5"),
    useApi("/api/admin/product?limit=5"),
    useApi("/api/admin/category?limit=5"),
  ]);
  return {
    clients: Number((clients as any)?.meta?.total || (clients as any)?.data?.length || 0),
    products: Number((products as any)?.meta?.total || (products as any)?.data?.length || 0),
    categories: Number((categories as any)?.meta?.total || (categories as any)?.data?.length || 0),
    recentClients: ((clients as any)?.data || []) as Record<string, any>[],
    recentProducts: ((products as any)?.data || []) as Record<string, any>[],
  };
});

const cards = computed(() => [
  {
    label: t("$.admin.clients"),
    value: stats.value?.clients ?? 0,
    to: "/admin/clients",
    icon: "i-heroicons-users",
    accent: "from-emerald-500/15 to-teal-500/5",
    iconClass: "bg-emerald-500 text-white shadow-emerald-500/25",
  },
  {
    label: t("$.admin.products"),
    value: stats.value?.products ?? 0,
    to: "/admin/products",
    icon: "i-heroicons-shopping-bag",
    accent: "from-orange-500/15 to-amber-500/5",
    iconClass: "bg-orange-500 text-white shadow-orange-500/25",
  },
  {
    label: t("$.admin.categories"),
    value: stats.value?.categories ?? 0,
    to: "/admin/categories",
    icon: "i-lucide-paw-print",
    accent: "from-violet-500/15 to-fuchsia-500/5",
    iconClass: "bg-violet-500 text-white shadow-violet-500/25",
  },
]);

const userName = computed(() => user.value?.first_name || "administrátore");
const money = (value: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK" }).format(value);

useHead({ title: computed(() => t("$.admin.title")) });
</script>

<template>
  <div class="mx-auto w-full max-w-7xl space-y-6 px-5 pb-12 pt-6 sm:px-7">
    <section class="crm-hero-panel p-7 sm:p-9">
      <div class="relative z-10 max-w-3xl">
        <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-100">Řídicí centrum Zoo CRM</p>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-5xl">Dobrý den, {{ userName }}.</h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-emerald-50/85 sm:text-lg">
          Mějte klientské profily, sortiment a chytrá doporučení na jednom místě. Přehledně a bez zbytečného hledání.
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <UButton :to="localePath('/admin/clients/create')" color="secondary" size="lg" icon="i-heroicons-user-plus">
            {{ t("$.admin.new_client") }}
          </UButton>
          <UButton :to="localePath('/admin/products')" color="neutral" variant="soft" size="lg" trailing-icon="i-heroicons-arrow-right">
            Projít sortiment
          </UButton>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <NuxtLink
        v-for="card in cards"
        :key="card.to"
        :to="localePath(card.to)"
        class="group relative overflow-hidden rounded-2xl border border-default/80 bg-default/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div :class="card.accent" class="absolute inset-0 bg-gradient-to-br opacity-80" />
        <div class="relative flex items-start justify-between">
          <span :class="card.iconClass" class="grid size-12 place-items-center rounded-2xl shadow-lg">
            <UIcon :name="card.icon" class="size-6" />
          </span>
          <UIcon name="i-heroicons-arrow-up-right" class="size-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <USkeleton v-if="pending" class="relative mt-8 h-10 w-24" />
        <p v-else class="relative mt-8 text-4xl font-extrabold tracking-tight text-highlighted">{{ card.value }}</p>
        <p class="relative mt-1 font-bold text-muted">{{ card.label }}</p>
      </NuxtLink>
    </section>

    <section class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <UCard class="overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="crm-eyebrow">Poslední aktivita</p>
              <h2 class="text-xl font-extrabold">Noví klienti</h2>
            </div>
            <UButton :to="localePath('/admin/clients')" color="neutral" variant="ghost" trailing-icon="i-heroicons-arrow-right">Všichni klienti</UButton>
          </div>
        </template>
        <div v-if="stats?.recentClients?.length" class="divide-y divide-default">
          <NuxtLink
            v-for="client in stats.recentClients"
            :key="client.id"
            :to="localePath(client.gen_data?.url || `/admin/clients/${client.id}`)"
            class="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 font-extrabold text-primary">
              {{ client.first_name?.charAt(0) }}{{ client.last_name?.charAt(0) }}
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-bold">{{ client.first_name }} {{ client.last_name }}</span>
              <span class="block truncate text-sm text-muted">{{ client.email }}</span>
            </span>
            <UBadge color="neutral" variant="subtle">{{ t(`$.status.${client.status || 'active'}`) }}</UBadge>
          </NuxtLink>
        </div>
        <p v-else class="py-6 text-center text-muted">Zatím nejsou evidováni žádní klienti.</p>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <p class="crm-eyebrow">Sortiment</p>
            <h2 class="text-xl font-extrabold">Poslední produkty</h2>
          </div>
        </template>
        <div v-if="stats?.recentProducts?.length" class="space-y-3">
          <NuxtLink
            v-for="product in stats.recentProducts"
            :key="product.id"
            :to="localePath(product.gen_data?.url || `/admin/products/${product.id}`)"
            class="flex items-center gap-3 rounded-xl border border-default p-3 transition hover:border-primary hover:bg-primary/5"
          >
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary">
              <UIcon name="i-lucide-package" class="size-5" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-bold">{{ product.name }}</span>
              <span class="text-xs text-muted">{{ product.sku }}</span>
            </span>
            <span class="whitespace-nowrap text-sm font-extrabold text-primary">{{ money(Number(product.price || 0)) }}</span>
          </NuxtLink>
        </div>
        <p v-else class="py-6 text-center text-muted">Zatím nejsou evidovány žádné produkty.</p>
      </UCard>
    </section>
  </div>
</template>
