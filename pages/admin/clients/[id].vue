<script setup lang="ts">
import configSource from "@/assets/configs/client-update.json";
import type { IClient } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_clients_detail", title: "$.admin.edit_client" });
const { t } = useLang();
const { config, response, loading, onSave, goToList } = useAdminResource<IClient>(configSource, "admin_clients");
const client = computed(() => (response.value as any)?.data as IClient | undefined);
async function submit(body: Record<string, any>) {
  if (client.value && (await onSave(body, client.value))?.data) goToList();
}
useHead({ title: computed(() => t("$.admin.edit_client")) });
</script>

<template>
  <div v-if="config" class="mx-auto w-full max-w-5xl px-5 pb-10">
    <UPageHeader :title="t('$.admin.edit_client')" class="border-none" />
    <UCard v-if="client" class="mb-5">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ t("$.client.email") }}</p>
          <p class="font-semibold">{{ client.email }}</p>
        </div>
        <UBadge color="primary" variant="subtle">{{ t(`$.status.${client.status || 'active'}`) }}</UBadge>
      </div>
    </UCard>
    <CmpForm
      v-if="client"
      :fields="config.fields"
      :item="client"
      :loading="loading"
      :actions="{ no: { link: { path: '/admin/clients' } } }"
      :ui="{ body: 'grid gap-4 md:grid-cols-2' }"
      @submit="submit"
    />
  </div>
</template>
