<script setup lang="ts">
useSeoMeta({ robots: "noindex, nofollow" });
</script>

<template>
  <div class="crm-surface min-h-screen bg-slate-50 dark:bg-slate-950">
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div class="mx-auto flex h-20 max-w-7xl items-center px-5">
        <UiLogo />
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
