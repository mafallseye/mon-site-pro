<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => `${t('pages.legal.title')} | DIGISERVICE`, description: () => t('pages.legal.description'), ogTitle: () => `${t('pages.legal.title')} | DIGISERVICE`, ogDescription: () => t('pages.legal.description'), ogImage: '/logo.svg' })
</script>
<template><section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.legal.title') }}</h1></section></template>