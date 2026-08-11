<script setup lang="ts">
definePageMeta({ syscode: "login", title: "$.login.title", label: "$.login.label" });
const { t } = useLang();
const { display } = useToastify();
const { fetch: refreshSession } = useUserSession();
const loading = ref(false);
const fields = [
  {
    name: "email",
    type: "email",
    label: "$.client.email",
    placeholder: "admin@zoo.local",
    required: true,
    clearable: true,
    size: "lg",
  },
  {
    name: "password",
    type: "password",
    label: "$.client.password",
    required: true,
    clearable: true,
    minLength: 8,
    size: "lg",
  },
];

async function submit(body: Record<string, any>) {
  loading.value = true;
  try {
    await $fetch("/api/login", { method: "POST", body });
    await refreshSession();
    await navigateTo("/admin");
  } catch (error: any) {
    display({
      type: "error",
      message: error?.data?.message || error?.data?.statusMessage || "Přihlášení se nezdařilo",
    });
  } finally {
    loading.value = false;
  }
}

useHead({ title: computed(() => t("$.login.title")) });
useSeoMeta({ robots: "noindex, nofollow" });
</script>

<template>
  <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center px-5 py-12">
    <div class="w-full max-w-md">
      <div class="mb-7 text-center">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Pet shop administration</p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {{ t("$.login.title") }}
        </h1>
      </div>
      <CmpForm
        :fields="fields"
        :loading="loading"
        :ui="{
          root: 'w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900',
          body: 'grid gap-4',
        }"
        @submit="submit"
      />
    </div>
  </div>
</template>
