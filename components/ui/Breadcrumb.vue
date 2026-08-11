<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();

const labels: Record<string, string> = {
  admin: "Dashboard",
  clients: "Klienti",
  products: "Produkty",
  categories: "Druhy zvířat",
  create: "Nový záznam",
};

const items = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  return [
    { label: "", icon: "i-heroicons-home", to: localePath("/admin") },
    ...segments.slice(1).map((segment, index) => {
      const decoded = decodeURIComponent(segment).replace(/--\$\d+$/, "");
      return {
        label: labels[decoded] || decoded,
        to: localePath(`/admin/${segments.slice(1, index + 2).join("/")}`),
      };
    }),
  ];
});
</script>

<template>
  <UBreadcrumb :items="items" />
</template>
