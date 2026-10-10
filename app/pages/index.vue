<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: () => `${t('pages.home.title')} | DIGISERVICE`,
  description: () => t('pages.home.description'),
  ogTitle: () => `${t('pages.home.title')} | DIGISERVICE`,
  ogDescription: () => t('pages.home.description'),
  ogImage: '/logo.svg'
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
    <h1 class="max-w-3xl text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.home.title') }}</h1>
    <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ t('brand.subtitle') }}</p>
  </section>
</template>