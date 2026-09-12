<script setup lang="ts">
import type { ICustomerProfile, IProductProfileProbability } from "@/types/crm";
const model = defineModel<IProductProfileProbability[]>({ default: () => [] });
const { data, status } = await useAsyncData("product-profile-options", () => useApi("/api/admin/profile?limit=100"));
const profiles = computed(() => (((data.value as any)?.data || []) as ICustomerProfile[]));
function row(id: number) { return model.value.find((v) => Number(v.customer_profile_id) === Number(id)); }
function setValue(id: number, key: "probability_percent" | "is_target", value: number) {
  const existing = row(id);
  const next = existing ? model.value.map((v) => Number(v.customer_profile_id) === id ? { ...v, [key]: value } : v) : [...model.value, { customer_profile_id:id, probability_percent:key === "probability_percent" ? value : 0, is_target:key === "is_target" ? value as 0|1 : 0 }];
  model.value = next.filter((v) => v.probability_percent > 0 || v.is_target === 1);
}
</script>
<template>
  <section class="rounded-2xl border border-default p-5">
    <div class="mb-4"><h2 class="font-bold">Profily a pravděpodobnost nákupu</h2><p class="text-sm text-muted">Pravděpodobnost je 0–100 %. Cílový profil označuje hlavní segment produktu.</p></div>
    <p v-if="status === 'pending'" class="text-sm text-muted">Načítám profily…</p>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm"><thead><tr class="border-b border-default text-left text-muted"><th class="p-2">Profil</th><th class="w-32 p-2">Pravděpodobnost</th><th class="w-24 p-2 text-center">Cílový</th></tr></thead>
      <tbody><tr v-for="profile in profiles" :key="profile.id" class="border-b border-default/60"><td class="p-2 font-medium">{{ profile.name }}</td><td class="p-2"><input type="number" min="0" max="100" class="w-24 rounded-md border border-default bg-default px-2 py-1" :value="row(Number(profile.id))?.probability_percent || 0" @input="setValue(Number(profile.id), 'probability_percent', Math.min(100, Math.max(0, Number(($event.target as HTMLInputElement).value))))" /> %</td><td class="p-2 text-center"><input type="checkbox" :checked="row(Number(profile.id))?.is_target === 1" @change="setValue(Number(profile.id), 'is_target', ($event.target as HTMLInputElement).checked ? 1 : 0)" /></td></tr></tbody></table>
    </div>
  </section>
</template>
