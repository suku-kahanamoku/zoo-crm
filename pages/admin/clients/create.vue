<script setup lang="ts">
import configSource from "@/assets/configs/client-create.json";
import type { IClient } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_clients_create", title: "$.admin.new_client" });
const { t } = useLang();
const { config, loading, onSave, goToList } = useAdminResource<IClient>(configSource, "admin_clients");
async function submit(body: Record<string, any>) {
  if ((await onSave(body))?.data) goToList();
}
useHead({ title: computed(() => t("$.admin.new_client")) });
</script>

<template>
  <div v-if="config" class="mx-auto w-full max-w-5xl px-5 pb-10">
    <UPageHeader :title="t('$.admin.new_client')" class="border-none" />
    <CmpForm
      :fields="config.fields"
      :loading="loading"
      :actions="{ no: { link: { path: '/admin/clients' } } }"
      :ui="{ body: 'grid gap-4 md:grid-cols-2' }"
      @submit="submit"
    />
  </div>
</template>
