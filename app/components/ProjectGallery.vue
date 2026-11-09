<script setup lang="ts">
/**
 * Captures d'un projet sur la page détail : vue ordinateur + vue mobile côte à côte (xl),
 * empilées en mobile. Sans capture, affiche ImagePlaceholder.
 */
defineProps<{ title: string, image?: string, imageMobile?: string }>()
const { t } = useI18n()
</script>

<template>
  <div v-if="image" class="grid items-start gap-6 md:grid-cols-media-phone">
    <figure class="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <img :src="image" :alt="t('pages.portfolio.screenshotDesktop', { title })" width="1440" height="900" class="block aspect-card w-full object-cover object-top">
    </figure>
    <figure v-if="imageMobile" class="mx-auto w-48 overflow-hidden rounded-card border-4 border-ink bg-ink shadow-raised md:w-56">
      <img :src="imageMobile" :alt="t('pages.portfolio.screenshotMobile', { title })" width="780" height="1688" loading="lazy" decoding="async" class="block w-full">
    </figure>
  </div>
  <ImagePlaceholder v-else wide class="rounded-card" />
</template>
