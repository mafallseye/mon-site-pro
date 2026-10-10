<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => `${t('pages.services.title')} | DIGISERVICE`, description: () => t('pages.services.description'), ogTitle: () => `${t('pages.services.title')} | DIGISERVICE`, ogDescription: () => t('pages.services.description'), ogImage: '/logo.svg' })
</script>
<template><section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ t('pages.services.title') }}</h1></section></template>