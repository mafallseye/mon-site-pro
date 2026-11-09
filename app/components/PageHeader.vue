<script setup lang="ts">
/** En-tête de page : unique h1 de la page, filet or, intro facultative. */
defineProps<{ title: string, lead?: string, eyebrow?: string }>()
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto max-w-content px-4 pt-section-sm pb-10 md:px-6 md:pt-section md:pb-14 xl:px-8">
      <slot name="before" />
      <p v-if="eyebrow" class="mb-3 text-eyebrow font-semibold uppercase text-primary">{{ eyebrow }}</p>
      <h1 class="max-w-3xl text-h1 text-primary">{{ title }}</h1>
      <span aria-hidden="true" class="mt-5 block h-1 w-12 rounded-badge bg-accent" />
      <p v-if="lead" class="mt-5 max-w-prose-content text-lead text-ink-muted">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>
