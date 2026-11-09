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
    <main id="main-content" class="flex flex-1 items-center bg-bg px-4 py-section-sm md:px-6 md:py-section">
      <section class="mx-auto w-full max-w-3xl text-center">
        <p class="relative inline-block font-display text-code font-semibold tabular-nums text-primary">
          {{ error.statusCode || 500 }}<span aria-hidden="true" class="absolute -top-1 -right-5 size-4 rounded-badge bg-accent" />
        </p>
        <h1 class="mt-4 text-h1 text-primary">{{ title }}</h1>
        <p class="mx-auto mt-5 max-w-prose-content text-lead text-ink-muted">{{ description }}</p>
        <AppButton :to="localePath('/')" class="mt-8">{{ t(isNotFound ? 'pages.notFound.backHome' : 'pages.error.backHome') }}</AppButton>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
