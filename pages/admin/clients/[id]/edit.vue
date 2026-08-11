<script setup lang="ts">
import configSource from "@/assets/configs/client-update.json";
import type { IClient } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_clients_edit", title: "$.admin.edit_client" });
const { t } = useLang();
const route = useRoute();
const resourceId = Number(String(route.params.id).split("--").pop());
const formConfig = {
  ...configSource,
  restUrl: `/api/admin/client/${resourceId}`,
  patchUrl: `/api/admin/client/${resourceId}`,
};
const { config, response, loading, onSave } = useAdminResource<IClient>(formConfig, "admin_clients");
const client = computed(() => (response.value as any)?.data as IClient | undefined);
async function submit(body: Record<string, any>) {
  if (client.value && (await onSave(body, client.value))?.data) await navigateTo(route.path.replace(/\/edit$/, ""));
}
useHead({ title: computed(() => t("$.admin.edit_client")) });
</script>

<template>
  <div v-if="config" class="mx-auto w-full max-w-5xl px-5 pb-10">
    <UPageHeader :title="t('$.admin.edit_client')" class="border-none" />
    <CmpForm
      v-if="client"
      :fields="config.fields"
      :item="client"
      :loading="loading"
      :actions="{ no: { link: { path: route.path.replace(/\/edit$/, '') } } }"
      :ui="{ body: 'grid gap-4 md:grid-cols-2' }"
      @submit="submit"
    />
  </div>
</template>
