<script setup lang="ts">
import configSource from "@/assets/configs/client-update.json";
import type { IClient } from "@/types/crm";

definePageMeta({ layout: "admin", syscode: "admin_clients_edit", title: "$.admin.edit_client" });
const { t } = useLang();
const route = useRoute();
const resourceId = parseResourceId(route.params.id);
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
    <div class="crm-page-heading"><div><p class="crm-eyebrow">Klientské profily</p><h1 class="crm-page-title">{{ t('$.admin.edit_client') }}</h1></div></div>
    <div class="crm-form-shell p-2">
      <CmpForm
        v-if="client"
        :fields="config.fields"
        :item="client"
        :loading="loading"
        :actions="{ no: { link: { path: route.path.replace(/\/edit$/, '') } } }"
        :ui="{ root: 'border-0 bg-transparent shadow-none', body: 'grid gap-5 md:grid-cols-2' }"
        @submit="submit"
      />
    </div>
  </div>
</template>
