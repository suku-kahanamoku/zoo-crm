<script setup lang="ts">
const props = defineProps<{
  title: string;
  config: Record<string, any>;
  listRouteSyscode: string;
  createPath: string;
  nameField?: string;
}>();

const { t } = useLang();
const localePath = useLocalePath();
const {
  config,
  response,
  meta,
  loading,
  selected,
  deleteDialogOpen,
  onDelete,
  handleSort,
  handlePage,
  handleFilter,
} = useAdminResource<Record<string, any>>(props.config, props.listRouteSyscode);
const table = useTemplateRef<any>("table");

async function confirmDelete(confirmed: boolean) {
  await onDelete(confirmed);
  table.value?.tableEl?.tableApi.resetRowSelection();
}
</script>

<template>
  <div v-if="config" class="mx-auto w-full max-w-7xl px-5 pb-10">
    <UPageHeader :title="title" class="border-none" />
    <div class="mb-3 flex justify-end gap-2">
      <UButton
        icon="i-heroicons-trash"
        color="error"
        variant="outline"
        :aria-label="t('$.aria.delete_selected')"
        :disabled="!selected.length"
        :loading="loading"
        @click="deleteDialogOpen = true"
      />
      <UButton
        :to="localePath(createPath)"
        icon="i-heroicons-plus-circle"
        color="secondary"
        variant="outline"
        :aria-label="t('$.aria.create_new')"
      />
    </div>
    <CmpTable
      ref="table"
      v-model:selected="selected"
      :config="config"
      :data="(response as any)?.data || []"
      :meta="meta"
      :loading="loading"
      @delete="deleteDialogOpen = true"
      @sort="handleSort"
      @page="handlePage"
      @filter="handleFilter"
    />
    <CmpConfirmDialog
      v-model="deleteDialogOpen"
      :title="t('$.btn.delete')"
      color="error"
      :btns="{ ok: { icon: 'i-heroicons-trash' } }"
      @confirm="confirmDelete"
    >
      {{
        selected.length > 1
          ? t("$.message.delete_question_multi", { length: selected.length })
          : t("$.message.delete_question", { name: selected[0]?.[nameField || "name"] || "" })
      }}
    </CmpConfirmDialog>
  </div>
</template>
