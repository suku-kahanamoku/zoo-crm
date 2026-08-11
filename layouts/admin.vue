<script setup lang="ts">
const { loggedIn } = useUserSession();
const localePath = useLocalePath();
const open = ref(true);
const colorMode = useColorMode();

const navigation = computed(() => [
  { label: "Dashboard", to: localePath("/admin"), icon: "i-heroicons-squares-2x2" },
  { label: "Klienti", to: localePath("/admin/clients"), icon: "i-heroicons-users" },
  { label: "Produkty", to: localePath("/admin/products"), icon: "i-heroicons-shopping-bag" },
  { label: "Druhy zvířat", to: localePath("/admin/categories"), icon: "i-lucide-paw-print" },
]);

useSeoMeta({ robots: "noindex, nofollow" });
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <UHeader mode="slideover" :toggle="{ size: 'xl' }" :ui="{ container: 'max-w-full' }">
      <template #title>
        <UiLogo />
      </template>
      <template #right>
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          color="neutral"
          variant="ghost"
          aria-label="Přepnout barevný režim"
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
        />
        <UiProfileDropdownMenu v-if="loggedIn" />
      </template>
      <template #body>
        <UNavigationMenu :items="navigation" orientation="vertical" />
      </template>
    </UHeader>

    <div class="flex min-h-[calc(100vh-var(--ui-header-height))]">
      <USidebar v-model:open="open" collapsible="icon" rail>
        <template #default>
          <UNavigationMenu
            :items="navigation"
            orientation="vertical"
            :ui="{ list: 'space-y-2', link: 'w-full px-4 py-2 text-base font-semibold' }"
          />
        </template>
      </USidebar>
      <div class="min-w-0 flex-1 overflow-auto">
        <div class="mx-auto w-full max-w-7xl px-5 pt-5">
          <UiBreadcrumb />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
