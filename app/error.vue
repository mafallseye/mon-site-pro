<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()
const { t } = useI18n()
const localePath = useLocalePath()
const isNotFound = computed(() => props.error.statusCode === 404)
const title = computed(() => t(isNotFound.value ? 'pages.notFound.title' : 'pages.error.title'))
const description = computed(() => t(isNotFound.value ? 'pages.notFound.description' : 'pages.error.description'))

usePageSeo(
  () => `${title.value} | ${t('brand.name')}`,
  () => description.value
)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main id="main-content" class="flex flex-1 items-center px-4 py-20 sm:px-6">
      <section class="mx-auto w-full max-w-3xl text-center">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-primary-light">{{ error.statusCode || 500 }}</p>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl">{{ title }}</h1>
        <p class="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">{{ description }}</p>
        <NuxtLink :to="localePath('/')" class="mt-8 inline-flex min-h-12 items-center rounded-lg bg-accent px-6 py-3 font-bold text-primary transition hover:bg-amber-400">{{ t(isNotFound ? 'pages.notFound.backHome' : 'pages.error.backHome') }}</NuxtLink>
      </section>
    </main>
    <AppFooter />
  </div>
</template>